import { AppShell } from "@/components/layout/app-shell";
import { CourseCard } from "@/components/course/course-card";
import { calculateCourseProgress, getCourses } from "@/lib/learning";
import { requireUser } from "@/lib/permissions";

export default async function CoursesPage() {
  const user = await requireUser();
  const courses = await getCourses(user.id, user.role === "ADMIN");

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Cursos</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} {...course} progress={calculateCourseProgress(course)} />
        ))}
      </div>
    </AppShell>
  );
}
