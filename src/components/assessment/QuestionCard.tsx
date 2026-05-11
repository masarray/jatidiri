import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, children }: Props) {
  return (
    <div key={number} className="question-card rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary/70">
        Pertanyaan {number} dari {total}
      </div>
      <h2 className="mt-3 min-h-[6rem] text-lg font-semibold leading-snug text-foreground sm:text-xl">
        {text}
      </h2>
      <div className="mt-8">{children}</div>
    </div>
  );
}
