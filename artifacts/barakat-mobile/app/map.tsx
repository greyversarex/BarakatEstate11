import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { fetchListings } from "@/lib/api";
import type { Property } from "@/lib/types";

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeType, setActiveType] = useState<"all" | "sale" | "rent">("all");

  const { data: listings, isLoading } = useQuery<Property[]>({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const filtered = (listings ?? []).filter((p) => {
    if (activeType === "all") return true;
    return p.tag === activeType;
  });

  const openInMaps = (property: Property) => {
    if (property.lat && property.lng) {
      const url = Platform.OS === "ios"
        ? `maps:0,0?q=${property.lat},${property.lng}`
        : `geo:${property.lat},${property.lng}?q=${property.lat},${property.lng}`;
      Linking.openURL(url);
    } else if (property.addr) {
      const encoded = encodeURIComponent(`${property.addr}, Душанбе`);
      const url = Platform.OS === "ios"
        ? `maps:0,0?q=${encoded}`
        : `geo:0,0?q=${encoded}`;
      Linking.openURL(url);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Карта объектов
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.typeRow}>
        {(["all", "sale", "rent"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setActiveType(t)}
            style={[
              styles.typeChip,
              {
                backgroundColor: activeType === t ? colors.primary : colors.muted,
                borderColor: activeType === t ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.typeChipText, {
              color: activeType === t ? colors.primaryForeground : colors.mutedForeground,
              fontFamily: "Inter_600SemiBold",
            }]}>
              {t === "all" ? "Все" : t === "sale" ? "Продажа" : "Аренда"}
            </Text>
          </Pressable>
        ))}
        <Text style={[styles.count, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {filtered.length} объектов
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.mapPlaceholder, { backgroundColor: "#1A1610", borderRadius: colors.radius }]}>
            <Ionicons name="map" size={32} color="#DDB45D" />
            <Text style={{ color: "#DDB45D", fontFamily: "Inter_700Bold", fontSize: 16, marginTop: 8 }}>
              Все объекты на карте
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 13, textAlign: "center", marginTop: 4 }}>
              Нажмите на объект, чтобы открыть его в картах
            </Text>
          </View>

          <Text style={[styles.listTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
            Список объектов
          </Text>

          {filtered.map((p) => (
            <View
              key={String(p.id)}
              style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <Pressable
                onPress={() => router.push({ pathname: "/property/[id]", params: { id: String(p.id) } })}
                style={styles.itemLeft}
              >
                <View style={[styles.thumb, { borderRadius: 10, backgroundColor: colors.muted }]}>
                  {p.image ? (
                    <Image source={{ uri: p.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  ) : (
                    <Ionicons name="home-outline" size={20} color={colors.mutedForeground} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>
                    {p.title}
                  </Text>
                  <Text style={[styles.itemAddr, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                    {p.addr || p.district}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>
                    {p.price}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => openInMaps(p)}
                style={[styles.mapBtn, { backgroundColor: colors.muted, borderRadius: 10 }]}
              >
                <Ionicons name="navigate-outline" size={18} color={colors.accent} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18 },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeChipText: { fontSize: 13 },
  count: { marginLeft: "auto", fontSize: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapPlaceholder: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 17,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    gap: 10,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thumb: {
    width: 60,
    height: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: { fontSize: 14, lineHeight: 19 },
  itemAddr: { fontSize: 12, marginTop: 1 },
  itemPrice: { fontSize: 13, marginTop: 2 },
  mapBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
