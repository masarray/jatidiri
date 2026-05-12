import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AlertCircle, ChevronDown, Home, Printer, RotateCcw, Sparkles } from "lucide-react";
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
          <section className="rounded-[2rem] border border-amber-500/25 bg-card p-6 shadow-sm">
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
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-5 sm:py-12">
        <div className="no-print mb-6 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="size-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-muted/50 active:scale-[0.98]"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-muted/50 active:scale-[0.98]"
            >
              <RotateCcw className="size-3.5" /> Ulang
            </button>
          </div>
        </div>

        <HeroCard name={identity.name} date={reportDate} context={lens.label} archetype={advisory.archetype} />

        <Section title="Cermin Jati Diri" kicker="pembacaan utama">
          <article className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-7 print-avoid-break">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="size-3.5" /> {advisory.mirrorTitle}
            </div>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-foreground/90 sm:text-base">
              {advisory.mirror.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50/55 p-4 text-sm leading-relaxed text-foreground/90">
              {advisory.sharpSummary}
            </div>
            <p className="mt-4 rounded-2xl border border-border/60 bg-muted/35 p-4 text-xs leading-relaxed text-muted-foreground">
              {advisory.evidenceLine}
            </p>
          </article>
        </Section>

        <Section title="Seberapa Kamu Sudah Hidup Dekat dengan Energi Alamimu" kicker="alignment reading">
          <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <h3 className="text-lg font-medium leading-snug text-foreground">{advisory.alignment.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{advisory.alignment.headline}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{advisory.alignment.body}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MetricPill label="Selaras" value={advisory.alignment.alignedCount} tone="teal" />
              <MetricPill label="Belum hidup" value={advisory.alignment.dormantCount} tone="amber" />
              <MetricPill label="Adaptif" value={advisory.alignment.adaptiveCount} tone="rose" />
            </div>
          </article>
        </Section>

        <Section title="Kenapa Kamu Menyala" kicker="sumber energi utama">
          <p className="section-lead">
            Bagian ini menggabungkan beberapa elemen yang saling berkaitan. Tujuannya bukan memberi banyak label, tetapi menjawab: area apa yang membuat kamu merasa hidup?
          </p>
          <div className="mt-4 grid gap-3">
            {advisory.energyThemes.map((theme, index) => (
              <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} />
            ))}
          </div>
        </Section>

        <Section title="Kenapa Kamu Bisa Lelah" kicker="titik rentan energi">
          <article className="rounded-[2rem] border border-amber-300/55 bg-amber-50/60 p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-[15px] leading-relaxed text-foreground/90">
              Kelelahan emosi tidak selalu muncul karena kamu tidak mampu. Kadang justru karena kamu mampu menjalankan banyak peran, tetapi terlalu lama berada di area yang bukan sumber energi alami.
            </p>
          </article>
          <div className="mt-4 grid gap-3">
            {advisory.vulnerabilities.map((item, index) => (
              <VulnerabilityCard key={item.id} item={item} index={index + 1} />
            ))}
          </div>
        </Section>

        {advisory.adaptiveThemes.length > 0 && (
          <Section title="Kemampuan yang Bisa, Tapi Bisa Menguras" kicker="mode adaptif">
            <p className="section-lead">
              Ini adalah bagian penting. Area di bawah ini mungkin sudah kamu eksplorasi cukup jauh karena pekerjaan, tanggung jawab, atau tuntutan hidup. Kamu bisa melakukannya, tetapi belum tentu ini rumah energimu.
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
              Area ini punya sinyal alami, tetapi mungkin belum cukup sering kamu pakai sebagai aktivitas nyata. Ini bisa menjadi arah eksperimen diri berikutnya.
            </p>
            <div className="mt-4 grid gap-3">
              {advisory.dormantThemes.map((theme, index) => (
                <EnergyThemeCard key={theme.id} theme={theme} index={index + 1} soft />
              ))}
            </div>
          </Section>
        )}

        <Section title="Kalimat yang Menyalakan Energi Kamu" kicker="manual komunikasi">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <p className="text-sm leading-relaxed text-muted-foreground">
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

        <Section title="Cara Merawat Diri" kicker="self advisory">
          <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6 print-avoid-break">
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
              {advisory.recoveryRituals.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/6 p-4 text-xs leading-relaxed text-muted-foreground">
              {advisory.selfCare.map((item) => (
                <p key={item} className="mt-2 first:mt-0">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-muted/45 p-4 text-xs leading-relaxed text-muted-foreground">
              {advisory.qualityNote}
            </p>
          </article>
        </Section>

        <details className="mt-10 group rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm print-avoid-break">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
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

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground print:hidden">
          Hasil ini adalah alat refleksi diri, bukan diagnosis klinis atau label permanen. Gunakan sebagai bahan mengenal pola energi, komunikasi, dan arah pengembangan diri.
        </p>
      </div>
    </main>
  );
}

function HeroCard({ name, date, context, archetype }: { name: string; date: string; context: string; archetype: string }) {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/10 via-card to-amber-50/70 p-6 shadow-sm sm:p-8 print-avoid-break">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Peta Jati Diri · Smart Advisory V5</div>
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
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kesimpulan jati diri</div>
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

function EnergyThemeCard({ theme, index, soft }: { theme: AdvisoryTheme; index: number; soft?: boolean }) {
  return (
    <article className={`rounded-[1.75rem] border p-5 shadow-sm print-avoid-break ${toneClass(theme.tone, soft)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={theme.tone} />
        <div>
          <h3 className="text-base font-medium text-foreground">{theme.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{theme.headline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
          <div className="mt-4 rounded-2xl border border-background/70 bg-background/55 p-4 text-xs leading-relaxed text-foreground/80">
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
    <article className={`rounded-[1.75rem] border p-5 shadow-sm print-avoid-break ${toneClass(item.tone)}`}>
      <div className="flex items-start gap-3">
        <NumberBubble value={index} tone={item.tone} muted />
        <div>
          <h3 className="text-base font-medium text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.headline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <div className="mt-4 rounded-2xl border border-background/70 bg-background/60 p-4 text-xs leading-relaxed text-foreground/85">
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">mode adaptif</div>
      <h3 className="mt-2 text-base font-medium text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.headline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
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
    <div className="rounded-2xl border border-primary/15 bg-primary/8 px-4 py-3 text-sm leading-relaxed text-foreground/90 shadow-sm">
      “{children}”
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
        <span key={role.id} className="rounded-full border border-background/70 bg-background/65 px-3 py-1 text-[11px] text-muted-foreground">
          {role.name} · alami {role.natural} · terlatih {role.strength}
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
      <div className="text-sm font-medium text-foreground">Peta Wilayah Peran</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Ini peta pendukung. Pembacaan utama tetap ada di Cermin Jati Diri, sumber energi, dan mode adaptif di atas.
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
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-4 space-y-3">
        {roles.map((role) => {
          const value = role[mode];
          return (
            <div key={role.id}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{role.name}</span>
                <span className="text-muted-foreground">{value}</span>
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
