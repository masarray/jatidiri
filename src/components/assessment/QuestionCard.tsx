import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, children }: Props) {
  return (
    <section className="question-card calm-question-card" aria-labelledby={`question-${number}`}>
      <div className="calm-question-meta">
        <span>Pertanyaan</span>
        <span className="tabular-nums">{number} / {total}</span>
      </div>

      <h2 id={`question-${number}`} className="calm-question-text">
        {text}
      </h2>

      <div className="calm-question-answer-area">{children}</div>
    </section>
  );
}
