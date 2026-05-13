import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { isAssessmentComplete, progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/completion")({
  component: CompletionPage,
});

function CompletionPage() {
  const navigate = useNavigate();
  const { identity, answers } = useAssessmentStore();
  const complete = isAssessmentComplete(answers);
  const naturalProgress = progressFor("natural", answers);
  const strengthProgress = progressFor("strength", answers);

  useEffect(() => {
    if (!identity) navigate({ to: "/" });
  }, [identity, navigate]);

  if (!identity) return null;

  if (!complete) {
    const targetSession = naturalProgress.done ? "strength" : "natural";
    return (
      <main className="min-h-dvh px-5 py-12 max-w-md mx-auto flex flex-col items-center justify-center text-center">
        <div className="grid place-items-center size-16 rounded-full bg-amber-500/10 text-[var(--ember)]">
          <Sparkles className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Asesmen belum lengkap</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
          Sesi 1: {naturalProgress.answered}/{naturalProgress.total} · Sesi 2: {strengthProgress.answered}/{strengthProgress.total}.
          Lanjutkan agar hasil peta diri dapat dibaca dengan lebih utuh.
        </p>
        <Link
          to="/assessment/$session"
          params={{ session: targetSession }}
          className="mt-10 w-full max-w-xs rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20"
        >
          Lanjutkan Asesmen
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-5 py-12 max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <div className="grid place-items-center size-20 rounded-full bg-[var(--ember)]/15 text-[var(--ember)]">
        <Sparkles className="size-10" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Terima Kasih</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
        kamu sudah menyelesaikan seluruh rangkaian Quick Scan dengan baik. Sistem sedang membaca pola
        pilihan kamu dan menyusun peta energi diri.
      </p>
      <Link
        to="/result"
        className="mt-10 w-full max-w-xs rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20"
      >
        Lihat Hasil Saya
      </Link>
    </main>
  );
}
