import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Share,
  Alert,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Search, Share2, Play, Bookmark } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Audio } from "expo-av";
import { useAppStore, useQuranStore } from "../../store/useAppStore";
import type { Bookmark as BookmarkType } from "../../store/useAppStore";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Constants
const PRIMARY_COLOR = "#A44AFF";
const SECONDARY_COLOR = "#8D92A3";
const BACKGROUND_COLOR = "#0B1535";
const CARD_BACKGROUND_COLOR = "#6236CC";
const TEXT_COLOR = "white";
const BORDER_COLOR = "rgba(141, 146, 163, 0.2)";
const ACTION_BAR_BACKGROUND = "rgba(18, 25, 49, 0.5)";

// Types
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Ayah = {
  nomorAyat: number;
  teksArab: string;
  teksIndonesia: string;
  audio: {
    "05": string;
  };
};

type Surah = {
  namaLatin: string;
  arti: string;
  tempatTurun: string;
  jumlahAyat: number;
  nama: string;
  ayat: Ayah[];
};

// Fetch surah detail
const fetchSurahDetail = async (id: number): Promise<Surah> => {
  const response = await axios.get(`https://equran.id/api/v2/surat/${id}`);
  return response.data.data;
};

const SurahDetail = () => {
  const route = useRoute<any>();
  const { surahId, nomorAyat } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NavigationProp>();

  // Store
  const {
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead,
    collections,
    addAyatToCollection,
    createCollection,
  } = useQuranStore();

  // Audio
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);

  // Query
  const { data: surah, isLoading } = useQuery({
    queryKey: ["surah", surahId],
    queryFn: () => fetchSurahDetail(surahId),
  });

  // Navigation handlers
  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  const handleHome = () => {
    navigation.navigate("HomeScreen");
  };

  // Bookmark handlers
  const toggleBookmarkWithCollection = (item: Ayah) => {
    if (isBookmarked(surahId, item.nomorAyat)) {
      removeBookmark(surahId, item.nomorAyat);
    } else {
      // Show collection options
      const buttons: any[] = collections.map((col: any) => ({
        text: col.name,
        onPress: () => {
          const bookmark: BookmarkType = {
            surahId: surahId,
            nomorAyat: item.nomorAyat,
            surahName: surah?.namaLatin || "",
            ayahText: item.teksArab,
          };
          addAyatToCollection(col.id, bookmark);
          Alert.alert("Success", `Ayah added to ${col.name}`);
        },
      }));

      buttons.push({
        text: "Create New Collection",
        onPress: () => {
          Alert.prompt(
            "Create Collection",
            "Enter collection name:",
            (text) => {
              if (text?.trim()) {
                const newCollectionId = createCollection(text);
                const bookmark: BookmarkType = {
                  surahId: surahId,
                  nomorAyat: item.nomorAyat,
                  surahName: surah?.namaLatin || "",
                  ayahText: item.teksArab,
                };
                addAyatToCollection(newCollectionId, bookmark);
                Alert.alert(
                  "Success",
                  `Collection "${text}" created and ayah added!`,
                );
              }
            },
            "plain-text",
            "",
            "default",
          );
        },
      });

      buttons.push({ text: "Cancel", style: "cancel" });

      Alert.alert(
        "Save to Collection",
        "Choose a collection for this Ayah",
        buttons,
      );
    }
  };

  const handleBookmark = (nomorAyat: number, ayahText: string) => {
    const bookmark = {
      surahId: surahId,
      nomorAyat: nomorAyat,
      surahName: surah?.namaLatin || "",
      ayahText: ayahText,
    };

    if (isBookmarked(surahId, nomorAyat)) {
      removeBookmark(surahId, nomorAyat);
    } else {
      addBookmark(bookmark);
    }
  };

  // Audio handlers
  const playAudio = async (audioUrl: string, ayatNumber: number) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true },
    );
    setSound(newSound);
    setPlayingAyat(ayatNumber);

    // Update last read when playing audio
    setLastRead({
      surahId: surahId,
      surahName: surah?.nama || "",
      nomorAyat: ayatNumber,
      namaLatin: surah?.namaLatin || "",
    });
  };

  // Share handler
  const onShare = async (item: Ayah) => {
    try {
      await Share.share({
        message: `${item.teksArab}\n\n${item.teksIndonesia}\n\nFrom Surah ${surah?.namaLatin} (${item.nomorAyat})`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Render ayah item
  const renderAyatItem = ({ item, index }: { item: Ayah; index: number }) => {
    const bookmarked = isBookmarked(surahId, item.nomorAyat);
    const isPlaying = playingAyat === item.nomorAyat;

    const toggleBookmark = (item: Ayah) => {
      if (bookmarked) {
        removeBookmark(surahId, item.nomorAyat);
      } else {
        addBookmark({
          surahId: surahId,
          nomorAyat: item.nomorAyat,
          surahName: surah?.namaLatin || "",
        });
      }
    };

    const onBookmarkPress = (item: Ayah) => {
      if (bookmarked) {
        removeBookmark(surahId, item.nomorAyat);
      } else {
        // Default save to regular bookmarks
        addBookmark({
          surahId,
          nomorAyat: item.nomorAyat,
          surahName: surah?.namaLatin || "",
          ayahText: item.teksArab,
        });
      }
    };

    const onBookmarkLongPress = (item: Ayah) => {
      const currentCollections = useQuranStore.getState().collections;

      const options: any[] = currentCollections.map((c) => ({
        text: c.name,
        onPress: () => {
          addAyatToCollection(c.id, {
            surahId,
            nomorAyat: item.nomorAyat,
            surahName: surah?.namaLatin || "",
            ayahText: item.teksArab,
          });
          Alert.alert("Tersimpan", `Ayat dimasukkan ke ${c.name}`);
        },
      }));

      options.push({
        text: "+ Buat Koleksi Baru",
        onPress: () => {
          Alert.prompt("Koleksi Baru", "Masukkan nama folder:", (name) => {
            if (name) {
              const newId = createCollection(name);
              addAyatToCollection(newId, {
                surahId,
                nomorAyat: item.nomorAyat,
                surahName: surah?.namaLatin || "",
                ayahText: item.teksArab,
              });
            }
          });
        },
      });

      options.push({ text: "Batal", style: "cancel" });

      Alert.alert("Simpan ke Koleksi", "Pilih folder penyimpanan:", options);
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50)}
        style={styles.ayatContainer}
      >
        <View style={styles.ayatActionBar}>
          <View style={styles.ayatNumberBadge}>
            <Text style={styles.ayatNumberText}>{item.nomorAyat}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onShare(item)}
              style={styles.actionIcon}
            >
              <Share2 color={PRIMARY_COLOR} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => playAudio(item.audio["05"], item.nomorAyat)}
              style={styles.actionIcon}
            >
              <Play
                color={PRIMARY_COLOR}
                size={20}
                fill={isPlaying ? PRIMARY_COLOR : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleBookmark(item)}
              onLongPress={() => onBookmarkLongPress(item)}
              style={styles.actionIcon}
            >
              <Bookmark
                color={PRIMARY_COLOR}
                size={20}
                fill={bookmarked ? PRIMARY_COLOR : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.arabicText}>{item.teksArab}</Text>
        <Text style={styles.translationText}>{item.teksIndonesia}</Text>
      </Animated.View>
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

  // Handle viewable items change for tracking last read
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && surah) {
        const firstVisibleAyat = viewableItems[0].item;
        setLastRead({
          surahId: surahId,
          surahName: surah.nama || "",
          nomorAyat: firstVisibleAyat.nomorAyat,
          namaLatin: surah.namaLatin || "",
        });
      }
    },
    [surahId, surah, setLastRead],
  );

  const viewabilityConfig = React.useMemo(
    () => ({
      itemVisiblePercentThreshold: 30,
    }),
    [],
  );

  // Handle scroll to index failure
  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    flatListRef.current?.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: true,
    });
  };

  // Scroll to specific ayah when data is loaded
  React.useEffect(() => {
    if (surah && nomorAyat) {
      const ayatIndex = surah.ayat.findIndex(
        (ayat: Ayah) => ayat.nomorAyat === nomorAyat,
      );
      if (ayatIndex !== -1 && flatListRef.current) {
        // Delay to ensure FlatList is fully rendered
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: ayatIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 300);
      }
    }
  }, [surah, nomorAyat]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={handleHome}>
          <ArrowLeft color={SECONDARY_COLOR} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{surah?.namaLatin || "Loading..."}</Text>
        <Search color={SECONDARY_COLOR} size={28} onPress={handleSearchPress} />
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Memuat Ayat...</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={surah?.ayat}
          keyExtractor={(item) => item.nomorAyat.toString()}
          renderItem={renderAyatItem}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          ListHeaderComponent={
            surah ? (
              <View style={styles.bannerCard}>
                <Text style={styles.bannerTitle}>{surah.namaLatin}</Text>
                <Text style={styles.bannerSub}>{surah.arti}</Text>
                <View style={styles.divider} />
                <Text style={styles.bannerInfo}>
                  {surah.tempatTurun.toUpperCase()} • {surah.jumlahAyat} VERSES
                </Text>
                <Text style={styles.bismillah}>
                  بِسْمِ اللَّهُ الرَّحْمَنِ الرَّحِيم
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  navTitle: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerCard: {
    margin: 20,
    padding: 28,
    borderRadius: 20,
    backgroundColor: CARD_BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    color: TEXT_COLOR,
    fontSize: 26,
    fontWeight: "bold",
  },
  bannerSub: {
    color: TEXT_COLOR,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: "80%",
    marginVertical: 16,
  },
  bannerInfo: {
    color: TEXT_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  bismillah: {
    color: TEXT_COLOR,
    fontSize: 24,
    marginTop: 20,
    fontFamily: "System",
  },
  listContent: {
    paddingBottom: 40,
  },
  ayatContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  ayatActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ACTION_BAR_BACKGROUND,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  ayatNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  ayatNumberText: {
    color: TEXT_COLOR,
    fontWeight: "bold",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  actionIcon: {
    padding: 4,
  },
  arabicText: {
    color: TEXT_COLOR,
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 45,
  },
  translationText: {
    color: SECONDARY_COLOR,
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    color: TEXT_COLOR,
    textAlign: "center",
    marginTop: 20,
  },
});

export default SurahDetail;
