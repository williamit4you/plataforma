import { Award, BookOpen, Brain, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CourseCard } from "@/components/course/course-card";
import { Card, CardContent } from "@/components/ui/card";
import { calculateCourseProgress, getCourses } from "@/lib/learning";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";

export default async function DashboardPage() {
  const user = await requireUser();
  const courses = await getCourses(user.id, user.role === "ADMIN");
  const completedLessons = courses
    .flatMap((course) => course.modules)
    .flatMap((module) => module.lessons)
    .filter((lesson) => lesson.completed).length;

  let xp = 0;
  let pendingFlashcards = 0;
  let certificates = 0;
  let streak = 0;

  if (process.env.DATABASE_URL) {
    try {
      const [xpEvents, flashcardReviews, certificateCount, studyStreak] = await Promise.all([
        prisma.xpEvent.findMany({ where: { userId: user.id }, select: { amount: true } }),
        prisma.flashcardReview.count({ where: { userId: user.id, nextReviewAt: { lte: new Date() } } }),
        prisma.certificate.count({ where: { userId: user.id } }),
        prisma.studyStreak.findUnique({ where: { userId: user.id } }),
      ]);
      xp = xpEvents.reduce((sum, event) => sum + event.amount, 0);
      pendingFlashcards = flashcardReviews;
      certificates = certificateCount;
      streak = studyStreak?.currentDays ?? 0;
    } catch {}
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Dashboard do aluno</h1>
        <p className="mt-2 text-slate-600">Continue de onde parou e mantenha sua revisao em dia.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Cursos liberados", value: courses.length, icon: BookOpen },
          { title: "XP", value: xp, icon: Flame },
          { title: "Flashcards pendentes", value: pendingFlashcards, icon: Brain },
          { title: "Certificados", value: certificates, icon: Award },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between pt-5">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>
                <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
              </div>
              <item.icon className="text-teal-600" />
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Aulas concluidas: {completedLessons} - Sequencia atual: {streak} dia(s)
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-950">Seus cursos</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} {...course} progress={calculateCourseProgress(course)} />
        ))}
      </div>
    </AppShell>
  );
}
