import type { ClusterReport, Zone } from "@/types/assessment";

const ZONES: { zone: Zone; title: string; tone: string; bg: string }[] = [
  {
    zone: "Natural & Explored",
    title: "Alami & Terlatih",
    tone: "Area yang cenderung menjadi kekuatan utama karena selaras antara energi alami dan pengalaman aktivitas.",
    bg: "bg-primary/10 border-primary/40",
  },
  {
    zone: "Natural but Dormant",
    title: "Potensi Belum Terlatih",
    tone: "Area yang tampak punya energi alami, tetapi belum cukup sering digunakan atau dikembangkan.",
    bg: "bg-[var(--ember)]/10 border-[var(--ember)]/40",
  },
  {
    zone: "Adaptive / Survival",
    title: "Kemampuan Adaptif",
    tone: "Area yang bisa dijalankan, namun perlu dijaga agar tidak menjadi tuntutan yang menguras energi.",
    bg: "bg-amber-500/10 border-amber-500/40",
  },
  {
    zone: "Weak / Draining",
    title: "Titik Rentan Energi",
    tone: "Area yang sebaiknya dibantu sistem, kolaborasi, atau batasan peran agar tidak menjadi beban utama.",
    bg: "bg-muted border-border",
  },
];

export function ZoneMatrix({ reports }: { reports: ClusterReport[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ZONES.map((z) => {
        const items = reports.filter((r) => r.zone === z.zone);
        return (
          <div key={z.zone} className={`rounded-2xl border p-4 ${z.bg}`}>
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground">{z.title}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{z.tone}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {items.length === 0 && <li className="text-xs text-muted-foreground">—</li>}
              {items.map((r) => (
                <li
                  key={r.cluster}
                  className="rounded-full border border-border/60 bg-background/70 px-2 py-1 text-xs font-medium"
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
