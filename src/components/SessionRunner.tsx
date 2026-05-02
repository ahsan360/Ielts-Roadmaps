"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ModeDefinition } from "@/lib/modes/types";
import type { Word } from "@/lib/words";
import { shuffle } from "@/lib/words";
import { useSession } from "@/hooks/useSession";
import { AnswerInput } from "./AnswerInput";
import { FeedbackBanner } from "./FeedbackBanner";
import { Stats } from "./Stats";
import { Results } from "./Results";

interface Props {
  mode: ModeDefinition;
  words: Word[];
}

export function SessionRunner({ mode, words: rawWords }: Props) {
  const [ready, setReady] = useState(!mode.prepareWords);
  const [words, setWords] = useState<Word[]>(() =>
    mode.prepareWords ? [] : shuffle(rawWords)
  );

  useEffect(() => {
    if (mode.prepareWords) {
      setWords(shuffle(mode.prepareWords(rawWords)));
      setReady(true);
    } else {
      setWords(shuffle(rawWords));
      setReady(true);
    }
  }, [mode, rawWords]);

  const session = useSession(words);

  if (!ready) {
    return <div className="text-slate-500">Loading…</div>;
  }

  if (words.length === 0) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-lg text-slate-700">
          No words to practice yet. Try a different category
          {mode.id === "review" ? " or finish a session first" : ""}.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (session.finished) {
    return (
      <Results
        correct={session.correct}
        total={session.total}
        onRestart={() => setWords((w) => shuffle(w))}
      />
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <Stats
        index={session.index}
        total={session.total}
        correct={session.correct}
        incorrect={session.incorrect}
      />
      <div className="flex min-h-[180px] w-full items-center justify-center rounded-2xl bg-white p-8 shadow-lg">
        <mode.Prompt word={session.current} />
      </div>
      {mode.Controls && <mode.Controls word={session.current} />}
      <AnswerInput
        onSubmit={(a) => session.submit(a)}
        disabled={!!session.lastResult}
        autoFocus={mode.autoFocus !== false}
        resetSignal={session.index}
      />
      {session.lastResult && (
        <FeedbackBanner result={session.lastResult} onNext={session.next} />
      )}
    </div>
  );
}
