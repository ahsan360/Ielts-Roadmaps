"use client";

import { useEffect, useRef } from "react";
import type { CheckResult } from "@/lib/checker";

interface Props {
  result: CheckResult;
  onNext: () => void;
}

export function FeedbackBanner({ result, onNext }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext]);

  return (
    <div
      className={`w-full max-w-md rounded-lg border-2 p-4 ${
        result.correct
          ? "border-green-300 bg-green-50 text-green-900"
          : "border-red-300 bg-red-50 text-red-900"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">
            {result.correct ? "✓ Correct" : "✗ Wrong"}
          </div>
          {!result.correct && (
            <div className="mt-1 text-sm">
              You typed: <span className="font-mono">{result.got}</span>
              <br />
              Answer: <span className="font-mono font-semibold">{result.expected}</span>
            </div>
          )}
        </div>
        <button
          ref={btnRef}
          onClick={onNext}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
