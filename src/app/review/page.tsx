"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SessionRunner } from "@/components/SessionRunner";
import { reviewMode } from "@/lib/modes/registry";
import { filterByCategories, getAllWords } from "@/lib/words";

function ReviewInner() {
  const searchParams = useSearchParams();
  const cats = useMemo(() => {
    const raw = searchParams.get("cats");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const words = useMemo(() => filterByCategories(getAllWords(), cats), [cats]);

  return (
    <main className="flex flex-1 flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{reviewMode.name}</h1>
          <p className="text-sm text-slate-500">{reviewMode.description}</p>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← Home
        </Link>
      </div>
      <SessionRunner mode={reviewMode} words={words} />
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="text-slate-500">Loading…</div>}>
      <ReviewInner />
    </Suspense>
  );
}
