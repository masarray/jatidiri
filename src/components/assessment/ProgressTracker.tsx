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
  const calloutLeft = clamp(percent, 7, 93);

  return (
    <div
      className="rounded-[1rem] border border-border/65 bg-card/90 px-3 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.032),inset_0_1px_0_rgba(255,255,255,0.72)]"
      aria-label={`Progress ${current} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 truncate text-[11px] font-medium leading-tight text-muted-foreground">
          {label ?? "Progress asesmen"}
        </div>
        <div className="rounded-full border border-primary/14 bg-primary/[0.05] px-2.5 py-1 text-[11px] font-semibold leading-none text-primary tabular-nums">
          {rounded}%
        </div>
      </div>

      <div className="relative mx-1 mt-2 h-[34px]" aria-hidden="true">
        <span
          className="absolute top-0 -translate-x-1/2 rounded-md border border-primary/12 bg-card px-2 py-[3px] text-[10.5px] font-semibold leading-none text-primary shadow-[0_2px_8px_rgba(15,23,42,0.075),inset_0_1px_0_rgba(255,255,255,0.86)] tabular-nums transition-[left] duration-180 ease-out"
          style={{ left: `${calloutLeft}%` }}
        >
          {current}
        </span>
        <span
          className="absolute top-[18px] h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-primary/16 transition-[left] duration-180 ease-out"
          style={{ left: `${calloutLeft}%` }}
        />

        <span className="absolute inset-x-0 top-[26px] h-[3px] -translate-y-1/2 rounded-full bg-muted shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]" />
        <span
          className="absolute left-0 top-[26px] h-[3px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklab,var(--ember)_54%,var(--primary)))] transition-[width] duration-180 ease-out"
          style={{ width: `${percent}%` }}
        />
        {MILESTONES.map((milestone) => (
          <span
            key={milestone}
            className="absolute top-[26px] size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card"
            style={{ left: `${milestone}%` }}
          />
        ))}
        <span
          className="absolute top-[26px] size-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-card bg-[color-mix(in_oklab,var(--ember)_60%,var(--primary))] shadow-[0_0_0_3px_color-mix(in_oklab,var(--ember)_13%,transparent),0_4px_10px_rgba(15,23,42,0.14)] transition-[left] duration-180 ease-out"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}
