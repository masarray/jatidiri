import { motion } from "framer-motion";
import type { AnswerValue } from "@/types/assessment";

interface Props {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  leftLabel: string;
  rightLabel: string;
}

const SIZES = [44, 38, 32, 28, 32, 38, 44];

export function AnswerScale({ value, onSelect, leftLabel, rightLabel }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const v = n as AnswerValue;
          const selected = value === v;
          const size = SIZES[n - 1];
          // left = cool, right = ember
          const isHot = n >= 5;
          const isCool = n <= 3;
          const baseColor = isHot
            ? "border-[var(--ember)]"
            : isCool
              ? "border-[var(--cool)]"
              : "border-muted-foreground/40";
          const fillColor = isHot
            ? "bg-[var(--ember)]"
            : isCool
              ? "bg-[var(--cool)]"
              : "bg-muted-foreground/60";
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(v)}
              aria-label={`Pilih ${n}`}
              className="relative grid place-items-center transition-transform active:scale-95"
              style={{ width: size + 12, height: size + 12 }}
            >
              <motion.span
                animate={{ scale: selected ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`rounded-full border-2 ${baseColor} ${selected ? fillColor : "bg-transparent"}`}
                style={{ width: size, height: size }}
              />
              {selected && (
                <motion.span
                  layoutId="selection-glow"
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 0 4px color-mix(in oklab, var(--ember) 25%, transparent)" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-[11px] sm:text-xs text-muted-foreground px-2">
        <span className="max-w-[40%] leading-tight">{leftLabel}</span>
        <span className="max-w-[40%] text-right leading-tight">{rightLabel}</span>
      </div>
    </div>
  );
}
