import { useEffect, useState, type CSSProperties } from "react";
import type { AnswerValue, AssessmentSession } from "@/types/assessment";

interface Props {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  leftLabel?: string;
  rightLabel?: string;
  session?: AssessmentSession;
  disabled?: boolean;
}

const AGREEMENT_LABELS = [
  "Sangat tidak setuju",
  "Tidak setuju",
  "Agak tidak setuju",
  "Netral",
  "Agak setuju",
  "Setuju",
  "Sangat setuju",
];

const VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

type Tone = {
  fill: string;
  soft: string;
  ink: string;
  border: string;
  ring: string;
};

const SCALE_TONES: Record<AnswerValue, Tone> = {
  1: {
    fill: "oklch(0.34 0.018 250)",
    soft: "oklch(0.34 0.018 250 / 0.055)",
    ink: "oklch(0.985 0.004 90)",
    border: "oklch(0.34 0.018 250 / 0.24)",
    ring: "oklch(0.34 0.018 250 / 0.10)",
  },
  2: {
    fill: "oklch(0.48 0.016 250)",
    soft: "oklch(0.48 0.016 250 / 0.052)",
    ink: "oklch(0.985 0.004 90)",
    border: "oklch(0.48 0.016 250 / 0.22)",
    ring: "oklch(0.48 0.016 250 / 0.09)",
  },
  3: {
    fill: "oklch(0.70 0.012 250)",
    soft: "oklch(0.70 0.012 250 / 0.09)",
    ink: "oklch(0.26 0.02 250)",
    border: "oklch(0.64 0.012 250 / 0.24)",
    ring: "oklch(0.70 0.012 250 / 0.12)",
  },
  4: {
    fill: "oklch(0.98 0.004 90)",
    soft: "oklch(0.98 0.004 90 / 0.70)",
    ink: "oklch(0.28 0.02 240)",
    border: "oklch(0.83 0.012 85 / 0.58)",
    ring: "oklch(0.55 0.02 240 / 0.08)",
  },
  5: {
    fill: "oklch(0.84 0.12 78)",
    soft: "oklch(0.84 0.12 78 / 0.10)",
    ink: "oklch(0.31 0.055 55)",
    border: "oklch(0.76 0.12 76 / 0.30)",
    ring: "oklch(0.84 0.12 78 / 0.13)",
  },
  6: {
    fill: "oklch(0.70 0.15 48)",
    soft: "oklch(0.70 0.15 48 / 0.085)",
    ink: "oklch(0.985 0.004 90)",
    border: "oklch(0.68 0.15 48 / 0.28)",
    ring: "oklch(0.70 0.15 48 / 0.12)",
  },
  7: {
    fill: "oklch(0.60 0.18 28)",
    soft: "oklch(0.60 0.18 28 / 0.080)",
    ink: "oklch(0.99 0.004 90)",
    border: "oklch(0.58 0.18 28 / 0.30)",
    ring: "oklch(0.60 0.18 28 / 0.12)",
  },
};

function hapticTap() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // Haptic is optional. The visual feedback remains calm and sufficient.
  }
}

function getFootnote(session: AssessmentSession) {
  if (session === "strength") {
    return "Jawab sesuai pengalaman nyata Anda, bukan harapan ideal.";
  }
  return "Jawab spontan sesuai yang pertama kali terasa.";
}

export function AnswerScale({ value, onSelect, session = "natural", disabled = false }: Props) {
  const [pressValue, setPressValue] = useState<AnswerValue | null>(null);

  useEffect(() => {
    if (!pressValue) return;
    const timer = window.setTimeout(() => setPressValue(null), 220);
    return () => window.clearTimeout(timer);
  }, [pressValue]);

  function handleSelect(nextValue: AnswerValue) {
    if (disabled) return;
    hapticTap();
    setPressValue(nextValue);
    onSelect(nextValue);
  }

  return (
    <div className="calm-answer-scale w-full">
      <div className="calm-answer-head">
        <span>Skala persetujuan</span>
        <span className="tabular-nums">1–7</span>
      </div>

      <div className="calm-answer-list" role="radiogroup" aria-label="Skala persetujuan 1 sampai 7">
        {VALUES.map((nextValue, index) => {
          const selected = value === nextValue;
          const tone = SCALE_TONES[nextValue];

          return (
            <button
              key={nextValue}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(nextValue)}
              role="radio"
              aria-checked={selected}
              aria-label={`Pilih ${nextValue}: ${AGREEMENT_LABELS[index]}`}
              className={`calm-answer-option ${selected ? "is-selected" : ""} ${pressValue === nextValue ? "is-pressing" : ""}`}
              style={
                {
                  "--scale-fill": tone.fill,
                  "--scale-soft": tone.soft,
                  "--scale-ink": tone.ink,
                  "--scale-border": tone.border,
                  "--scale-ring": tone.ring,
                } as CSSProperties
              }
            >
              <span className="calm-answer-dot" aria-hidden="true">
                {nextValue}
              </span>
              <span className="calm-answer-label">{AGREEMENT_LABELS[index]}</span>
            </button>
          );
        })}
      </div>

      <p className="calm-answer-footnote">{getFootnote(session)}</p>
    </div>
  );
}
