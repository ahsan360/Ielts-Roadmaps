"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SessionRunner } from "@/components/SessionRunner";
import { listenMode } from "@/lib/modes/listen";
import { filterByCategories, getAllWords } from "@/lib/words";

function ListenInner() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);

  const cats = useMemo(() => {
    const raw = searchParams.get("cats");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const words = useMemo(() => filterByCategories(getAllWords(), cats), [cats]);

  const handleStart = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
    setUnlocked(true);
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{listenMode.name}</h1>
          <p className="text-sm text-slate-500">{listenMode.description}</p>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← Home
        </Link>
      </div>
      {unlocked ? (
        <SessionRunner mode={listenMode} words={words} />
      ) : (
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-6xl">🔊</div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Audio required</h2>
            <p className="mt-1 text-sm text-slate-600">
              Each word will be spoken aloud as you go. Tap below to enable audio (required on iPhone).
            </p>
          </div>
          <button
            onClick={handleStart}
            className="w-full rounded-lg bg-brand-600 py-3 text-lg font-semibold text-white hover:bg-brand-700"
          >
            Tap to start
          </button>
        </div>
      )}
    </main>
  );
}

export default function ListenPage() {
  return (
    <Suspense fallback={<div className="text-slate-500">Loading…</div>}>
      <ListenInner />
    </Suspense>
  );
}
