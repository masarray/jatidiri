import type { ClusterReport } from "@/types/assessment";

export function ClusterRadar({ reports }: { reports: ClusterReport[] }) {
  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div key={r.cluster} className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-foreground">{r.cluster}</span>
            <span className="tabular-nums text-muted-foreground">
              Natural {r.natural} · Aktivitas {r.strength}
            </span>
          </div>
          <div className="space-y-1.5">
            <ScoreLine label="Natural" value={r.natural} className="bg-primary" />
            <ScoreLine label="Aktivitas" value={r.strength} className="bg-[var(--ember)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreLine({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-[11px] text-muted-foreground">
      <span>{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}
