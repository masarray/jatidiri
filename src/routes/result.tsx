import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Printer, RotateCcw, Home, AlertCircle } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { buildClusterReports, topClusters, bottomClusters, progressFor, getNextAssessmentTarget, isAssessmentComplete } from "@/engine/scoring";
import { CLUSTER_META } from "@/data/clusterMeta";
import { pickTypology } from "@/data/typology";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { ZoneMatrix } from "@/components/result/ZoneMatrix";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
      { name: "description", content: "Ringkasan bakat alami, kekuatan, dan zona energi Anda." },
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
  const top = useMemo(() => topClusters(reports, 3), [reports]);
  const bottom = useMemo(() => bottomClusters(reports, 3), [reports]);
  const typology = useMemo(() => pickTypology(top), [top]);

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
              Hasil peta diri baru ditampilkan setelah kedua sesi selesai, agar kesimpulannya tidak menyesatkan.
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
              className="mt-6 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition"
            >
              Lanjutkan Asesmen
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between no-print mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="size-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
            >
              <Printer className="size-3.5" /> Cetak / PDF
            </button>
            <button
              onClick={() => {
                if (confirm("Mulai dari awal? Jawaban Anda akan dihapus.")) {
                  reset();
                  navigate({ to: "/" });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
            >
              <RotateCcw className="size-3.5" /> Ulang
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 via-card to-[var(--ember)]/10 border border-border/60 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Peta Jati Diri · {new Date(identity.startedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{identity.name}</h1>
          <div className="mt-6">
            <div className="text-xs text-muted-foreground">Indikasi Tipologi Energi</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-primary">{typology.name}</div>
            <p className="mt-3 text-sm text-foreground/90 leading-relaxed">{typology.tagline}</p>
          </div>
        </section>

        <div className="mt-4 rounded-2xl border border-border/60 bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          Hasil ini adalah peta refleksi diri berdasarkan jawaban Anda, bukan diagnosis klinis, bukan tes rekrutmen, dan bukan label permanen. Gunakan sebagai bahan mengenal pola energi, komunikasi, dan area pengembangan.
        </div>

        {/* Snapshot */}
        <Section title="Human Snapshot">
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
            Berdasarkan pola jawaban Anda, {typology.experience.toLowerCase()} <strong>Anda tampak hidup</strong> {typology.alive.toLowerCase()} Tiga
            energi inti yang tampak menonjol berada di area{" "}
            <strong>{top.map((c) => CLUSTER_META[c].label).join(", ")}</strong>. Sebaliknya, Anda
            cenderung lebih cepat lelah pada area{" "}
            <strong>{bottom.map((c) => CLUSTER_META[c].label).join(", ")}</strong>.
          </p>
        </Section>

        {/* Cluster Map */}
        <Section title="Strength Cluster Map">
          <p className="text-xs text-muted-foreground mb-2">
            Bandingkan bakat alami (Natural) dan kekuatan aktivitas (Aktivitas) di 8 cluster.
          </p>
          <ClusterRadar reports={reports} />
        </Section>

        {/* Top Talents */}
        <Section title="Top Bakat Alami">
          <div className="space-y-3">
            {top.map((c, i) => {
              const m = CLUSTER_META[c];
              const r = reports.find((x) => x.cluster === c)!;
              return (
                <div key={c} className="rounded-2xl bg-card border border-border/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                        #{i + 1} · {c}
                      </div>
                      <h3 className="mt-1 font-bold text-base">{m.label}</h3>
                    </div>
                    <ScoreBadge score={r.natural} />
                  </div>
                  <p className="mt-2 text-sm text-foreground/90 italic">{m.tagline}</p>
                  <dl className="mt-4 space-y-2 text-xs">
                    <Row k="Terlihat sebagai" v={m.observable} />
                    <Row k="Pengisi energi" v={m.recharge} />
                    <Row k="Pemicu hidup" v={m.trigger} />
                    <Row k="Blind spot" v={m.blindspot} />
                  </dl>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Bottom Draining */}
        <Section title="Zona Penguras Energi">
          <div className="space-y-3">
            {bottom.map((c) => {
              const m = CLUSTER_META[c];
              const r = reports.find((x) => x.cluster === c)!;
              return (
                <div key={c} className="rounded-2xl bg-muted/40 border border-border/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {c}
                      </div>
                      <h3 className="mt-1 font-bold text-base">{m.label}</h3>
                    </div>
                    <ScoreBadge score={r.natural} muted />
                  </div>
                  <dl className="mt-4 space-y-2 text-xs">
                    <Row k="Yang menguras" v={m.drain} />
                    <Row k="Cara kompensasi" v={m.compensate} />
                  </dl>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Zone Matrix */}
        <Section title="Natural vs Aktivitas Matrix">
          <ZoneMatrix reports={reports} />
        </Section>

        {/* Communication Guide */}
        <Section title="Panduan Komunikasi">
          <div className="space-y-3">
            {top.slice(0, 2).map((c) => {
              const m = CLUSTER_META[c];
              return (
                <div key={c} className="rounded-2xl bg-card border border-border/60 p-5">
                  <div className="text-xs font-semibold text-primary mb-2">{m.label}</div>
                  <dl className="space-y-2 text-xs">
                    <Row k="Cara terbaik berbicara" v={m.commGood} />
                    <Row k="Yang membuat defensif" v={m.commBad} />
                    <Row k="Cara memberi kritik" v={m.critique} />
                  </dl>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Burnout */}
        <Section title="Burnout & Recharge Map">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4">
              <div className="text-xs font-semibold text-primary mb-2">Yang menghidupkan</div>
              <ul className="space-y-1.5 text-xs">
                {top.map((c) => (
                  <li key={c} className="leading-snug">• {CLUSTER_META[c].recharge}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[var(--ember)]/10 border border-[var(--ember)]/30 p-4">
              <div className="text-xs font-semibold text-[var(--ember)] mb-2">Yang menguras</div>
              <ul className="space-y-1.5 text-xs">
                {bottom.map((c) => (
                  <li key={c} className="leading-snug">• {CLUSTER_META[c].drain}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <footer className="mt-12 text-center text-xs text-muted-foreground no-print">
          Peta Jati Diri · Self-awareness assessment
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 print-page">
      <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="font-semibold text-muted-foreground shrink-0 min-w-[110px]">{k}</dt>
      <dd className="text-foreground/90 leading-relaxed">{v}</dd>
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
