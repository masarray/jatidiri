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
    title: "Bakat Alami",
    time: "± 30–40 menit · 180 pertanyaan",
    button: "Mulai Sesi 1",
    bullets: [
      "Pilih yang paling sesuai dengan diri kamu sehari-hari.",
      "Jangan terlalu menganalisis atau menebak arah pertanyaan.",
      "Tidak ada jawaban benar atau salah — jawab apa adanya.",
      "Setelah memilih, sistem otomatis lanjut ke pertanyaan berikutnya.",
    ],
  },
  strength: {
    eyebrow: "Sesi 2 dari 2",
    title: "Kekuatan Aktivitas",
    time: "± 20 menit · 114 pertanyaan",
    button: "Mulai Sesi 2",
    bullets: [
      "Sekarang fokus pada aktivitas: seberapa kuat kamu melakukannya dalam pengalaman nyata.",
      "Bukan tentang seberapa suka, tetapi seberapa terampil, terbiasa, atau percaya diri Anda melakukannya.",
      "Skala 5 pilihan bergerak dari 'Sangat lemah' sampai 'Sangat kuat'.",
      "Pilih jawaban paling jujur, bukan jawaban yang terdengar paling ideal.",
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
            Ini bukan diagnosis klinis, bukan ujian, dan bukan alat seleksi kerja. Hasilnya adalah peta refleksi diri berdasarkan pola jawaban Anda.
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 px-2 text-xs text-muted-foreground">
          <Heart className="size-3.5 shrink-0 mt-0.5 text-[var(--ember)]" />
          <p>
            Jawaban tersimpan otomatis. Anda bisa jeda dan melanjutkan lagi dari perangkat yang sama.
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
