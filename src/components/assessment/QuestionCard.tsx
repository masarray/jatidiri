import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, children }: Props) {
  return (
    <div key={number} className="question-card compact-question-card rounded-[1.65rem] border border-border/60 bg-card p-4 shadow-sm sm:p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
        Pertanyaan {number} dari {total}
      </div>
      <h2 className="mt-2 min-h-[4.2rem] text-[1.22rem] font-semibold leading-snug text-foreground sm:text-xl">
        {text}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
