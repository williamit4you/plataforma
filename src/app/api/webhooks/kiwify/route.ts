import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const kiwifySchema = z.object({
  event: z.string().default("purchase.approved"),
  id: z.string().optional(),
  order_id: z.string().optional(),
  customer: z
    .object({
      email: z.string().email().optional(),
      name: z.string().optional(),
    })
    .optional(),
  status: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-kiwify-signature") ?? request.headers.get("x-webhook-secret");
  if (env.KIWIFY_WEBHOOK_SECRET && signature !== env.KIWIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = kiwifySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Payload invalido." }, { status: 400 });

  const externalId = parsed.data.order_id ?? parsed.data.id ?? crypto.randomUUID();

  try {
    await prisma.webhookEvent.upsert({
      where: { externalId },
      update: { status: "DUPLICATED", payload },
      create: {
        provider: "KIWIFY",
        externalId,
        eventType: parsed.data.event,
        status: "RECEIVED",
        payload,
      },
    });
  } catch {}

  return NextResponse.json({ ok: true, externalId });
}
