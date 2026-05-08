"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

interface Entry {
  word: string;
  meaning: string;
  pos: string;
  example: string;
  synonyms: string[];
  extra: string;
  section: string;
}

interface Props {
  data: {
    meta: {
      title: string;
      total: number;
      sections: Record<string, number>;
    };
    entries: Entry[];
  };
}

const PAGE_SIZE = 200;

export function VocabularyView({ data }: Props) {
  const [query, setQuery] = useState("");
  const [activeSections, setActiveSections] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(query);

  const sectionList = useMemo(
    () =>
      Object.entries(data.meta.sections).sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
      ),
    [data.meta.sections]
  );

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return data.entries.filter((e) => {
      if (activeSections.size > 0 && !activeSections.has(e.section)) return false;
      if (!q) return true;
      const hay =
        e.word + " " + e.meaning + " " + e.example + " " +
        (e.synonyms || []).join(" ") + " " + e.extra;
      return hay.toLowerCase().includes(q);
    });
  }, [data.entries, deferredQuery, activeSections]);

  const slice = filtered.slice(0, visible);

  const toggleSection = (name: string) => {
    setActiveSections((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
    setVisible(PAGE_SIZE);
  };

  const clearSections = () => {
    setActiveSections(new Set());
    setVisible(PAGE_SIZE);
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vocabulary</h1>
          <p className="text-sm text-slate-500">
            {data.meta.total.toLocaleString()} entries across {sectionList.length} sections.
            Search any word, meaning, example, or synonym.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← Home
        </Link>
      </header>

      <section className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:p-4 sm:shadow-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Search word, meaning, example, synonym..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={clearSections}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeSections.size === 0
                ? "bg-brand-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            All <span className="opacity-70">{data.meta.total}</span>
          </button>
          {sectionList.map(([name, count]) => {
            const on = activeSections.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleSection(name)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  on
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {name} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <p className="-mt-2 text-xs text-slate-500">
        {filtered.length.toLocaleString()} match
        {filtered.length === 1 ? "" : "es"}
        {deferredQuery ? ` for "${deferredQuery}"` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No matches.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {slice.map((e, i) => (
            <EntryCard key={i} entry={e} q={deferredQuery} />
          ))}

          {filtered.length > slice.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-2 self-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 shadow-sm transition hover:bg-slate-50"
            >
              Show {Math.min(PAGE_SIZE, filtered.length - slice.length)} more
              <span className="text-slate-400"> · {filtered.length - slice.length} hidden</span>
            </button>
          )}
        </div>
      )}
    </main>
  );
}

function EntryCard({ entry, q }: { entry: Entry; q: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-lg font-bold text-slate-900">
            <Highlight text={entry.word} q={q} />
          </h3>
          {entry.pos && (
            <span className="text-xs italic text-slate-500">{entry.pos}</span>
          )}
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
          {entry.section}
        </span>
      </div>

      {entry.meaning && (
        <p className="mt-1.5 text-sm text-slate-700">
          <Highlight text={entry.meaning} q={q} />
        </p>
      )}

      {entry.example && (
        <p className="mt-2 text-sm italic text-slate-500">
          “<Highlight text={entry.example} q={q} />”
        </p>
      )}

      {entry.synonyms && entry.synonyms.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold">syn:</span>{" "}
          <Highlight text={entry.synonyms.join(", ")} q={q} />
        </p>
      )}

      {entry.extra && (
        <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
          {entry.extra}
        </p>
      )}
    </article>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const trimmed = q.trim();
  if (!trimmed) return <>{text}</>;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={i} className="rounded bg-yellow-200 px-0.5 text-slate-900">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
