import Link from "next/link";
import { Award } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateCourseProgress, getCourses } from "@/lib/learning";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { issueCertificateAction } from "@/server/actions/learning-actions";

export default async function CertificatesPage() {
  const user = await requireUser();
  const courses = await getCourses(user.id, user.role === "ADMIN");
  let certificates: { id: string; code: string; courseId: string; issuedAt: Date }[] = [];

  if (process.env.DATABASE_URL) {
    try {
      certificates = await prisma.certificate.findMany({
        where: { userId: user.id },
        select: { id: true, code: true, courseId: true, issuedAt: true },
        orderBy: { issuedAt: "desc" },
      });
    } catch {}
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Certificados</h1>
      <div className="mt-6 grid gap-4">
        {courses.map((course) => {
          const progress = calculateCourseProgress(course);
          const certificate = certificates.find((item) => item.courseId === course.id);

          return (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-teal-600" />
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-6 text-slate-600">
                  Progresso atual: {progress}%. O certificado fica disponivel quando o curso chega a 100%.
                </p>
                {certificate ? (
                  <Button asChild variant="secondary">
                    <Link href={`/certificate/${certificate.code}`}>Ver certificado</Link>
                  </Button>
                ) : (
                  <form action={issueCertificateAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <Button disabled={progress < 100}>Emitir certificado</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
