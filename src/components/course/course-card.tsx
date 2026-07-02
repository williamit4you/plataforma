import Link from "next/link";
import { ArrowRight, Clock, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type CourseCardProps = {
  title: string;
  slug: string;
  description: string;
  level: string;
  hours?: number;
  workloadHours?: number;
  progress?: number;
};

export function CourseCard({ title, slug, description, level, hours, workloadHours, progress = 32 }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-3 flex items-center gap-2">
          <Badge>{level}</Badge>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={14} />
            {hours ?? workloadHours ?? 0}h
          </span>
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Signal size={14} />
              Progresso
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <Button asChild variant="secondary">
          <Link href={`/courses/${slug}`}>
            Continuar
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
