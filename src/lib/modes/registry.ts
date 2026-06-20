import type { ModeDefinition } from "./types";
import { practiceMode } from "./practice";
import { testMode } from "./test";
import { listenMode } from "./listen";
import { getMissedWords } from "@/lib/storage";
import type { Word } from "@/lib/words";

export const reviewMode: ModeDefinition = {
  ...practiceMode,
  id: "review",
  name: "Review Missed",
  description: "Drill only the words you got wrong in past sessions.",
  href: "/review",
  emoji: "🎯",
  prepareWords: (words: Word[]) => {
    const missed = new Set(getMissedWords());
    return words.filter((w) => missed.has(w.text));
  },
};

export const modes: ModeDefinition[] = [practiceMode, testMode, listenMode, reviewMode];

export function findMode(id: string): ModeDefinition | undefined {
  return modes.find((m) => m.id === id);
}
