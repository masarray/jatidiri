import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Compass, Sparkles, Heart, Zap, ShieldCheck } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { getNextAssessmentTarget, progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peta Jati Diri — Quick Scan Energi & Bakat Alami Kamu" },
      {
        name: "description",
        content:
          "Asesmen self-awareness untuk memahami bakat alami, kemampuan yang terlihat, dan area yang menguras energi kamu.",
      },
      { property: "og:title", content: "Peta Jati Diri" },
      {
        property: "og:description",
        content: "Pahami apa yang membuat kamu hidup, apa yang menguras energi kamu.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const { identity, answers, setCurrentIndex } = useAssessmentStore();
  const naturalProgress = progressFor("natural", answers);
  const strengthProgress = progressFor("strength", answers);
  const hasProgress = Boolean(
    identity && (naturalProgress.answered > 0 || strengthProgress.answered > 0),
  );

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

  return (
    <main className="min-h-dvh px-5 py-10 sm:py-16 max-w-md mx-auto flex flex-col">
      <header className="flex-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Compass className="size-3.5" />
          Quick Scan self-awareness
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          Peta Jati Diri
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Pahami hal apa yang membuat kamu hidup, apa yang menguras energi, dan apakah aktivitas kamu
          sudah berjalan dekat dengan kekuatan alami.
        </p>

        <ul className="mt-10 space-y-4">
          <Feature
            icon={<Sparkles className="size-4" />}
            title="72 pertanyaan tajam"
            desc="Quick Scan dua sesi: pola alami dan kemampuan yang sudah terlihat."
          />
          <Feature
            icon={<Heart className="size-4" />}
            title="Peta energi pribadi"
            desc="Tahu mana yang menghidupkan, mana yang menguras, dan mana yang perlu ruang tumbuh."
          />
          <Feature
            icon={<Zap className="size-4" />}
            title="Panduan komunikasi"
            desc="Membantu kamu dan orang terdekat memahami pola komunikasi yang lebih pas."
          />
          <Feature
            icon={<ShieldCheck className="size-4" />}
            title="Privat di perangkat kamu"
            desc="Jawaban tersimpan lokal di browser dan tidak dikirim ke server."
          />
        </ul>
      </header>

      <div className="mt-12 sticky bottom-4">
        {hasProgress ? (
          <div className="space-y-2 rounded-3xl bg-background/85 backdrop-blur-md p-2 border border-border/60 shadow-sm">
            <button
              onClick={continueAssessment}
              className="block w-full text-center rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition"
            >
              {naturalProgress.done && strengthProgress.done ? "Lihat hasil saya" : "Lanjutkan asesmen"}
            </button>
            <Link
              to="/identity"
              className="block w-full text-center text-xs text-muted-foreground py-2"
            >
              Mulai asesmen baru
            </Link>
            <p className="text-center text-[11px] text-muted-foreground pb-1">
              Sesi 1: {naturalProgress.answered}/{naturalProgress.total} · Sesi 2: {strengthProgress.answered}/{strengthProgress.total}
            </p>
          </div>
        ) : (
          <Link
            to="/identity"
            className="block w-full text-center rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition"
          >
            Mulai Quick Scan
          </Link>
        )}
        <p className="text-center text-[11px] text-muted-foreground mt-3">
          ± 10–15 menit · Tidak ada jawaban benar atau salah
        </p>
      </div>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid place-items-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
        {icon}
      </span>
      <div>
        <div className="font-semibold text-sm text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
      </div>
    </li>
  );
}
