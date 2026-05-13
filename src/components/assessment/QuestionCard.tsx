import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text?: string;
  situation?: string;
  prompt?: string;
  patternArea?: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, situation, prompt, patternArea, children }: Props) {
  const helper = prompt ?? "Pilih respons yang paling mungkin kamu lakukan secara alami.";

  return (
    <section
      className="rounded-[18px] border border-white/70 bg-white/88 px-3.5 py-3.5 shadow-[0_14px_34px_rgba(39,45,58,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:px-4 sm:py-4"
      aria-labelledby={`question-${number}`}
      aria-label={`Pertanyaan ${number} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-primary/68">
          {patternArea ?? "Pertanyaan"}
        </span>
        <span className="shrink-0 rounded-full border border-primary/10 bg-primary/[0.045] px-2.5 py-1 text-[10px] font-semibold leading-none text-primary/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] tabular-nums">
          {number}/{total}
        </span>
      </div>

      {situation ? (
        <div key={number} className="question-text-enter mt-2.5">
          <p
            id={`question-${number}`}
            className="text-[1.03rem] font-semibold leading-[1.42] tracking-[-0.008em] text-foreground sm:text-[1.12rem]"
          >
            {situation}
          </p>
          <p className="mt-2.5 text-[0.82rem] font-medium leading-relaxed text-muted-foreground">
            {helper}
          </p>
        </div>
      ) : (
        <h2
          key={number}
          id={`question-${number}`}
          className="question-text-enter mt-2.5 min-h-[3.8rem] text-[1.05rem] font-semibold leading-[1.4] tracking-[-0.008em] text-foreground sm:text-[1.14rem]"
        >
          {text}
        </h2>
      )}

      <div className="mt-3.5 sm:mt-4">{children}</div>
    </section>
  );
}
