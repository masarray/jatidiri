import type { ClusterReport, Zone } from "@/types/assessment";
import { CLUSTER_META } from "@/data/clusterMeta";

const ZONES: { zone: Zone; title: string; tone: string; bg: string }[] = [
  {
    zone: "Natural & Explored",
    title: "Alami & Terlatih",
    tone: "Area yang relatif paling siap dijadikan kekuatan utama karena energi alami dan pengalaman aktivitas sama-sama tampak kuat.",
    bg: "bg-primary/10 border-primary/35",
  },
  {
    zone: "Natural but Dormant",
    title: "Potensi Alami Belum Terlatih",
    tone: "Area yang tampak memiliki energi alami, tetapi belum terlihat sama kuat dalam aktivitas atau pengalaman saat ini.",
    bg: "bg-accent/60 border-border/70",
  },
  {
    zone: "Adaptive / Survival",
    title: "Kemampuan Adaptif",
    tone: "Area yang bisa dijalankan, namun perlu dijaga agar tidak menjadi beban utama yang menguras energi.",
    bg: "bg-[var(--ember)]/10 border-[var(--ember)]/25",
  },
  {
    zone: "Weak / Draining",
    title: "Area Perlu Dikelola",
    tone: "Area yang sebaiknya dibantu dengan sistem, alat, kolaborasi, atau pembagian peran yang tepat.",
    bg: "bg-muted/55 border-border/70",
  },
];

export function ZoneMatrix({ reports }: { reports: ClusterReport[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ZONES.map((z) => {
        const items = reports.filter((r) => r.zone === z.zone);
        return (
          <div key={z.zone} className={`rounded-3xl border p-5 print-avoid-break ${z.bg}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
              {z.title}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{z.tone}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {items.length === 0 && <span className="text-xs text-muted-foreground">Belum ada cluster yang dominan di area ini.</span>}
              {items.map((r) => (
                <span
                  key={r.cluster}
                  className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground"
                  title={`${CLUSTER_META[r.cluster].label}: Natural ${r.natural}, Aktivitas ${r.strength}`}
                >
                  {CLUSTER_META[r.cluster].label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
