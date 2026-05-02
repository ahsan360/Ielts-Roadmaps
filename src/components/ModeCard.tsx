"use client";

import Link from "next/link";
import type { ModeDefinition } from "@/lib/modes/types";

interface Props {
  mode: ModeDefinition;
  query: string;
}

export function ModeCard({ mode, query }: Props) {
  const href = query ? `${mode.href}?${query}` : mode.href;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="text-4xl">{mode.emoji ?? "•"}</div>
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600">
        {mode.name}
      </h3>
      <p className="text-sm text-slate-600">{mode.description}</p>
      <span className="mt-auto pt-2 text-sm font-medium text-brand-600">
        Start →
      </span>
    </Link>
  );
}
