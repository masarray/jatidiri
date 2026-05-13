import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ANSWER_VALUES, type AnswerValue, type AssessmentSession } from "@/types/assessment";

interface Props {
  value?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  leftLabel?: string;
  rightLabel?: string;
  session?: AssessmentSession;
  disabled?: boolean;
}

const NATURAL_LABELS = [
  "Tidak menggambarkan saya",
  "Kurang menggambarkan saya",
  "Muncul dalam kondisi tertentu",
  "Cukup menggambarkan saya",
  "Sangat menggambarkan saya",
];

const STRENGTH_LABELS = [
  "Belum mampu",
  "Masih sulit",
  "Cukup mampu",
  "Mampu dengan baik",
  "Kemampuan utama saya",
];

const VALUES = ANSWER_VALUES;

type Tone = {
  text: string;
  textActive: string;
  idleBg: string;
  hoverBg: string;
  activeBg: string;
  idleBorder: string;
  hoverBorder: string;
  activeBorder: string;
  idleEdge: string;
  hoverEdge: string;
  activeEdge: string;
  glow: string;
  rail: string;
  sheen: string;
};

// V7: premium full-card choice buttons, refactored to a 5-point mobile scale.
// No radio circles, no number badges. The whole card is the answer target.
// Each level has a soft surface color so the scale is readable without tiring the eyes.
const TONES: Record<AnswerValue, Tone> = {
  1: {
    text: "#263648",
    textActive: "#17283c",
    idleBg: "linear-gradient(180deg,#fbfdff 0%,#f3f8fe 100%)",
    hoverBg: "linear-gradient(180deg,#f5fbff 0%,#e9f3fc 100%)",
    activeBg: "linear-gradient(180deg,#eaf5ff 0%,#d8eafe 100%)",
    idleBorder: "#d2deeb",
    hoverBorder: "#aec6dd",
    activeBorder: "#7ea6ca",
    idleEdge: "#c3ceda",
    hoverEdge: "#aab9ca",
    activeEdge: "#7193b5",
    glow: "rgba(90,126,162,.16)",
    rail: "linear-gradient(180deg,#8db4d7,#6387aa)",
    sheen: "rgba(116,162,205,.10)",
  },
  2: {
    text: "#2d3947",
    textActive: "#202e3c",
    idleBg: "linear-gradient(180deg,#fcfdfe 0%,#f4f7fb 100%)",
    hoverBg: "linear-gradient(180deg,#f8fbfe 0%,#edf3f8 100%)",
    activeBg: "linear-gradient(180deg,#eef5fb 0%,#e2ebf4 100%)",
    idleBorder: "#d7dee7",
    hoverBorder: "#bdc8d5",
    activeBorder: "#98aaba",
    idleEdge: "#c8d0da",
    hoverEdge: "#b4beca",
    activeEdge: "#8797a7",
    glow: "rgba(117,132,151,.14)",
    rail: "linear-gradient(180deg,#a6b3c1,#758497)",
    sheen: "rgba(117,132,151,.085)",
  },
  3: {
    text: "#3a3546",
    textActive: "#2e2939",
    idleBg: "linear-gradient(180deg,#fffefe 0%,#f8f4f9 100%)",
    hoverBg: "linear-gradient(180deg,#fef9ff 0%,#f2ebf6 100%)",
    activeBg: "linear-gradient(180deg,#fbf2fd 0%,#eee2f3 100%)",
    idleBorder: "#dfd4e2",
    hoverBorder: "#cdb9d4",
    activeBorder: "#ac90b8",
    idleEdge: "#d0c2d5",
    hoverEdge: "#bea9c6",
    activeEdge: "#92769d",
    glow: "rgba(128,103,139,.15)",
    rail: "linear-gradient(180deg,#b49ac0,#80678b)",
    sheen: "rgba(128,103,139,.09)",
  },
  4: {
    text: "#3c4350",
    textActive: "#303846",
    idleBg: "linear-gradient(180deg,#fffdf9 0%,#f8f2e8 100%)",
    hoverBg: "linear-gradient(180deg,#fffaf1 0%,#f3eadb 100%)",
    activeBg: "linear-gradient(180deg,#fff5e6 0%,#efdfc2 100%)",
    idleBorder: "#e3d6c3",
    hoverBorder: "#d1bd9b",
    activeBorder: "#c19b5a",
    idleEdge: "#d0bfaa",
    hoverEdge: "#bca786",
    activeEdge: "#9e7a42",
    glow: "rgba(165,124,60,.15)",
    rail: "linear-gradient(180deg,#c9a568,#aa813d)",
    sheen: "rgba(170,129,61,.09)",
  },
  5: {
    text: "#642b25",
    textActive: "#501a16",
    idleBg: "linear-gradient(180deg,#fffdfb 0%,#ffeeeb 100%)",
    hoverBg: "linear-gradient(180deg,#fff3f0 0%,#ffded8 100%)",
    activeBg: "linear-gradient(180deg,#ffe5df 0%,#ffc6bc 100%)",
    idleBorder: "#edafa6",
    hoverBorder: "#e58c82",
    activeBorder: "#d96457",
    idleEdge: "#d97f75",
    hoverEdge: "#cd6258",
    activeEdge: "#b64339",
    glow: "rgba(200,75,66,.19)",
    rail: "linear-gradient(180deg,#e56e65,#c84b42)",
    sheen: "rgba(200,75,66,.11)",
  },
};

