import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  number: number;
  total: number;
  text: string;
  children: ReactNode;
}

export function QuestionCard({ number, total, text, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={number}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-3xl bg-card shadow-sm border border-border/60 p-6 sm:p-8"
      >
        <div className="text-xs font-semibold tracking-wider uppercase text-primary/70">
          Pertanyaan {number} dari {total}
        </div>
        <h2 className="mt-3 text-lg sm:text-xl font-semibold leading-snug text-foreground min-h-[6rem]">
          {text}
        </h2>
        <div className="mt-8">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
