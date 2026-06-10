import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/useAppStore";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { COLORS } from "../../constants/colors";
import { useJuzDetail } from "../../hooks/useJuzDetail";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { AyatItem } from "../../components/AyatItemJuz";
import { LoadingState } from "../../components/LoadingState";
import { ErrorState } from "../../components/ErrorState";
import { BannerCard } from "../../components/BannerCard";

const JuzDetail = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "JuzDetail">>();
  const { juzId } = route.params;
  const language = i18n.language?.includes("id") ? "id" : "en";
  
  const { addBookmark, removeBookmark, isBookmarked } = useAppStore();
  const { data: juz, isLoading, isError, error, refetch } = useJuzDetail(juzId, language);
  const { playAudio, playingAyat } = useAudioPlayer();

  const onShare = async (item: any) => {
    try {
      const translation = language === "en"
        ? item.textEnglish || item.textIndonesian
        : item.textIndonesian;
      await Share.share({
        message: `${item.text}\n\n${translation}\n\n${t("From")} ${item.surah?.englishName || t("Surah")} - ${t("Juz")} ${juzId}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const toggleBookmark = (item: any) => {
    const surahNumber = item.surah?.number || 1;
    if (isBookmarked(surahNumber, item.numberInSurah)) {
      removeBookmark(surahNumber, item.numberInSurah);
    } else {
      addBookmark({
        surahId: surahNumber,
        nomorAyat: item.numberInSurah,
        surahName: item.surah?.englishName || t("Surah"),
        ayahText: item.text,
      });
      Alert.alert(t("Success"), t("Ayah added to bookmarks"));
    }
  };

  const renderAyatItem = ({ item }: { item: any }) => (
    <AyatItem
      item={item}
      juzId={juzId}
      language={language}
      isBookmarked={isBookmarked(item.surah?.number || 1, item.numberInSurah)}
      isPlaying={playingAyat === item.number}
      onShare={() => onShare(item)}
      onPlay={() => playAudio(item.number)}
      onBookmark={() => toggleBookmark(item)}
    />
  );

  const renderContent = () => {
    if (isLoading) return <LoadingState juzId={juzId} />;
    if (isError) return <ErrorState error={error as Error} onRetry={refetch} juzId={juzId} />;
    if (!juz || !juz.ayahs || juz.ayahs.length === 0) {
      return <ErrorState error={new Error(`No ayahs data for Juz ${juzId}`)} onRetry={refetch} juzId={juzId} />;
    }

    return (
      <FlatList
        data={juz.ayahs}
        keyExtractor={(item, index) => `${juzId}-${index}`}
        renderItem={renderAyatItem}
        initialNumToRender={10}
        ListHeaderComponent={<BannerCard juzId={juzId} />}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.SECONDARY} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {t("Juz")} {juzId}
        </Text>
        <Search color={COLORS.SECONDARY} size={28} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  navHeader: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 40,
  },
});

export default JuzDetail;