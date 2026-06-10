export interface Surah {
  nomor: number;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  nama: string;
  tempatTurun?: string;
  audio?: string | null;
}

export interface SearchResult extends Surah {
  matchScore?: number;
  highlightedText?: string;
}

export type SearchState = {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const SEARCH_CONSTANTS = {
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 100,
  DEBOUNCE_DELAY: 300,
} as const;