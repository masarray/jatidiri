import { Link } from "@tanstack/react-router";

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
      className="mx-1 rounded-[18px] border border-[#edf1ea] bg-white/86 px-3.5 py-2.5 shadow-[0_10px_26px_rgba(64,70,80,0.045),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-xl"
      aria-label={`Progress ${current} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-2 text-[10px] leading-none">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="inline-flex h-6 min-w-[76px] items-center rounded-full px-2 font-medium text-[#69777b] transition hover:bg-[#f1f5ef] hover:text-[#42525a] active:scale-[0.98] disabled:opacity-30"
        >
          &lt; Sebelumnya
        </button>
        <div className="min-w-0 flex-1 truncate text-center font-medium tracking-[0.003em] text-[#647177]">
          {label ?? "Progress asesmen"}
        </div>
        <div className="flex h-6 min-w-[48px] items-center justify-end text-[10px] font-semibold leading-none text-[#5f8a78] tabular-nums">
          {current}/{total}
        </div>
      </div>

      <div className="relative mt-1.5 h-8">
        <div
          className="absolute left-0 top-[13px] z-10 grid h-5 w-[42px] place-items-center border border-[#cfe3d6] bg-[#eef7f1] pl-1.5 pr-2 text-[7px] font-bold uppercase tracking-[0.035em] text-[#5c9a73] shadow-[0_3px_8px_rgba(91,128,108,0.055)]"
          style={{ clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)" }}
          aria-hidden="true"
        >
          Start
        </div>

        <div className="absolute inset-x-[39px] top-0 h-8">
          <span
            className="absolute top-0 z-20 -translate-x-1/2 rounded-[6px] border border-[#cfe3d6] bg-[#f3faf5] px-2 py-0.5 text-[8.5px] font-bold leading-none text-[#5f9676] tabular-nums shadow-[0_4px_10px_rgba(91,128,108,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          >
            {rounded}%
          </span>
          <span
            className="absolute top-[12px] z-20 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#cfe3d6] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          />

          <span
            className="absolute inset-x-0 top-[24px] h-[3px] -translate-y-1/2 rounded-full bg-[#ece9e2] shadow-[inset_0_1px_1px_rgba(84,91,98,0.06)]"
            aria-hidden="true"
          />
          <span
            className="absolute left-0 top-[24px] h-[3px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#9cc8aa_0%,#94bfa5_62%,#a7c3d1_100%)] shadow-[0_0_0_1px_rgba(255,255,255,.56),0_0_8px_rgba(132,174,150,.12)] transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
          {[0, 25, 50, 75, 100].map((milestone) => {
            const done = percent >= milestone;
            return (
              <span
                key={milestone}
                className="absolute top-[24px] size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-[background,box-shadow] duration-200"
                style={{
                  left: `${milestone}%`,
                  background: done ? "#9cc8aa" : "#f6f5f0",
                  boxShadow: done ? "0 0 0 2px rgba(156,200,170,.10), 0 1px 5px rgba(91,128,108,.08)" : "0 1px 3px rgba(84,91,98,.045)",
                }}
                aria-hidden="true"
              />
            );
          })}
          <span
            className="absolute top-[24px] z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white bg-[#91bea2] shadow-[0_0_0_3px_rgba(145,190,162,.10),0_4px_9px_rgba(91,128,108,.12)] transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
            aria-hidden="true"
          />
        </div>

        <Link
          to="/"
          className="absolute right-0 top-[13px] z-10 grid h-5 w-[42px] place-items-center border border-[#d6e2e9] bg-[#f0f5f8] pl-2 pr-1.5 text-[7px] font-bold uppercase tracking-[0.035em] text-[#648199] shadow-[0_3px_8px_rgba(88,111,128,0.055)] transition hover:bg-[#eaf2f6] hover:text-[#4f748c] active:scale-[0.98]"
          style={{ clipPath: "polygon(7px 0, 100% 0, 100% 100%, 7px 100%, 0 50%)" }}
        >
          Jeda
        </Link>
      </div>
    </div>
  );
}
