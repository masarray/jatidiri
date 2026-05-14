import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { progressFor } from "@/engine/scoring";

export const Route = createFileRoute("/identity")({
  head: () => ({
    meta: [
      { title: "Mulai Asesmen — Peta Jati Diri" },
      { name: "description", content: "Masukkan nama dan konteks pembacaan hasil asesmen kamu." },
    ],
  }),
  component: IdentityPage,
});

const PURPOSES = ["Pribadi", "Pasangan & Keluarga", "Karier", "Tim"];

function IdentityPage() {
  const navigate = useNavigate();
  const { setIdentity, reset, answers, identity } = useAssessmentStore();
  const [name, setName] = useState(identity?.name ?? "");
  const [purpose, setPurpose] = useState<string | undefined>(identity?.purpose);
  const naturalProgress = progressFor("natural", answers);
  const strengthProgress = progressFor("strength", answers);
  const hasExistingProgress = naturalProgress.answered > 0 || strengthProgress.answered > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (hasExistingProgress) {
      const ok = confirm(
        "Mulai asesmen baru? Jawaban yang tersimpan di perangkat ini akan dihapus.",
      );
      if (!ok) return;
    }

    reset();
    setIdentity({ name: name.trim(), purpose, startedAt: new Date().toISOString() });
    navigate({ to: "/instruction/$session", params: { session: "natural" } });
  }

  return (
    <main className="min-h-dvh px-5 py-8 max-w-md mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Kembali
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-foreground">Sebelum mulai</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Masukkan nama untuk ditampilkan pada hasil. Pilihan tujuan membantu sistem menyesuaikan bahasa pembacaan tanpa mengubah inti pola yang terbaca.
      </p>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="leading-relaxed">
          Peta Jati Diri adalah alat self-awareness, bukan diagnosis klinis dan bukan tes rekrutmen resmi.
          Jawablah apa adanya, bukan versi ideal yang terdengar paling baik.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tujuan pembacaan (opsional)</label>
          <div className="grid grid-cols-2 gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p === purpose ? undefined : p)}
                className={`rounded-xl border px-3 py-2.5 text-sm transition active:scale-[0.98] ${
                  purpose === p
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition disabled:opacity-50"
        >
          Lanjut
        </button>
      </form>
    </main>
  );
}
