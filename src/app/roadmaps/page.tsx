import Link from "next/link";
import { roadmaps } from "@/data/roadmaps";

export default function RoadmapsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Roadmaps</h1>
          <p className="text-sm text-slate-500">
            Browse available study plans and add more roadmap files under <code>public/roadmaps</code>.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← Home
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roadmaps.map((roadmap) => (
          <Link
            key={roadmap.slug}
            href={`/roadmaps/${roadmap.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-3xl">📘</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600">
                {roadmap.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{roadmap.description}</p>
            </div>
            <span className="mt-auto text-sm font-medium text-brand-600">Open roadmap →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
