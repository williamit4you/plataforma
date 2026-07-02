export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
