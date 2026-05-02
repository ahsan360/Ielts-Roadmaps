"use client";

import { useCallback, useEffect, useState } from "react";
import type { Word } from "@/lib/words";
import { strictChecker, type CheckResult, type Checker } from "@/lib/checker";
import { recordResult } from "@/lib/storage";

export function useSession(words: Word[], checker: Checker = strictChecker) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    setIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setLastResult(null);
  }, [words]);

  const submit = useCallback(
    (answer: string): CheckResult => {
      const word = words[index];
      const result = checker(answer, word.text);
      recordResult(word.text, result.correct);
      if (result.correct) setCorrect((c) => c + 1);
      else setIncorrect((i) => i + 1);
      setLastResult(result);
      return result;
    },
    [words, index, checker]
  );

  const next = useCallback(() => {
    setLastResult(null);
    setIndex((i) => i + 1);
  }, []);

  return {
    current: words[index],
    index,
    total: words.length,
    correct,
    incorrect,
    finished: index >= words.length,
    lastResult,
    submit,
    next,
  };
}
