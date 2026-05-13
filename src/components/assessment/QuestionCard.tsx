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
      className="rounded-[22px] border border-white/75 bg-white/88 px-4 py-4 shadow-[0_20px_52px_rgba(39,45,58,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl sm:px-5 sm:py-5"
      aria-labelledby={`question-${number}`}
      aria-label={`Pertanyaan ${number} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">Pertanyaan</span>
        <span className="rounded-full border border-primary/10 bg-primary/[0.055] px-2.5 py-1 text-[11px] font-semibold leading-none text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] tabular-nums">
          {number}/{total}
        </span>
      </div>

      <h2
        key={number}
        id={`question-${number}`}
        className="question-text-enter mt-3 min-h-[4.65rem] text-[1.18rem] font-semibold leading-[1.42] tracking-[-0.01em] text-foreground sm:text-[1.26rem]"
      >
        {text}
      </h2>

      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}
