import { AyahItemCollection } from "../types/quran.types";

export const getItemCountText = (count: number): string => {
  return `${count} item${count !== 1 ? "s" : ""}`;
};

export const formatShareMessage = (item: AyahItemCollection): string => {
  return `${item.surahName} - Ayah ${item.nomorAyat}\n\n${item.ayahText}`;
};

export const getItemKey = (item: AyahItemCollection): string => {
  return `${item.surahId}-${item.nomorAyat}`;
};