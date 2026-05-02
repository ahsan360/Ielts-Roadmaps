"use client";

import Link from "next/link";

interface Props {
  correct: number;
  total: number;
  onRestart: () => void;
}

export function Results({ correct, total, onRestart }: Props) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const message =
    pct >= 90 ? "Excellent!" : pct >= 70 ? "Good work." : pct >= 50 ? "Keep practicing." : "Don't give up.";

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-slate-900">Session complete</h2>
      <div className="text-center">
        <div className="text-6xl font-bold text-brand-600">{pct}%</div>
        <div className="mt-2 text-slate-600">
          {correct} correct out of {total}
        </div>
        <div className="mt-3 text-lg font-medium text-slate-700">{message}</div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <button
          onClick={onRestart}
          className="rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Practice again
        </button>
        <Link
          href="/"
          className="rounded-lg border-2 border-slate-300 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
