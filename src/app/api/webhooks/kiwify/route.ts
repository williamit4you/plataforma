import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const customerSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    full_name: z.string().optional(),
  })
  .optional();

const kiwifySchema = z
  .object({
    event: z.string().optional(),
    event_type: z.string().optional(),
    id: z.string().optional(),
    order_id: z.string().optional(),
    orderId: z.string().optional(),
    status: z.string().optional(),
    payment_status: z.string().optional(),
    amount: z.number().optional(),
    total: z.number().optional(),
    customer: customerSchema,
    Customer: customerSchema,
  })
  .passthrough();

function normalizeStatus(payload: z.infer<typeof kiwifySchema>) {
  return (payload.payment_status ?? payload.status ?? payload.event ?? payload.event_type ?? "").toLowerCase();
}

function isApproved(payload: z.infer<typeof kiwifySchema>) {
  const status = normalizeStatus(payload);
  return ["approved", "paid", "purchase.approved", "order.paid", "payment_approved"].some((item) =>
    status.includes(item)
  );
}

function amountToCents(payload: z.infer<typeof kiwifySchema>) {
  const amount = payload.amount ?? payload.total ?? 69.9;
  return Math.round(amount > 1000 ? amount : amount * 100);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-kiwify-signature") ?? request.headers.get("x-webhook-secret");
  if (env.KIWIFY_WEBHOOK_SECRET && signature !== env.KIWIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = kiwifySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Payload invalido." }, { status: 400 });

  const externalId = parsed.data.order_id ?? parsed.data.orderId ?? parsed.data.id ?? crypto.randomUUID();
  const eventType = parsed.data.event ?? parsed.data.event_type ?? "purchase.approved";
  const customer = parsed.data.customer ?? parsed.data.Customer;
  const email = customer?.email?.toLowerCase();
  const name = customer?.name ?? customer?.full_name ?? "Aluno";

  try {
    const previousWebhook = await prisma.webhookEvent.findUnique({ where: { externalId } });
    if (previousWebhook?.status === "PROCESSED") {
      return NextResponse.json({ ok: true, duplicated: true, externalId });
    }

    await prisma.webhookEvent.upsert({
      where: { externalId },
      update: { status: "RECEIVED_AGAIN", payload, eventType },
      create: {
        provider: "KIWIFY",
        externalId,
        eventType,
        status: "RECEIVED",
        payload,
      },
    });

    if (!isApproved(parsed.data)) {
      await prisma.webhookEvent.update({
        where: { externalId },
        data: { status: "IGNORED", processedAt: new Date() },
      });
      return NextResponse.json({ ok: true, ignored: true, externalId });
    }

    if (!email) {
      await prisma.webhookEvent.update({
        where: { externalId },
        data: { status: "FAILED_MISSING_EMAIL", processedAt: new Date() },
      });
      return NextResponse.json({ error: "Email do cliente ausente." }, { status: 422 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        update: { name, status: "ACTIVE" },
        create: { email, name, role: "STUDENT", status: "ACTIVE" },
      });

      await tx.payment.upsert({
        where: { externalId },
        update: {
          userId: user.id,
          provider: "KIWIFY",
          status: "APPROVED",
          amountCents: amountToCents(parsed.data),
          rawPayload: payload,
        },
        create: {
          userId: user.id,
          externalId,
          provider: "KIWIFY",
          status: "APPROVED",
          amountCents: amountToCents(parsed.data),
          rawPayload: payload,
        },
      });

      const publishedCourses = await tx.course.findMany({ where: { status: "PUBLISHED" }, select: { id: true } });
      for (const course of publishedCourses) {
        await tx.subscription.upsert({
          where: { userId_courseId: { userId: user.id, courseId: course.id } },
          update: { status: "ACTIVE", lifetime: true, source: "KIWIFY" },
          create: {
            userId: user.id,
            courseId: course.id,
            source: "KIWIFY",
            status: "ACTIVE",
            lifetime: true,
          },
        });
      }

      await tx.webhookEvent.update({
        where: { externalId },
        data: { status: "PROCESSED", processedAt: new Date() },
      });

      return { userId: user.id, coursesReleased: publishedCourses.length };
    });

    return NextResponse.json({ ok: true, externalId, ...result });
  } catch {
    try {
      await prisma.webhookEvent.update({
        where: { externalId },
        data: { status: "FAILED", processedAt: new Date() },
      });
    } catch {}

    return NextResponse.json({ error: "Falha ao processar webhook." }, { status: 500 });
  }
}
