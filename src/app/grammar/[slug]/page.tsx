import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGrammarReference,
  getGrammarReferences,
  type GrammarReferenceData,
} from "@/data/grammar";
import { GrammarReferenceView } from "@/components/GrammarReferenceView";

export function generateStaticParams() {
  return getGrammarReferences().map((g) => ({ slug: g.slug }));
}

function loadGrammarData(slug: string): GrammarReferenceData | null {
  const filePath = path.join(process.cwd(), "src/data/grammar", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as GrammarReferenceData;
}

export default function GrammarReferencePage({
  params,
}: {
  params: { slug: string };
}) {
  const ref = getGrammarReference(params.slug);
  if (!ref) notFound();
  const data = loadGrammarData(params.slug);
  if (!data) notFound();

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <Link
          href="/grammar"
          className="text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          ← All grammar references
        </Link>
      </div>
      <GrammarReferenceView data={data} />
    </main>
  );
}
