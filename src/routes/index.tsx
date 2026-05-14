import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Compass, Sparkles, Heart, Zap, ShieldCheck } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { getNextAssessmentTarget, progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peta Jati Diri — Cermin Pola Energi Kamu" },
      {
        name: "description",
        content:
          "Quick Scan berbasis kartu situasi untuk membaca pilihan aksi, pola energi, kemampuan yang sudah terlihat, mode adaptif, dan sisi yang menguras.",
      },
      { property: "og:title", content: "Peta Jati Diri" },
      {
        property: "og:description",
        content:
          "Pilih respons dalam situasi nyata. Sistem membaca pola energi, sisi terang, sisi bocor, dan kemampuan yang sudah terlihat.",
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

  const totalCards = naturalProgress.total + strengthProgress.total;

  return (
    <main className="min-h-dvh px-5 py-10 sm:py-16 max-w-md mx-auto flex flex-col">
      <header className="flex-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Compass className="size-3.5" />
          Context Action Cards
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          Peta Jati Diri
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Bukan tes setuju-tidak setuju. Kamu akan diberi situasi nyata, lalu memilih
          respons yang paling mungkin kamu lakukan. Dari pilihan aksi itu, sistem membaca
          pola energi, kemampuan yang sudah terlihat, mode adaptif, dan sisi yang menguras.
        </p>

        <ul className="mt-10 space-y-4">
          <Feature
            icon={<Sparkles className="size-4" />}
            title={`${totalCards} kartu situasi`}
            desc={`${naturalProgress.total} kartu Zona Kekuatan Alami dan ${strengthProgress.total} kartu Bukti Kemampuan.`}
          />
          <Feature
            icon={<Heart className="size-4" />}
            title="Pilih aksi, bukan skor"
            desc="Tidak ada angka, tidak ada sangat setuju. Kamu cukup memilih respons yang paling mendekati kejadian nyata."
          />
          <Feature
            icon={<Zap className="size-4" />}
            title="Sisi terang dan sisi bocor"
            desc="Hasil membaca kekuatan, mode adaptif, titik lelah, dan pola yang kadang membuat energi bocor."
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
              {naturalProgress.done && strengthProgress.done ? "Lihat hasil saya" : "Lanjutkan Quick Scan"}
            </button>
            <Link
              to="/identity"
              className="block w-full text-center text-xs text-muted-foreground py-2"
            >
              Mulai dari awal
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
          ± 12–18 menit · {totalCards} kartu situasi · Tidak ada jawaban benar atau salah
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
