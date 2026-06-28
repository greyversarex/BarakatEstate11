import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export default function PropertyCard({ property, compact }: PropertyCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(property.id);

  const handlePress = () => {
    router.push({ pathname: "/property/[id]", params: { id: String(property.id) } });
  };

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(property.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, opacity: pressed ? 0.92 : 1 },
        compact && styles.compact,
      ]}
    >
      <View style={[styles.imageWrap, { borderRadius: colors.radius - 2 }]}>
        {property.image ? (
          <Image
            source={{ uri: property.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }]}>
            <Ionicons name="home-outline" size={32} color={colors.mutedForeground} />
          </View>
        )}
        <View style={[styles.tagBadge, { backgroundColor: property.tag === "rent" ? colors.accent : colors.primary }]}>
          <Text style={[styles.tagText, { color: property.tag === "rent" ? colors.accentForeground : colors.primaryForeground }]}>
            {property.tagLabel}
          </Text>
        </View>
        <Pressable onPress={handleFav} style={styles.favBtn} hitSlop={8}>
          <Ionicons name={fav ? "heart" : "heart-outline"} size={20} color={fav ? "#E53E3E" : "#FFFFFF"} />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={[styles.price, { color: colors.accent, fontFamily: "Inter_700Bold" }]} numberOfLines={1}>
          {property.price}
        </Text>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>
          {property.title}
        </Text>
        <Text style={[styles.addr, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
          {property.addr || property.district}
        </Text>
        <View style={[styles.chips, { borderTopColor: colors.border }]}>
          {property.rooms > 0 && (
            <View style={[styles.chip, { backgroundColor: colors.muted }]}>
              <Ionicons name="bed-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{property.rooms}</Text>
            </View>
          )}
          {property.area > 0 && (
            <View style={[styles.chip, { backgroundColor: colors.muted }]}>
              <Ionicons name="resize-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{property.area} м²</Text>
            </View>
          )}
          {property.floor && property.floor !== "-" && (
            <View style={[styles.chip, { backgroundColor: colors.muted }]}>
              <Ionicons name="layers-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{property.floor}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  compact: {
    width: 220,
    marginBottom: 0,
    marginRight: 12,
  },
  imageWrap: {
    height: 180,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F0EAD8",
  },
  tagBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 12,
  },
  price: {
    fontSize: 17,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 20,
  },
  addr: {
    fontSize: 12,
    marginBottom: 8,
  },
  chips: {
    flexDirection: "row",
    gap: 6,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
