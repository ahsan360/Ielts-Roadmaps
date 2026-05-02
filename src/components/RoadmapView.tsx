"use client";

import { useEffect, useMemo, useState } from "react";
import type { RoadmapData } from "@/data/roadmaps";

interface Props {
  slug: string;
  data: RoadmapData;
}

const TAG_STYLES: Record<string, string> = {
  // Cloud roadmap
  theory: "bg-violet-100 text-violet-700",
  handson: "bg-sky-100 text-sky-700",
  project: "bg-orange-100 text-orange-700",
  review: "bg-emerald-100 text-emerald-700",
  design: "bg-pink-100 text-pink-700",
  // Grammar roadmap
  concept: "bg-violet-100 text-violet-700",
  drill: "bg-sky-100 text-sky-700",
  writing: "bg-orange-100 text-orange-700",
  speaking: "bg-pink-100 text-pink-700",
};

const STAT_BAR_COLORS: Record<string, string> = {
  theory: "text-violet-600",
  handson: "text-sky-600",
  project: "text-orange-600",
  concept: "text-violet-600",
  drill: "text-sky-600",
  writing: "text-orange-600",
  speaking: "text-pink-600",
};

export function RoadmapView({ slug, data }: Props) {
  const storageKey = `roadmap:completed:${slug}`;
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [activeWeek, setActiveWeek] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggleComplete = (day: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleExpanded = (day: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(data.statLabels).forEach((k) => (counts[k] = 0));
    data.weeks.forEach((w) =>
      w.days.forEach((d) => {
        if (!completed.has(d.day)) return;
        d.tags.forEach((t) => {
          if (t in counts) counts[t] += 1;
        });
      })
    );
    return counts;
  }, [completed, data]);

  const done = completed.size;
  const pct = data.totalDays === 0 ? 0 : (done / data.totalDays) * 100;

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{data.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{data.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-slate-500">
            {done} / {data.totalDays} days completed ({pct.toFixed(1)}%)
          </p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(data.statLabels).map(([key, label]) => (
            <span
              key={key}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {label}:{" "}
              <span className={`font-bold ${STAT_BAR_COLORS[key] ?? "text-slate-900"}`}>
                {stats[key] ?? 0}
              </span>
            </span>
          ))}
        </div>
      </header>

      <nav className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {data.weeks.map((w, i) => (
          <button
            key={i}
            onClick={() => setActiveWeek(i)}
            className={`flex-1 min-w-[72px] rounded-lg px-2 py-2 text-xs font-semibold transition ${
              activeWeek === i
                ? "bg-brand-600 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            WK {i + 1}
          </button>
        ))}
      </nav>

      <section className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">{data.weeks[activeWeek].title}</h2>
          <p
            className="mt-1 text-sm leading-relaxed text-slate-600 [&_em]:font-semibold [&_em]:not-italic [&_em]:text-violet-600"
            dangerouslySetInnerHTML={{ __html: data.weeks[activeWeek].goal }}
          />
        </div>

        <div className="flex flex-col gap-3">
          {data.weeks[activeWeek].days.map((day) => {
            const isCompleted = completed.has(day.day);
            const isExpanded = expanded.has(day.day);
            return (
              <article
                key={day.day}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                  isCompleted ? "border-emerald-200" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className="flex cursor-pointer items-center gap-3 p-4 select-none"
                  onClick={() => toggleExpanded(day.day)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(day.day);
                    }}
                    aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white hover:border-emerald-400"
                    }`}
                  >
                    {isCompleted ? "✓" : ""}
                  </button>

                  <span className="hidden min-w-[52px] text-xs font-bold text-slate-400 sm:inline">
                    Day {day.day}
                  </span>

                  <h3
                    className={`flex-1 text-sm font-semibold sm:text-base ${
                      isCompleted ? "text-slate-500 line-through" : "text-slate-900"
                    }`}
                  >
                    {day.title}
                  </h3>

                  <div className="hidden items-center gap-1 sm:flex">
                    {day.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          TAG_STYLES[t] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span
                    className={`text-slate-400 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-4 sm:px-6 sm:pl-16">
                    <div className="flex flex-wrap gap-1 pb-3 sm:hidden">
                      {day.tags.map((t) => (
                        <span
                          key={t}
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            TAG_STYLES[t] ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      {day.blocks.map((b, i) => (
                        <div key={i}>
                          <div className="text-xs font-bold uppercase tracking-wide text-amber-600">
                            {b.time}
                          </div>
                          <p
                            className="mt-1 text-sm leading-relaxed text-slate-700 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_em]:font-medium [&_em]:not-italic [&_em]:text-violet-700 [&_.resource]:rounded [&_.resource]:bg-slate-200 [&_.resource]:px-1.5 [&_.resource]:py-0.5 [&_.resource]:font-mono [&_.resource]:text-[0.8em] [&_.resource]:text-sky-700"
                            dangerouslySetInnerHTML={{ __html: b.content }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <span className="font-bold">✓ Deliverable: </span>
                      {day.deliverable}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
