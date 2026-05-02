"use client";

import { useCallback, useEffect, useState } from "react";
import { speak as speakFn, preloadVoices, type Accent } from "@/lib/speech";

const ACCENT_KEY = "ielts-vocab-accent";
const RATE_KEY = "ielts-vocab-rate";

export function useSpeech() {
  const [accent, setAccentState] = useState<Accent>("UK");
  const [rate, setRateState] = useState(1);

  useEffect(() => {
    void preloadVoices();
    const savedAccent = window.localStorage.getItem(ACCENT_KEY) as Accent | null;
    const savedRate = window.localStorage.getItem(RATE_KEY);
    if (savedAccent) setAccentState(savedAccent);
    if (savedRate) setRateState(Number(savedRate));
  }, []);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    window.localStorage.setItem(ACCENT_KEY, a);
  }, []);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    window.localStorage.setItem(RATE_KEY, String(r));
  }, []);

  const speak = useCallback(
    (text: string) => speakFn(text, { accent, rate }),
    [accent, rate]
  );

  return { speak, accent, setAccent, rate, setRate };
}
