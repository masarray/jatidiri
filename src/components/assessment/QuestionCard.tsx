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
      className="rounded-[18px] border border-white/75 bg-white/90 px-3.5 py-3.5 antialiased shadow-[0_14px_34px_rgba(39,45,58,0.065),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl sm:px-4 sm:py-4"
      aria-labelledby={`question-${number}`}
      aria-label={`Pertanyaan ${number} dari ${total}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#7a9d94]">
          {patternArea ?? "Pertanyaan"}
        </span>
        <span className="shrink-0 rounded-full border border-[#d6e4dd] bg-[#f8fcf9] px-2.5 py-1 text-[9.5px] font-medium leading-none text-[#5f8f82] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] tabular-nums">
          {number}/{total}
        </span>
      </div>

      {situation ? (
        <div key={number} className="question-text-enter mt-2.5">
          <p
            id={`question-${number}`}
            className="text-[1.015rem] font-[650] leading-[1.54] tracking-[-0.008em] text-[#22303a] sm:text-[1.07rem]"
          >
            {situation}
          </p>
          <p className="mt-2.5 text-[0.81rem] font-normal leading-[1.55] tracking-[0.002em] text-[#70808a]">
            {helper}
          </p>
        </div>
      ) : (
        <h2
          key={number}
          id={`question-${number}`}
          className="question-text-enter mt-2.5 min-h-[3.8rem] text-[1.02rem] font-[650] leading-[1.53] tracking-[-0.008em] text-[#22303a] sm:text-[1.08rem]"
        >
          {text}
        </h2>
      )}

      <div className="mt-3.5 sm:mt-4">{children}</div>
    </section>
  );
}
