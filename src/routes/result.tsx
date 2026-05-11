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
import { buildPatternSignatureReport, type MicroRoleScore } from "@/engine/patternSignature";
import { CLUSTER_META } from "@/data/clusterMeta";
import { pickTypology } from "@/data/typology";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { ZoneMatrix } from "@/components/result/ZoneMatrix";
import {
  buildPurposeGuidance,
  getPurposeLens,
  purposeSummaryText,
} from "@/data/purposeLens";
import {
  buildAnalogies,
  buildCommunicationOn,
  buildCommunicationResistance,
  buildDailyHabits,
  buildObservablePatterns,
  getMicroRoleNarrative,
} from "@/data/observableNarratives";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
      { name: "description", content: "Ringkasan kecenderungan alami, kekuatan aktivitas, dan pola inti diri." },
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
  const patternReport = useMemo(() => buildPatternSignatureReport(answers, reports), [answers, reports]);
  const topNaturalClusters = useMemo(() => topClusters(reports, 5), [reports]);
  const topThree = topNaturalClusters.slice(0, 3);
  const bottom = useMemo(() => bottomClusters(reports, 3), [reports]);
  const topActivityClusters = useMemo(
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
  const observablePatterns = useMemo(() => buildObservablePatterns(patternReport.topNaturalRoles), [patternReport]);
  const dailyHabits = useMemo(() => buildDailyHabits(patternReport.topNaturalRoles), [patternReport]);
  const communicationOn = useMemo(() => buildCommunicationOn(patternReport.topNaturalRoles), [patternReport]);
  const communicationResistance = useMemo(() => buildCommunicationResistance(patternReport.topNaturalRoles), [patternReport]);
  const analogies = useMemo(() => buildAnalogies(patternReport.topNaturalRoles), [patternReport]);

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
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pola Inti</div>
            <div className="mt-1 text-2xl font-bold text-primary">{patternReport.core.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{patternReport.core.subtitle}</p>
          </div>
        </section>

        <Section title="Pola Inti yang Terbaca" kicker="Core Signature">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">{patternReport.core.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {patternReport.core.evidence.map((role) => (
                <span key={role.id} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                  {role.name}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SignatureNote title="Yang tampak dari luar" body={patternReport.core.visiblePattern} />
              <SignatureNote title="Energi terdalam" body={patternReport.core.hiddenEnergy} />
              <SignatureNote title="Risiko salah tempat" body={patternReport.core.riskIfMisplaced} />
              <SignatureNote title="Cara memakai dengan sehat" body={patternReport.core.healthyUse} />
            </div>
          </div>
        </Section>

        <Section title="Bahasa Sehari-hari" kicker="Observable Pattern">
          <div className="grid gap-3 sm:grid-cols-2">
            <BulletPanel
              title="Perilaku yang mungkin terlihat"
              intro="Bagian ini menerjemahkan micro-role menjadi kebiasaan yang lebih mudah dikenali dalam hidup sehari-hari."
              items={observablePatterns}
            />
            <BulletPanel
              title="Kebiasaan kecil yang sering relate"
              intro="Poin ini membantu membaca pola yang sering muncul tanpa terasa seperti teori psikologi."
              items={dailyHabits}
            />
          </div>
          <div className="mt-3 rounded-3xl border border-primary/20 bg-primary/10 p-5 print-avoid-break">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Analogi mudah</div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/90">
              {analogies.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Panduan Komunikasi Praktis" kicker="Communication Trigger">
          <div className="grid gap-3 sm:grid-cols-2">
            <BulletPanel
              title="Cara bicara yang membuat lebih terbuka"
              intro="Gunakan pendekatan ini agar komunikasi lebih mudah diterima dan tidak terasa menyerang."
              items={communicationOn}
            />
            <BulletPanel
              title="Pola yang dapat memicu resistensi"
              intro="Hindari pola ini terutama ketika sedang membahas keputusan, konflik, atau perubahan penting."
              items={communicationResistance}
              muted
            />
          </div>
        </Section>

        <Section title={lens.summaryTitle} kicker="Executive Summary">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">{lens.summaryFrame}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {purposeSummaryText(lens, topThree, topActivityClusters, bottom)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Indikasi tipologi cluster: <strong className="font-semibold text-foreground/90">{typology.name}</strong>. {typology.summary}
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              title="Natural Talent"
              caption="Micro-role yang cenderung muncul lebih spontan, terasa lebih hidup, dan relatif tidak cepat menguras energi."
              items={patternReport.topNaturalRoles.slice(0, 3).map((role) => role.name)}
            />
            <SummaryCard
              title="Explored Strength"
              caption="Aktivitas atau peran yang sudah lebih sering digunakan, dilatih, atau terbentuk dari pengalaman nyata."
              items={patternReport.topTrainedRoles.slice(0, 3).map((role) => role.name)}
            />
            <SummaryCard
              title="Draining Role"
              caption="Peran yang bisa saja dilakukan, tetapi lebih cepat menguras energi jika terlalu sering menjadi tuntutan utama."
              items={patternReport.drainingRoles.slice(0, 3).map((role) => role.name)}
            />
          </div>
        </Section>

        <Section title="Natural Talent" kicker="Natural Talent">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Bagian ini membaca potensi dominan pada level micro-role. Gunakan warna sebagai kode cepat: dominan, berkembang, netral, perlu dukungan, dan titik rentan energi.
          </p>
          <ColorMeaningLegend />
          <div className="space-y-3">
            {patternReport.topNaturalRoles.map((role, i) => (
              <MicroRoleInsightCard key={role.id} index={i + 1} role={role} score={role.natural} scoreLabel="Natural">
                <Row k="Terlihat sebagai" v={role.visible} />
                <Row k="Kebiasaan relate" v={getMicroRoleNarrative(role).dailyHabits[0]} />
                <Row k="Pengisi energi" v={role.energy} />
                <Row k="Hal yang perlu dijaga" v={role.risk} />
              </MicroRoleInsightCard>
            ))}
          </div>
        </Section>

        <Section title="Explored Strength" kicker="Explored Strength">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Bagian ini menunjukkan role atau aktivitas yang tampak sudah lebih sering digunakan, dilatih, atau lebih percaya diri dijalani dalam pengalaman nyata.
          </p>
          <div className="space-y-3">
            {patternReport.topTrainedRoles.map((role, i) => (
              <MicroRoleInsightCard key={role.id} index={i + 1} role={role} score={role.strength} scoreLabel="Aktivitas" mutedIndex>
                <Row k="Aktivitas yang tampak" v={role.visible} />
                <Row k="Jika selaras" v={role.energy} />
                <Row k="Agar tetap sehat" v={role.healthyUse} />
              </MicroRoleInsightCard>
            ))}
          </div>
        </Section>

        {patternReport.adaptiveGapInsights.length > 0 && (
          <Section title="Adaptive / Survival Strength" kicker="Natural vs Adaptive Gap">
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Bagian ini membaca kemampuan yang tampak kuat karena tuntutan hidup, jabatan, keluarga, target, atau kebutuhan sosial. Fokusnya bukan sekadar “Anda kuat di apa”, tetapi “Anda kuat lewat jalur apa” dan apakah jalur itu mengisi energi atau justru menguras.
            </p>
            <div className="space-y-3">
              {patternReport.adaptiveGapInsights.map((insight) => (
                <AdaptiveGapCard key={insight.id} insight={insight} />
              ))}
            </div>
          </Section>
        )}

        {patternReport.adaptiveRoles.length > 0 && (
          <Section title="Adaptive Capability" kicker="Adaptive Capability">
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Area ini dapat dijalankan dengan cukup baik, tetapi belum tentu menjadi rumah energi utama. Biasanya area seperti ini terbentuk karena pengalaman, tanggung jawab, survival, atau kebutuhan lingkungan.
            </p>
            <div className="space-y-3">
              {patternReport.adaptiveRoles.map((role, i) => (
                <MicroRoleInsightCard key={role.id} index={i + 1} role={role} score={role.strength} scoreLabel="Adaptif" mutedIndex>
                  <Row k="Kemampuan terlihat" v={role.visible} />
                  <Row k="Catatan energi" v="Bedakan antara 'saya bisa melakukan ini' dan 'ini benar-benar membuat saya hidup'." />
                  <Row k="Cara mengelola" v={role.healthyUse} />
                </MicroRoleInsightCard>
              ))}
            </div>
          </Section>
        )}

        <Section title="Natural vs Adaptive Map" kicker="Natural vs Adaptive Gap">
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Bagian ini membandingkan kecenderungan alami dengan kekuatan aktivitas pada peta cluster. Gunakan sebagai jembatan untuk membedakan kekuatan hidup, potensi belum terlatih, kemampuan adaptif, dan titik rentan energi.
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

        <Section title="Draining Role" kicker="Draining Role">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Area ini bukan berarti tidak bisa dilakukan. Namun apabila menjadi tuntutan utama dalam jangka panjang, area ini cenderung membutuhkan usaha, dukungan sistem, atau waktu pemulihan yang lebih besar.
          </p>
          <div className="space-y-3">
            {patternReport.drainingRoles.map((role) => (
              <div key={role.id} className="rounded-3xl border border-border/60 bg-muted/45 p-5 shadow-sm print-avoid-break">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{role.family}</div>
                    <h3 className="mt-1 font-bold text-foreground">{role.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{role.tagline}</p>
                  </div>
                  <ScoreBadge score={role.natural} />
                </div>
                <dl className="mt-4 space-y-2 text-xs">
                  <Row k="Yang menguras" v={role.risk} />
                  <Row k="Cara mengelola" v={role.healthyUse} />
                </dl>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Role Family Map" kicker="Role Family Map">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Peta ini merangkum micro-role ke dalam keluarga peran agar pola besar tetap mudah dibaca.
            </p>
            <div className="mt-4 space-y-3">
              {patternReport.roleFamilies.map((family) => (
                <div key={family.family}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-foreground">{family.family}</span>
                    <span className="text-muted-foreground">Natural {family.natural} · Aktivitas {family.strength}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${family.natural}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Strength Cluster Map" kicker="Cluster Score">
          <div className="mb-3 rounded-3xl border border-border/60 bg-card p-5 text-xs leading-relaxed text-muted-foreground shadow-sm print-avoid-break">
            Maksud peta ini dalam hidup sehari-hari: cluster menunjukkan wilayah besar energi Anda. Micro-role menjelaskan perilaku konkretnya. Jadi diagram bukan untuk dilihat sebagai angka semata, tetapi sebagai peta arah: area mana yang menghidupkan, area mana yang terlatih, dan area mana yang perlu dikelola agar tidak menjadi sumber lelah.
          </div>
          <ClusterRadar reports={reports} />
        </Section>

        <Section title="Energy & Recovery Map" kicker="Recharge & Drain">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-primary/25 bg-primary/10 p-5 print-avoid-break">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Cenderung Mengisi Energi</div>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-foreground/90">
                {patternReport.topNaturalRoles.slice(0, 4).map((role) => (
                  <li key={role.id}>• {role.energy}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-muted/55 p-5 print-avoid-break">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cenderung Menguras Energi</div>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-foreground/90">
                {patternReport.drainingRoles.slice(0, 4).map((role) => (
                  <li key={role.id}>• {role.risk}</li>
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

function AdaptiveGapCard({
  insight,
}: {
  insight: import("@/engine/patternSignature").AdaptiveGapInsight;
}) {
  return (
    <div className="rounded-3xl border border-amber-500/25 bg-card p-5 shadow-sm print-avoid-break">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">Adaptive / Survival</div>
          <h3 className="mt-1 text-base font-bold text-foreground">{insight.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{insight.interpretation}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Visible strength</div>
          <div className="text-lg font-bold text-[var(--ember)]">{insight.score}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SignatureNote title="Energizing route" body={insight.routeLabel} />
        <SignatureNote title="Draining route" body={insight.notRouteLabel} />
      </div>

      <dl className="mt-4 space-y-2 text-xs">
        <Row k="Best-fit use" v={insight.bestUse} />
        <Row k="Energy cost" v={insight.energyCost} />
        <Row k="Support strategy" v={insight.supportStrategy} />
      </dl>
    </div>
  );
}

function BulletPanel({
  title,
  intro,
  items,
  muted,
}: {
  title: string;
  intro: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/45" : "border-border/60 bg-card"}`}>
      <div className="text-sm font-bold text-foreground">{title}</div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{intro}</p>
      <ul className="mt-4 space-y-2 text-xs leading-relaxed text-foreground/90">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ColorMeaningLegend() {
  const items = [
    { label: "Dominan", tone: "bg-[var(--rank-dominant)]", text: "Kekuatan alami paling menonjol" },
    { label: "Berkembang", tone: "bg-[var(--rank-medium)]", text: "Potensi kuat yang perlu diberi ruang" },
    { label: "Netral", tone: "bg-[var(--rank-neutral)]", text: "Area penyeimbang" },
    { label: "Perlu dukungan", tone: "bg-[var(--rank-low)]", text: "Butuh sistem atau latihan" },
    { label: "Rentan", tone: "bg-[var(--rank-weak)]", text: "Cenderung menguras energi" },
  ];

  return (
    <div className="mb-4 grid gap-2 rounded-3xl border border-border/60 bg-card p-4 shadow-sm sm:grid-cols-5 print-avoid-break">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 sm:block">
          <span className={`inline-block size-3 shrink-0 rounded-full border border-border ${item.tone}`} />
          <div>
            <div className="text-[11px] font-bold text-foreground">{item.label}</div>
            <div className="text-[10px] leading-snug text-muted-foreground">{item.text}</div>
          </div>
        </div>
      ))}
    </div>
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

function SignatureNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/35 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <p className="mt-2 text-xs leading-relaxed text-foreground/90">{body}</p>
    </div>
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

function MicroRoleInsightCard({
  index,
  role,
  score,
  scoreLabel,
  children,
  mutedIndex,
}: {
  index: number;
  role: MicroRoleScore;
  score: number;
  scoreLabel: string;
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
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{role.family}</div>
            <h3 className="mt-1 font-bold text-foreground">{role.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{role.tagline}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <ScoreBadge score={score} muted={mutedIndex} />
          <div className="mt-1 text-[10px] text-muted-foreground">{scoreLabel}</div>
        </div>
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

function scoreTone(score: number, muted?: boolean) {
  if (muted) return "border-border bg-muted text-muted-foreground";
  if (score >= 80) return "border-[var(--rank-dominant-border)] bg-[var(--rank-dominant-soft)] text-[var(--rank-dominant-ink)]";
  if (score >= 64) return "border-[var(--rank-medium-border)] bg-[var(--rank-medium-soft)] text-[var(--rank-medium-ink)]";
  if (score >= 45) return "border-border bg-[var(--rank-neutral)] text-foreground";
  if (score >= 30) return "border-[var(--rank-low-border)] bg-[var(--rank-low-soft)] text-[var(--rank-low-ink)]";
  return "border-[var(--rank-weak-border)] bg-[var(--rank-weak)] text-white";
}

function ScoreBadge({ score, muted }: { score: number; muted?: boolean }) {
  return (
    <div className={`rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${scoreTone(score, muted)}`}>
      {score}
    </div>
  );
}
