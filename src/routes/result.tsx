import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Printer, RotateCcw, Home, AlertCircle } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  buildClusterReports,
  topClusters,
  bottomClusters,
  progressFor,
  getNextAssessmentTarget,
  isAssessmentComplete,
  computeReadingQuality,
} from "@/engine/scoring";
import { CLUSTER_META } from "@/data/clusterMeta";
import { pickTypology } from "@/data/typology";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { ZoneMatrix } from "@/components/result/ZoneMatrix";
import {
  buildPurposeGuidance,
  getPurposeLens,
  purposeSummaryText,
} from "@/data/purposeLens";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
      { name: "description", content: "Ringkasan kecenderungan alami, kekuatan aktivitas, dan panduan kontekstual." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const { identity, answers, reset, setCurrentIndex } = useAssessmentStore();
  const naturalProg = progressFor("natural", answers);
  const strengthProg = progressFor("strength", answers);
  const reports = useMemo(() => buildClusterReports(answers), [answers]);
  const topNatural = useMemo(() => topClusters(reports, 5), [reports]);
  const topThree = topNatural.slice(0, 3);
  const bottom = useMemo(() => bottomClusters(reports, 3), [reports]);
  const topActivity = useMemo(
    () => [...reports].sort((a, b) => b.strength - a.strength).slice(0, 3).map((r) => r.cluster),
    [reports],
  );
  const typology = useMemo(() => pickTypology(topThree), [topThree]);
  const readingQuality = useMemo(() => computeReadingQuality(answers), [answers]);
  const lens = useMemo(() => getPurposeLens(identity), [identity]);
  const purposeGuidance = useMemo(
    () => buildPurposeGuidance(lens, topThree, bottom, reports),
    [lens, topThree, bottom, reports],
  );

  useEffect(() => {
    if (!identity) navigate({ to: "/" });
  }, [identity, navigate]);

  if (!identity) return null;

  const allDone = isAssessmentComplete(answers);

  function continueAssessment() {
    const target = getNextAssessmentTarget(answers);
    if (target.to === "/assessment/$session") {
      setCurrentIndex(target.session, target.index);
      navigate({ to: target.to, params: { session: target.session } });
      return;
    }
    if (target.to === "/instruction/$session") {
      navigate({ to: target.to, params: { session: target.session } });
      return;
    }
    navigate({ to: target.to });
  }

  if (!allDone) {
    return (
      <main className="min-h-dvh bg-background px-5 py-10">
        <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
          <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="size-4" /> Beranda
          </Link>
          <section className="rounded-3xl border border-amber-500/25 bg-card p-6 shadow-sm">
            <div className="grid size-12 place-items-center rounded-full bg-amber-500/10 text-[var(--ember)]">
              <AlertCircle className="size-6" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-foreground">Asesmen belum lengkap</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hasil baru ditampilkan setelah kedua sesi selesai agar pembacaan tidak terpotong dan tidak menyesatkan.
            </p>
            <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>Sesi 1 — Bakat Alami</span>
                <strong>{naturalProg.answered}/{naturalProg.total}</strong>
              </div>
              <div className="mt-2 flex justify-between gap-3">
                <span>Sesi 2 — Kekuatan Aktivitas</span>
                <strong>{strengthProg.answered}/{strengthProg.total}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={continueAssessment}
              className="mt-6 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition active:scale-[0.98]"
            >
              Lanjutkan Asesmen
            </button>
          </section>
        </div>
      </main>
    );
  }

  const reportDate = new Date(identity.startedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <div className="no-print mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="size-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm"
            >
              <Printer className="size-3.5" /> Cetak / PDF
            </button>
            <button
              onClick={() => {
                if (confirm("Mulai dari awal? Jawaban Anda akan dihapus dari perangkat ini.")) {
                  reset();
                  navigate({ to: "/" });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm"
            >
              <RotateCcw className="size-3.5" /> Ulang
            </button>
          </div>
        </div>

        <section className="report-hero rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-[var(--ember)]/10 p-6 shadow-sm sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Peta Jati Diri · {lens.reportKicker}
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{identity.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Tanggal asesmen: {reportDate}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-left sm:text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Konteks Pembacaan
              </div>
              <div className="mt-1 text-xl font-bold text-primary">{lens.label}</div>
            </div>
          </div>
          <div className="mt-6 max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Indikasi Tipologi</div>
            <div className="mt-1 text-2xl font-bold text-primary">{typology.name}</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{typology.tagline}</p>
          </div>
        </section>

        <Section title={lens.summaryTitle} kicker="Executive Summary">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">{lens.summaryFrame}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {purposeSummaryText(lens, topThree, topActivity, bottom)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{typology.summary}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              title="Kekuatan Alami"
              caption="Potensi dominan yang cenderung memberi energi dan muncul lebih spontan."
              items={topThree.map((c) => CLUSTER_META[c].label)}
            />
            <SummaryCard
              title="Kekuatan Terlatih"
              caption="Aktivitas yang relatif lebih sering digunakan atau lebih percaya diri dijalani."
              items={topActivity.map((c) => CLUSTER_META[c].label)}
            />
            <SummaryCard
              title="Titik Rentan Energi"
              caption="Area yang tetap bisa dikelola, namun cenderung lebih menguras jika menjadi tuntutan utama."
              items={bottom.map((c) => CLUSTER_META[c].label)}
            />
          </div>
        </Section>

        <Section title="Kekuatan Alami" kicker="Natural Strengths">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Potensi dominan yang cenderung memberi energi, muncul lebih spontan, dan relatif mudah berkembang ketika mendapat ruang yang sesuai.
          </p>
          <div className="space-y-3">
            {topNatural.map((c, i) => {
              const m = CLUSTER_META[c];
              const r = reports.find((x) => x.cluster === c)!;
              return (
                <InsightCard key={c} index={i + 1} title={m.label} score={r.natural} subtitle={m.tagline}>
                  <Row k="Terlihat sebagai" v={m.observable} />
                  <Row k="Pengisi energi" v={m.recharge} />
                  <Row k="Hal yang perlu dijaga" v={m.blindspot} />
                </InsightCard>
              );
            })}
          </div>
        </Section>

        <Section title="Kekuatan Terlatih" kicker="Explored Strengths">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Aktivitas atau kemampuan yang sudah cukup sering digunakan, dilatih, atau terlihat dalam pengalaman sehari-hari.
          </p>
          <div className="space-y-3">
            {topActivity.map((c, i) => {
              const m = CLUSTER_META[c];
              const r = reports.find((x) => x.cluster === c)!;
              return (
                <InsightCard key={c} index={i + 1} title={m.label} score={r.strength} subtitle={m.observable} mutedIndex>
                  <Row k="Aktivitas yang mendukung" v={m.trigger} />
                  <Row k="Agar tetap sehat" v={m.compensate} />
                </InsightCard>
              );
            })}
          </div>
        </Section>

        <Section title="Matriks Alami vs Aktivitas" kicker="Natural–Activity Gap">
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Bagian ini membandingkan kecenderungan alami dengan kekuatan aktivitas. Pembacaan ini membantu membedakan area yang sudah menjadi kekuatan utama, potensi yang belum terlatih, kemampuan adaptif, dan titik rentan energi.
          </p>
          <ZoneMatrix reports={reports} />
        </Section>

        <Section title={lens.guideTitle} kicker={lens.guideKicker}>
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{lens.guideIntro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {purposeGuidance.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
                <div className="text-sm font-bold text-foreground">{item.title}</div>
                <p className="mt-3 text-xs leading-relaxed text-foreground/90">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Titik Rentan Energi" kicker="Energy Risk Notes">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Area ini bukan berarti tidak bisa dilakukan. Namun apabila menjadi tuntutan utama dalam jangka panjang, area ini cenderung membutuhkan usaha, dukungan sistem, atau waktu pemulihan yang lebih besar.
          </p>
          <div className="space-y-3">
            {bottom.map((c) => {
              const m = CLUSTER_META[c];
              const r = reports.find((x) => x.cluster === c)!;
              return (
                <div key={c} className="rounded-3xl border border-border/60 bg-muted/45 p-5 shadow-sm print-avoid-break">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-foreground">{m.label}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.tagline}</p>
                    </div>
                    <ScoreBadge score={r.natural} muted />
                  </div>
                  <dl className="mt-4 space-y-2 text-xs">
                    <Row k="Yang menguras" v={m.drain} />
                    <Row k="Cara mengelola" v={m.compensate} />
                  </dl>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Peta Cluster Kekuatan" kicker="Cluster Score">
          <ClusterRadar reports={reports} />
        </Section>

        <Section title="Peta Energi & Pemulihan" kicker="Recharge & Drain">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-primary/25 bg-primary/10 p-5 print-avoid-break">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Cenderung Mengisi Energi</div>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-foreground/90">
                {topThree.map((c) => (
                  <li key={c}>• {CLUSTER_META[c].recharge}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-muted/55 p-5 print-avoid-break">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cenderung Menguras Energi</div>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-foreground/90">
                {bottom.map((c) => (
                  <li key={c}>• {CLUSTER_META[c].drain}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title={lens.reflectionTitle} kicker="Next Step">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gunakan hasil ini sebagai bahan observasi selama satu minggu. Tidak perlu langsung mengubah banyak hal; cukup perhatikan pola yang paling sering muncul.
            </p>
            <ol className="mt-4 space-y-3 text-sm text-foreground/90">
              {lens.reflectionItems.map((item, index) => (
                <li key={item}><strong>{index + 1}.</strong> {item}</li>
              ))}
            </ol>
          </div>
        </Section>

        <Section title="Catatan Pembacaan" kicker="Reading Note">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Hasil ini adalah peta refleksi berdasarkan jawaban Anda. Hasil tidak dimaksudkan sebagai diagnosis klinis, tes rekrutmen, atau label permanen. Gunakan sebagai bahan membaca pola energi, komunikasi, dan arah pengembangan diri.
            </p>
            <ReadingQualityNote quality={readingQuality} />
          </div>
        </Section>

        <footer className="no-print mt-12 text-center text-xs text-muted-foreground">
          Peta Jati Diri · Self-awareness assessment
        </footer>
      </div>
    </main>
  );
}

function ReadingQualityNote({ quality }: { quality: ReturnType<typeof computeReadingQuality> }) {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kualitas Pembacaan</div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/90">{quality.summary}</p>
        </div>
        <div className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
          {quality.level} · {quality.score}/100
        </div>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {quality.notes.map((note) => (
          <li key={note}>• {note}</li>
        ))}
      </ul>
    </div>
  );
}

function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="report-section mt-10">
      {kicker && <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</div>}
      <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function SummaryCard({ title, caption, items }: { title: string; caption: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm print-avoid-break">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{caption}</p>
      <ul className="mt-3 space-y-1.5 text-xs font-medium leading-relaxed text-foreground/90">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

function InsightCard({
  index,
  title,
  score,
  subtitle,
  children,
  mutedIndex,
}: {
  index: number;
  title: string;
  score: number;
  subtitle: string;
  children: ReactNode;
  mutedIndex?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${mutedIndex ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
            {index}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ScoreBadge score={score} muted={mutedIndex} />
      </div>
      <dl className="mt-4 space-y-2 text-xs">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="font-semibold text-muted-foreground">{k}</dt>
      <dd className="leading-relaxed text-foreground/90">{v}</dd>
    </div>
  );
}

function ScoreBadge({ score, muted }: { score: number; muted?: boolean }) {
  return (
    <div
      className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
        muted ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
      }`}
    >
      {score}
    </div>
  );
}
