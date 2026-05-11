import { useEffect, useState, type CSSProperties } from "react";
import type { AnswerValue, AssessmentSession } from "@/types/assessment";

interface Props {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  leftLabel: string;
  rightLabel: string;
  session?: AssessmentSession;
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

// Compact mobile target: all seven answers should fit on one phone screen.
const OPTION_HEIGHT = 40;
const OPTION_GAP = 5;

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
    soft: "oklch(0.22 0.018 250 / 0.075)",
    ink: "oklch(0.99 0.004 90)",
    border: "oklch(0.22 0.018 250 / 0.58)",
    glow: "oklch(0.22 0.018 250 / 0.2)",
  },
  2: {
    name: "Slate",
    fill: "oklch(0.47 0.018 250)",
    soft: "oklch(0.47 0.018 250 / 0.075)",
    ink: "oklch(0.99 0.004 90)",
    border: "oklch(0.47 0.018 250 / 0.46)",
    glow: "oklch(0.47 0.018 250 / 0.16)",
  },
  3: {
    name: "Mist",
    fill: "oklch(0.78 0.01 250)",
    soft: "oklch(0.78 0.01 250 / 0.16)",
    ink: "oklch(0.24 0.02 250)",
    border: "oklch(0.72 0.012 250 / 0.56)",
    glow: "oklch(0.78 0.01 250 / 0.24)",
  },
  4: {
    name: "Neutral",
    fill: "oklch(1 0 0)",
    soft: "oklch(1 0 0 / 0.7)",
    ink: "oklch(0.28 0.02 240)",
    border: "oklch(0.82 0.012 85)",
    glow: "oklch(0.55 0.02 240 / 0.1)",
  },
  5: {
    name: "Amber",
    fill: "oklch(0.87 0.13 82)",
    soft: "oklch(0.87 0.13 82 / 0.14)",
    ink: "oklch(0.28 0.04 55)",
    border: "oklch(0.78 0.14 78 / 0.52)",
    glow: "oklch(0.87 0.13 82 / 0.24)",
  },
  6: {
    name: "Orange",
    fill: "oklch(0.72 0.17 48)",
    soft: "oklch(0.72 0.17 48 / 0.12)",
    ink: "oklch(0.99 0.005 90)",
    border: "oklch(0.68 0.17 48 / 0.54)",
    glow: "oklch(0.72 0.17 48 / 0.26)",
  },
  7: {
    name: "Coral Red",
    fill: "oklch(0.62 0.21 28)",
    soft: "oklch(0.62 0.21 28 / 0.115)",
    ink: "oklch(0.99 0.005 90)",
    border: "oklch(0.58 0.21 28 / 0.56)",
    glow: "oklch(0.62 0.21 28 / 0.28)",
  },
};

function getLabels(session: AssessmentSession) {
  return session === "strength" ? STRENGTH_LABELS : NATURAL_LABELS;
}

function getCaption(session: AssessmentSession, leftLabel: string, rightLabel: string) {
  if (session === "strength") return "Pilih sesuai kekuatan aktivitas dalam pengalaman nyata Anda.";
  return `${leftLabel} → ${rightLabel}`;
}

function hapticTap() {
  try {
    navigator.vibrate?.([14, 8, 12]);
  } catch {
    // Visual feedback remains active even when haptic is unsupported.
  }
}

export function AnswerScale({ value, onSelect, leftLabel, rightLabel, session = "natural" }: Props) {
  const labels = getLabels(session);
  const selectedIndex = value ? value - 1 : -1;
  const selectedTone = value ? SCALE_TONES[value] : undefined;
  const [pressValue, setPressValue] = useState<AnswerValue | null>(null);

  useEffect(() => {
    if (!pressValue) return;
    const timer = window.setTimeout(() => setPressValue(null), 520);
    return () => window.clearTimeout(timer);
  }, [pressValue]);

  function handleSelect(n: AnswerValue) {
    hapticTap();
    setPressValue(n);
    onSelect(n);
  }

  return (
    <div className="w-full">
      <div className="answer-scale-caption mb-1.5 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span>{session === "strength" ? "Skala kekuatan" : "Skala kesesuaian"}</span>
        <span className="text-right tabular-nums">1–7</span>
      </div>

      <div
        className="answer-pill-group compact-answer-group relative rounded-[1.35rem] border border-border/70 bg-muted/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
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
            className="answer-pill-indicator pointer-events-none absolute left-1.5 right-1.5 rounded-full"
            style={{
              height: OPTION_HEIGHT,
              transform: `translateY(${selectedIndex * (OPTION_HEIGHT + OPTION_GAP)}px)`,
            }}
          />
        ) : null}

        <div className="relative z-[1] grid gap-[5px]">
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
                className={`answer-pill-option compact-answer-option group relative flex h-10 w-full items-center gap-2.5 rounded-full px-2.5 text-left outline-none transition-[background,box-shadow,transform,color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary/30 ${
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
                <span className="answer-pill-number grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-150">
                  {n}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold leading-none sm:text-sm">{labels[index]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="answer-scale-footnote mt-2 text-center text-[10px] leading-tight text-muted-foreground">{getCaption(session, leftLabel, rightLabel)}</p>
    </div>
  );
}
