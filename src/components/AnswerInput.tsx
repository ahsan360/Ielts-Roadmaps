"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  resetSignal?: number;
}

export function AnswerInput({ onSubmit, disabled, autoFocus = true, resetSignal = 0 }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    if (autoFocus) inputRef.current?.focus();
  }, [resetSignal, autoFocus]);

  useEffect(() => {
    if (!disabled && autoFocus) inputRef.current?.focus();
  }, [disabled, autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || value.trim() === "") return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="Type the word…"
        className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-brand-500 disabled:bg-slate-100"
      />
      <button
        type="submit"
        disabled={disabled || value.trim() === ""}
        className="rounded-lg bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Check (Enter)
      </button>
    </form>
  );
}
