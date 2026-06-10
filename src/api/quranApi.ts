import axios from "axios";
import {
  Ayah,
  AudioSources,
  JuzData,
  Language,
  Surah,
  SurahHome,
} from "../types/quran.types";

const EQURAN_BASE_URL = "https://equran.id/api/v2";
const ALQURAN_CLOUD_BASE_URL = "https://api.alquran.cloud/v1";

type ApiResponse<T> = {
  data: T;
};

type AlQuranCloudAyah = {
  number: number;
  numberInSurah: number;
  text: string;
  surah?: {
    englishName: string;
    number: number;
  };
};

type AlQuranCloudJuz = {
  ayahs: AlQuranCloudAyah[];
};

type AlQuranCloudSurah = {
  ayahs: AlQuranCloudAyah[];
};

type EquranAyah = {
  nomorAyat: number;
  teksArab: string;
  teksLatin?: string;
  teksIndonesia: string;
  audio: AudioSources;
};

type EquranSurah = Omit<Surah, "ayat"> & {
  ayat: EquranAyah[];
};

const fetchEnglishTranslationForJuz = async (
  juzId: number,
): Promise<Record<number, string>> => {
  try {
    const response = await axios.get(
      `${ALQURAN_CLOUD_BASE_URL}/juz/${juzId}/en.sahih`,
      { timeout: 10000 },
    );

    const translationMap: Record<number, string> = {};
    const juzData = response.data as ApiResponse<AlQuranCloudJuz>;
    if (juzData.data?.ayahs) {
      juzData.data.ayahs.forEach((ayah) => {
        translationMap[ayah.number] = ayah.text;
      });
    }

    return translationMap;
  } catch (error) {
    console.error("Error fetching English translation:", error);
    return {};
  }
};

export const fetchJuzDetail = async (
  id: number,
  language: Language = "id",
): Promise<JuzData> => {
  try {
    const [arabicResponse, indonesianResponse] = await Promise.all([
      axios.get<ApiResponse<AlQuranCloudJuz>>(
        `${ALQURAN_CLOUD_BASE_URL}/juz/${id}/ar.uthmani`,
      ),
      axios.get<ApiResponse<AlQuranCloudJuz>>(
        `${ALQURAN_CLOUD_BASE_URL}/juz/${id}/id.indonesian`,
      ),
    ]);

    if (
      !arabicResponse.data.data?.ayahs ||
      !indonesianResponse.data.data?.ayahs
    ) {
      throw new Error("No ayahs found for this Juz");
    }

    const arabicAyahs = arabicResponse.data.data.ayahs;
    const indonesianAyahs = indonesianResponse.data.data.ayahs;

    let mergedAyahs: Ayah[] = arabicAyahs.map((arabicAyah, index) => ({
      ...arabicAyah,
      textIndonesian: indonesianAyahs[index]?.text || "",
      nomorAyat: arabicAyah.numberInSurah,
      teksArab: arabicAyah.text,
      teksIndonesia: indonesianAyahs[index]?.text || "",
      audio: {},
    }));

    if (language === "en") {
      const englishTranslations = await fetchEnglishTranslationForJuz(id);
      mergedAyahs = mergedAyahs.map((ayah) => ({
        ...ayah,
        textEnglish: englishTranslations[ayah.number] || ayah.textIndonesian,
      }));
    }

    return {
      ...arabicResponse.data.data,
      ayahs: mergedAyahs,
    };
  } catch (error) {
    console.error("Error fetching Juz:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to connect to server: ${error.message}`);
    }
    throw new Error("Failed to connect to server. Check your internet connection.");
  }
};


// Fetch surah detail from equran.id (Indonesian)
export const fetchSurahDetailIndonesia = async (id: number): Promise<Surah> => {
  const response = await axios.get<ApiResponse<EquranSurah>>(
    `${EQURAN_BASE_URL}/surat/${id}`,
  );
  const surah = response.data.data;

  return {
    ...surah,
    ayat: surah.ayat.map((ayah) => ({
      ...ayah,
      number: ayah.nomorAyat,
      numberInSurah: ayah.nomorAyat,
      text: ayah.teksArab,
      textIndonesian: ayah.teksIndonesia,
    })),
  };
};

// Fetch English translation from Quran Cloud API
export const fetchEnglishTranslation = async (
  surahNumber: number,
): Promise<Record<number, string>> => {
  try {
    const response = await axios.get<ApiResponse<AlQuranCloudSurah>>(
      `${ALQURAN_CLOUD_BASE_URL}/surah/${surahNumber}/en.sahih`,
      { timeout: 10000 },
    );

    const translationMap: Record<number, string> = {};
    response.data.data?.ayahs?.forEach((ayah) => {
      translationMap[ayah.numberInSurah] = ayah.text;
    });

    return translationMap;
  } catch (error) {
    console.error("Error fetching English translation:", error);
    return {};
  }
};

// Main fetch function with language support
export const fetchSurahDetail = async (
  id: number,
  language: Language = "id",
): Promise<Surah> => {
  const surah = await fetchSurahDetailIndonesia(id);

  if (language === "en") {
    const englishTranslations = await fetchEnglishTranslation(id);

    surah.ayat = surah.ayat.map((ayah) => ({
      ...ayah,
      teksInggris: englishTranslations[ayah.nomorAyat] || ayah.teksIndonesia,
    }));
  }

  return surah;
};



export const fetchAllSurahs = async (): Promise<SurahHome[]> => {
  const response = await axios.get<ApiResponse<SurahHome[]>>(
    `${EQURAN_BASE_URL}/surat`,
  );
  return response.data.data;
};

// Add caching for better performance
let cachedSurahs: SurahHome[] | null = null;

export const fetchSurahsWithCache = async (): Promise<SurahHome[]> => {
  if (cachedSurahs) {
    return cachedSurahs;
  }
  
  const surahs = await fetchAllSurahs();
  cachedSurahs = surahs;
  return surahs;
};

export const clearSurahCache = () => {
  cachedSurahs = null;
};
