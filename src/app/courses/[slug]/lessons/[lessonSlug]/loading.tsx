export default function LessonLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-12 w-96 animate-pulse rounded-md bg-slate-200" />
        <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
