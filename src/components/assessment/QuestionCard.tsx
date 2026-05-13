import type { ReactNode } from "react";
import type { QuestionChoice, QuestionFormat } from "@/types/assessment";

interface Props {
  number: number;
  total: number;
  text: string;
  format?: QuestionFormat;
  choiceA?: QuestionChoice;
  choiceB?: QuestionChoice;
  children: ReactNode;
}

function ChoiceBox({ label, choice }: { label: "A" | "B"; choice: QuestionChoice }) {
  return (
    <div className="rounded-[17px] border border-slate-200/80 bg-slate-50/80 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
      <div className="mb-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-primary shadow-sm">
        {label}
      </div>
      <p className="text-[14.2px] font-semibold leading-snug text-slate-700 sm:text-[15px]">
        {choice.text}
      </p>
    </div>
  );
}

export function QuestionCard({ number, total, text, format = "scale", choiceA, choiceB, children }: Props) {
  const isChoicePair = format === "choice_pair" && choiceA && choiceB;

  return (
    <section
      className="rounded-[22px] border border-white/75 bg-white/88 px-4 py-4 shadow-[0_20px_52px_rgba(39,45,58,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl sm:px-5 sm:py-5"
      aria-labelledby={`question-${number}`}
      aria-label={`Pertanyaan ${number} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
          {isChoicePair ? "Trade-off" : "Pertanyaan"}
        </span>
        <span className="rounded-full border border-primary/10 bg-primary/[0.055] px-2.5 py-1 text-[11px] font-semibold leading-none text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] tabular-nums">
          {number}/{total}
        </span>
      </div>

      <h2
        key={number}
        id={`question-${number}`}
        className="question-text-enter mt-3 min-h-[3.8rem] text-[1.16rem] font-semibold leading-[1.42] tracking-[-0.01em] text-foreground sm:text-[1.24rem]"
      >
        {text}
      </h2>

      {isChoicePair ? (
        <div className="mt-3 grid gap-2.5">
          <ChoiceBox label="A" choice={choiceA} />
          <ChoiceBox label="B" choice={choiceB} />
        </div>
      ) : null}

      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}
