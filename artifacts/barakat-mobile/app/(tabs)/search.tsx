import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PropertyCard from "@/components/PropertyCard";
import { useColors } from "@/hooks/useColors";
import { fetchListings } from "@/lib/api";
import type { Property } from "@/lib/types";

const DEAL_TYPES = [
  { label: "Все", value: "all" },
  { label: "Продажа", value: "sale" },
  { label: "Аренда", value: "rent" },
];

const PROP_TYPES = ["Все типы", "Квартира", "Студия", "Дом", "Коммерческая", "Новостройка"];
const DISTRICTS = ["Все районы", "Центр", "И. Сомони", "Сино", "Фирдавси", "Шохмансур"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [dealType, setDealType] = useState("all");
  const [propType, setPropType] = useState("Все типы");
  const [district, setDistrict] = useState("Все районы");
  const [showFilters, setShowFilters] = useState(false);

  const { data: listings, isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const results = useMemo(() => {
    if (!listings) return [];
    return listings.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !(p.addr || "").toLowerCase().includes(q) &&
          !(p.district || "").toLowerCase().includes(q) &&
          !(p.propertyType || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (dealType !== "all" && p.tag !== dealType) return false;
      if (propType !== "Все типы" && p.propertyType !== propType) return false;
      if (district !== "Все районы" && p.district !== district) return false;
      return true;
    });
  }, [listings, query, dealType, propType, district]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const activeFilters = (dealType !== "all" ? 1 : 0) + (propType !== "Все типы" ? 1 : 0) + (district !== "Все районы" ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchRow, { backgroundColor: colors.muted, borderRadius: colors.radius / 2 }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="Адрес, район, тип..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          style={[
            styles.filterToggle,
            { backgroundColor: activeFilters > 0 ? colors.primary : colors.muted, borderRadius: 10 },
          ]}
        >
          <Ionicons name="options-outline" size={20} color={activeFilters > 0 ? colors.primaryForeground : colors.mutedForeground} />
          {activeFilters > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.accentForeground }]}>{activeFilters}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {showFilters && (
        <View style={[styles.filtersPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.filterLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>Тип сделки</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
            {DEAL_TYPES.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => setDealType(t.value)}
                style={[
                  styles.chip,
                  { backgroundColor: dealType === t.value ? colors.primary : colors.muted, borderColor: dealType === t.value ? colors.primary : colors.border },
                ]}
              >
                <Text style={{ color: dealType === t.value ? colors.primaryForeground : colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>Тип объекта</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
            {PROP_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => setPropType(t)}
                style={[
                  styles.chip,
                  { backgroundColor: propType === t ? colors.accent : colors.muted, borderColor: propType === t ? colors.accent : colors.border },
                ]}
              >
                <Text style={{ color: propType === t ? colors.accentForeground : colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>Район</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {DISTRICTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDistrict(d)}
                style={[
                  styles.chip,
                  { backgroundColor: district === d ? colors.accent : colors.muted, borderColor: district === d ? colors.accent : colors.border },
                ]}
              >
                <Text style={{ color: district === d ? colors.accentForeground : colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {activeFilters > 0 && (
            <Pressable
              onPress={() => { setDealType("all"); setPropType("Все типы"); setDistrict("Все районы"); }}
              style={styles.resetBtn}
            >
              <Text style={{ color: colors.accent, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                Сбросить фильтры
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="warning-outline" size={36} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 8 }}>Ошибка загрузки</Text>
            <Pressable onPress={() => refetch()} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }}>Повторить</Text>
            </Pressable>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="search-outline" size={40} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 8, fontSize: 15 }}>Ничего не найдено</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.count, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {results.length} {results.length === 1 ? "объект" : results.length < 5 ? "объекта" : "объектов"}
            </Text>
            {results.map((p) => (
              <PropertyCard key={String(p.id)} property={p} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  searchRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterToggle: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  filtersPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  resetBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    marginBottom: 12,
  },
  center: {
    paddingTop: 60,
    alignItems: "center",
    gap: 8,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
});
