"use client";

import { useEffect, useState } from "react";
import { getOverallAccuracy, getMissedWords, getNextResetTime } from "@/lib/storage";

export function useStats(refreshKey: number = 0) {
  const [overall, setOverall] = useState({ seen: 0, correct: 0, pct: 0 });
  const [missedCount, setMissedCount] = useState(0);
  const [nextReset, setNextReset] = useState<number | null>(null);

  useEffect(() => {
    setOverall(getOverallAccuracy());
    setMissedCount(getMissedWords().length);
    setNextReset(getNextResetTime());
  }, [refreshKey]);

  return { overall, missedCount, nextReset };
}
