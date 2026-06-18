"use client";

import { useState } from "react";
import type { Category } from "@/lib/words";
import { getCategoryChunks } from "@/lib/words";

const CHUNK_THRESHOLD = 20;

interface Props {
  categories: Category[];
  value: string[];
  onChange: (ids: string[]) => void;
}

function allIdsFor(categories: Category[]): string[] {
  return categories.flatMap((cat) =>
    cat.count >= CHUNK_THRESHOLD
      ? getCategoryChunks(cat).map((c) => c.id)
      : [cat.id]
  );
}

export function CategoryPicker({ categories, value, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const selected = new Set(value);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const toggleChunkGroup = (chunks: Category[]) => {
    const chunkIds = chunks.map((c) => c.id);
    const allOn = chunkIds.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allOn) chunkIds.forEach((id) => next.delete(id));
    else chunkIds.forEach((id) => next.add(id));
    onChange(Array.from(next));
  };

  const selectAll = () => onChange(allIdsFor(categories));
  const clear = () => onChange([]);

  const visible = expanded ? categories : categories.slice(0, 12);

  const selectedCount = value.length;
  const totalIds = allIdsFor(categories).length;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          Categories{" "}
          {selectedCount === 0 || selectedCount === totalIds
            ? "(All)"
            : `(${selectedCount} chunks)`}
        </span>
        <div className="flex gap-2 text-brand-600">
          <button onClick={selectAll} className="hover:underline">
            All
          </button>
          <span className="text-slate-300">|</span>
          <button onClick={clear} className="hover:underline">
            None
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {visible.map((cat) => {
          if (cat.count >= CHUNK_THRESHOLD) {
            const chunks = getCategoryChunks(cat);
            const allOn = chunks.every((c) => selected.has(c.id));
            const someOn = chunks.some((c) => selected.has(c.id));
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleChunkGroup(chunks)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      allOn
                        ? "border-brand-500 bg-brand-500 text-white"
                        : someOn
                        ? "border-brand-300 bg-brand-50 text-brand-700"
                        : "border-slate-300 bg-slate-50 text-slate-500 hover:border-brand-300"
                    }`}
                  >
                    {cat.name}{" "}
                    <span className="opacity-60">({cat.count})</span>
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {chunks.map((chunk) => {
                      const on = selected.has(chunk.id);
                      return (
                        <button
                          key={chunk.id}
                          onClick={() => toggle(chunk.id)}
                          className={`rounded-full border px-2.5 py-1 text-xs transition ${
                            on
                              ? "border-brand-500 bg-brand-500 text-white"
                              : "border-slate-300 bg-white text-slate-600 hover:border-brand-300"
                          }`}
                        >
                          {chunk.name.replace(cat.name + " ", "")}
                          <span className="ml-1 opacity-50">
                            ({chunk.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const on = selected.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                on
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-300"
              }`}
            >
              {cat.name} <span className="opacity-60">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {categories.length > 12 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          {expanded ? "Show less" : `Show all ${categories.length} categories`}
        </button>
      )}
    </div>
  );
}
