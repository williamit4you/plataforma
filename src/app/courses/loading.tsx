export default function CoursesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-40 animate-pulse rounded-md bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
