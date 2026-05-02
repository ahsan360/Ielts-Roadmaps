export interface RoadmapBlock {
  time: string;
  content: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  tags: string[];
  blocks: RoadmapBlock[];
  deliverable: string;
}

export interface RoadmapWeek {
  title: string;
  goal: string;
  days: RoadmapDay[];
}

export interface RoadmapData {
  title: string;
  subtitle: string;
  icon: string;
  totalDays: number;
  statLabels: Record<string, string>;
  weeks: RoadmapWeek[];
}

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
}

export const roadmaps: Roadmap[] = [
  {
    slug: "60-day-cloud-distributed-systems",
    title: "60-Day Cloud & Distributed Systems Roadmap",
    description: "A 60-day study plan for cloud computing, distributed systems, and modern architecture.",
  },
  {
    slug: "ielts-grammar-band-7-plus",
    title: "IELTS Grammar Roadmap — Band 7+",
    description:
      "A 42-day advanced grammar plan dedicated to Band 7+: tense mastery, conditionals, complex sentences, modality, cohesion and IELTS-specific application.",
  },
];

export function getRoadmaps(): Roadmap[] {
  return roadmaps;
}

export function getRoadmap(slug: string): Roadmap | undefined {
  return roadmaps.find((roadmap) => roadmap.slug === slug);
}
