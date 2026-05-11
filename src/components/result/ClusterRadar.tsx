import type { ClusterReport } from "@/types/assessment";
import { CLUSTER_META } from "@/data/clusterMeta";

export function ClusterRadar({ reports }: { reports: ClusterReport[] }) {
  const sorted = [...reports].sort((a, b) => b.natural + b.strength - (a.natural + a.strength));

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm print-avoid-break">
      <div className="mb-4 grid grid-cols-[1fr_auto] items-end gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Cluster Comparison
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Natural menunjukkan kecenderungan energi alami. Aktivitas menunjukkan kekuatan yang sudah terasa dalam pengalaman nyata.
          </p>
        </div>
        <div className="hidden text-right text-[10px] leading-relaxed text-muted-foreground sm:block">
          <span className="inline-block h-2 w-5 rounded-full bg-primary" /> Natural<br />
          <span className="inline-block h-2 w-5 rounded-full bg-[var(--ember)]" /> Aktivitas
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {sorted.map((r) => (
          <div key={r.cluster} className="grid gap-3 py-3 sm:grid-cols-[11rem_1fr] sm:items-center">
            <div>
              <div className="text-sm font-semibold text-foreground">{CLUSTER_META[r.cluster].label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{r.cluster}</div>
            </div>
            <div className="space-y-1.5">
              <ScoreLine label="Natural" value={r.natural} className="bg-primary" />
              <ScoreLine label="Aktivitas" value={r.strength} className="bg-[var(--ember)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreLine({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_2.25rem] items-center gap-2 text-[11px] text-muted-foreground">
      <span>{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="text-right tabular-nums text-foreground/80">{value}</span>
    </div>
  );
}
