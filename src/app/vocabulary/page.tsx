import { VocabularyView } from "@/components/VocabularyView";
import vocabulary from "@/data/vocabulary.json";

export const metadata = {
  title: "Vocabulary — IELTS Vocab",
  description: "Browse and search the full IELTS 7+ vocabulary list extracted from the master file.",
};

export default function VocabularyPage() {
  return <VocabularyView data={vocabulary as VocabularyData} />;
}

type VocabularyData = {
  meta: {
    title: string;
    source: string;
    total: number;
    sections: Record<string, number>;
    generated: string;
  };
  entries: {
    word: string;
    meaning: string;
    pos: string;
    example: string;
    synonyms: string[];
    extra: string;
    section: string;
  }[];
};
