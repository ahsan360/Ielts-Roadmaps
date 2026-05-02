import Link from "next/link";
import { grammarReferences } from "@/data/grammar";

export default function GrammarIndexPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grammar References</h1>
          <p className="text-sm text-slate-500">
            Reference sheets for the grammar areas IELTS Band 7+ candidates need to control.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← Home
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {grammarReferences.map((g) => (
          <Link
            key={g.slug}
            href={`/grammar/${g.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-3xl">📝</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{g.description}</p>
            </div>
            <span className="mt-auto text-sm font-medium text-brand-600">
              Open reference →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
