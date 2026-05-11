import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AlertCircle, Home, Printer, RotateCcw } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  buildClusterReports,
  computeReadingQuality,
  getNextAssessmentTarget,
  isAssessmentComplete,
  progressFor,
} from "@/engine/scoring";
import {
  buildPatternSignatureReport,
  type AdaptiveGapInsight,
  type MicroRoleScore,
} from "@/engine/patternSignature";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { getPurposeLens } from "@/data/purposeLens";
import {
  buildCommunicationOn,
  buildCommunicationResistance,
  buildDailyHabits,
  buildObservablePatterns,
} from "@/data/observableNarratives";
import { buildCommunicationSwitchProfiles, type CommunicationSwitchProfile } from "@/data/communicationSwitch";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
      {
        name: "description",
        content: "Ringkasan pola energi alami, titik rentan energi, kemampuan adaptif, dan strategi komunikasi.",
      },
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
  const readingQuality = useMemo(() => computeReadingQuality(answers), [answers]);
  const lens = useMemo(() => getPurposeLens(identity), [identity]);

  const topNaturalRoles = patternReport.topNaturalRoles.slice(0, 7);
  const drainingRoles = patternReport.drainingRoles.slice(0, 7);
  const trainedRoles = patternReport.topTrainedRoles.slice(0, 7);
  const adaptiveRoles = patternReport.adaptiveRoles.slice(0, 7);
  const dormantRoles = patternReport.naturalDormantRoles.slice(0, 7);
  const adaptiveInsights = patternReport.adaptiveGapInsights.slice(0, 3);

  const observablePatterns = useMemo(() => buildObservablePatterns(topNaturalRoles).slice(0, 4), [topNaturalRoles]);
  const dailyHabits = useMemo(() => buildDailyHabits(topNaturalRoles).slice(0, 4), [topNaturalRoles]);
  const communicationOn = useMemo(() => buildCommunicationOn(topNaturalRoles).slice(0, 5), [topNaturalRoles]);
  const communicationResistance = useMemo(
    () => buildCommunicationResistance(topNaturalRoles).slice(0, 5),
    [topNaturalRoles],
  );
  const communicationSwitches = useMemo(
    () => buildCommunicationSwitchProfiles(topNaturalRoles, lens.key),
    [topNaturalRoles, lens.key],
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
            <h1 className="mt-5 text-2xl font-semibold text-foreground">Asesmen belum lengkap</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hasil baru ditampilkan setelah kedua sesi selesai agar pembacaan tidak terpotong.
            </p>
            <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>Sesi 1 — Bakat Alami</span>
                <strong>
                  {naturalProg.answered}/{naturalProg.total}
                </strong>
              </div>
              <div className="mt-2 flex justify-between gap-3">
                <span>Sesi 2 — Kekuatan Aktivitas</span>
                <strong>
                  {strengthProg.answered}/{strengthProg.total}
                </strong>
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

  const strongestText = joinRoleNames(topNaturalRoles.slice(0, 3));
  const drainText = joinRoleNames(drainingRoles.slice(0, 3));

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

        <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/12 via-card to-[var(--ember)]/8 p-6 shadow-sm sm:p-8 print-avoid-break">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Peta Jati Diri · Pembacaan Pola Energi
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{identity.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Tanggal asesmen: {reportDate}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-left sm:text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Konteks
              </div>
              <div className="mt-1 text-lg font-semibold text-primary">{lens.label}</div>
            </div>
          </div>
          <div className="mt-6 max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pola inti</div>
            <div className="mt-1 text-2xl font-semibold text-primary">{patternReport.core.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{patternReport.core.subtitle}</p>
          </div>
        </section>

        <Section title="Cermin Diri Singkat" kicker="dibaca oleh kamu">
          <div className="rounded-[1.75rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
              Kamu tampak lebih mudah hidup ketika berada di wilayah <strong className="font-semibold">{strongestText}</strong>. Ini bukan label permanen, tetapi sinyal tentang jalur yang biasanya membuat energi, rasa ingin tahu, dan dorongan bergerak lebih mudah menyala.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Hasil ini juga membaca area yang bisa membuat energi turun, terutama bila kamu terlalu lama diminta bergerak di wilayah <strong className="font-semibold text-foreground/80">{drainText}</strong> tanpa bantuan sistem, pasangan, tim, atau batas peran yang jelas.
            </p>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <InsightCard title="Tombol ON kamu" body={communicationOn[0] ?? patternReport.core.hiddenEnergy} accent />
            <InsightCard title="Energi turun saat" body={communicationResistance[0] ?? patternReport.core.riskIfMisplaced} muted />
            <InsightCard title="Paling sehat dipakai untuk" body={patternReport.core.healthyUse} />
          </div>
        </Section>

        <Section title="7 Sumber Energi Alami" kicker="yang membuat kamu lebih hidup">
          <p className="section-lead">
            Bagian ini membaca tujuh pola yang paling mudah menyalakan energi alami. Ini bukan berarti selalu mudah, tetapi biasanya lebih cepat membuat kamu merasa punya arah, semangat, atau rasa bermakna.
          </p>
          <div className="mt-4 grid gap-3">
            {topNaturalRoles.map((role, index) => (
              <EnergyRoleCard key={role.id} index={index + 1} role={role} score={role.natural} scoreLabel="energi alami">
                <Row k="Terlihat sebagai" v={role.visible} />
                <Row k="Menyalakan saat" v={role.energy} />
                <Row k="Pakai sehat" v={role.healthyUse} />
              </EnergyRoleCard>
            ))}
          </div>
        </Section>

        <Section title="7 Titik Rentan Energi" kicker="yang mudah membuat lelah">
          <p className="section-lead">
            Ini bukan daftar kelemahan moral. Ini adalah area yang cenderung membutuhkan energi lebih besar. Bila terlalu sering menjadi pusat tuntutan, kamu bisa tampak menjalankan, tetapi bagian dalam terasa cepat lelah.
          </p>
          <div className="mt-4 grid gap-3">
            {drainingRoles.map((role, index) => (
              <EnergyRoleCard key={role.id} index={index + 1} role={role} score={role.natural} scoreLabel="energi rendah" muted>
                <Row k="Berisiko lelah jika" v={role.risk} />
                <Row k="Jangan dipaksa sebagai" v="pusat tuntutan harian tanpa sistem, batas, atau dukungan orang lain." />
                <Row k="Cara bantu" v="pakai checklist, template, pembagian peran, jeda pemulihan, atau pasangan/tim yang lebih natural di area ini." />
              </EnergyRoleCard>
            ))}
          </div>
        </Section>

        <Section title="Alami vs Terlatih" kicker="gap yang paling penting dibaca">
          <div className="grid gap-3 sm:grid-cols-2">
            <ZoneSummaryCard
              title="Alami & terlatih"
              body="Area ini cenderung menjadi rumah energi: natural dan sudah cukup sering dipakai."
              roles={topNaturalRoles.filter((role) => role.strength >= 55).slice(0, 5)}
              tone="calm"
            />
            <ZoneSummaryCard
              title="Potensi belum terlatih"
              body="Area ini punya energi alami, tetapi belum cukup sering digunakan atau dikembangkan."
              roles={dormantRoles.length > 0 ? dormantRoles : topNaturalRoles.filter((role) => role.strength < 55).slice(0, 5)}
              tone="soft"
            />
            <ZoneSummaryCard
              title="Kemampuan adaptif"
              body="Area ini bisa kamu jalankan, tetapi perlu dijaga agar tidak menjadi tuntutan yang menguras."
              roles={adaptiveRoles.length > 0 ? adaptiveRoles : trainedRoles.filter((role) => role.gap > 8).slice(0, 5)}
              tone="warm"
            />
            <ZoneSummaryCard
              title="Titik rentan energi"
              body="Area ini sebaiknya dibantu sistem, kolaborasi, atau batas peran."
              roles={drainingRoles.slice(0, 5)}
              tone="muted"
            />
          </div>
        </Section>

        {adaptiveInsights.length > 0 && (
          <Section title="Kemampuan yang Bisa, Tapi Bisa Menguras" kicker="adaptive / survival">
            <p className="section-lead">
              Bagian ini membaca aktivitas yang mungkin terlihat kuat karena sering digunakan, tuntutan pekerjaan, peran keluarga, atau tanggung jawab. Kamu bisa melakukannya, tetapi belum tentu itu sumber energi utama.
            </p>
            <div className="mt-4 grid gap-4">
              {adaptiveInsights.map((insight) => (
                <AdaptiveGapCard key={insight.id} insight={insight} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Kalimat yang Menyalakan Energi Kamu" kicker="cara masuk yang lebih diterima">
          <p className="section-lead">
            Bagian ini dibaca oleh kamu terlebih dahulu. Maksudnya: pola kalimat seperti apa yang biasanya membuat kamu lebih ON, lebih semangat, dan lebih tidak resistan.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <CuratedList title="Kamu biasanya lebih ON ketika orang berkata…" items={communicationOn} />
            <CuratedList title="Kamu mudah resistan jika mendengar…" items={communicationResistance} muted />
          </div>
          <CommunicationSwitchGuide switches={communicationSwitches} />
        </Section>

        <Section title="Pola yang Mungkin Terlihat Sehari-hari" kicker="human observable pattern">
          <div className="grid gap-3 sm:grid-cols-2">
            <CuratedList title="Orang lain mungkin melihat kamu seperti ini" items={observablePatterns} />
            <CuratedList title="Kebiasaan kecil yang mungkin relate" items={dailyHabits} />
          </div>
        </Section>

        <Section title="Kekuatan yang Sudah Terlatih" kicker="sesi 2 · aktivitas nyata">
          <p className="section-lead">
            Ini adalah area yang tampak sering dipakai atau terasa kuat dalam aktivitas nyata. Bandingkan dengan energi alami: yang selaras akan terasa mengisi, yang terlalu jauh dari natural bisa menjadi adaptif.
          </p>
          <div className="mt-4 grid gap-3">
            {trainedRoles.map((role, index) => (
              <EnergyRoleCard key={role.id} index={index + 1} role={role} score={role.strength} scoreLabel="terlatih">
                <Row k="Terlihat sebagai" v={role.visible} />
                <Row k="Energi alami" v={`${role.natural}/100 · ${role.confidenceLabel}`} />
              </EnergyRoleCard>
            ))}
          </div>
        </Section>

        <Section title="Peta Pendukung" kicker="chart bukan inti utama">
          <p className="section-lead">
            Chart di bawah ini hanya membantu melihat wilayah besar. Pembacaan paling penting tetap ada pada tujuh sumber energi, tujuh titik rentan, dan gap alami-vs-terlatih di atas.
          </p>
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
              <div className="text-sm font-semibold text-foreground">Peta Cluster Besar</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Ringkasan visual wilayah besar, bukan pengganti pembacaan micro-role.
              </p>
              <div className="mt-4">
                <ClusterRadar reports={reports} />
              </div>
            </div>
            <RoleFamilySummary families={patternReport.roleFamilies.slice(0, 6)} />
          </div>
          <ReadingQualityNote quality={readingQuality} />
        </Section>

        <section className="mt-10 rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-sm print-avoid-break">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Next step</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {lens.key === "relationship_family" ? "Refleksi Pasangan 7 Hari" : "Refleksi 7 Hari"}
          </h2>
          <div className="mt-4 rounded-3xl border border-border/60 bg-background/60 p-5 text-sm leading-relaxed text-foreground/90">
            <p>
              Gunakan hasil ini untuk observasi kecil selama satu minggu. Fokus pada satu perubahan: masuk lewat jalur yang lebih tepat, dan jangan jadikan titik rentan sebagai beban utama tanpa bantuan sistem.
            </p>
            <ol className="mt-5 space-y-3 font-medium">
              <li>1. Situasi apa yang paling cepat menyalakan energi kamu?</li>
              <li>2. Aktivitas apa yang bisa kamu lakukan, tetapi membuat lelah jika terlalu lama?</li>
              <li>3. Kalimat atau cara masuk seperti apa yang paling membuat kamu tidak defensif?</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}

function joinRoleNames(roles: MicroRoleScore[]) {
  if (roles.length === 0) return "beberapa pola utama yang muncul";
  return roles.map((role) => role.name).join(", ");
}

function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="report-section mt-10">
      {kicker && <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</div>}
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function InsightCard({ title, body, accent, muted }: { title: string; body: string; accent?: boolean; muted?: boolean }) {
  const tone = accent
    ? "border-primary/20 bg-primary/10"
    : muted
      ? "border-border/70 bg-muted/45"
      : "border-border/60 bg-card";
  return (
    <div className={`rounded-2xl border p-4 shadow-sm print-avoid-break ${tone}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</div>
      <p className="mt-2 text-xs leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function CuratedList({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/45" : "border-border/60 bg-card"}`}>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/90">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function EnergyRoleCard({
  index,
  role,
  score,
  scoreLabel,
  children,
  muted,
}: {
  index: number;
  role: MicroRoleScore;
  score: number;
  scoreLabel: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/35" : "border-border/60 bg-card"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${muted ? "bg-background text-muted-foreground" : "bg-primary/10 text-primary"}`}>
            {index}
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {role.family} · {role.confidenceLabel}
            </div>
            <h3 className="mt-1 text-base font-semibold text-foreground">{role.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{role.tagline}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <ScoreBadge score={score} muted={muted} />
          <div className="mt-1 text-[10px] text-muted-foreground">{scoreLabel}</div>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-xs">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
      <dt className="font-semibold text-muted-foreground">{k}</dt>
      <dd className="leading-relaxed text-foreground/90">{v}</dd>
    </div>
  );
}

function ZoneSummaryCard({
  title,
  body,
  roles,
  tone,
}: {
  title: string;
  body: string;
  roles: MicroRoleScore[];
  tone: "calm" | "soft" | "warm" | "muted";
}) {
  const toneClass = {
    calm: "border-primary/25 bg-primary/8",
    soft: "border-rose-300/45 bg-rose-50/60",
    warm: "border-amber-300/60 bg-amber-50/65",
    muted: "border-border/70 bg-muted/45",
  }[tone];

  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm print-avoid-break ${toneClass}`}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-foreground/75">{body}</p>
      {roles.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {roles.map((role) => (
            <span key={role.id} className="rounded-full border border-border/60 bg-background/75 px-3 py-1 text-[11px] font-medium text-foreground/85">
              {role.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">Belum ada sinyal yang cukup kuat untuk kategori ini.</p>
      )}
    </div>
  );
}

function AdaptiveGapCard({ insight }: { insight: AdaptiveGapInsight }) {
  return (
    <div className="rounded-[1.5rem] border border-amber-500/25 bg-card p-5 shadow-sm print-avoid-break">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">
            kemampuan adaptif
          </div>
          <h3 className="mt-1 text-base font-semibold text-foreground">{insight.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{insight.interpretation}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">terlihat kuat</div>
          <div className="text-lg font-semibold text-[var(--ember)]">{insight.score}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InsightCard title="Jalur yang mengisi" body={insight.routeLabel} accent />
        <InsightCard title="Jalur yang menguras" body={insight.notRouteLabel} muted />
      </div>

      <dl className="mt-4 space-y-2 text-xs">
        <Row k="Paling cocok" v={insight.bestUse} />
        <Row k="Biaya energi" v={insight.energyCost} />
        <Row k="Cara dukung" v={insight.supportStrategy} />
      </dl>
    </div>
  );
}

function CommunicationSwitchGuide({ switches }: { switches: CommunicationSwitchProfile[] }) {
  if (switches.length === 0) return null;
  const primary = switches[0];
  return (
    <div className="mt-4 rounded-[1.5rem] border border-primary/15 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Catatan untuk pasangan / rekan kerja</div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{primary.summary}</p>
      <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Contoh reframe</div>
        <div className="mt-3 grid gap-3 text-xs leading-relaxed sm:grid-cols-2">
          <div>
            <div className="font-semibold text-muted-foreground">Kurang masuk</div>
            <p className="mt-1 text-foreground/80">“{primary.reframeExample.raw}”</p>
          </div>
          <div>
            <div className="font-semibold text-muted-foreground">Lebih masuk</div>
            <p className="mt-1 font-medium text-foreground">“{primary.reframeExample.better}”</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{primary.partnerNote}</p>
    </div>
  );
}

function RoleFamilySummary({ families }: { families: { family: string; natural: number; strength: number }[] }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-sm font-semibold text-foreground">Peta Wilayah Peran</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Ringkasan wilayah besar agar mudah melihat kecenderungan umum. Detail paling akurat tetap ada di micro-role.
      </p>
      <div className="mt-4 space-y-3">
        {families.map((family) => (
          <div key={family.family}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-foreground">{family.family}</span>
              <span className="text-muted-foreground">
                Alami {family.natural} · Terlatih {family.strength}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${family.natural}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadingQualityNote({ quality }: { quality: ReturnType<typeof computeReadingQuality> }) {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-4 print-avoid-break">
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

function scoreTone(score: number, muted?: boolean) {
  if (muted) return "border-border bg-background text-muted-foreground";
  if (score >= 80) return "border-[var(--rank-dominant-border)] bg-[var(--rank-dominant-soft)] text-[var(--rank-dominant-ink)]";
  if (score >= 64) return "border-[var(--rank-medium-border)] bg-[var(--rank-medium-soft)] text-[var(--rank-medium-ink)]";
  if (score >= 45) return "border-border bg-[var(--rank-neutral)] text-foreground";
  if (score >= 30) return "border-[var(--rank-low-border)] bg-[var(--rank-low-soft)] text-[var(--rank-low-ink)]";
  return "border-[var(--rank-weak-border)] bg-[var(--rank-weak)] text-white";
}

function ScoreBadge({ score, muted }: { score: number; muted?: boolean }) {
  return <div className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${scoreTone(score, muted)}`}>{score}</div>;
}
