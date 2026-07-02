import { CheckCircle2, ListChecks, Target } from "lucide-react";
import { MarkdownView } from "@/components/lesson/markdown-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { splitMarkdownSections } from "@/lib/lesson-content";

function sectionIcon(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("objetivo")) return Target;
  if (normalized.includes("check")) return ListChecks;
  return CheckCircle2;
}

export function LessonStudyView({ content }: { content: string }) {
  const sections = splitMarkdownSections(content);

  return (
    <div className="space-y-4">
      <Card className="border-teal-200 bg-teal-50/50">
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center gap-2">
            {sections.map((section, index) => (
              <Badge key={section.title} className="bg-white">
                {index + 1}. {section.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {sections.map((section, index) => {
        const Icon = sectionIcon(section.title);
        return (
          <Card key={`${section.title}-${index}`} className="overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="mr-2 text-sm font-medium text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <MarkdownView content={section.content} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
