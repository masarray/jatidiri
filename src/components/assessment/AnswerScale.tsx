import { useEffect, useState, type CSSProperties } from "react";
import type { AnswerValue, AssessmentSession } from "@/types/assessment";

interface Props {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  leftLabel: string;
  rightLabel: string;
  session: AssessmentSession;
}

const NATURAL_LABELS = [
  "Sangat tidak sesuai",
  "Tidak sesuai",
  "Agak tidak sesuai",
  "Netral",
  "Agak sesuai",
  "Sesuai",
  "Sangat sesuai",
];

const STRENGTH_LABELS = [
  "Sangat lemah",
  "Lemah",
  "Agak lemah",
  "Netral",
  "Agak kuat",
  "Kuat",
  "Sangat kuat",
];

const VALUES = [1, 2, 3, 4, 5, 6, 7] as const;
const OPTION_HEIGHT = 54;
const OPTION_GAP = 8;

type Tone = {
  name: string;
  fill: string;
  soft: string;
  ink: string;
  border: string;
  glow: string;
};

const SCALE_TONES: Record<AnswerValue, Tone> = {
  1: {
    name: "Charcoal",
    fill: "oklch(0.22 0.018 250)",
    soft: "oklch(0.22 0.018 250 / 0.08)",
    ink: "oklch(0.99 0.004 90)",
    border: "oklch(0.22 0.018 250 / 0.62)",
    glow: "oklch(0.22 0.018 250 / 0.22)",
  },
  2: {
    name: "Slate",
    fill: "oklch(0.47 0.018 250)",
    soft: "oklch(0.47 0.018 250 / 0.08)",
    ink: "oklch(0.99 0.004 90)",
    border: "oklch(0.47 0.018 250 / 0.48)",
    glow: "oklch(0.47 0.018 250 / 0.18)",
  },
  3: {
    name: "Mist",
    fill: "oklch(0.78 0.01 250)",
    soft: "oklch(0.78 0.01 250 / 0.18)",
    ink: "oklch(0.24 0.02 250)",
    border: "oklch(0.72 0.012 250 / 0.62)",
    glow: "oklch(0.78 0.01 250 / 0.28)",
  },
  4: {
    name: "Neutral",
    fill: "oklch(1 0 0)",
    soft: "oklch(1 0 0 / 0.7)",
    ink: "oklch(0.28 0.02 240)",
    border: "oklch(0.82 0.012 85)",
    glow: "oklch(0.55 0.02 240 / 0.12)",
  },
  5: {
    name: "Amber",
    fill: "oklch(0.87 0.13 82)",
    soft: "oklch(0.87 0.13 82 / 0.16)",
    ink: "oklch(0.28 0.04 55)",
    border: "oklch(0.78 0.14 78 / 0.56)",
    glow: "oklch(0.87 0.13 82 / 0.28)",
  },
  6: {
    name: "Orange",
    fill: "oklch(0.72 0.17 48)",
    soft: "oklch(0.72 0.17 48 / 0.14)",
    ink: "oklch(0.99 0.005 90)",
    border: "oklch(0.68 0.17 48 / 0.58)",
    glow: "oklch(0.72 0.17 48 / 0.3)",
  },
  7: {
    name: "Coral Red",
    fill: "oklch(0.62 0.21 28)",
    soft: "oklch(0.62 0.21 28 / 0.13)",
    ink: "oklch(0.99 0.005 90)",
    border: "oklch(0.58 0.21 28 / 0.6)",
    glow: "oklch(0.62 0.21 28 / 0.32)",
  },
};

function getLabels(session: AssessmentSession) {
  return session === "strength" ? STRENGTH_LABELS : NATURAL_LABELS;
}

function getCaption(session: AssessmentSession, leftLabel: string, rightLabel: string) {
  if (session === "strength") return "Pilih tingkat kekuatan aktivitas yang paling menggambarkan pengalaman nyata Anda.";
  return `Pilih yang paling dekat: ${leftLabel} → ${rightLabel}.`;
}

