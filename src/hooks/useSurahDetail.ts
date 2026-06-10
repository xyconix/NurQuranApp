import { useQuery } from "@tanstack/react-query";
import { fetchSurahDetail } from "../api/quranApi";
import { Language } from "../types/quran.types";

export const useSurahDetail = (surahId: number, language: Language) => {
  return useQuery({
    queryKey: ["surah", surahId, language],
    queryFn: () => fetchSurahDetail(surahId, language),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};