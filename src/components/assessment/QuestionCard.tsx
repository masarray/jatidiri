import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, children }: Props) {
  return (
    <section
      className="rounded-[1.45rem] border border-border/65 bg-card/96 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.042),inset_0_1px_0_rgba(255,255,255,0.76)] sm:px-5 sm:py-5"
      aria-labelledby={`question-${number}`}
      aria-label={`Pertanyaan ${number} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">Pertanyaan</span>
        <span className="rounded-md border border-primary/13 bg-primary/[0.05] px-2.5 py-[5px] text-[12px] font-semibold leading-none text-primary shadow-[0_2px_8px_rgba(15,23,42,0.055),inset_0_1px_0_rgba(255,255,255,0.74)] tabular-nums">
          {number}
        </span>
      </div>

      <h2
        key={number}
        id={`question-${number}`}
        className="question-text-enter mt-3 min-h-[3.55rem] text-[1.08rem] font-semibold leading-[1.38] tracking-[-0.012em] text-foreground sm:text-[1.2rem]"
      >
        {text}
      </h2>

      <div className="mt-3.5 sm:mt-4">{children}</div>
    </section>
  );
}
