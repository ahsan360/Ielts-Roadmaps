import wordsData from "@/data/words.json";

export interface Word {
  text: string;
  categoryId: string;
  categoryName: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

interface RawCategory {
  id: string;
  name: string;
  words: string[];
}

interface RawData {
  version: number;
  title: string;
  categories: RawCategory[];
}

const data = wordsData as RawData;

export function getAllWords(): Word[] {
  return data.categories.flatMap((cat) =>
    cat.words.map((text) => ({
      text,
      categoryId: cat.id,
      categoryName: cat.name,
    }))
  );
}

export function getCategories(): Category[] {
  return data.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    count: cat.words.length,
  }));
}

export function filterByCategories(words: Word[], categoryIds: string[]): Word[] {
  if (categoryIds.length === 0) return words;
  const set = new Set(categoryIds);
  return words.filter((w) => set.has(w.categoryId));
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getTitle(): string {
  return data.title;
}
