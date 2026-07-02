import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateCourseProgress, getCourse } from "@/lib/learning";
import { requireUser } from "@/lib/permissions";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const course = await getCourse(slug, user.id, user.role === "ADMIN");
  if (!course) notFound();
  const progress = calculateCourseProgress(course);

  return (
    <AppShell>
      <div className="mb-6">
        <Badge>{course.level}</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">{course.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{course.description}</p>
        <p className="mt-3 text-sm font-medium text-teal-700">{progress}% concluido</p>
      </div>
      <div className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>
                {module.order}. {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.slug}
                    className="flex flex-col justify-between gap-3 rounded-md border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="flex items-center gap-2 font-medium text-slate-950">
                        {lesson.completed && <CheckCircle2 size={16} className="text-teal-600" />}
                        {lesson.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {lesson.readingMinutes} min - {lesson.difficulty}
                      </p>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
                        Abrir aula
                        <ArrowRight size={15} />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
