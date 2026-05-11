interface Props {
  current: number;
  total: number;
  label?: string;
}

const MILESTONES = [0, 25, 50, 75, 100];

export function ProgressTracker({ current, total, label }: Props) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.max(0, Math.min(100, (current / safeTotal) * 100));
  const rounded = Math.round(percent);

  return (
    <div className="calm-progress-card" aria-label={`Progress ${current} dari ${total}`}>
      <div className="calm-progress-head">
        <div className="min-w-0">
          <div className="calm-progress-label">{label ?? "Progress asesmen"}</div>
          <div className="calm-progress-title tabular-nums">Pertanyaan {current} / {total}</div>
        </div>
        <div className="calm-progress-percent tabular-nums">{rounded}%</div>
      </div>

      <div className="calm-progress-track" aria-hidden="true">
        <span className="calm-progress-fill" style={{ width: `${percent}%` }} />
        {MILESTONES.map((milestone) => (
          <span
            key={milestone}
            className={`calm-progress-node ${percent >= milestone ? "is-done" : ""}`}
            style={{ left: `${milestone}%` }}
          />
        ))}
        <span className="calm-progress-active-node" style={{ left: `${percent}%` }} />
      </div>
    </div>
  );
}
