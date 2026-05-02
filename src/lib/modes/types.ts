import type { ComponentType } from "react";
import type { Word } from "@/lib/words";

export interface PromptProps {
  word: Word;
}

export interface ControlsProps {
  word: Word;
}

export interface ModeDefinition {
  id: string;
  name: string;
  description: string;
  href: string;
  emoji?: string;
  Prompt: ComponentType<PromptProps>;
  Controls?: ComponentType<ControlsProps>;
  prepareWords?: (words: Word[]) => Word[];
  autoFocus?: boolean;
}
