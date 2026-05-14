import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AlertCircle, ChevronDown, FileDown, Home, Printer, RotateCcw, Sparkles } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  buildClusterReports,
  computeReadingQuality,
  getNextAssessmentTarget,
  isAssessmentComplete,
  progressFor,
} from "@/engine/scoring";
import { buildPatternSignatureReport, type MicroRoleScore } from "@/engine/patternSignature";
import {
  buildSmartResultAdvisory,
  type AdvisoryAdaptive,
  type AdvisoryTheme,
  type AdvisoryVulnerability,
  type AdvisoryTone,
  type SmartResultAdvisory,
} from "@/engine/smartResultAdvisory";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { getPurposeLens } from "@/data/purposeLens";
import { generateJatiDiriPdf } from "@/pdf/generateJatiDiriPdf";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Kamu" },
      {
        name: "description",
        content: "Pembacaan jati diri, sumber energi, titik rentan energi, dan kemampuan adaptif.",
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
  const advisory = useMemo(
    () => buildSmartResultAdvisory(patternReport, readingQuality, lens),
    [patternReport, readingQuality, lens],
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
          <section className="rounded-[2rem] border border-amber-500/25 bg-card p-6 shadow-sm">
            <div className="grid size-12 place-items-center rounded-full bg-amber-500/10 text-[var(--ember)]">
              <AlertCircle className="size-6" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-foreground">Asesmen belum lengkap</h1>
            <p className="mt-3 text-[14px] leading-7 text-muted-foreground">
              Hasil baru ditampilkan setelah kedua sesi selesai agar pembacaan tidak terpotong.
            </p>
            <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>Sesi 1 — Kartu Situasi Alami</span>
                <strong>
                  {naturalProg.answered}/{naturalProg.total}
                </strong>
              </div>
              <div className="mt-2 flex justify-between gap-3">
                <span>Sesi 2 — Bukti Kemampuan</span>
                <strong>
                  {strengthProg.answered}/{strengthProg.total}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={continueAssessment}
              className="mt-6 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground shadow-sm transition active:scale-[0.99]"
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
      <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-5 sm:py-10">
        <div className="no-print mb-6 rounded-[1.5rem] border border-border/60 bg-card/92 p-3 shadow-[0_10px_30px_rgba(36,49,58,0.05)] backdrop-blur-sm sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-1 text-sm text-muted-foreground transition hover:text-foreground">
              <Home className="size-4" /> Beranda
            </Link>
            <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                generateJatiDiriPdf({
                  name: identity.name,
                  date: reportDate,
                  context: lens.label,
                  advisory,
                  patternReport,
                  readingQuality,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3.5 py-2 text-[12px] font-medium text-primary shadow-sm transition hover:bg-primary/12 active:scale-[0.98]"
            >
              <FileDown className="size-3.5" /> PDF Report
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-3.5 py-2 text-[12px] font-medium text-foreground/80 shadow-sm transition hover:bg-muted/45 active:scale-[0.98]"
            >
              <Printer className="size-3.5" /> Print
            </button>
            <button
              onClick={() => {
                if (confirm("Mulai dari awal? Jawaban kamu akan dihapus dari perangkat ini.")) {
                  reset();
                  navigate({ to: "/" });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-3.5 py-2 text-[12px] font-medium text-foreground/80 shadow-sm transition hover:bg-muted/45 active:scale-[0.98]"
            >
              <RotateCcw className="size-3.5" /> Ulang
            </button>
          </div>
          </div>
        </div>

        <HeroCard name={identity.name} date={reportDate} context={lens.label} archetype={advisory.archetype} />

        <ResultJumpNav />

        <Section id="cermin" title="Cermin Jati Diri" kicker="pembacaan utama">
          <article className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-7 print-avoid-break">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="size-3.5" /> {advisory.mirrorTitle}
            </div>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-foreground/90 sm:text-base">
              {advisory.mirror.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50/55 p-4 text-[14.5px] leading-7 text-foreground/90">
              {advisory.sharpSummary}
            </div>
            <p className="mt-4 rounded-2xl border border-border/60 bg-muted/35 p-4 text-[13px] leading-6 text-muted-foreground">
              {advisory.evidenceLine}
            </p>
          </article>

        </Section>

        <Section id="neraca" title="Neraca Energi Kamu" kicker="fuel · skill · cost">
          <SectionLead>
            Bagian ini memisahkan tiga hal yang sering tertukar: apa yang menyalakan kamu, kemampuan yang sudah bisa dipakai, dan area yang punya biaya energi. Ini membantu hasil tidak menyamakan “bisa” dengan “alami”.
          </SectionLead>
          <EnergyLedgerGrid ledger={advisory.energyLedger} />
        </Section>

        {advisory.contrastReadings.length > 0 && (
          <Section id="kontras" title="Kontras Penting yang Tidak Boleh Disalahartikan" kicker="calibrated reading">
            <SectionLead>
              Bagian ini membaca kemampuan yang bisa terlihat kuat, tetapi memiliki biaya energi atau sisi bocor tertentu. Tujuannya agar hasil tidak menyamakan “bisa” dengan “selalu alami”.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.contrastReadings.map((item, index) => (
                <ContrastReadingCard key={item.id} item={item} index={index + 1} />
              ))}
            </div>
          </Section>
        )}

        <Section id="manual" title="Manual Singkat Memakai Pola Ini" kicker="operating manual">
          <OperatingManualGrid manual={advisory.operatingManual} />
        </Section>

        {advisory.evidenceMap.length > 0 && (
          <Section id="bukti" title="Bukti dari Pilihan Aksi" kicker="evidence-based reading">
            <SectionLead>
              Bagian ini menunjukkan beberapa pilihan yang menjadi dasar pembacaan. Tujuannya agar hasil terasa grounded, bukan seperti label yang muncul tiba-tiba.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.evidenceMap.slice(0, 4).map((item) => (
                <EvidenceMapCard key={item.id} item={item} />
              ))}
            </div>
          </Section>
        )}

        {advisory.weeklyExperiments.length > 0 && (
          <Section id="eksperimen" title="Eksperimen 7 Hari" kicker="next small step">
            <SectionLead>
              Ini bukan tugas besar. Pilih satu eksperimen kecil agar hasil asesmen berubah menjadi pengalaman nyata, bukan hanya bacaan.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.weeklyExperiments.map((item, index) => (
                <WeeklyExperimentCard key={item.id} item={item} index={index + 1} />
              ))}
            </div>
          </Section>
        )}

        {advisory.patternInsights.length > 0 && (
          <Section id="sinyal" title="Sinyal Kombinasi yang Terbaca" kicker="smart pattern engine">
            <SectionLead>
              Bagian ini membaca kombinasi pilihan aksi, bukan skor tunggal. Tujuannya menunjukkan sisi terang dan sisi bocor yang muncul bersama-sama.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.patternInsights.slice(0, 3).map((insight, index) => (
                <PatternInsightCard key={insight.id} insight={insight} index={index + 1} />
              ))}
            </div>
          </Section>
        )}

        <Section id="selaras" title="Seberapa Kamu Sudah Selaras dengan Zona Kekuatan Alami" kicker="alignment reading">
          <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <h3 className="text-[1.1rem] font-semibold leading-snug text-foreground">{advisory.alignment.title}</h3>
            <p className="mt-3 text-[14.5px] leading-7 text-foreground/90">{advisory.alignment.headline}</p>
            <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{advisory.alignment.body}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MetricPill label="Selaras" value={advisory.alignment.alignedCount} tone="teal" />
              <MetricPill label="Belum hidup" value={advisory.alignment.dormantCount} tone="amber" />
              <MetricPill label="Adaptif" value={advisory.alignment.adaptiveCount} tone="rose" />
            </div>
          </article>
        </Section>

        <Section id="menyala" title="Kenapa Kamu Menyala" kicker="zona kekuatan alami">
          <SectionLead>
            Bagian ini menggabungkan beberapa elemen yang saling berkaitan. Tujuannya bukan memberi banyak label, tetapi menjawab: area apa yang membuat kamu merasa hidup dan bertenaga?
          </SectionLead>
          <div className="mt-5 grid gap-3">
            {advisory.energyThemes.map((theme, index) => (
              <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} />
            ))}
          </div>
        </Section>

        <Section id="lelah" title="Kenapa Kamu Bisa Lelah" kicker="titik rentan energi">
          <article className="rounded-[2rem] border border-amber-300/55 bg-amber-50/60 p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-[15.5px] leading-7 text-foreground/90">
              Kelelahan emosi tidak selalu muncul karena kamu tidak mampu. Kadang justru karena kamu mampu menjalankan banyak peran, tetapi terlalu lama berada di area yang bukan zona kekuatan alami kamu.
            </p>
          </article>
          <div className="mt-4 grid gap-3">
            {advisory.vulnerabilities.map((item, index) => (
              <VulnerabilityCard key={item.id} item={item} index={index + 1} />
            ))}
          </div>
        </Section>

        {advisory.adaptiveThemes.length > 0 && (
          <Section id="adaptif" title="Kemampuan yang Bisa, Tapi Bisa Menguras" kicker="kemampuan adaptif">
            <SectionLead>
              Ini adalah bagian penting. Area di bawah ini mungkin sudah kamu eksplorasi cukup jauh karena pekerjaan, tanggung jawab, atau tuntutan hidup. Kamu bisa melakukannya, tetapi belum tentu ini zona kekuatan alami kamu.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.adaptiveThemes.map((item) => (
                <AdaptiveCard key={item.id} item={item} />
              ))}
            </div>
          </Section>
        )}

        {advisory.dormantThemes.length > 0 && (
          <Section id="dormant" title="Potensi yang Belum Banyak Kamu Hidupkan" kicker="natural but dormant">
            <SectionLead>
              Area ini punya sinyal alami, tetapi mungkin belum cukup sering kamu pakai sebagai aktivitas nyata. Ini bisa menjadi arah eksperimen diri berikutnya.
            </SectionLead>
            <div className="mt-5 grid gap-3">
              {advisory.dormantThemes.map((theme, index) => (
                <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} soft />
              ))}
            </div>
          </Section>
        )}

        <Section id="bahasa" title="Kalimat yang Menyalakan Energi Kamu" kicker="manual komunikasi">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-[14px] leading-7 text-muted-foreground">
              Bagian ini dibaca oleh kamu terlebih dahulu. Ini membantu kamu mengenali bahasa seperti apa yang biasanya membuatmu lebih ON, lebih semangat, dan lebih tidak defensif.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {advisory.onSwitch.map((item) => (
                <QuotePill key={item}>{item}</QuotePill>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniPanel title="Catatan untuk pasangan / rekan kerja" items={advisory.forOthers} />
            <MiniPanel title="Yang mudah membuat kamu resistan" items={advisory.resistance} muted />
          </div>
        </Section>

        <Section id="rawat" title="Cara Merawat Diri" kicker="self advisory">
          <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <div className="space-y-3 text-[14.5px] leading-7 text-foreground/90">
              {advisory.recoveryRituals.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/6 p-4 text-[13px] leading-6 text-muted-foreground">
              {advisory.selfCare.map((item) => (
                <p key={item} className="mt-2 first:mt-0">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-muted/45 p-4 text-[13px] leading-6 text-muted-foreground">
              {advisory.qualityNote}
            </p>
          </article>
        </Section>

        <details className="mt-12 group rounded-[1.85rem] border border-border/60 bg-card/96 p-5 shadow-sm print-avoid-break">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-foreground/90">
            <span>Detail Peta Pendukung</span>
            <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
          </summary>
          <div className="mt-5 space-y-5">
            <ClusterRadar reports={reports} />
            <RoleFamilySummary families={patternReport.roleFamilies.slice(0, 8)} />
            <RoleScoreList title="Sinyal natural paling kuat" roles={patternReport.topNaturalRoles.slice(0, 7)} mode="natural" />
            <RoleScoreList title="Kekuatan aktivitas yang terlihat" roles={patternReport.topTrainedRoles.slice(0, 7)} mode="strength" />
            <ReadingQualityNote quality={readingQuality} />
          </div>
        </details>

        <p className="mt-8 text-center text-[13px] leading-6 text-muted-foreground print:hidden">
          Hasil ini adalah alat refleksi diri, bukan diagnosis klinis atau label permanen. Gunakan sebagai bahan mengenal pola energi, komunikasi, dan arah pengembangan diri.
        </p>
      </div>
    </main>
  );
}

function HeroCard({ name, date, context, archetype }: { name: string; date: string; context: string; archetype: string }) {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-card to-emerald-50/40 p-6 shadow-[0_16px_40px_rgba(36,49,58,0.06)] sm:p-8 print-avoid-break">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">Peta Jati Diri · Smart Advisory V5</div>
      <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.35rem]">{name}</h1>
          <p className="mt-2 text-[14px] leading-6 text-muted-foreground">Tanggal asesmen: {date}</p>
        </div>
        <div className="rounded-[1.3rem] border border-border/70 bg-background/78 px-4 py-3 text-left shadow-sm sm:min-w-[180px] sm:text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Konteks</div>
          <div className="mt-1 text-[15px] font-medium leading-snug text-primary">{context}</div>
        </div>
      </div>
      <div className="mt-7 max-w-[40rem] rounded-[1.5rem] border border-primary/12 bg-primary/6 px-5 py-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kesimpulan jati diri</div>
        <div className="mt-2 text-[1.45rem] font-semibold leading-[1.3] tracking-[-0.02em] text-foreground sm:text-[1.9rem]">{archetype}</div>
      </div>
    </section>
  );
}

function ResultJumpNav() {
  const items = [
    { id: 'cermin', label: 'Cermin' },
    { id: 'neraca', label: 'Neraca' },
    { id: 'menyala', label: 'Menyala' },
    { id: 'lelah', label: 'Lelah' },
    { id: 'adaptif', label: 'Adaptif' },
    { id: 'bahasa', label: 'Bahasa' },
    { id: 'rawat', label: 'Rawat Diri' },
  ];

  return (
    <nav className="no-print mt-5 overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2 rounded-[1.2rem] border border-border/60 bg-card/88 p-2 shadow-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full border border-border/60 bg-background/85 px-3.5 py-2 text-[12px] font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary/6 hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[64ch] text-[14.5px] leading-7 text-muted-foreground sm:text-[15px]">{children}</p>;
}

function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="mt-10 print-avoid-break">
      {kicker && <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</div>}
      <h2 className="mt-1 text-xl font-medium tracking-tight text-foreground sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function toneClass(tone: AdvisoryTone, soft = false) {
  const variants: Record<AdvisoryTone, string> = {
    teal: soft ? "border-teal-200/70 bg-teal-50/45" : "border-teal-200/70 bg-teal-50/55",
    amber: soft ? "border-amber-200/70 bg-amber-50/45" : "border-amber-200/80 bg-amber-50/60",
    rose: soft ? "border-rose-200/70 bg-rose-50/45" : "border-rose-200/80 bg-rose-50/60",
    slate: soft ? "border-slate-200/80 bg-slate-50/55" : "border-slate-200/80 bg-slate-50/70",
    sky: soft ? "border-sky-200/70 bg-sky-50/45" : "border-sky-200/80 bg-sky-50/60",
  };
  return variants[tone];
}




function ContrastReadingCard({
  item,
  index,
}: {
  item: SmartResultAdvisory["contrastReadings"][number];
  index: number;
}) {
  return (
    <article className={`rounded-[1.6rem] border p-5 shadow-sm print-avoid-break ${toneClass(item.tone, true)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={item.tone} muted />
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.kicker}</div>
          <h3 className="mt-1 text-base font-medium leading-snug text-foreground">{item.title}</h3>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{item.headline}</p>
          <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{item.body}</p>
          <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/68 p-4 text-[13px] leading-6 text-foreground/85">
            <span className="font-medium">Pakai sehatnya: </span>
            {item.healthyUse}
          </div>
          {item.evidence.length > 0 && (
            <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/62 p-4 text-[13px] leading-6 text-muted-foreground">
              <div className="mb-2 font-medium text-foreground/80">Terbaca dari pilihan aksi seperti:</div>
              <ul className="space-y-1.5">
                {item.evidence.slice(0, 3).map((line) => (
                  <li key={line}>“{line}”</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function OperatingManualGrid({ manual }: { manual: SmartResultAdvisory["operatingManual"] }) {
  const panels = [
    { title: "Lingkungan yang menyalakan", items: manual.bestEnvironment, tone: "teal" as AdvisoryTone },
    { title: "Cara kerja paling sehat", items: manual.workStyle, tone: "sky" as AdvisoryTone },
    { title: "Yang perlu dijaga", items: manual.watchOut, tone: "amber" as AdvisoryTone },
    { title: "Sistem pendukung", items: manual.supportSystem, tone: "slate" as AdvisoryTone },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {panels.map((panel) => (
        <article key={panel.title} className={`rounded-[1.5rem] border p-4 shadow-sm print-avoid-break ${toneClass(panel.tone, true)}`}>
          <h3 className="text-[15px] font-semibold text-foreground">{panel.title}</h3>
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-foreground/80">
            {panel.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/45" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}


function EnergyLedgerGrid({ ledger }: { ledger: SmartResultAdvisory["energyLedger"] }) {
  const groups = [
    {
      id: "fuel",
      title: "Yang Menyalakan",
      subtitle: "Bahan bakar alami yang paling sering muncul dari pilihan aksi kamu.",
      items: ledger.fuel,
      tone: "teal" as AdvisoryTone,
    },
    {
      id: "skill",
      title: "Yang Bisa Kamu Pakai",
      subtitle: "Kemampuan yang terlihat bisa dijalankan, termasuk yang mungkin terbentuk karena pengalaman.",
      items: ledger.skill,
      tone: "sky" as AdvisoryTone,
    },
    {
      id: "cost",
      title: "Yang Ada Biaya Energinya",
      subtitle: "Area yang perlu batas agar tidak berubah menjadi lelah, bocor fokus, atau overuse.",
      items: ledger.cost,
      tone: "amber" as AdvisoryTone,
    },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {groups.map((group) => (
        <article key={group.id} className={`rounded-[1.75rem] border p-4 shadow-sm print-avoid-break ${toneClass(group.tone, true)}`}>
          <h3 className="text-[15px] font-semibold text-foreground">{group.title}</h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{group.subtitle}</p>
          <div className="mt-4 space-y-3">
            {group.items.length > 0 ? (
              group.items.map((item) => <EnergyLedgerItemCard key={item.id} item={item} />)
            ) : (
              <p className="rounded-[1.15rem] border border-background/75 bg-background/65 p-3 text-[13px] leading-6 text-muted-foreground">
                Belum ada sinyal yang cukup kuat di bagian ini. Baca hasil utama sebagai peta awal.
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function EnergyLedgerItemCard({ item }: { item: SmartResultAdvisory["energyLedger"]["fuel"][number] }) {
  return (
    <div className="rounded-[1.15rem] border border-background/75 bg-background/68 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium leading-snug text-foreground">{item.title}</div>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{item.body}</p>
        </div>
        <span className="shrink-0 rounded-full border border-background/80 bg-background/75 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          {item.score}
        </span>
      </div>
      {item.evidence.length > 0 && (
        <div className="mt-3 border-t border-background/80 pt-2 text-[11px] leading-relaxed text-foreground/75">
          “{item.evidence[0]}”
        </div>
      )}
    </div>
  );
}

function EvidenceMapCard({ item }: { item: SmartResultAdvisory["evidenceMap"][number] }) {
  return (
    <article className={`rounded-[1.5rem] border p-4 shadow-sm print-avoid-break ${toneClass(item.tone, true)}`}>
      <div className="flex items-start gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-2xl border border-background/70 bg-background/70 text-[11px] font-semibold text-primary">
          {item.title.replace("Pilihan ", "")}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-6 text-muted-foreground">{item.situation}</p>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">“{item.selectedText}”</p>
          <p className="mt-3 rounded-[1.15rem] border border-background/75 bg-background/65 p-3 text-[13px] leading-6 text-muted-foreground">
            {item.meaning}
          </p>
        </div>
      </div>
    </article>
  );
}

function WeeklyExperimentCard({ item, index }: { item: SmartResultAdvisory["weeklyExperiments"][number]; index: number }) {
  return (
    <article className="rounded-[1.65rem] border border-primary/15 bg-card p-4 shadow-sm print-avoid-break">
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone="teal" muted />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/70">{item.signal}</div>
          <h3 className="mt-1 text-[17px] font-semibold leading-snug text-foreground">{item.title}</h3>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{item.action}</p>
          <p className="mt-3 rounded-2xl border border-primary/10 bg-primary/6 p-3 text-[13px] leading-6 text-muted-foreground">
            {item.why}
          </p>
        </div>
      </div>
    </article>
  );
}

function PatternInsightCard({
  insight,
  index,
}: {
  insight: SmartResultAdvisory["patternInsights"][number];
  index: number;
}) {
  return (
    <article className={`rounded-[1.6rem] border p-5 shadow-sm print-avoid-break ${toneClass(insight.tone)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={insight.tone} muted />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {insight.kind === "drive" ? "pola penggerak" : insight.kind === "adaptive" ? "mode adaptif" : "sisi bocor yang perlu dijaga"}
          </div>
          <h3 className="mt-1 text-[17px] font-semibold leading-snug text-foreground">{insight.title}</h3>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{insight.headline}</p>
          <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{insight.body}</p>
          <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/68 p-4 text-[13px] leading-6 text-foreground/85">
            <span className="font-medium">Cara mengelola: </span>
            {insight.support}
          </div>
          {insight.evidence.length > 0 && (
            <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/62 p-4 text-[13px] leading-6 text-muted-foreground">
              <div className="mb-2 font-medium text-foreground/80">Terlihat dari pilihan aksi seperti:</div>
              <ul className="space-y-1.5">
                {insight.evidence.slice(0, 3).map((item) => (
                  <li key={item}>“{item}”</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function EnergyThemeCard({ theme, index, soft }: { theme: AdvisoryTheme; index: number; soft?: boolean }) {
  return (
    <article className={`rounded-[1.6rem] border p-5 shadow-sm print-avoid-break ${toneClass(theme.tone, soft)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={theme.tone} />
        <div>
          <h3 className="text-[17px] font-semibold leading-snug text-foreground">{theme.title}</h3>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{theme.headline}</p>
          <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{theme.body}</p>
          <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/62 p-4 text-[13px] leading-6 text-foreground/80">
            <p><span className="font-medium">Kenapa ini cocok: </span>{theme.whyItFits}</p>
            <p className="mt-2"><span className="font-medium">Pakai sehatnya: </span>{theme.healthyUse}</p>
          </div>
          <Evidence roles={theme.evidence} />
        </div>
      </div>
    </article>
  );
}

function VulnerabilityCard({ item, index }: { item: AdvisoryVulnerability; index: number }) {
  return (
    <article className={`rounded-[1.6rem] border p-5 shadow-sm print-avoid-break ${toneClass(item.tone)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={item.tone} muted />
        <div>
          <h3 className="text-[17px] font-semibold leading-snug text-foreground">{item.title}</h3>
          <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{item.headline}</p>
          <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{item.body}</p>
          <div className="mt-4 rounded-[1.2rem] border border-background/75 bg-background/68 p-4 text-[13px] leading-6 text-foreground/85">
            <span className="font-medium">Cara mengelola: </span>
            {item.support}
          </div>
          <Evidence roles={item.evidence} />
        </div>
      </div>
    </article>
  );
}

function AdaptiveCard({ item }: { item: AdvisoryAdaptive }) {
  return (
    <article className="rounded-[1.75rem] border border-amber-300/60 bg-amber-50/60 p-5 shadow-sm print-avoid-break">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]/90">kemampuan adaptif</div>
      <h3 className="mt-2 text-[17px] font-semibold leading-snug text-foreground">{item.title}</h3>
      <p className="mt-2 text-[14.5px] leading-7 text-foreground/90">{item.headline}</p>
      <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{item.body}</p>
      <p className="mt-3 text-[14.5px] leading-7 text-foreground/90">{item.emotionalNote}</p>
      <div className="mt-4 rounded-2xl border border-amber-300/70 bg-background/60 p-4 text-[13px] leading-6 text-foreground/85">
        <span className="font-medium">Saran pemulihan: </span>
        {item.recovery}
      </div>
      <Evidence roles={item.evidence} />
    </article>
  );
}

function QuotePill({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/8 px-4 py-3 text-[14.5px] leading-7 text-foreground/90 shadow-sm">
      “{children}”
    </div>
  );
}

function MiniPanel({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/40" : "border-primary/15 bg-card"}`}>
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-[13px] leading-6 text-foreground/85">
        {items.slice(0, 4).map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Evidence({ roles }: { roles: MicroRoleScore[] }) {
  if (roles.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {roles.slice(0, 4).map((role) => (
        <span key={role.id} className="rounded-full border border-background/70 bg-background/70 px-3 py-1.5 text-[12px] leading-none text-muted-foreground">
          {role.name} · alami {role.natural} · terlatih {role.strength} · {role.confidenceLabel}
        </span>
      ))}
    </div>
  );
}

function NumberBubble({ value, tone, muted }: { value: number; tone: AdvisoryTone; muted?: boolean }) {
  const color: Record<AdvisoryTone, string> = {
    teal: muted ? "bg-teal-100 text-teal-700" : "bg-teal-600 text-white",
    amber: muted ? "bg-amber-100 text-amber-700" : "bg-amber-500 text-white",
    rose: muted ? "bg-rose-100 text-rose-700" : "bg-rose-500 text-white",
    slate: muted ? "bg-slate-100 text-slate-600" : "bg-slate-700 text-white",
    sky: muted ? "bg-sky-100 text-sky-700" : "bg-sky-600 text-white",
  };
  return <div className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium ${color[tone]}`}>{value}</div>;
}

function MetricPill({ label, value, tone }: { label: string; value: number; tone: AdvisoryTone }) {
  const styles: Record<AdvisoryTone, string> = {
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
  };
  return (
    <div className={`rounded-2xl border px-3 py-3 ${styles[tone]}`}>
      <div className="text-lg font-medium leading-none">{value}</div>
      <div className="mt-1 text-[10px] leading-tight opacity-80">{label}</div>
    </div>
  );
}

function RoleFamilySummary({ families }: { families: { family: string; natural: number; strength: number }[] }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-[15px] font-semibold text-foreground">Peta Wilayah Peran</div>
      <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
        Ini peta pendukung. Pembacaan utama tetap ada di Cermin Jati Diri, sumber energi, dan kemampuan adaptif di atas.
      </p>
      <div className="mt-4 space-y-3">
        {families.map((family) => (
          <div key={family.family}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-foreground">{family.family}</span>
              <span className="text-muted-foreground">
                Alami {family.natural} · Terlatih {family.strength}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, family.natural))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleScoreList({ title, roles, mode }: { title: string; roles: MicroRoleScore[]; mode: "natural" | "strength" }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-[15px] font-semibold text-foreground">{title}</div>
      <div className="mt-4 space-y-3">
        {roles.map((role) => {
          const value = role[mode];
          return (
            <div key={role.id}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{role.name}</span>
                <span className="text-muted-foreground">{value} · {role.confidenceLabel}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReadingQualityNote({ quality }: { quality: ReturnType<typeof computeReadingQuality> }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-[15px] font-semibold text-foreground">Kualitas Pembacaan</div>
      <p className="mt-2 text-[13px] leading-6 text-foreground/90">{quality.summary}</p>
      <div className="mt-3 inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
        {quality.level} · {quality.score}/100
      </div>
      <div className="mt-2 text-[13px] leading-6 text-muted-foreground">
        Format: Context Action Cards · Signal engine · Evidence-based reading
      </div>
      <ul className="mt-3 space-y-1.5 text-[13px] leading-6 text-muted-foreground">
        {quality.notes.map((note) => (
          <li key={note}>• {note}</li>
        ))}
      </ul>
    </div>
  );
}
