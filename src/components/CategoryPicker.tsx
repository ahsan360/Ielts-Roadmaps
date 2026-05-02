"use client";

import { useState } from "react";
import type { Category } from "@/lib/words";

interface Props {
  categories: Category[];
  value: string[];
  onChange: (ids: string[]) => void;
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

  const selectAll = () => onChange(categories.map((c) => c.id));
  const clear = () => onChange([]);

  const visible = expanded ? categories : categories.slice(0, 12);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          Categories {value.length > 0 ? `(${value.length})` : "(All)"}
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
      <div className="flex flex-wrap gap-2">
        {visible.map((cat) => {
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
