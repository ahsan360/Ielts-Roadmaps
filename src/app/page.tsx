"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryPicker } from "@/components/CategoryPicker";
import { ModeCard } from "@/components/ModeCard";
import { getCategories } from "@/lib/words";
import { modes } from "@/lib/modes/registry";
import { useStats } from "@/hooks/useStats";
import { clearStats } from "@/lib/storage";

export default function HomePage() {
  const categories = getCategories();
  const [selected, setSelected] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);
  const { overall, missedCount, nextReset } = useStats(refresh);

  useEffect(() => {
    const saved = window.localStorage.getItem("ielts-vocab-selected");
    if (saved) {
      try {
        setSelected(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ielts-vocab-selected", JSON.stringify(selected));
  }, [selected]);

  const query = selected.length > 0 ? `cats=${selected.join(",")}` : "";

  const handleClear = () => {
    if (confirm("Clear all stats and missed-word history?")) {
      clearStats();
      setRefresh((r) => r + 1);
    }
  };

  return (
    <main className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          IELTS Listening Vocabulary
        </h1>
        <p className="max-w-xl text-slate-600">
          Drill 896 common IELTS Listening words across 34 categories. Type them, hear them, and review the ones you miss.
        </p>
      </header>

      {overall.seen > 0 && (
        <section className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
            <span>
              <span className="font-semibold text-slate-900">{overall.pct}%</span>{" "}
              <span className="text-slate-500">overall accuracy</span>
            </span>
            <span>
              <span className="font-semibold text-slate-900">{overall.seen}</span>{" "}
              <span className="text-slate-500">attempts</span>
            </span>
            <span>
              <span className="font-semibold text-slate-900">{missedCount}</span>{" "}
              <span className="text-slate-500">missed words</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm sm:justify-end">
            {nextReset && (
              <span className="text-slate-500">
                Auto-resets in {Math.max(1, Math.ceil((nextReset - Date.now()) / 86400000))}d
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-slate-500 hover:text-red-600 hover:underline"
            >
              Reset now
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow">
        <CategoryPicker categories={categories} value={selected} onChange={setSelected} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((m) => (
          <ModeCard key={m.id} mode={m} query={query} />
        ))}
      </section>

      <footer className="mt-auto pt-8 text-center text-sm text-slate-500">
        <p>
          Built for IELTS prep by Ahsan Habib, Software Engineer at Appify Lab.
        </p>
        <Link href="https://www.linkedin.com/in/ahsan-habib-u/" className="hover:underline">
          LinkedIn
        </Link>
      </footer>
    </main>
  );
}
