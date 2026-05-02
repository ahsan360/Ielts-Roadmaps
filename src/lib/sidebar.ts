import { roadmaps } from "@/data/roadmaps";
import { grammarReferences } from "@/data/grammar";

export interface SidebarLink {
  label: string;
  href: string;
  emoji?: string;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: "Navigate",
    links: [{ label: "Home", href: "/", emoji: "🏠" }],
  },
  {
    title: "Roadmaps",
    links: roadmaps.map((r) => ({
      label: r.title,
      href: `/roadmaps/${r.slug}`,
      emoji: "📘",
    })),
  },
  {
    title: "Grammar",
    links: grammarReferences.map((g) => ({
      label: g.title,
      href: `/grammar/${g.slug}`,
      emoji: "📝",
    })),
  },
];