function optionHint(session: AssessmentSession, n: AnswerValue) {
  if (session === "strength") {
    if (n === 4) return "Tidak lemah, tidak kuat.";
    if (n < 4) return "Aktivitas ini relatif belum kuat.";
    return "Aktivitas ini relatif terasa kuat.";
  }

  if (n === 4) return "Netral atau tidak cukup menonjol.";
  if (n < 4) return "Cenderung bukan pola diri Anda.";
  return "Cenderung sesuai dengan pola diri Anda.";
}

function hapticTap() {
  try {
    navigator.vibrate?.([18, 10, 16]);
  } catch {
    // Browser may not support haptic vibration. The visual press effect still runs.
  }
}

export function AnswerScale({ value, onSelect, leftLabel, rightLabel, session }: Props) {
  const labels = getLabels(session);
  const selectedIndex = value ? value - 1 : -1;
  const selectedTone = value ? SCALE_TONES[value] : undefined;
  const [pressValue, setPressValue] = useState<AnswerValue | null>(null);

  useEffect(() => {
    if (!pressValue) return;
    const timer = window.setTimeout(() => setPressValue(null), 560);
    return () => window.clearTimeout(timer);
  }, [pressValue]);

  function handleSelect(n: AnswerValue) {
    hapticTap();
    setPressValue(n);
    onSelect(n);
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span>{session === "strength" ? "Skala kekuatan" : "Skala kesesuaian"}</span>
        <span className="hidden text-right sm:inline">Tekan angka 1–7</span>
      </div>

      <div
        className="answer-pill-group relative rounded-[1.65rem] border border-border/70 bg-muted/25 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={
          selectedTone
            ? ({
                "--active-scale-fill": selectedTone.fill,
                "--active-scale-soft": selectedTone.soft,
                "--active-scale-ink": selectedTone.ink,
                "--active-scale-border": selectedTone.border,
                "--active-scale-glow": selectedTone.glow,
              } as CSSProperties)
            : undefined
        }
      >
        {selectedIndex >= 0 ? (
          <span
            aria-hidden="true"
            className="answer-pill-indicator pointer-events-none absolute left-2 right-2 rounded-full"
            style={{
              height: OPTION_HEIGHT,
              transform: `translateY(${selectedIndex * (OPTION_HEIGHT + OPTION_GAP)}px)`,
            }}
          />
        ) : null}

        <div className="relative z-[1] grid gap-2">
          {VALUES.map((n, index) => {
            const selected = value === n;
            const tone = SCALE_TONES[n];

            return (
              <button
                key={n}
                type="button"
                onClick={() => handleSelect(n)}
                aria-label={`Pilih ${n}: ${labels[index]}`}
                aria-pressed={selected}
                className={`answer-pill-option group relative flex h-[54px] w-full items-center gap-3 rounded-full px-3 text-left outline-none transition-[background,box-shadow,transform,color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  selected ? "is-selected text-foreground" : "text-foreground"
                } ${pressValue === n ? "is-pressing" : ""}`}
                style={
                  {
                    "--scale-fill": tone.fill,
                    "--scale-soft": tone.soft,
                    "--scale-ink": tone.ink,
                    "--scale-border": tone.border,
                    "--scale-glow": tone.glow,
                  } as CSSProperties
                }
              >
                <span className="answer-pill-number grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-all duration-150">
                  {n}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-tight sm:text-[15px]">{labels[index]}</span>
                  <span className="mt-0.5 hidden text-[11px] leading-tight text-muted-foreground sm:block">{optionHint(session, n)}</span>
                </span>

                <span aria-hidden="true" className="answer-pill-dot size-3 shrink-0 rounded-full border transition-all duration-150" />
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">{getCaption(session, leftLabel, rightLabel)}</p>
    </div>
  );
}
