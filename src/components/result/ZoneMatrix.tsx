import type { ClusterReport, Zone } from "@/types/assessment";

const ZONES: { zone: Zone; title: string; tone: string; bg: string }[] = [
  { zone: "Natural & Explored", title: "Rumah Energi", tone: "Mudah hidup, cepat berkembang.", bg: "bg-primary/10 border-primary/40" },
  { zone: "Natural but Dormant", title: "Potensi Tertidur", tone: "Bakat alami yang belum dihidupkan.", bg: "bg-[var(--ember)]/10 border-[var(--ember)]/40" },
  { zone: "Adaptive / Survival", title: "Mode Bertahan", tone: "Bisa, tapi mungkin menguras energi.", bg: "bg-amber-500/10 border-amber-500/40" },
  { zone: "Weak / Draining", title: "Zona Kuras", tone: "Bukan area energi alami Anda.", bg: "bg-muted border-border" },
];

export function ZoneMatrix({ reports }: { reports: ClusterReport[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ZONES.map((z) => {
        const items = reports.filter((r) => r.zone === z.zone);
        return (
          <div key={z.zone} className={`rounded-2xl border p-4 ${z.bg}`}>
            <div className="text-xs font-semibold text-foreground uppercase tracking-wide">{z.title}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{z.tone}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {items.length === 0 && <li className="text-xs text-muted-foreground">—</li>}
              {items.map((r) => (
                <li
                  key={r.cluster}
                  className="text-xs px-2 py-1 rounded-full bg-background/70 border border-border/60 font-medium"
                >
                  {r.cluster}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