function getLabels(session: AssessmentSession) {
  return session === "strength" ? STRENGTH_LABELS : NATURAL_LABELS;
}

function getScaleTitle(session: AssessmentSession) {
  return session === "strength" ? "Skala kemampuan nyata" : "Skala pola alami";
}

function getHelper(session: AssessmentSession) {
  return session === "strength"
    ? "Nilai kemampuan yang sudah terlihat dalam pengalaman nyata, bukan sekadar minat."
    : "Pilih yang paling menggambarkan gerak alami kamu, bukan jawaban yang terdengar paling baik.";
}

function hapticTap() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // optional haptic feedback
  }
}

function cardStyle(tone: Tone, active: boolean, pressing: boolean, hovering: boolean): CSSProperties {
  const background = active ? tone.activeBg : hovering ? tone.hoverBg : tone.idleBg;
  const border = active ? tone.activeBorder : hovering ? tone.hoverBorder : tone.idleBorder;
  const text = pressing || active ? tone.textActive : tone.text;

  return {
    color: text,
    background,
    borderColor: border,
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,.92)",
      active ? `0 0 0 1px ${tone.activeBorder}` : "0 0 0 1px rgba(255,255,255,.62)",
      `0 ${active || hovering ? 10 : 7}px ${active || hovering ? 24 : 16}px ${
        active || hovering ? tone.glow : "rgba(39,45,58,.045)"
      }`,
    ].join(", "),
    transform: pressing
      ? "translate3d(0,1px,0) scale(.992)"
      : hovering
        ? "translate3d(0,-1px,0) scale(1.002)"
        : "translate3d(0,0,0) scale(1)",
    transition:
      "transform 110ms cubic-bezier(.2,.9,.2,1), border-color 120ms ease-out, background 120ms ease-out, box-shadow 140ms ease-out, color 120ms ease-out",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    willChange: "transform",
  };
}

export function AnswerScale({ value, onSelect, session = "natural", disabled = false }: Props) {
  const labels = useMemo(() => getLabels(session), [session]);
  const [pressingValue, setPressingValue] = useState<AnswerValue | null>(null);
  const [hoverValue, setHoverValue] = useState<AnswerValue | null>(null);
  const [committingValue, setCommittingValue] = useState<AnswerValue | null>(null);
  const commitTimerRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
      if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
    };
  }, []);

  function releaseVisual(delay = 70) {
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
      releaseVisual(58);
    }, 96);
  }

  return (
    <div className="w-full select-none">
      <div className="mb-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/82">
        <span>{getScaleTitle(session)}</span>
      </div>

      <div className="grid gap-2">
        {VALUES.map((itemValue, index) => {
          const selected = value === itemValue;
          const pressing = pressingValue === itemValue || committingValue === itemValue;
          const hovering = hoverValue === itemValue;
          const active = selected || pressing;
          const tone = TONES[itemValue];

          return (
            <button
              key={itemValue}
              type="button"
              disabled={disabled || Boolean(committingValue)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" || event.pointerType === "pen") setHoverValue(itemValue);
              }}
              onPointerLeave={() => {
                setHoverValue((current) => (current === itemValue ? null : current));
                if (!committingValue) setPressingValue((current) => (current === itemValue ? null : current));
              }}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                event.preventDefault();
                commit(itemValue);
              }}
              onPointerCancel={() => {
                if (!committingValue) setPressingValue(null);
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
                "group relative flex min-h-[45px] w-full items-center overflow-hidden rounded-[16px] border px-4 py-2.5 text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              ].join(" ")}
              style={cardStyle(tone, active, pressing, hovering)}
            >
              <span
                className="pointer-events-none absolute inset-y-[10px] left-[9px] w-[3px] rounded-full transition-[opacity,transform] duration-100"
                style={{
                  background: tone.rail,
                  opacity: active || hovering ? 0.9 : 0.34,
                  transform: pressing ? "scaleY(.76)" : hovering || active ? "scaleY(1)" : "scaleY(.62)",
                }}
                aria-hidden="true"
              />

              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, ${tone.sheen} 0%, rgba(255,255,255,0) 54%)`,
                  opacity: active ? 1 : hovering ? 0.78 : 0,
                }}
                aria-hidden="true"
              />

              <span
                className="pointer-events-none absolute inset-x-4 top-px h-px rounded-full bg-white/80 transition-opacity duration-100"
                style={{ opacity: active || hovering ? 0.9 : 0.6 }}
                aria-hidden="true"
              />

              <span className="relative min-w-0 flex-1 pl-2.5 text-[14.2px] font-semibold leading-tight tracking-[-0.002em] sm:text-[15px]">
                {labels[index]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 px-3 text-center text-[10.7px] leading-snug text-muted-foreground sm:mt-3.5">
        {getHelper(session)}
      </p>
    </div>
  );
}
