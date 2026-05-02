export interface GrammarRuleExample {
  singular: string;
  plural: string;
}

export interface GrammarRule {
  pattern: string;
  examples?: GrammarRuleExample[];
  items?: string[];
  note?: string;
}

export interface GrammarSection {
  id: string;
  title: string;
  summary?: string;
  rules: GrammarRule[];
  tip?: string;
}

export interface GrammarReferenceData {
  title: string;
  subtitle: string;
  icon: string;
  intro: string;
  sections: GrammarSection[];
  checklist?: string[];
}

export interface GrammarReference {
  slug: string;
  title: string;
  description: string;
}

export const grammarReferences: GrammarReference[] = [
  {
    slug: "plurals-band-7-plus",
    title: "Plural Forms — Band 7+",
    description:
      "Complete reference of regular, irregular, classical and tricky plural forms required for IELTS Band 7+, with subject-verb agreement traps.",
  },
];

export function getGrammarReferences(): GrammarReference[] {
  return grammarReferences;
}

export function getGrammarReference(slug: string): GrammarReference | undefined {
  return grammarReferences.find((g) => g.slug === slug);
}
