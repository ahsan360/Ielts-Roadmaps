"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SessionRunner } from "@/components/SessionRunner";
import { practiceMode } from "@/lib/modes/practice";
import { filterByCategories, getAllWords } from "@/lib/words";

function PracticeInner() {
  const searchParams = useSearchParams();
  const cats = useMemo(() => {
    const raw = searchParams.get("cats");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const words = useMemo(() => filterByCategories(getAllWords(), cats), [cats]);

  return (
    <main className="flex flex-1 flex-col items-center gap-6">
      <PageHeader title={practiceMode.name} subtitle={practiceMode.description} />
      <SessionRunner mode={practiceMode} words={words} />
    </main>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex w-full max-w-md items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        ← Home
      </Link>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="text-slate-500">Loading…</div>}>
      <PracticeInner />
    </Suspense>
  );
}
