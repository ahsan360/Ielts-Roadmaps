"use client";

import { useState } from "react";
import type { GrammarReferenceData } from "@/data/grammar";

interface Props {
  data: GrammarReferenceData;
}

export function GrammarReferenceView({ data }: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(data.sections.map((s) => s.id))
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(data.sections.map((s) => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{data.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{data.subtitle}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{data.intro}</p>
      </header>

      <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Jump to section
          </h2>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Expand all
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={collapseAll}
              className="text-xs font-medium text-slate-500 hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {data.sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-brand-600"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {data.sections.map((section) => {
        const isOpen = openSections.has(section.id);
        return (
          <section
            key={section.id}
            id={section.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm scroll-mt-6"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition hover:bg-slate-50"
            >
              <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
              <span
                className={`text-slate-400 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-6 py-5">
                {section.summary && (
                  <p className="mb-5 text-sm leading-relaxed text-slate-600">
                    {section.summary}
                  </p>
                )}

                <div className="flex flex-col gap-5">
                  {section.rules.map((rule, i) => (
                    <RuleBlock key={i} rule={rule} />
                  ))}
                </div>

                {section.tip && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                    <span className="font-bold">💡 Band 7+ tip: </span>
                    {section.tip}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}

      {data.checklist && data.checklist.length > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-emerald-900">
            ✓ Band 7+ Self-Check
          </h2>
          <p className="mt-1 text-sm text-emerald-800">
            Tick mentally — every item should feel like an automatic 'yes'. Anything you
            hesitate on is a topic to drill.
          </p>
          <ul className="mt-4 space-y-2">
            {data.checklist.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-emerald-900">
                <span className="mt-0.5 flex-shrink-0 font-bold">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function RuleBlock({ rule }: { rule: import("@/data/grammar").GrammarRule }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{rule.pattern}</h3>

      {rule.examples && rule.examples.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {rule.examples.map((ex, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm">
              <span className="text-slate-700">{ex.singular}</span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold text-violet-700">{ex.plural}</span>
            </div>
          ))}
        </div>
      )}

      {rule.items && rule.items.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {rule.items.map((item, i) => (
            <li key={i} className="text-sm text-slate-700 before:mr-2 before:text-slate-400 before:content-['•']">
              {item}
            </li>
          ))}
        </ul>
      )}

      {rule.note && (
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-700">Note: </span>
          {rule.note}
        </p>
      )}
    </div>
  );
}
