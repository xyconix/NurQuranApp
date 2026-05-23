import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Share,
  Alert,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  Share2,
  Play,
  Bookmark,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Audio, AVPlaybackStatus } from "expo-av";
import { useAppStore } from "../../store/useAppStore";
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

type AudioSources = {
  [key: string]: string;
};

type Ayah = {
  nomorAyat: number;
  teksArab: string;
  teksIndonesia: string;
  audio: AudioSources;
};

type Surah = {
  namaLatin: string;
  arti: string;
  tempatTurun: string;
  jumlahAyat: number;
  nama: string;
  audioFull?: AudioSources;
  ayat: Ayah[];
};

// Fetch surah detail
const fetchSurahDetail = async (id: number): Promise<Surah> => {
  const response = await axios.get(`https://equran.id/api/v2/surat/${id}`);
  return response.data.data;
};

// Qari names mapping
const QARI_NAMES: Record<string, string> = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsin Al-Qasim",
  "03": "Abdurrahman As-Sudais",
  "04": "Ibrahim Al-Dossari",
  "05": "Misyari Rasyid Al-Afasi",
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
  } = useAppStore();

  // Audio states
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedQari, setSelectedQari] = useState("05"); // Default Misyari
  const isPlayingFullSurahRef = useRef(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Query
  const { data: surah, isLoading } = useQuery({
    queryKey: ["surah", surahId],
    queryFn: () => fetchSurahDetail(surahId),
  });

  // Initialize audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        setIsAudioReady(true);
        console.log("Audio mode set successfully");
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };
    setupAudio();

    // Cleanup on unmount
    return () => {
      cleanupSound();
    };
  }, []);

  const cleanupSound = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
        soundRef.current = null;
      }
    } catch (error) {
      console.error("Error cleaning up sound:", error);
    }
  };

  // Get working audio URL with fallback
  const getAudioUrl = (audio: AudioSources): string => {
    // Try selected qari first
    if (audio[selectedQari]) return audio[selectedQari];
    // Fallback order
    const fallbackOrder = ["05", "01", "02", "03", "04"];
    for (const key of fallbackOrder) {
      if (audio[key]) return audio[key];
    }
    return "";
  };

  // Try playing audio with fallback URLs
  const tryPlayAudio = async (
    audio: AudioSources,
    ayatNumber: number,
    onFinish?: () => void
  ): Promise<boolean> => {
    const urlKeys = [selectedQari, "05", "01", "02", "03", "04"];
    const triedUrls = new Set<string>();

    for (const key of urlKeys) {
      const url = audio[key];
      if (!url || triedUrls.has(url)) continue;
      triedUrls.add(url);

      try {
        console.log(`Trying audio URL (Qari ${key}):`, url);

        await cleanupSound();

        const { sound: newSound, status } =
          await Audio.Sound.createAsync(
            { uri: url },
            {
              shouldPlay: true,
              volume: 1.0,
              rate: 1.0,
            }
          );

        if (!status.isLoaded) {
          console.log(`Audio not loaded for Qari ${key}, trying next...`);
          await newSound.unloadAsync();
          continue;
        }

        console.log(`Audio loaded successfully (Qari ${key}), duration: ${status.durationMillis}ms`);

        // Set callback for when audio finishes
        newSound.setOnPlaybackStatusUpdate((playbackStatus: AVPlaybackStatus) => {
          if (!playbackStatus.isLoaded) return;

          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.log(`Audio finished for ayah ${ayatNumber}`);
            if (onFinish) {
              onFinish();
            } else {
              setPlayingAyat(null);
            }
          }
        });

        soundRef.current = newSound;
        setPlayingAyat(ayatNumber);
        return true;
      } catch (error) {
        console.error(`Error with Qari ${key}:`, error);
        continue;
      }
    }

    return false;
  };

  // Navigation handlers
  const handleSearchPress = () => navigation.navigate("Search");
  const handleHome = () => navigation.navigate("HomeScreen");

  // Play single ayah audio
  const playSingleAyah = async (item: Ayah) => {
    try {
      // If same ayah is playing, stop it
      if (playingAyat === item.nomorAyat) {
        await cleanupSound();
        setPlayingAyat(null);
        return;
      }

      // Stop full surah if playing
      if (isPlayingFullSurah) {
        setIsPlayingFullSurah(false);
        isPlayingFullSurahRef.current = false;
      }

      setIsLoadingAudio(true);

      const success = await tryPlayAudio(item.audio, item.nomorAyat);

      if (!success) {
        Alert.alert(
          "Audio Error",
          "Could not play audio. Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      } else if (surah) {
        setLastRead({
          surahId,
          surahName: surah.nama || "",
          nomorAyat: item.nomorAyat,
          namaLatin: surah.namaLatin || "",
        });
      }
    } catch (error) {
      console.error("Error in playSingleAyah:", error);
      Alert.alert("Error", "Failed to play audio");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Play full surah
  const playFullSurah = async () => {
    if (!surah?.ayat || surah.ayat.length === 0) {
      Alert.alert("Error", "No ayahs available");
      return;
    }

    if (isPlayingFullSurah) {
      // Stop
      await cleanupSound();
      setIsPlayingFullSurah(false);
      isPlayingFullSurahRef.current = false;
      setPlayingAyat(null);
      setCurrentPlayingIndex(0);
      return;
    }

    // Start
    setIsPlayingFullSurah(true);
    isPlayingFullSurahRef.current = true;
    setCurrentPlayingIndex(0);
    await playAyahSequential(0);
  };

  const playAyahSequential = async (index: number) => {
    if (!surah?.ayat || index >= surah.ayat.length) {
      console.log("Surah playback complete");
      setIsPlayingFullSurah(false);
      isPlayingFullSurahRef.current = false;
      setPlayingAyat(null);
      setCurrentPlayingIndex(0);
      return;
    }

    if (!isPlayingFullSurahRef.current) {
      console.log("Playback was stopped by user");
      return;
    }

    const currentAyah = surah.ayat[index];
    console.log(`\n=== Playing Ayah ${currentAyah.nomorAyat} (index ${index}) ===`);

    setIsLoadingAudio(true);
    setCurrentPlayingIndex(index);

    const success = await tryPlayAudio(
      currentAyah.audio,
      currentAyah.nomorAyat,
      () => {
        // onFinish callback - play next ayah
        console.log(`Ayah ${currentAyah.nomorAyat} finished, checking next...`);

        if (!isPlayingFullSurahRef.current) {
          console.log("User stopped playback");
          setPlayingAyat(null);
          return;
        }

        const nextIndex = index + 1;
        if (nextIndex < surah.ayat.length) {
          console.log(`Moving to next ayah (index ${nextIndex})`);
          // Use setTimeout to prevent stack overflow and ensure proper cleanup
          setTimeout(() => {
            playAyahSequential(nextIndex);
          }, 800);
        } else {
          console.log("All ayahs played!");
          setIsPlayingFullSurah(false);
          isPlayingFullSurahRef.current = false;
          setPlayingAyat(null);
          setCurrentPlayingIndex(0);
        }
      }
    );

    setIsLoadingAudio(false);

    if (success) {
      // Scroll to current ayah
      try {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.3,
          });
        }, 200);
      } catch (err) {
        // Ignore scroll errors
      }

      // Update last read
      setLastRead({
        surahId,
        surahName: surah.nama || "",
        nomorAyat: currentAyah.nomorAyat,
        namaLatin: surah.namaLatin || "",
      });
    } else {
      console.log(`Failed to play ayah ${currentAyah.nomorAyat}, trying next...`);
      // Skip to next ayah if current fails
      if (isPlayingFullSurahRef.current) {
        const nextIndex = index + 1;
        if (nextIndex < surah.ayat.length) {
          setTimeout(() => playAyahSequential(nextIndex), 500);
        } else {
          setIsPlayingFullSurah(false);
          isPlayingFullSurahRef.current = false;
          setPlayingAyat(null);
        }
      }
    }
  };

  const skipToNextAyah = async () => {
    if (!isPlayingFullSurah || !surah?.ayat) return;
    const nextIndex = currentPlayingIndex + 1;
    if (nextIndex < surah.ayat.length) {
      await cleanupSound();
      await playAyahSequential(nextIndex);
    }
  };

  const skipToPreviousAyah = async () => {
    if (!isPlayingFullSurah || currentPlayingIndex <= 0) return;
    await cleanupSound();
    await playAyahSequential(currentPlayingIndex - 1);
  };

  // Qari selector
  const showQariSelector = () => {
    const buttons = Object.entries(QARI_NAMES).map(([key, name]) => ({
      text: `${name} ${selectedQari === key ? "✓" : ""}`,
      onPress: () => setSelectedQari(key),
    }));
    buttons.push({ text: "Cancel", onPress: () => {} });

    Alert.alert("Select Qari (Reciter)", "Choose a reciter:", buttons);
  };

  // Bookmark handlers
  const toggleBookmark = (item: Ayah) => {
    if (isBookmarked(surahId, item.nomorAyat)) {
      removeBookmark(surahId, item.nomorAyat);
    } else {
      addBookmark({
        surahId,
        nomorAyat: item.nomorAyat,
        surahName: surah?.namaLatin || "",
        ayahText: item.teksArab,
      });
    }
  };

  const onBookmarkLongPress = (item: Ayah) => {
    const currentCollections = useAppStore.getState().collections;

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
        if (Platform.OS === "ios") {
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
        } else {
          const collectionName = `Collection ${collections.length + 1}`;
          const newId = createCollection(collectionName);
          addAyatToCollection(newId, {
            surahId,
            nomorAyat: item.nomorAyat,
            surahName: surah?.namaLatin || "",
            ayahText: item.teksArab,
          });
          Alert.alert("Berhasil", `Ayat disimpan ke ${collectionName}`);
        }
      },
    });

    options.push({ text: "Batal", onPress: () => {} });

    Alert.alert("Simpan ke Koleksi", "Pilih folder penyimpanan:", options);
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

    return (
      <Animated.View
        entering={FadeInUp.delay(Math.min(index * 50, 500))}
        style={[
          styles.ayatContainer,
          isPlaying && styles.ayatContainerPlaying,
        ]}
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
              onPress={() => playSingleAyah(item)}
              style={styles.actionIcon}
              disabled={isLoadingAudio && isPlaying}
            >
              {isLoadingAudio && isPlaying ? (
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              ) : isPlaying ? (
                <Pause
                  color={PRIMARY_COLOR}
                  size={20}
                  fill={PRIMARY_COLOR}
                />
              ) : (
                <Play
                  color={PRIMARY_COLOR}
                  size={20}
                  fill="transparent"
                />
              )}
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

  // Handle viewable items change
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && surah && !isPlayingFullSurah) {
        const firstVisibleAyat = viewableItems[0].item;
        setLastRead({
          surahId,
          surahName: surah.nama || "",
          nomorAyat: firstVisibleAyat.nomorAyat,
          namaLatin: surah.namaLatin || "",
        });
      }
    },
    [surahId, surah, setLastRead, isPlayingFullSurah]
  );

  const viewabilityConfig = React.useMemo(
    () => ({ itemVisiblePercentThreshold: 30 }),
    []
  );

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

  // Scroll to specific ayah
  useEffect(() => {
    if (surah && nomorAyat) {
      const ayatIndex = surah.ayat.findIndex(
        (ayat: Ayah) => ayat.nomorAyat === nomorAyat
      );
      if (ayatIndex !== -1 && flatListRef.current) {
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
      <StatusBar
        barStyle="light-content"
        backgroundColor={BACKGROUND_COLOR}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={handleHome}>
          <ArrowLeft color={SECONDARY_COLOR} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{surah?.namaLatin || "Loading..."}</Text>
        <TouchableOpacity onPress={handleSearchPress}>
          <Search color={SECONDARY_COLOR} size={28} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Memuat Ayat...</Text>
        </View>
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
                <Text style={styles.bannerArabic}>{surah.nama}</Text>
                <Text style={styles.bannerTitle}>{surah.namaLatin}</Text>
                <Text style={styles.bannerSub}>{surah.arti}</Text>
                <View style={styles.divider} />
                <Text style={styles.bannerInfo}>
                  {surah.tempatTurun.toUpperCase()} • {surah.jumlahAyat} AYAT
                </Text>
                <Text style={styles.bismillah}>
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                </Text>

                {/* Qari Selector */}
                <TouchableOpacity
                  style={styles.qariSelector}
                  onPress={showQariSelector}
                  activeOpacity={0.7}
                >
                  <Volume2 color={TEXT_COLOR} size={16} />
                  <Text style={styles.qariText}>
                    {QARI_NAMES[selectedQari]}
                  </Text>
                </TouchableOpacity>

                {/* Play Full Surah */}
                <TouchableOpacity
                  style={[
                    styles.playFullButton,
                    isPlayingFullSurah && styles.playFullButtonActive,
                  ]}
                  onPress={playFullSurah}
                  activeOpacity={0.8}
                  disabled={isLoadingAudio && !isPlayingFullSurah}
                >
                  {isLoadingAudio && !isPlayingFullSurah ? (
                    <ActivityIndicator size="small" color={TEXT_COLOR} />
                  ) : isPlayingFullSurah ? (
                    <Pause color={TEXT_COLOR} size={24} fill={TEXT_COLOR} />
                  ) : (
                    <Play color={TEXT_COLOR} size={24} fill={TEXT_COLOR} />
                  )}
                  <Text style={styles.playFullButtonText}>
                    {isPlayingFullSurah
                      ? "Stop Playback"
                      : "Play Full Surah"}
                  </Text>
                </TouchableOpacity>

                {/* Audio Controls */}
                {isPlayingFullSurah && (
                  <View style={styles.audioControlsContainer}>
                    <View style={styles.audioControls}>
                      <TouchableOpacity
                        onPress={skipToPreviousAyah}
                        disabled={currentPlayingIndex === 0}
                        style={styles.controlButton}
                      >
                        <SkipBack
                          color={
                            currentPlayingIndex === 0
                              ? SECONDARY_COLOR
                              : TEXT_COLOR
                          }
                          size={22}
                        />
                      </TouchableOpacity>

                      <View style={styles.nowPlayingContainer}>
                        {isLoadingAudio && (
                          <ActivityIndicator
                            size="small"
                            color={TEXT_COLOR}
                            style={{ marginRight: 8 }}
                          />
                        )}
                        <Text style={styles.nowPlayingText}>
                          Ayah {playingAyat || "..."} / {surah.jumlahAyat}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={skipToNextAyah}
                        disabled={
                          currentPlayingIndex >= surah.ayat.length - 1
                        }
                        style={styles.controlButton}
                      >
                        <SkipForward
                          color={
                            currentPlayingIndex >= surah.ayat.length - 1
                              ? SECONDARY_COLOR
                              : TEXT_COLOR
                          }
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${((currentPlayingIndex + 1) / surah.ayat.length) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  bannerArabic: {
    color: TEXT_COLOR,
    fontSize: 32,
    marginBottom: 8,
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
  },
  qariSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  qariText: {
    color: TEXT_COLOR,
    fontSize: 13,
    fontWeight: "500",
  },
  playFullButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    marginTop: 16,
    gap: 12,
  },
  playFullButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.6)",
  },
  playFullButtonText: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: "700",
  },
  audioControlsContainer: {
    width: "100%",
    marginTop: 16,
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  controlButton: {
    padding: 10,
  },
  nowPlayingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nowPlayingText: {
    color: TEXT_COLOR,
    fontSize: 15,
    fontWeight: "600",
  },
  progressBarContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: TEXT_COLOR,
    borderRadius: 2,
  },
  listContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: TEXT_COLOR,
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  ayatContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  ayatContainerPlaying: {
    backgroundColor: "rgba(164, 74, 255, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_COLOR,
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
});

export default SurahDetail;