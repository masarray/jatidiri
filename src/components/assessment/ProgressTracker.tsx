interface Props {
  current: number;
  total: number;
  label?: string;
  canGoBack?: boolean;
  onBack?: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function ProgressTracker({ current, total, label, canGoBack = false, onBack }: Props) {
  const safeTotal = Math.max(total, 1);
  const percent = clamp((current / safeTotal) * 100, 0, 100);
  const rounded = Math.round(percent);

  return (
    <div
      className="rounded-[16px] border border-white/75 bg-white/84 px-3 py-2 shadow-[0_10px_26px_rgba(39,45,58,0.06),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl"
      aria-label={`Progress ${current} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-2 text-[10.5px]">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="inline-flex h-6 min-w-[78px] items-center rounded-full px-1.5 font-medium text-muted-foreground transition hover:bg-muted/45 active:scale-[0.98] disabled:opacity-30"
        >
          &lt; Sebelumnya
        </button>
        <div className="min-w-0 flex-1 truncate text-center font-semibold tracking-[0.01em] text-foreground/72">
          {label ?? "Progress asesmen"}
        </div>
        <div className="flex h-6 min-w-[50px] items-center justify-end text-[10px] font-semibold leading-none text-primary/80 tabular-nums">
          {current}/{total}
        </div>
      </div>

      <div className="relative mt-1 h-11">
        <div
          className="absolute left-0 top-5 z-10 grid h-6 w-[44px] place-items-center bg-[#28c985] pl-1 pr-2 text-[8px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_4px_10px_rgba(15,118,110,0.16)]"
          style={{ clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%)" }}
          aria-hidden="true"
        >
          Start
        </div>

        <div className="absolute inset-x-[40px] top-0 h-11">
          <span
            className="absolute top-0 z-20 -translate-x-1/2 rounded-[5px] bg-[#28c985] px-2.5 py-1 text-[10px] font-bold leading-none text-white tabular-nums shadow-[0_7px_16px_rgba(15,118,110,0.22),inset_0_1px_0_rgba(255,255,255,0.28)] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          >
            {rounded}%
          </span>
          <span
            className="absolute top-[18px] z-20 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#28c985] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          />

          <span
            className="absolute inset-x-0 top-8 h-[5px] -translate-y-1/2 rounded-full bg-[color-mix(in_oklab,var(--muted)_76%,white)] shadow-[inset_0_1px_2px_rgba(15,23,42,0.075)]"
            aria-hidden="true"
          />
          <span
            className="absolute left-0 top-8 h-[5px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#28c985_0%,#20cf91_58%,#22aee8_100%)] shadow-[0_0_0_1px_rgba(255,255,255,.58),0_0_14px_rgba(31,207,146,.28)] transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
          {[0, 25, 50, 75, 100].map((milestone) => {
            const done = percent >= milestone;
            return (
              <span
                key={milestone}
                className="absolute top-8 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white transition-[background,box-shadow] duration-200"
                style={{
                  left: `${milestone}%`,
                  background: done ? "#21c982" : "color-mix(in oklab, var(--card) 88%, var(--muted))",
                  boxShadow: done
                    ? "0 0 0 3px rgba(33,201,130,.14), 0 3px 8px rgba(15,118,110,.16)"
                    : "0 1px 4px rgba(15,23,42,.08)",
                }}
                aria-hidden="true"
              />
            );
          })}
          <span
            className="absolute top-8 z-10 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#21c982] shadow-[0_0_0_4px_rgba(33,201,130,.16),0_6px_14px_rgba(15,118,110,.22)] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          />
        </div>

        <a
          href="/"
          className="absolute right-0 top-5 z-10 grid h-6 w-[46px] place-items-center bg-[#21aee8] pl-2 pr-1 text-[8px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_4px_10px_rgba(14,116,144,0.16)]"
          style={{ clipPath: "polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%)" }}
        >
          Jeda
        </a>
      </div>
    </div>
  );
}
