import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AlertCircle, ChevronDown, Home, Printer, RotateCcw } from "lucide-react";
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
} from "@/engine/smartResultAdvisory";
import { ClusterRadar } from "@/components/result/ClusterRadar";
import { getPurposeLens } from "@/data/purposeLens";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Hasil Peta Jati Diri Anda" },
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
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <div className="no-print mb-8 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="size-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm transition active:scale-[0.98]"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm transition active:scale-[0.98]"
            >
              <RotateCcw className="size-3.5" /> Ulang
            </button>
          </div>
        </div>

        <HeroCard name={identity.name} date={reportDate} context={lens.label} archetype={advisory.archetype} />

        <Section title="Cermin Jati Diri" kicker="pembacaan utama">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-7 print-avoid-break">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Kamu itu orang yang...</div>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-foreground/90 sm:text-base">
              {advisory.mirror.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
              {advisory.evidenceLine}
            </p>
          </div>
        </Section>

        <Section title="Kenapa Kamu Menyala" kicker="sumber energi utama">
          <p className="section-lead">
            Bagian ini tidak dipaksa menjadi tujuh poin. Engine menggabungkan beberapa elemen yang saling berkaitan agar hasilnya lebih mudah dicerna sebagai pola diri, bukan daftar istilah.
          </p>
          <div className="mt-4 grid gap-3">
            {advisory.energyThemes.map((theme, index) => (
              <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} />
            ))}
          </div>
        </Section>

        <Section title="Kenapa Kamu Bisa Lelah" kicker="titik rentan energi">
          <div className="rounded-[2rem] border border-amber-300/55 bg-amber-50/60 p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-[15px] leading-relaxed text-foreground/90">
              Kamu bisa merasa lelah bukan hanya karena tugasnya berat. Kadang yang melelahkan adalah terlalu lama hidup di area yang bukan rumah energi alami, tetapi tetap harus dijalankan karena pekerjaan, keluarga, atau tanggung jawab.
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {advisory.vulnerabilities.map((item, index) => (
              <VulnerabilityCard key={item.id} item={item} index={index + 1} />
            ))}
          </div>
        </Section>

        {advisory.adaptiveThemes.length > 0 && (
          <Section title="Kemampuan yang Bisa, Tapi Bisa Menguras" kicker="adaptive / survival mode">
            <p className="section-lead">
              Ini adalah area yang tampak sudah kamu jalankan cukup jauh, tetapi belum tentu menjadi sumber energi alami. Bagian ini sering menjelaskan kenapa seseorang terlihat mampu di luar, tetapi merasa lelah di dalam.
            </p>
            <div className="mt-4 grid gap-3">
              {advisory.adaptiveThemes.map((item) => (
                <AdaptiveCard key={item.id} item={item} />
              ))}
            </div>
          </Section>
        )}

        {advisory.dormantThemes.length > 0 && (
          <Section title="Potensi yang Belum Banyak Kamu Hidupkan" kicker="natural but dormant">
            <p className="section-lead">
              Ini adalah area yang punya sinyal alami, tetapi belum tentu sudah sering kamu eksplorasi sebagai aktivitas nyata. Bagian ini bisa menjadi arah eksperimen pengembangan diri.
            </p>
            <div className="mt-4 grid gap-3">
              {advisory.dormantThemes.map((theme, index) => (
                <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} soft />
              ))}
            </div>
          </Section>
        )}

        <Section title="Kalimat yang Menyalakan Energi Kamu" kicker="manual komunikasi diri">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bagian ini dibaca oleh kamu terlebih dahulu. Ini membantu kamu mengenali bahasa seperti apa yang biasanya membuatmu lebih ON, lebih semangat, dan lebih tidak defensif.
            </p>
            <div className="mt-4 grid gap-3">
              {advisory.onSwitch.map((item) => (
                <QuotePill key={item}>{item}</QuotePill>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniPanel title="Kalau orang lain ingin mengajak kamu bergerak" items={advisory.onSwitch} />
            <MiniPanel title="Yang mudah membuat kamu resistan" items={advisory.resistance} muted />
          </div>
        </Section>

        <Section title="Cara Merawat Diri" kicker="self advisory">
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
              {advisory.selfCare.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-muted/45 p-4 text-xs leading-relaxed text-muted-foreground">
              {advisory.qualityNote}
            </p>
          </div>
        </Section>

        <details className="mt-10 group rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
            <span>Detail Peta Pendukung</span>
            <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
          </summary>
          <div className="mt-5 space-y-5">
            <ClusterRadar reports={reports} />
            <RoleFamilySummary families={patternReport.roleFamilies.slice(0, 8)} />
            <ReadingQualityNote quality={readingQuality} />
          </div>
        </details>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground print:hidden">
          Hasil ini adalah alat refleksi diri, bukan diagnosis klinis atau label permanen. Gunakan sebagai bahan mengenal pola energi, komunikasi, dan arah pengembangan diri.
        </p>
      </div>
    </main>
  );
}

function HeroCard({ name, date, context, archetype }: { name: string; date: string; context: string; archetype: string }) {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/10 via-card to-[var(--ember)]/7 p-6 shadow-sm sm:p-8 print-avoid-break">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Peta Jati Diri · Smart Advisory</div>
      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">{name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tanggal asesmen: {date}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-left sm:text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Konteks</div>
          <div className="mt-1 text-base font-medium text-primary">{context}</div>
        </div>
      </div>
      <div className="mt-7 max-w-2xl">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ringkasan jati diri</div>
        <div className="mt-2 text-2xl font-medium leading-snug text-primary sm:text-3xl">{archetype}</div>
      </div>
    </section>
  );
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

function EnergyThemeCard({ theme, index, soft }: { theme: AdvisoryTheme; index: number; soft?: boolean }) {
  return (
    <article className={`rounded-[1.75rem] border p-5 shadow-sm print-avoid-break ${soft ? "border-rose-300/40 bg-rose-50/55" : "border-border/60 bg-card"}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} soft={soft} />
        <div>
          <h3 className="text-base font-medium text-foreground">{theme.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{theme.headline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
          <Evidence roles={theme.evidence} />
        </div>
      </div>
    </article>
  );
}

function VulnerabilityCard({ item, index }: { item: AdvisoryVulnerability; index: number }) {
  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm print-avoid-break">
      <div className="flex items-start gap-3">
        <NumberBubble value={index} muted />
        <div>
          <h3 className="text-base font-medium text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.headline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <div className="mt-4 rounded-2xl border border-border/60 bg-muted/35 p-4 text-xs leading-relaxed text-foreground/85">
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
    <article className="rounded-[1.75rem] border border-amber-300/60 bg-amber-50/55 p-5 shadow-sm print-avoid-break">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">mode adaptif</div>
      <h3 className="mt-2 text-base font-medium text-foreground">{item.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.body}</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.emotionalNote}</p>
      <div className="mt-4 rounded-2xl border border-amber-300/70 bg-background/60 p-4 text-xs leading-relaxed text-foreground/85">
        <span className="font-medium">Saran pemulihan: </span>
        {item.recovery}
      </div>
      <Evidence roles={item.evidence} />
    </article>
  );
}

function QuotePill({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/8 px-4 py-3 text-sm leading-relaxed text-foreground/90">
      {children}
    </div>
  );
}

function MiniPanel({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm print-avoid-break ${muted ? "border-border/70 bg-muted/40" : "border-primary/15 bg-card"}`}>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/85">
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
        <span key={role.id} className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] text-muted-foreground">
          {role.name} · {role.natural}
        </span>
      ))}
    </div>
  );
}

function NumberBubble({ value, soft, muted }: { value: number; soft?: boolean; muted?: boolean }) {
  const tone = muted
    ? "bg-muted text-muted-foreground"
    : soft
      ? "bg-rose-100 text-rose-700"
      : "bg-primary/10 text-primary";
  return <div className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium ${tone}`}>{value}</div>;
}

function RoleFamilySummary({ families }: { families: { family: string; natural: number; strength: number }[] }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-sm font-medium text-foreground">Peta Wilayah Peran</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Ini hanya peta pendukung. Pembacaan utama tetap ada di Cermin Jati Diri dan sumber energi di atas.
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

function ReadingQualityNote({ quality }: { quality: ReturnType<typeof computeReadingQuality> }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
      <div className="text-sm font-medium text-foreground">Kualitas Pembacaan</div>
      <p className="mt-2 text-xs leading-relaxed text-foreground/90">{quality.summary}</p>
      <div className="mt-3 inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
        {quality.level} · {quality.score}/100
      </div>
      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {quality.notes.map((note) => (
          <li key={note}>• {note}</li>
        ))}
      </ul>
    </div>
  );
}
