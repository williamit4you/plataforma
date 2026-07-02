export default function CourseDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="h-12 w-96 animate-pulse rounded-md bg-slate-200" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-52 animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}
