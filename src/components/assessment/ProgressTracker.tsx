import { motion } from "framer-motion";

interface Props {
  current: number;
  total: number;
  label?: string;
}

export function ProgressTracker({ current, total, label }: Props) {
  const percent = total === 0 ? 0 : Math.min(100, (current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground">
        <span>{label ?? "Progress"}</span>
        <span className="tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--ember)))",
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        {[25, 50, 75].map((p) => (
          <span
            key={p}
            className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-background border border-border"
            style={{ left: `calc(${p}% - 3px)` }}
          />
        ))}
      </div>
    </div>
  );
}
