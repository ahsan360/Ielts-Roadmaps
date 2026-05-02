import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmap, getRoadmaps, type RoadmapData } from "@/data/roadmaps";
import { RoadmapView } from "@/components/RoadmapView";

export function generateStaticParams() {
  return getRoadmaps().map((roadmap) => ({ slug: roadmap.slug }));
}

function loadRoadmapData(slug: string): RoadmapData | null {
  const filePath = path.join(process.cwd(), "src/data/roadmaps", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as RoadmapData;
}

export default function RoadmapPage({ params }: { params: { slug: string } }) {
  const roadmap = getRoadmap(params.slug);
  if (!roadmap) {
    notFound();
  }
  const data = loadRoadmapData(params.slug);
  if (!data) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <Link href="/roadmaps" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ← All roadmaps
        </Link>
      </div>

      <RoadmapView slug={params.slug} data={data} />
    </main>
  );
}
