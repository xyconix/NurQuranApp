import { Surah, SearchResult } from "../types/search.types";

export const filterSurahsByQuery = (
  surahs: Surah[],
  query: string,
  minLength: number = 2
): SearchResult[] => {
  if (query.length < minLength) return [];
  
  const searchKey = query.toLowerCase().trim();
  
  return surahs
    .filter(
      (surah) =>
        surah.namaLatin.toLowerCase().includes(searchKey) ||
        surah.arti.toLowerCase().includes(searchKey) ||
        surah.nama.toLowerCase().includes(searchKey)
    )
    .map((surah) => ({
      ...surah,
      matchScore: calculateMatchScore(surah, searchKey),
    }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

export const calculateMatchScore = (surah: Surah, query: string): number => {
  let score = 0;
  
  // Exact match on name gets highest score
  if (surah.namaLatin.toLowerCase() === query) score += 100;
  // Starts with query gets high score
  else if (surah.namaLatin.toLowerCase().startsWith(query)) score += 50;
  // Contains query gets medium score
  else if (surah.namaLatin.toLowerCase().includes(query)) score += 30;
  
  // Match on meaning/translation
  if (surah.arti.toLowerCase().includes(query)) score += 20;
  
  // Match on Arabic name
  if (surah.nama.toLowerCase().includes(query)) score += 25;
  
  return score;
};

export const highlightText = (text: string, query: string): string => {
  if (!query || query.length === 0) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const getResultCountText = (count: number, t: (key: string) => string): string => {
  return `${t("Found")} ${count} ${t("results")}`;
};

export const isValidSearchQuery = (query: string, minLength: number = 2): boolean => {
  return query.trim().length >= minLength;
};