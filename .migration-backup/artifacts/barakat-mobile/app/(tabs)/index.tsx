import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

const DISTRICTS = ["Все", "Центр", "И. Сомони", "Сино", "Фирдавси", "Шохмансур"];
const TYPES = [
  { label: "Все", value: "all" },
  { label: "Продажа", value: "sale" },
  { label: "Аренда", value: "rent" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Все");
  const [selectedType, setSelectedType] = useState("all");

  const { data: listings, isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const featured = listings?.filter((p) => p.new).slice(0, 8) ?? [];

  const filtered = (listings ?? []).filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !(p.addr || "").toLowerCase().includes(q) &&
        !(p.district || "").toLowerCase().includes(q)
      )
        return false;
    }
    if (selectedDistrict !== "Все" && p.district !== selectedDistrict) return false;
    if (selectedType !== "all" && p.tag !== selectedType) return false;
    return true;
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#1A1610", "#3D3526"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.logo, { fontFamily: "Inter_700Bold" }]}>Barakat Estate</Text>
            <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>
              Недвижимость в Душанбе
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => router.push("/map")}
              style={[styles.searchBtn, { backgroundColor: "rgba(221,180,93,0.2)" }]}
            >
              <Ionicons name="map-outline" size={20} color="#DDB45D" />
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              style={[styles.searchBtn, { backgroundColor: "rgba(221,180,93,0.2)" }]}
            >
              <Ionicons name="search" size={20} color="#DDB45D" />
            </Pressable>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(221,180,93,0.3)" }]}>
          <Ionicons name="search-outline" size={16} color="#EBCF8A" />
          <TextInput
            style={[styles.searchInput, { color: "#FFFFFF", fontFamily: "Inter_400Regular" }]}
            placeholder="Найти объект..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.5)" />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {TYPES.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => setSelectedType(t.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedType === t.value ? colors.primary : colors.muted,
                  borderColor: selectedType === t.value ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedType === t.value ? colors.primaryForeground : colors.mutedForeground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.separator} />
          {DISTRICTS.map((d) => (
            <Pressable
              key={d}
              onPress={() => setSelectedDistrict(d)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedDistrict === d ? colors.accent : colors.muted,
                  borderColor: selectedDistrict === d ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedDistrict === d ? colors.accentForeground : colors.mutedForeground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                {d}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {featured.length > 0 && !search && selectedDistrict === "Все" && selectedType === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                Рекомендованные
              </Text>
              <Ionicons name="star" size={14} color={colors.primary} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {featured.map((p) => (
                <PropertyCard key={String(p.id)} property={p} compact />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              {search || selectedDistrict !== "Все" || selectedType !== "all"
                ? `Найдено: ${filtered.length}`
                : "Все объекты"}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Ionicons name="warning-outline" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                Ошибка загрузки
              </Text>
              <Pressable onPress={() => refetch()} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }}>Повторить</Text>
              </Pressable>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="home-outline" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                Объекты не найдены
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16 }}>
              {filtered.map((p) => (
                <PropertyCard key={String(p.id)} property={p} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    fontSize: 22,
    color: "#DDB45D",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterRow: {
    marginVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#E7DDC8",
    marginHorizontal: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  center: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
