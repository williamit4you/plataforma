import { Award, BookOpen, Brain, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CourseCard } from "@/components/course/course-card";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses } from "@/lib/learning";

export default async function DashboardPage() {
  const courses = await getCourses();
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Dashboard do aluno</h1>
        <p className="mt-2 text-slate-600">Continue de onde parou e mantenha sua revisao em dia.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Cursos liberados", value: courses.length, icon: BookOpen },
          { title: "XP", value: 420, icon: Flame },
          { title: "Flashcards pendentes", value: 8, icon: Brain },
          { title: "Certificados", value: 0, icon: Award },
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
      <h2 className="mt-8 text-xl font-semibold text-slate-950">Seus cursos</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} {...course} />
        ))}
      </div>
    </AppShell>
  );
}
