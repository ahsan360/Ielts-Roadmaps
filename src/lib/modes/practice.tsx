import type { ModeDefinition, PromptProps } from "./types";

function PracticePrompt({ word }: PromptProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-slate-500">{word.categoryName}</span>
      <h1 className="text-5xl font-bold text-slate-900 sm:text-6xl">{word.text}</h1>
    </div>
  );
}

export const practiceMode: ModeDefinition = {
  id: "practice",
  name: "Type Practice",
  description: "See the word, type it. Build muscle memory and spelling.",
  href: "/practice",
  emoji: "⌨️",
  Prompt: PracticePrompt,
  autoFocus: true,
};
