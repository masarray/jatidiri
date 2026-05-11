interface Props {
  current: number;
  total: number;
  label?: string;
}

export function ProgressTracker({ current, total, label }: Props) {
  const percent = total === 0 ? 0 : Math.min(100, (current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label ?? "Progress"}</span>
        <span className="tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${percent}%`,
            background:
              "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--ember)))",
          }}
        />
        {[25, 50, 75].map((p) => (
          <span
            key={p}
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full border border-border bg-background"
            style={{ left: `calc(${p}% - 3px)` }}
          />
        ))}
      </div>
    </div>
  );
}
