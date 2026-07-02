"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const accessSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
});

export async function grantAccessAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = accessSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await prisma.subscription.upsert({
    where: { userId_courseId: { userId: parsed.data.userId, courseId: parsed.data.courseId } },
    update: { status: "ACTIVE" },
    create: { userId: parsed.data.userId, courseId: parsed.data.courseId, source: "MANUAL", lifetime: true },
  });

  await prisma.adminLog.create({
    data: {
      userId: admin.id,
      action: "GRANT_ACCESS",
      metadata: parsed.data,
    },
  });

  revalidatePath("/admin/users");
}
