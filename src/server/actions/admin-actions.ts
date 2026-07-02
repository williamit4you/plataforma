"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { importAiCoursePayload } from "@/server/services/course-importer";

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

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  level: z.string().min(2),
  workloadHours: z.coerce.number().int().min(1),
  priceCents: z.coerce.number().int().min(0).default(6990),
});

export async function createCourseAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = courseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const slug = slugify(parsed.data.title);
  await prisma.course.upsert({
    where: { slug },
    update: {
      description: parsed.data.description,
      level: parsed.data.level,
      workloadHours: parsed.data.workloadHours,
      priceCents: parsed.data.priceCents,
      status: "PUBLISHED",
    },
    create: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      level: parsed.data.level,
      workloadHours: parsed.data.workloadHours,
      priceCents: parsed.data.priceCents,
      status: "PUBLISHED",
    },
  });

  await prisma.adminLog.create({
    data: { userId: admin.id, action: "CREATE_OR_UPDATE_COURSE", metadata: { slug } },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

const moduleSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(3),
  order: z.coerce.number().int().min(1),
});

export async function createModuleAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = moduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const slug = slugify(parsed.data.title);
  await prisma.module.upsert({
    where: { courseId_slug: { courseId: parsed.data.courseId, slug } },
    update: { title: parsed.data.title, order: parsed.data.order },
    create: {
      courseId: parsed.data.courseId,
      title: parsed.data.title,
      slug,
      order: parsed.data.order,
    },
  });

  await prisma.adminLog.create({
    data: { userId: admin.id, action: "CREATE_OR_UPDATE_MODULE", metadata: { courseId: parsed.data.courseId, slug } },
  });

  revalidatePath("/admin/modules");
  revalidatePath("/courses");
}

const lessonSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(3),
  readingMinutes: z.coerce.number().int().min(1),
  difficulty: z.string().min(2),
  order: z.coerce.number().int().min(1),
  contentMd: z.string().min(10),
});

export async function createLessonAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = lessonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const slug = slugify(parsed.data.title);
  await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: parsed.data.moduleId, slug } },
    update: {
      title: parsed.data.title,
      description: parsed.data.description,
      readingMinutes: parsed.data.readingMinutes,
      difficulty: parsed.data.difficulty,
      order: parsed.data.order,
      contentMd: parsed.data.contentMd,
    },
    create: {
      moduleId: parsed.data.moduleId,
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      objectives: ["Estudar o conteudo", "Aplicar na pratica"],
      readingMinutes: parsed.data.readingMinutes,
      difficulty: parsed.data.difficulty,
      order: parsed.data.order,
      contentMd: parsed.data.contentMd,
    },
  });

  await prisma.adminLog.create({
    data: { userId: admin.id, action: "CREATE_OR_UPDATE_LESSON", metadata: { moduleId: parsed.data.moduleId, slug } },
  });

  revalidatePath("/admin/lessons");
  revalidatePath("/courses");
}

export async function importAiCourseAction(formData: FormData) {
  const admin = await requireAdmin();
  const rawPayload = String(formData.get("payload") ?? "");
  const json = JSON.parse(rawPayload) as unknown;
  await importAiCoursePayload(prisma, json, { adminUserId: admin.id });

  revalidatePath("/admin/import");
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}
