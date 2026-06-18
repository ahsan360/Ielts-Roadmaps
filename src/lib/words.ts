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

const CHUNK_SIZE = 20;
const CHUNK_SEP = "__chunk__";

export function buildChunkId(categoryId: string, chunkIndex: number): string {
  return `${categoryId}${CHUNK_SEP}${chunkIndex}`;
}

export function parseChunkId(id: string): { categoryId: string; chunkIndex: number } | null {
  const idx = id.indexOf(CHUNK_SEP);
  if (idx === -1) return null;
  return { categoryId: id.slice(0, idx), chunkIndex: Number(id.slice(idx + CHUNK_SEP.length)) };
}

export function getCategoryChunks(cat: Category): Category[] {
  const chunks: Category[] = [];
  for (let i = 0; i < cat.count; i += CHUNK_SIZE) {
    const end = Math.min(i + CHUNK_SIZE, cat.count);
    chunks.push({
      id: buildChunkId(cat.id, Math.floor(i / CHUNK_SIZE)),
      name: `${cat.name} ${i + 1}–${end}`,
      count: end - i,
    });
  }
  return chunks;
}

export function filterByCategories(words: Word[], categoryIds: string[]): Word[] {
  if (categoryIds.length === 0) return words;

  const plainIds = new Set<string>();
  const chunkFilters: { categoryId: string; chunkIndex: number }[] = [];

  for (const id of categoryIds) {
    const parsed = parseChunkId(id);
    if (parsed) chunkFilters.push(parsed);
    else plainIds.add(id);
  }

  return words.filter((w) => {
    if (plainIds.has(w.categoryId)) return true;
    for (const { categoryId, chunkIndex } of chunkFilters) {
      if (w.categoryId !== categoryId) continue;
      const catWords = words.filter((x) => x.categoryId === categoryId);
      const start = chunkIndex * CHUNK_SIZE;
      const end = start + CHUNK_SIZE;
      const pos = catWords.indexOf(w);
      if (pos >= start && pos < end) return true;
    }
    return false;
  });
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
