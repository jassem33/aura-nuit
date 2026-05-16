"use client";

import { useState } from "react";

export type QuestionFaq = {
  question: string;
  reponse: string;
};

export function FaqGroup({
  titre,
  questions,
}: {
  titre: string;
  questions: QuestionFaq[];
}) {
  const [ouvert, setOuvert] = useState<number | null>(0);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-lg md:text-xl text-charbon">{titre}</h2>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondaire/15 text-secondaire text-[10px] font-medium">
          {questions.length}
        </span>
      </div>
      <ul className="divide-y divide-charbon/10 border-y border-charbon/10">
        {questions.map((q, i) => {
          const isOpen = ouvert === i;
          return (
            <li key={q.question}>
              <button
                type="button"
                onClick={() => setOuvert(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-3 text-left hover:text-secondaire transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-xs md:text-sm text-charbon font-medium">
                  {q.question}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full border border-charbon/20 text-charbon/70 text-sm transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen && (
                <p className="pb-4 pr-10 text-[12px] md:text-[13px] text-charbon/70 leading-relaxed">
                  {q.reponse}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
