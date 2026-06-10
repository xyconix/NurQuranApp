import { Audio, AVPlaybackStatus } from "expo-av";
import { AudioSources } from "../types/quran.types";
import { QARI_FALLBACK_ORDER, DEFAULT_QARI } from "../constants/qari";

export const setupAudioMode = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    return true;
  } catch (error) {
    console.error("Error setting audio mode:", error);
    return false;
  }
};

export const getAudioUrl = (
  audio: AudioSources,
  selectedQari: string,
): string => {
  if (audio[selectedQari]) return audio[selectedQari];
  
  for (const key of QARI_FALLBACK_ORDER) {
    if (audio[key]) return audio[key];
  }
  return "";
};

export const cleanupSound = async (soundRef: React.MutableRefObject<Audio.Sound | null>) => {
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

export const tryPlayAudio = async (
  audio: AudioSources,
  selectedQari: string,
  ayatNumber: number,
  soundRef: React.MutableRefObject<Audio.Sound | null>,
  onFinish?: () => void,
): Promise<boolean> => {
  const urlKeys = [selectedQari, ...QARI_FALLBACK_ORDER];
  const triedUrls = new Set<string>();

  for (const key of urlKeys) {
    const url = audio[key];
    if (!url || triedUrls.has(url)) continue;
    triedUrls.add(url);

    try {
      await cleanupSound(soundRef);

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume: 1.0, rate: 1.0 },
      );

      if (!status.isLoaded) {
        await newSound.unloadAsync();
        continue;
      }

      newSound.setOnPlaybackStatusUpdate((playbackStatus: AVPlaybackStatus) => {
        if (!playbackStatus.isLoaded) return;
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping && onFinish) {
          onFinish();
        }
      });

      soundRef.current = newSound;
      return true;
    } catch (error) {
      console.error(`Error with Qari ${key}:`, error);
      continue;
    }
  }

  return false;
};