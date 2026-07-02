import { submitQuizAction } from "@/server/actions/quiz-actions";
import { Button } from "@/components/ui/button";

type LessonQuizFormProps = {
  courseSlug: string;
  lessonSlug: string;
  quizzes: {
    id: string;
    title: string;
    questions: {
      id: string;
      prompt: string;
      explanation: string;
      answers: { id: string; text: string; isCorrect?: boolean }[];
    }[];
  }[];
};

export function LessonQuizForm({ courseSlug, lessonSlug, quizzes }: LessonQuizFormProps) {
  if (!quizzes.length) {
    return <p className="text-sm text-slate-500">Nenhum quiz cadastrado para esta aula.</p>;
  }

  return (
    <div className="space-y-5">
      {quizzes.map((quiz) => (
        <form key={quiz.id} action={submitQuizAction} className="space-y-4">
          <input type="hidden" name="quizId" value={quiz.id} />
          <input type="hidden" name="courseSlug" value={courseSlug} />
          <input type="hidden" name="lessonSlug" value={lessonSlug} />
          {quiz.questions.map((question) => (
            <fieldset key={question.id} className="rounded-md bg-slate-50 p-3">
              <legend className="text-sm font-medium text-slate-950">{question.prompt}</legend>
              <div className="mt-3 space-y-2">
                {question.answers.map((answer) => (
                  <label key={answer.id} className="flex items-start gap-2 rounded-md bg-white p-2 text-sm text-slate-700">
                    <input
                      required
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      className="mt-1"
                    />
                    <span>{answer.text}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">{question.explanation}</p>
            </fieldset>
          ))}
          <Button className="w-full" variant="secondary">
            Enviar respostas
          </Button>
        </form>
      ))}
    </div>
  );
}
