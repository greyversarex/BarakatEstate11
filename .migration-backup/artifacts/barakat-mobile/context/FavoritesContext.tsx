import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const FAV_KEY = "barakat_favorites";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (id: string | number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAV_KEY).then((raw) => {
      if (raw) {
        try {
          setFavoriteIds(JSON.parse(raw));
        } catch {
          setFavoriteIds([]);
        }
      }
    });
  }, []);

  const isFavorite = useCallback(
    (id: string | number) => favoriteIds.includes(String(id)),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (id: string | number) => {
      const sid = String(id);
      setFavoriteIds((prev) => {
        const next = prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid];
        AsyncStorage.setItem(FAV_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
