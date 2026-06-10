import { useState, useMemo, useCallback, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { SearchResult } from "../types/search.types";
import { filterSurahsByQuery, isValidSearchQuery } from "../utils/searchHelpers";
import { SEARCH_CONSTANTS } from "../types/search.types";

export const useSearch = () => {
  const { allSurahs } = useAppStore();
  const [query, setQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, SEARCH_CONSTANTS.DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<SearchResult[]>(() => {
    if (!isValidSearchQuery(debouncedQuery)) {
      return [];
    }
    return filterSurahsByQuery(allSurahs, debouncedQuery, SEARCH_CONSTANTS.MIN_SEARCH_LENGTH);
  }, [debouncedQuery, allSurahs]);

  const hasResults = results.length > 0;
  const isValidQuery = isValidSearchQuery(query);
  const isQueryTooShort = query.length > 0 && query.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH;
  const resultCount = results.length;

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const updateQuery = useCallback((text: string) => {
    setQuery(text);
  }, []);

  return {
    query,
    setQuery: updateQuery,
    clearSearch,
    results,
    hasResults,
    isValidQuery,
    isQueryTooShort,
    resultCount,
    isDebouncing,
  };
};