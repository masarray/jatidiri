import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/transition")({
  component: TransitionPage,
});

function TransitionPage() {
  const navigate = useNavigate();
  const { identity, answers } = useAssessmentStore();
  const naturalProgress = progressFor("natural", answers);

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/" });
      return;
    }
    if (!naturalProgress.done) {
      navigate({ to: "/assessment/$session", params: { session: "natural" } });
    }
  }, [identity, navigate, naturalProgress.done]);

  return (
    <main className="min-h-dvh px-5 py-12 max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <div className="grid place-items-center size-16 rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">Sesi 1 selesai</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
        kamu sudah menyelesaikan bagian Zona Kekuatan Alami. Sekarang kita lanjut singkat ke Sesi 2 untuk melihat
        bukti kemampuan yang sudah muncul dalam kehidupan nyata.
      </p>
      <Link
        to="/instruction/$session"
        params={{ session: "strength" }}
        className="mt-10 w-full max-w-xs rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20"
      >
        Lanjut ke Sesi 2
      </Link>
    </main>
  );
}
