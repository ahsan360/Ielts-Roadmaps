interface Props {
  index: number;
  total: number;
  correct: number;
  incorrect: number;
}

export function Stats({ index, total, correct, incorrect }: Props) {
  const seen = correct + incorrect;
  const pct = seen === 0 ? 0 : Math.round((correct / seen) * 100);
  const progress = total === 0 ? 0 : Math.round((index / total) * 100);

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>
          {index + 1} / {total}
        </span>
        <span>
          ✓ {correct} &nbsp; ✗ {incorrect} &nbsp; {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
