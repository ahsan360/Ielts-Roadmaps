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
    slug: "tenses-band-7-plus",
    title: "Tenses — Band 7+",
    description:
      "All 12 tenses with forms, IELTS uses, signal words, reported-speech backshift, and the top tense errors at the Band 6→7 threshold.",
  },
  {
    slug: "conditionals-band-7-plus",
    title: "Conditionals — Band 7+",
    description:
      "Zero / 1st / 2nd / 3rd + Mixed + Inverted + Wish/If only + alternatives — the highest Band 7+ signal in IELTS Speaking and Writing.",
  },
  {
    slug: "articles-band-7-plus",
    title: "Articles — Band 7+",
    description:
      "a / an / the / zero article — the most-missed grammar point in IELTS, with all the tricky abstract-noun and unique-entity cases.",
  },
  {
    slug: "plurals-band-7-plus",
    title: "Plural Forms — Band 7+",
    description:
      "Complete reference of regular, irregular, classical and tricky plural forms required for IELTS Band 7+, with subject-verb agreement traps.",
  },
  {
    slug: "sentence-structures-band-7-plus",
    title: "Sentence Structures — Band 7+",
    description:
      "Simple / compound / complex / mixed sentences + cleft + inversion + parallelism — the variety Band 7+ writing demands.",
  },
  {
    slug: "relative-participle-clauses-band-7-plus",
    title: "Relative & Participle Clauses — Band 7+",
    description:
      "Defining / non-defining / reduced relative clauses + -ing / -ed / having + V3 participle clauses — the elegance of Band 7+ writing.",
  },
  {
    slug: "passive-voice-band-7-plus",
    title: "Passive Voice — Band 7+",
    description:
      "Full passive across all 12 tenses + reporting passives ('It is said that…') + causative have/get — IELTS Task 1 essential.",
  },
  {
    slug: "modal-verbs-band-7-plus",
    title: "Modal Verbs — Band 7+",
    description:
      "Basic + expanded + perfect modals (must have, should have, could have) for past speculation and regret — high Band 7+ marker.",
  },
  {
    slug: "gerunds-infinitives-band-7-plus",
    title: "Gerunds, Infinitives & Verb Patterns — Band 7+",
    description:
      "-ing vs to-V vs bare infinitive, meaning-shift verbs (stop / remember / try), preposition + -ing, and the comprehensive verb-pattern lists.",
  },
  {
    slug: "linking-cohesion-band-7-plus",
    title: "Linking & Cohesion — Band 7+",
    description:
      "Discourse markers + reference + substitution + paragraph flow — the Coherence & Cohesion scoring criterion (25% of Writing).",
  },
  {
    slug: "lexico-grammar-polish-band-7-plus",
    title: "Lexico-Grammar Polish — Band 7+",
    description:
      "Nominalization + hedging + dependent prepositions + advanced punctuation + comparatives + spelling — the final 10% to Band 7+.",
  },
];

export function getGrammarReferences(): GrammarReference[] {
  return grammarReferences;
}

export function getGrammarReference(slug: string): GrammarReference | undefined {
  return grammarReferences.find((g) => g.slug === slug);
}
