import { useQuery } from "@tanstack/react-query";
import { fetchJuzDetail } from "../api/quranApi";
import { Language } from "../types/quran.types";

export const useJuzDetail = (juzId: number, language: Language) => {
  return useQuery({
    queryKey: ["juz", juzId, language],
    queryFn: () => fetchJuzDetail(juzId, language),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!juzId,
  });
};