"use client";

import { useEffect } from "react";
import type { ModeDefinition, PromptProps, ControlsProps } from "./types";
import { useSpeech } from "@/hooks/useSpeech";

function TestPrompt({ word }: PromptProps) {
  const { speak } = useSpeech();
  useEffect(() => {
    speak(word.text);
  }, [word.text, speak]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs uppercase tracking-wide text-slate-500">Listen carefully</span>
      <div className="text-7xl">🔊</div>
      <p className="text-sm text-slate-500">Type what you hear</p>
    </div>
  );
}

function TestControls({ word }: ControlsProps) {
  const { speak, accent, setAccent, rate, setRate } = useSpeech();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <button
        onClick={() => speak(word.text)}
        className="rounded-md bg-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-300"
      >
        🔁 Replay
      </button>
      <label className="flex items-center gap-1.5">
        Accent
        <select
          value={accent}
          onChange={(e) => setAccent(e.target.value as typeof accent)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1"
        >
          <option value="UK">UK</option>
          <option value="US">US</option>
          <option value="AU">AU</option>
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        Speed
        <select
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="rounded-md border border-slate-300 bg-white px-2 py-1"
        >
          <option value={0.7}>Slow</option>
          <option value={1}>Normal</option>
          <option value={1.3}>Fast</option>
        </select>
      </label>
    </div>
  );
}

export const testMode: ModeDefinition = {
  id: "test",
  name: "Listen & Type",
  description: "Hear a word in UK / US / AU accent, type it. IELTS-style.",
  href: "/test",
  emoji: "🎧",
  Prompt: TestPrompt,
  Controls: TestControls,
  autoFocus: true,
};
