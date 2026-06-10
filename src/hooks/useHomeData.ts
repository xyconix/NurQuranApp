import { useQuery } from "@tanstack/react-query";
import { fetchSurahsWithCache } from "../api/quranApi";
import { useAppStore } from "../store/useAppStore";

export const useHomeData = () => {
  const { lastRead } = useAppStore();

  const {
    data: surahs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahsWithCache,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });

  const hasLastRead = !!lastRead;
  const lastReadData = lastRead || null;

  return {
    surahs: surahs || [],
    isLoading,
    isError,
    error,
    refetch,
    hasLastRead,
    lastReadData,
  };
};