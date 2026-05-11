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
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { ZoneMatrix } from "@/components/result/ZoneMatrix";
import { buildPurposeGuidance, getPurposeLens } from "@/data/purposeLens";
import { buildCommunicationSwitchProfiles, type CommunicationSwitchProfile } from "@/data/communicationSwitch";
import {
  buildAnalogies,
  buildCommunicationOn,
  buildCommunicationResistance,
  buildDailyHabits,
  buildObservablePatterns,
} from "@/data/observableNarratives";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
      { name: "description", content: "Ringkasan pola inti, sumber energi, kekuatan adaptif, dan strategi komunikasi." },
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
  const lens = useMemo(() => getPurposeLens(identity), [identity]);
  const purposeGuidance = useMemo(
    () => buildPurposeGuidance(lens, topThree, bottom, reports),
    [lens, topThree, bottom, reports],
  );
  const readingQuality = useMemo(() => computeReadingQuality(answers), [answers]);

  const observablePatterns = useMemo(() => buildObservablePatterns(patternReport.topNaturalRoles).slice(0, 3), [patternReport]);
  const dailyHabits = useMemo(() => buildDailyHabits(patternReport.topNaturalRoles).slice(0, 3), [patternReport]);
  const communicationOn = useMemo(() => buildCommunicationOn(patternReport.topNaturalRoles).slice(0, 4), [patternReport]);
  const communicationResistance = useMemo(() => buildCommunicationResistance(patternReport.topNaturalRoles).slice(0, 4), [patternReport]);
  const communicationSwitches = useMemo(
    () => buildCommunicationSwitchProfiles(patternReport.topNaturalRoles, lens.key),
    [patternReport.topNaturalRoles, lens.key],
  );
  const analogies = useMemo(() => buildAnalogies(patternReport.topNaturalRoles).slice(0, 2), [patternReport]);

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

  const primaryAnalogy = analogies[0] ?? "Pola ini dapat dibaca sebagai cara kerja energi: bukan hanya apa yang bisa dilakukan, tetapi jalur mana yang membuat semangat bertahan lebih lama.";

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

        <section className="report-hero rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-[var(--ember)]/10 p-6 shadow-sm sm:p-8 print-avoid-break">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Peta Jati Diri · Curated Psychological Insight
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
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Core Signature</div>
            <div className="mt-1 text-2xl font-bold text-primary">{patternReport.core.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{patternReport.core.subtitle}</p>
          </div>
        </section>

        <Section title="Pembacaan Utama" kicker="Curated Insight">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-base leading-relaxed text-foreground/90">{patternReport.core.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {patternReport.core.evidence.map((role) => (
                <span key={role.id} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                  {role.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <InsightCard title="Yang terlihat dari luar" body={patternReport.core.visiblePattern} />
            <InsightCard title="Sumber energi dan semangat" body={patternReport.core.hiddenEnergy} accent />
            <InsightCard
              title="Jika salah konteks"
              body={`${patternReport.core.riskIfMisplaced} Jika pola ini dipaksa terlalu lama di luar jalur yang sesuai, semangat dan energi Anda dapat cepat turun.`}
              muted
            />
            <InsightCard title="Strategi pemakaian sehat" body={patternReport.core.healthyUse} />
          </div>

          <div className="mt-3 rounded-3xl border border-primary/20 bg-primary/10 p-5 print-avoid-break">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Analogi sederhana</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{primaryAnalogy}</p>
          </div>
        </Section>

        <Section title="Kenapa Ini Terasa Relate" kicker="Observable Pattern">
          <div className="grid gap-3 sm:grid-cols-2">
            <CuratedList title="Perilaku yang mungkin terlihat" items={observablePatterns} />
            <CuratedList title="Kebiasaan kecil yang sering muncul" items={dailyHabits} />
          </div>
        </Section>

        {patternReport.adaptiveGapInsights.length > 0 && (
          <Section title="Adaptive / Survival Strength" kicker="Natural vs Adaptive Gap">
            <div className="mb-4 rounded-3xl border border-amber-500/25 bg-amber-500/10 p-5 print-avoid-break">
              <p className="text-sm leading-relaxed text-foreground/90">
                Bagian ini membaca kemampuan yang tampak kuat karena tuntutan pekerjaan, tanggung jawab, keluarga, target, jabatan, atau kebutuhan sosial. Fokusnya bukan hanya <strong>“Anda kuat di apa”</strong>, tetapi <strong>“Anda kuat lewat jalur apa”</strong>, lalu apakah jalur itu menjadi sumber energi dan semangat atau justru membuat energi turun lebih cepat.
              </p>
            </div>
            <div className="space-y-3">
              {patternReport.adaptiveGapInsights.slice(0, 2).map((insight) => (
                <AdaptiveGapCard key={insight.id} insight={insight} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Natural Talent" kicker="Top Natural Roles">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Lima area berikut adalah kandidat sumber energi dan semangat yang paling dominan. Ini bukan sekadar aktivitas yang bisa dilakukan, tetapi area yang cenderung lebih mudah membuat Anda hidup, fokus, dan terlibat.
          </p>
          <ColorMeaningLegend />
          <div className="space-y-3">
            {patternReport.topNaturalRoles.slice(0, 5).map((role, i) => (
              <MicroRoleCompactCard key={role.id} index={i + 1} role={role} score={role.natural} scoreLabel="Natural">
                <Row k="Terlihat sebagai" v={role.visible} />
                <Row k="Sumber energi" v={role.energy} />
                <Row k="Perlu dijaga" v={role.risk} />
              </MicroRoleCompactCard>
            ))}
          </div>
        </Section>

        <Section title="Explored Strength" kicker="Kekuatan Terlatih">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Area ini menunjukkan aktivitas yang tampak sudah sering digunakan, dilatih, atau terbentuk karena pengalaman nyata. Area ini bisa selaras dengan Natural Talent, tetapi bisa juga menjadi kemampuan adaptif.
          </p>
          <div className="space-y-3">
            {patternReport.topTrainedRoles.slice(0, 5).map((role, i) => (
              <MicroRoleCompactCard key={role.id} index={i + 1} role={role} score={role.strength} scoreLabel="Aktivitas" mutedIndex>
                <Row k="Aktivitas terlihat" v={role.visible} />
                <Row k="Jika selaras" v={role.energy} />
                <Row k="Strategi sehat" v={role.healthyUse} />
              </MicroRoleCompactCard>
            ))}
          </div>
        </Section>

        <Section title="Draining Role" kicker="Titik Rentan Energi">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Area ini bukan vonis kelemahan. Artinya, area tersebut bisa saja dikerjakan, tetapi bila dijadikan tuntutan utama terlalu lama, semangat dan energi Anda dapat cepat turun. Gunakan sistem, alat bantu, pembagian peran, atau delegasi bila memungkinkan.
          </p>
          <div className="space-y-3">
            {patternReport.drainingRoles.slice(0, 3).map((role, i) => (
              <MicroRoleCompactCard key={role.id} index={i + 1} role={role} score={role.natural} scoreLabel="Natural" mutedIndex>
                <Row k="Yang menguras" v={role.risk} />
                <Row k="Cara mengelola" v={role.healthyUse} />
              </MicroRoleCompactCard>
            ))}
          </div>
        </Section>

        <Section title={lens.guideTitle} kicker={lens.guideKicker}>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{lens.guideIntro}</p>
          {lens.key === "relationship_family" ? (
            <RelationshipSwitchGuide switches={communicationSwitches} />
          ) : (
            <>
              <CommunicationSwitchGuide switches={communicationSwitches} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <CuratedList title="Cara bicara yang membuat lebih terbuka" items={communicationOn} />
                <CuratedList title="Pola yang dapat memicu resistensi" items={communicationResistance} muted />
              </div>
            </>
          )}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {purposeGuidance.slice(0, 2).map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
                <div className="text-sm font-bold text-foreground">{item.title}</div>
                <p className="mt-3 text-xs leading-relaxed text-foreground/90">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Peta Ringkas" kicker="Appendix">
          <div className="space-y-3">
            <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Peta ini adalah ringkasan teknis. Bagian paling penting tetap pembacaan di atas: pola inti, Natural Talent, Explored Strength, Adaptive / Survival Strength, dan Draining Role.
              </p>
            </div>
            <ZoneMatrix reports={reports} />
            <RoleFamilySummary families={patternReport.roleFamilies.slice(0, 6)} />
            <ClusterRadar reports={reports} />
          </div>
        </Section>

        <Section title={lens.reflectionTitle} kicker="Next Step">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gunakan hasil ini untuk observasi kecil selama satu minggu. Fokus pada satu perubahan: tempatkan energi terbaik Anda di jalur yang lebih tepat, dan jangan jadikan titik rentan sebagai beban utama tanpa bantuan sistem.
            </p>
            <ol className="mt-4 space-y-3 text-sm text-foreground/90">
              {lens.reflectionItems.slice(0, 3).map((item, index) => (
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


function RelationshipSwitchGuide({ switches }: { switches: CommunicationSwitchProfile[] }) {
  const primary = switches[0];
  const secondary = switches[1];

  if (!primary) return null;

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5 shadow-sm print-avoid-break">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Communication ON-Switch</div>
        <h3 className="mt-2 text-lg font-bold text-foreground">Setiap orang punya pintu masuk komunikasi yang berbeda.</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          Bagian ini membaca kalimat, topik, dan cara membungkus aktivitas agar pasangan lebih mudah merasa hidup, bukan resistan. Aktivitas yang sama bisa terasa berat atau justru menarik, tergantung pintu masuk komunikasinya.
        </p>
      </div>

      <SwitchProfileCard profile={primary} featured />
      {secondary && <SwitchProfileCard profile={secondary} />}

      <div className="rounded-3xl border border-amber-500/25 bg-amber-500/10 p-5 shadow-sm print-avoid-break">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">Parenting hint</div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {primary.parentingNote ?? "Dalam parenting, gunakan pintu komunikasi yang membuat pasangan merasa dihargai dan punya ruang kontribusi. Setelah itu, sepakati rutinitas, batas, dan visi pengasuhan secara konkret."}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Prinsip praktisnya: masuk lewat tombol ON pasangan, baru bicara pembagian peran, aturan anak, rutinitas rumah, dan strategi keluarga. Jangan berharap satu kalimat yang sama cocok untuk semua tipe energi.
        </p>
      </div>
    </div>
  );
}

function CommunicationSwitchGuide({ switches }: { switches: CommunicationSwitchProfile[] }) {
  if (switches.length === 0) return null;
  return (
    <div className="space-y-3">
      {switches.slice(0, 2).map((profile, index) => (
        <SwitchProfileCard key={profile.id} profile={profile} featured={index === 0} />
      ))}
    </div>
  );
}

function SwitchProfileCard({
  profile,
  featured,
}: {
  profile: CommunicationSwitchProfile;
  featured?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm print-avoid-break ${featured ? "border-primary/20 bg-card" : "border-border/60 bg-card"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{profile.title}</div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{profile.summary}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <CuratedList title="Kalimat yang menyalakan" items={profile.onSwitch.slice(0, 4)} />
        <CuratedList title="Kalimat yang memicu resistensi" items={profile.resistanceTrigger.slice(0, 4)} muted />
      </div>

      <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Contoh reframe</div>
        <div className="mt-3 grid gap-3 text-xs leading-relaxed sm:grid-cols-2">
          <div>
            <div className="font-semibold text-muted-foreground">Kurang masuk</div>
            <p className="mt-1 text-foreground/80">“{profile.reframeExample.raw}”</p>
          </div>
          <div>
            <div className="font-semibold text-muted-foreground">Lebih masuk</div>
            <p className="mt-1 font-medium text-foreground">“{profile.reframeExample.better}”</p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border/60 bg-muted/35 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Catatan untuk pasangan</div>
        <p className="mt-2 text-xs leading-relaxed text-foreground/90">{profile.partnerNote}</p>
      </div>
    </div>
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
        <InsightCard title="Jalur yang mengisi" body={insight.routeLabel} accent />
        <InsightCard title="Jalur yang menguras" body={insight.notRouteLabel} muted />
      </div>

      <dl className="mt-4 space-y-2 text-xs">
        <Row k="Best-fit use" v={insight.bestUse} />
        <Row k="Energy cost" v={insight.energyCost} />
        <Row k="Support strategy" v={insight.supportStrategy} />
      </dl>
    </div>
  );
}

function CuratedList({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/45" : "border-border/60 bg-card"}`}>
      <div className="text-sm font-bold text-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/90">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ColorMeaningLegend() {
  const items = [
    { label: "Dominan", tone: "bg-[var(--rank-dominant)]", text: "Sumber energi utama" },
    { label: "Berkembang", tone: "bg-[var(--rank-medium)]", text: "Perlu diberi ruang" },
    { label: "Netral", tone: "bg-[var(--rank-neutral)]", text: "Area penyeimbang" },
    { label: "Perlu dukungan", tone: "bg-[var(--rank-low)]", text: "Butuh sistem" },
    { label: "Rentan", tone: "bg-[var(--rank-weak)]", text: "Cepat menguras" },
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

function RoleFamilySummary({ families }: { families: { family: string; natural: number; strength: number }[] }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-sm font-bold text-foreground">Role Family Map</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Keluarga peran membantu membaca wilayah besar tanpa kehilangan detail micro-role.
      </p>
      <div className="mt-4 space-y-3">
        {families.map((family) => (
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

function InsightCard({ title, body, accent, muted }: { title: string; body: string; accent?: boolean; muted?: boolean }) {
  const tone = accent
    ? "border-primary/20 bg-primary/10"
    : muted
      ? "border-border/70 bg-muted/45"
      : "border-border/60 bg-card";
  return (
    <div className={`rounded-2xl border p-4 shadow-sm print-avoid-break ${tone}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <p className="mt-2 text-xs leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function MicroRoleCompactCard({
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
          <div className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${mutedIndex ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
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
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-3">
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
