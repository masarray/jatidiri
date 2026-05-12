import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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

type Tone = {
  text: string;
  idleBg: string;
  idleBorder: string;
  idleEdge: string;
  activeBg: string;
  activeBorder: string;
  activeEdge: string;
  accent: string;
  accentSoft: string;
  halo: string;
  rail: string;
};

// Softer hierarchy: visible enough to answer by instinct, calm enough for 180+ questions.
const TONES: Record<AnswerValue, Tone> = {
  1: {
    text: "#263246",
    idleBg: "linear-gradient(180deg,#fbfdff 0%,#f1f7ff 100%)",
    idleBorder: "#cfe0f3",
    idleEdge: "#bdd0e4",
    activeBg: "linear-gradient(180deg,#f0f7ff 0%,#deecfb 100%)",
    activeBorder: "#7fa4ca",
    activeEdge: "#6385a8",
    accent: "#5e7fa4",
    accentSoft: "#e7f1fb",
    halo: "rgba(94,127,164,.18)",
    rail: "linear-gradient(180deg,#e8f2fc,#d7e6f5)",
  },
  2: {
    text: "#2c3544",
    idleBg: "linear-gradient(180deg,#fdfefe 0%,#f3f6f9 100%)",
    idleBorder: "#d5dde7",
    idleEdge: "#c2ccd8",
    activeBg: "linear-gradient(180deg,#f5f8fb 0%,#e9eff5 100%)",
    activeBorder: "#93a1b1",
    activeEdge: "#7d8a99",
    accent: "#718092",
    accentSoft: "#eef3f7",
    halo: "rgba(113,128,146,.16)",
    rail: "linear-gradient(180deg,#eef3f8,#e1e8ef)",
  },
  3: {
    text: "#383448",
    idleBg: "linear-gradient(180deg,#fffefe 0%,#f7f2f8 100%)",
    idleBorder: "#ded3e1",
    idleEdge: "#cec1d2",
    activeBg: "linear-gradient(180deg,#fbf7fc 0%,#eee6f1 100%)",
    activeBorder: "#a891b1",
    activeEdge: "#8e7897",
    accent: "#80678a",
    accentSoft: "#f4edf6",
    halo: "rgba(128,103,138,.16)",
    rail: "linear-gradient(180deg,#f3edf6,#e8ddeb)",
  },
  4: {
    text: "#3a4150",
    idleBg: "linear-gradient(180deg,#fffdf9 0%,#f8f1e7 100%)",
    idleBorder: "#e3d5bf",
    idleEdge: "#cebea1",
    activeBg: "linear-gradient(180deg,#fff8ed 0%,#f2e3c9 100%)",
    activeBorder: "#c69e5c",
    activeEdge: "#a28247",
    accent: "#ad8139",
    accentSoft: "#fff3df",
    halo: "rgba(173,129,57,.18)",
    rail: "linear-gradient(180deg,#fff1dc,#ead9ba)",
  },
  5: {
    text: "#5a3915",
    idleBg: "linear-gradient(180deg,#fffefa 0%,#fff4dc 100%)",
    idleBorder: "#edcb8d",
    idleEdge: "#d9ad67",
    activeBg: "linear-gradient(180deg,#fff2d6 0%,#ffdfa3 100%)",
    activeBorder: "#de942d",
    activeEdge: "#bc7416",
    accent: "#c87914",
    accentSoft: "#fff1d6",
    halo: "rgba(200,121,20,.20)",
    rail: "linear-gradient(180deg,#ffe9bd,#ffd991)",
  },
  6: {
    text: "#643217",
    idleBg: "linear-gradient(180deg,#fffdfb 0%,#ffeddf 100%)",
    idleBorder: "#eeaf86",
    idleEdge: "#d98a57",
    activeBg: "linear-gradient(180deg,#ffe9d7 0%,#ffcba7 100%)",
    activeBorder: "#de763e",
    activeEdge: "#b95727",
    accent: "#cf5d25",
    accentSoft: "#ffe7d7",
    halo: "rgba(207,93,37,.22)",
    rail: "linear-gradient(180deg,#ffd9be,#ffbd90)",
  },
  7: {
    text: "#642720",
    idleBg: "linear-gradient(180deg,#fffdfc 0%,#ffebe8 100%)",
    idleBorder: "#edaaa1",
    idleEdge: "#d77b72",
    activeBg: "linear-gradient(180deg,#ffe9e5 0%,#ffc8c0 100%)",
    activeBorder: "#df6256",
    activeEdge: "#bd4439",
    accent: "#c8453b",
    accentSoft: "#ffe5e1",
    halo: "rgba(200,69,59,.23)",
    rail: "linear-gradient(180deg,#ffd9d3,#ffb9b0)",
  },
};

function getLabels(session: AssessmentSession) {
  return session === "strength" ? STRENGTH_LABELS : AGREEMENT_LABELS;
}

function getScaleTitle(session: AssessmentSession) {
  return session === "strength" ? "Skala kekuatan aktivitas" : "Skala persetujuan spontan";
}

function getHelper(session: AssessmentSession) {
  return session === "strength"
    ? "Pilih sesuai kekuatan aktivitas yang benar-benar kamu rasakan."
    : "Jawab spontan. Pilih yang paling menggambarkan diri kamu saat ini.";
}

