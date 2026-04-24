import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Share2, Play, Bookmark, Search } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Audio } from "expo-av";
import { useQuranStore } from "../../store/useAppStore";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AnimatedQuran } from "../../components/SurahAssets";

// Constants
const PRIMARY_COLOR = "#A44AFF";
const SECONDARY_COLOR = "#8D92A3";
const BACKGROUND_COLOR = "#0B1535";
const CARD_BACKGROUND_COLOR = "#6236CC";
const ERROR_COLOR = "#ff5252";
const TEXT_COLOR = "white";
const BORDER_COLOR = "rgba(141,146,163,0.1)";
const ACTION_BAR_BACKGROUND = "rgba(18,25,49,0.5)";

// Types
type Ayah = {
  numberInSurah: number;
  text: string;
  textIndonesian: string;
  number: number;
  surah?: {
    englishName: string;
    number: number;
  };
  audioUrl?: string;
};

type JuzData = {
  ayahs: Ayah[];
};

// Fetching data Juz with better error handling
const fetchJuzDetail = async (id: number): Promise<JuzData> => {
  try {
    // Fetch Arabic and Indonesian translation in parallel
    const [arabicResponse, indonesianResponse] = await Promise.all([
      axios.get(`https://api.alquran.cloud/v1/juz/${id}/ar.uthmani`),
      axios.get(`https://api.alquran.cloud/v1/juz/${id}/id.indonesian`),
    ]);

    // Validate response
    if (
      !arabicResponse.data.data?.ayahs ||
      !indonesianResponse.data.data?.ayahs
    ) {
      throw new Error("Data ayat tidak ditemukan untuk Juz ini");
    }

    // Merge data - combine Arabic and Indonesian text
    const arabicAyahs = arabicResponse.data.data.ayahs;
    const indonesianAyahs = indonesianResponse.data.data.ayahs;

    const mergedAyahs = arabicAyahs.map((arabicAyah: any, index: number) => ({
      ...arabicAyah,
      textIndonesian: indonesianAyahs[index]?.text || "",
    }));

    return {
      ...arabicResponse.data.data,
      ayahs: mergedAyahs,
    };
  } catch (error) {
    console.error("Error fetching Juz:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Gagal menyambung ke server: ${error.message}`);
    }
    throw new Error("Gagal menyambung ke server. Periksa koneksi internet.");
  }
};

const JuzDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "JuzDetail">>();
  const { juzId } = route.params;

  // Store
  const { addBookmark, removeBookmark, isBookmarked } = useQuranStore();

  // Audio state
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [playingAyat, setPlayingAyat] = React.useState<number | null>(null);

  const {
    data: juz,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["juz", juzId],
    queryFn: () => fetchJuzDetail(juzId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!juzId,
  });

  // Audio playback function
  const playAudio = async (ayatNumber: number) => {
    try {
      // Construct audio URL for this ayat
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayatNumber}.mp3`;

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );
      setSound(newSound);
      setPlayingAyat(ayatNumber);
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Tidak dapat memutar audio");
    }
  };

  // Share function
  const onShare = async (item: Ayah) => {
    try {
      await Share.share({
        message: `${item.text}\n\n${item.textIndonesian}\n\nFrom Surah ${item.surah?.englishName || "Surah"} - Juz ${juzId}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Bookmark toggle function
  const toggleBookmark = (item: Ayah) => {
    const surahNumber = item.surah?.number || 1;
    if (isBookmarked(surahNumber, item.numberInSurah)) {
      removeBookmark(surahNumber, item.numberInSurah);
    } else {
      addBookmark({
        surahId: surahNumber,
        nomorAyat: item.numberInSurah,
        surahName: item.surah?.englishName || "Surah",
        ayahText: item.text,
      });
      Alert.alert("Success", "Ayah ditambahkan ke bookmark");
    }
  };

  const renderAyatItem = ({ item }: { item: Ayah }) => {
    const bookmarked = isBookmarked(
      item.surah?.number || 1,
      item.numberInSurah,
    );
    const isPlaying = playingAyat === item.number;

    return (
      <View style={styles.ayatContainer}>
        <View style={styles.ayatActionBar}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{item.numberInSurah}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onShare(item)}>
              <Share2 color={PRIMARY_COLOR} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => playAudio(item.number)}
              style={{ marginHorizontal: 20 }}
            >
              <Play
                color={PRIMARY_COLOR}
                size={20}
                fill={isPlaying ? PRIMARY_COLOR : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBookmark(item)}>
              <Bookmark
                color={PRIMARY_COLOR}
                size={20}
                fill={bookmarked ? PRIMARY_COLOR : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Display surah name */}
        <Text style={styles.surahTag}>
          {item.surah?.englishName || "Surah"}
        </Text>

        {/* Arabic text */}
        <Text style={styles.arabicText}>{item.text}</Text>

        {/* Indonesian translation */}
        <Text style={styles.translationText}>{item.textIndonesian}</Text>
      </View>
    );
  };

  // Clean up audio when component unmounts
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.infoText}>Memuat Juz {juzId}...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{(error as Error).message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.buttonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!juz || !juz.ayahs || juz.ayahs.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Tidak ada data ayat untuk Juz {juzId}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.buttonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={juz.ayahs}
        keyExtractor={(item, index) => `${juzId}-${index}`}
        renderItem={renderAyatItem}
        initialNumToRender={10}
        ListHeaderComponent={
          <View style={styles.bannerCard}>
            <Text style={styles.bannerTitle}>Juz {juzId}</Text>
            <View style={styles.divider} />
            <AnimatedQuran />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={SECONDARY_COLOR} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Juz {juzId}</Text>
        <Search color={SECONDARY_COLOR} size={28} />
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  navHeader: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerCard: {
    margin: 20,
    padding: 25,
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 20,
    alignItems: "center",
  },
  bannerTitle: {
    color: TEXT_COLOR,
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "80%",
    marginVertical: 15,
  },
  ayatContainer: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  ayatActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ACTION_BAR_BACKGROUND,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  surahTag: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
  },
  arabicText: {
    color: TEXT_COLOR,
    fontSize: 24,
    textAlign: "right",
    lineHeight: 45,
    marginBottom: 10,
    fontWeight: "bold",
  },
  translationText: {
    color: SECONDARY_COLOR,
    fontSize: 15,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 40,
  },
  infoText: {
    color: TEXT_COLOR,
    marginTop: 10,
  },
  errorText: {
    color: ERROR_COLOR,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: TEXT_COLOR,
    fontWeight: "bold",
  },
});

export default JuzDetail;
