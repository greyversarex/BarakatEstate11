import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { fetchListings } from "@/lib/api";
import type { Property } from "@/lib/types";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageIndex, setImageIndex] = useState(0);

  const { data: listings, isLoading } = useQuery<Property[]>({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const property = listings?.find((p) => String(p.id) === id);
  const fav = property ? isFavorite(property.id) : false;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="home-outline" size={40} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 8 }}>
          Объект не найден
        </Text>
      </View>
    );
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const images = property.images.length > 0 ? property.images : property.image ? [property.image] : [];

  const handleCall = () => {
    if (property.phone) Linking.openURL(`tel:${property.phone}`);
  };

  const handleTelegram = () => {
    if (property.telegram) Linking.openURL(`https://t.me/${property.telegram.replace("@", "")}`);
  };

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(property.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={handleFav} style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
          <Ionicons name={fav ? "heart" : "heart-outline"} size={20} color={fav ? "#E53E3E" : "#FFFFFF"} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      >
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / 375);
                setImageIndex(idx);
              }}
            >
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.mainImage} contentFit="cover" />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.mainImage, { backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }]}>
              <Ionicons name="home-outline" size={48} color={colors.mutedForeground} />
            </View>
          )}
          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === imageIndex ? "#FFFFFF" : "rgba(255,255,255,0.5)" },
                  ]}
                />
              ))}
            </View>
          )}
          <View style={[styles.tagBadge, { backgroundColor: property.tag === "rent" ? colors.accent : colors.primary }]}>
            <Text style={{ color: property.tag === "rent" ? colors.accentForeground : colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 12 }}>
              {property.tagLabel}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.price, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>
            {property.price}
          </Text>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
            {property.title}
          </Text>
          {property.addr && (
            <View style={styles.addrRow}>
              <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
              <Text style={[styles.addr, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {property.addr}
              </Text>
            </View>
          )}

          <View style={[styles.specs, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            {property.rooms > 0 && <SpecItem icon="bed-outline" label="Комнат" value={String(property.rooms)} colors={colors} />}
            {property.area > 0 && <SpecItem icon="resize-outline" label="Площадь" value={`${property.area} м²`} colors={colors} />}
            {property.floor && property.floor !== "-" && <SpecItem icon="layers-outline" label="Этаж" value={property.floor} colors={colors} />}
            {property.district && <SpecItem icon="map-outline" label="Район" value={property.district} colors={colors} />}
            {property.propertyType && <SpecItem icon="business-outline" label="Тип" value={property.propertyType} colors={colors} />}
          </View>

          {property.description ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                Описание
              </Text>
              <Text style={[styles.description, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {property.description}
              </Text>
            </View>
          ) : null}

          {property.agentName && (
            <View style={[styles.agentCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
                {property.agentAvatar ? (
                  <Image source={{ uri: property.agentAvatar }} style={StyleSheet.absoluteFill} contentFit="cover" />
                ) : (
                  <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
                    {property.agent}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.agentName, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  {property.agentName}
                </Text>
                <Text style={[styles.agentRole, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  Агент • {property.deals} сделок
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Platform.OS === "web" ? 16 : insets.bottom + 8 }]}>
        {property.telegram && (
          <Pressable
            onPress={handleTelegram}
            style={[styles.ctaBtn, { backgroundColor: "#2AABEE", borderRadius: 14 }]}
          >
            <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
          </Pressable>
        )}
        <Pressable
          onPress={handleCall}
          style={[styles.ctaMainBtn, { backgroundColor: colors.primary, borderRadius: 14, flex: 1 }]}
        >
          <Ionicons name="call-outline" size={18} color={colors.primaryForeground} />
          <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
            Позвонить
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function SpecItem({ icon, label, value, colors }: { icon: string; label: string; value: string; colors: ReturnType<typeof import("@/hooks/useColors").useColors> }) {
  return (
    <View style={specStyles.item}>
      <Ionicons name={icon as never} size={18} color={colors.primary} />
      <View>
        <Text style={[specStyles.label, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{label}</Text>
        <Text style={[specStyles.value, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{value}</Text>
      </View>
    </View>
  );
}

const specStyles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, flex: 1, minWidth: "40%" },
  label: { fontSize: 11 },
  value: { fontSize: 14 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: 375,
    height: 300,
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  price: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  addrRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addr: {
    fontSize: 14,
  },
  specs: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    overflow: "hidden",
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  agentName: {
    fontSize: 15,
  },
  agentRole: {
    fontSize: 12,
    marginTop: 2,
  },
  ctaBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ctaBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaMainBtn: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
