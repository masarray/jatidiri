import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { Lightbulb, Clock, Heart, ShieldCheck, ChevronLeft } from "lucide-react";
import type { AssessmentSession } from "@/types/assessment";
import { useAssessmentStore } from "@/store/assessmentStore";
import { progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/instruction/$session")({
  component: InstructionPage,
});

const COPY: Record<AssessmentSession, { title: string; eyebrow: string; bullets: string[]; time: string; button: string }> = {
  natural: {
    eyebrow: "Sesi 1 dari 2",
    title: "Zona Kekuatan Alami",
    time: "± 10–15 menit · 44 kartu situasi",
    button: "Mulai Sesi 1",
    bullets: [
      "Setiap kartu berisi situasi nyata dan empat kemungkinan respons.",
      "Bayangkan kondisinya, lalu pilih aksi yang paling mungkin kamu lakukan saat tidak sedang berusaha terlihat ideal.",
      "Sebagian pilihan membaca dorongan alami; sebagian lain membaca sisi bocor seperti lelah basa-basi, prioritas bocor, atau sulit melepas hasil.",
      "Setelah memilih card, sistem otomatis lanjut ke kartu berikutnya.",
    ],
  },
  strength: {
    eyebrow: "Sesi 2 dari 2",
    title: "Bukti Kemampuan yang Terlihat",
    time: "± 2–3 menit · 5 kartu situasi",
    button: "Mulai Sesi 2",
    bullets: [
      "Bagian ini singkat dan bukan pengulangan sesi pertama.",
      "Fokusnya melihat apakah pola yang muncul sudah menjadi kemampuan nyata, atau lebih berupa kemampuan adaptif yang bisa kamu lakukan saat dibutuhkan.",
      "Pilih berdasarkan pengalaman yang benar-benar pernah kamu jalankan, bukan versi ideal.",
      "Di bagian ini sistem juga membaca kemampuan seperti menjelaskan, menuntaskan, menjaga hubungan, mengatur sistem, dan memasarkan ide tanpa harus menjadi social butterfly.",
    ],
  },
};

function InstructionPage() {
  const { session } = useParams({ from: "/instruction/$session" });
  const s = session as AssessmentSession;
  const copy = COPY[s] ?? COPY.natural;
  const navigate = useNavigate();
  const { identity, answers, setCurrentIndex } = useAssessmentStore();
  const naturalProgress = progressFor("natural", answers);

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/identity" });
      return;
    }
    if (s === "strength" && !naturalProgress.done) {
      navigate({ to: "/assessment/$session", params: { session: "natural" } });
    }
  }, [identity, navigate, naturalProgress.done, s]);

  function startSession() {
    setCurrentIndex(s, 0);
    navigate({ to: "/assessment/$session", params: { session: s } });
  }

  return (
    <main className="min-h-dvh px-5 py-8 max-w-md mx-auto flex flex-col">
      <div className="flex-1">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <ChevronLeft className="size-4" /> Beranda
        </Link>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          {copy.eyebrow}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{copy.title}</h1>
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {copy.time}
        </div>

        <div className="mt-8 rounded-2xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="size-4 text-primary" />
            <span className="font-semibold text-sm">Cara menjawab</span>
          </div>
          <ul className="space-y-3 text-sm text-foreground/90">
            {copy.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 mt-0.5 text-[var(--ember)]" />
          <p className="leading-relaxed">
            Ini bukan diagnosis klinis, bukan ujian, dan bukan alat seleksi kerja. Hasilnya adalah cermin refleksi diri dari pola pilihan aksi kamu.
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 px-2 text-xs text-muted-foreground">
          <Heart className="size-3.5 shrink-0 mt-0.5 text-[var(--ember)]" />
          <p>
            Jawaban tersimpan otomatis. Kamu bisa jeda dan melanjutkan lagi dari perangkat yang sama.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={startSession}
        className="mt-10 w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition"
      >
        {copy.button}
      </button>
    </main>
  );
}
