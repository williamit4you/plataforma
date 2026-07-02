import { AppShell } from "@/components/layout/app-shell";
import { CourseCard } from "@/components/course/course-card";
import { getCourses } from "@/lib/learning";

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Cursos</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} {...course} />
        ))}
      </div>
    </AppShell>
  );
}
