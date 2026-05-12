interface Props {
  current: number;
  total: number;
  label?: string;
}

const MILESTONES = [0, 25, 50, 75, 100];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function ProgressTracker({ current, total, label }: Props) {
  const safeTotal = Math.max(total, 1);
  const percent = clamp((current / safeTotal) * 100, 0, 100);
  const rounded = Math.round(percent);
  const calloutLeft = clamp(percent, 6, 94);

  return (
    <div
      className="rounded-[1.05rem] border border-border/70 bg-card/92 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.038),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-sm"
      aria-label={`Progress ${current} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 truncate text-[11px] font-medium leading-tight text-muted-foreground">
          {label ?? "Progress asesmen"}
        </div>
        <div className="rounded-full border border-primary/13 bg-primary/[0.045] px-2.5 py-1 text-[10.5px] font-semibold leading-none text-primary tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,.72)]">
          {rounded}%
        </div>
      </div>

      <div className="relative mx-1 mt-2 h-[34px]" aria-hidden="true">
        <span
          className="absolute top-[1px] -translate-x-1/2 rounded-[7px] border border-primary/14 bg-card px-2.5 py-[3px] text-[10.5px] font-semibold leading-none text-primary shadow-[0_4px_10px_rgba(15,23,42,0.075),inset_0_1px_0_rgba(255,255,255,0.92)] tabular-nums transition-[left] duration-150 ease-out"
          style={{ left: `${calloutLeft}%` }}
        >
          {current}
        </span>
        <span
          className="absolute top-[18px] h-0 w-0 -translate-x-1/2 border-x-[4.5px] border-t-[5px] border-x-transparent border-t-primary/18 transition-[left] duration-150 ease-out"
          style={{ left: `${calloutLeft}%` }}
        />

        <span className="absolute inset-x-0 top-[26px] h-[3px] -translate-y-1/2 rounded-full bg-muted shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]" />
        <span
          className="absolute left-0 top-[26px] h-[3px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklab,var(--ember)_50%,var(--primary)))] shadow-[0_0_0_1px_rgba(255,255,255,.45)] transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
        {MILESTONES.map((milestone) => {
          const done = percent >= milestone;
          return (
            <span
              key={milestone}
              className="absolute top-[26px] size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-150"
              style={{
                left: `${milestone}%`,
                background: done ? "color-mix(in oklab, var(--primary) 38%, white)" : "var(--card)",
                borderColor: done ? "color-mix(in oklab, var(--primary) 34%, var(--border))" : "var(--border)",
              }}
            />
          );
        })}
        <span
          className="absolute top-[26px] size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-card bg-[color-mix(in_oklab,var(--ember)_58%,var(--primary))] shadow-[0_0_0_4px_color-mix(in_oklab,var(--ember)_11%,transparent),0_5px_12px_rgba(15,23,42,0.14)] transition-[left] duration-150 ease-out"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}