function hapticTap() {
  try {
    navigator.vibrate?.(7);
  } catch {
    // optional haptic feedback
  }
}

function buttonStyle(tone: Tone, active: boolean, pressing: boolean): CSSProperties {
  const bottom = pressing ? 1 : active ? 2 : 3;
  const depthShadow = active
    ? `0 ${bottom}px 0 ${tone.activeEdge}, 0 ${bottom + 7}px 15px ${tone.halo}`
    : `0 ${bottom}px 0 ${tone.idleEdge}, 0 ${bottom + 8}px 15px rgba(15,23,42,.045)`;

  return {
    color: active ? tone.text : "#263241",
    background: active ? tone.activeBg : tone.idleBg,
    borderColor: active ? tone.activeBorder : tone.idleBorder,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.94), ${depthShadow}`,
    transform: pressing ? "translate3d(0,2px,0) scale(.993)" : "translate3d(0,0,0) scale(1)",
    transition:
      "transform 52ms cubic-bezier(.2,.8,.2,1), border-color 76ms ease-out, background 76ms ease-out, box-shadow 76ms ease-out",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    willChange: "transform",
  };
}

export function AnswerScale({ value, onSelect, session = "natural", disabled = false }: Props) {
  const labels = useMemo(() => getLabels(session), [session]);
  const [pressingValue, setPressingValue] = useState<AnswerValue | null>(null);
  const [committingValue, setCommittingValue] = useState<AnswerValue | null>(null);
  const commitTimerRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
    };
  }, []);

  function releaseVisual(delay = 92) {
    if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = window.setTimeout(() => {
      setPressingValue(null);
      setCommittingValue(null);
    }, delay);
  }

  function commit(nextValue: AnswerValue) {
    if (disabled || committingValue) return;

    hapticTap();
    setPressingValue(nextValue);
    setCommittingValue(nextValue);

    if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
    commitTimerRef.current = window.setTimeout(() => {
      onSelect(nextValue);
      releaseVisual(70);
    }, 96);
  }

  return (
    <div className="w-full select-none">
      <div className="mb-[7px] flex items-center justify-between gap-3 px-1 text-[10.5px] font-medium tracking-[0.01em] text-muted-foreground">
        <span>{getScaleTitle(session)}</span>
        <span className="tabular-nums text-muted-foreground/35">1–7</span>
      </div>

      <div className="grid gap-[6px]">
        {VALUES.map((itemValue, index) => {
          const selected = value === itemValue;
          const pressing = pressingValue === itemValue || committingValue === itemValue;
          const active = selected || pressing;
          const tone = TONES[itemValue];

          return (
            <button
              key={itemValue}
              type="button"
              disabled={disabled || Boolean(committingValue)}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                event.preventDefault();
                commit(itemValue);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  commit(itemValue);
                }
              }}
              aria-label={`Pilih ${itemValue}: ${labels[index]}`}
              aria-pressed={selected}
              className={[
                "relative flex min-h-[40px] w-full items-center gap-3 overflow-hidden rounded-[18px] border px-3.5 py-[7px] text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              ].join(" ")}
              style={buttonStyle(tone, active, pressing)}
            >
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-[4px] rounded-r-full transition-[opacity,background] duration-75"
                style={{ background: tone.rail, opacity: active ? 1 : 0.72 }}
                aria-hidden="true"
              />

              <span
                className="relative grid size-[20px] shrink-0 place-items-center rounded-full border transition-[background,border-color,box-shadow,transform] duration-75"
                style={{
                  borderColor: active ? tone.accent : tone.idleBorder,
                  background: active ? `linear-gradient(180deg,#ffffff 0%,${tone.accentSoft} 100%)` : "rgba(255,255,255,.86)",
                  boxShadow: active
                    ? `0 0 0 4px ${tone.halo}, inset 0 1px 0 rgba(255,255,255,.96)`
                    : "inset 0 1px 0 rgba(255,255,255,.96)",
                  transform: pressing ? "scale(.88)" : active ? "scale(1.05)" : "scale(1)",
                }}
                aria-hidden="true"
              >
                <span
                  className="size-[8px] rounded-full transition-[opacity,transform,background] duration-75"
                  style={{
                    background: tone.accent,
                    opacity: active ? 1 : 0,
                    transform: active ? "scale(1)" : "scale(.45)",
                  }}
                />
              </span>

              <span className="relative min-w-0 flex-1 text-[14.6px] font-[510] leading-tight tracking-[-0.006em] sm:text-[15px]">
                {labels[index]}
              </span>

              <span
                className="relative grid size-[19px] shrink-0 place-items-center rounded-full border text-[9.5px] font-semibold tabular-nums transition-[opacity,border-color,background,color,transform] duration-75"
                style={{
                  background: active ? "rgba(255,255,255,.66)" : "rgba(255,255,255,.22)",
                  borderColor: active ? tone.activeBorder : "rgba(130,140,155,.18)",
                  color: active ? tone.text : "rgba(91,101,116,.22)",
                  opacity: active ? 0.82 : 0.36,
                  transform: pressing ? "translateY(1px) scale(.96)" : "translateY(0) scale(1)",
                }}
                aria-hidden="true"
              >
                {itemValue}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 px-3 text-center text-[10.8px] leading-snug text-muted-foreground sm:mt-2.5">
        {getHelper(session)}
      </p>
    </div>
  );
}
