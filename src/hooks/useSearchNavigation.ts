import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Surah } from "../types/search.types";

export const useSearchNavigation = () => {
  const navigation = useNavigation<any>();

  const navigateToSurahDetail = useCallback((surahId: number) => {
    navigation.navigate("SurahDetail", { surahId });
  }, [navigation]);

  const navigateToAyahDetail = useCallback((surahId: number, ayahNumber: number) => {
    navigation.navigate("SurahDetail", { surahId, nomorAyat: ayahNumber });
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    navigateToSurahDetail,
    navigateToAyahDetail,
    goBack,
  };
};