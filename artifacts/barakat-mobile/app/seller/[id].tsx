import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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

import PropertyCard from "@/components/PropertyCard";
import { useColors } from "@/hooks/useColors";
import { fetchListings } from "@/lib/api";
import type { Property } from "@/lib/types";

const ADMIN_API = "https://barakatestateadmin.vercel.app";

interface SellerProfile {
  id: string | number;
  name?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  avatar?: unknown;
  dealsCount?: number;
  rating?: number;
  bio?: string;
}

function getAvatarUrl(avatar: unknown): string {
  if (!avatar) return "";
  if (typeof avatar === "string") {
    if (/^https?:/.test(avatar)) return avatar;
    return `${ADMIN_API}${avatar}`;
  }
  // @ts-ignore
  const url = avatar?.data?.attributes?.url || avatar?.url;
  if (!url) return "";
  if (/^https?:/.test(url)) return url;
  return `${ADMIN_API}${url}`;
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

async function fetchSeller(id: string): Promise<SellerProfile | null> {
  try {
    const res = await fetch(`${ADMIN_API}/api/profile?id=${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.attributes || data?.data || data || null;
  } catch {
    return null;
  }
}

export default function SellerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data: seller, isLoading: sellerLoading } = useQuery<SellerProfile | null>({
    queryKey: ["seller", id],
    queryFn: () => fetchSeller(id ?? ""),
    enabled: !!id,
  });

  const { data: listings } = useQuery<Property[]>({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const sellerListings = (listings ?? []).filter(
    (p) => p.sellerId && String(p.sellerId) === String(id)
  );

  const name = seller?.name || "Специалист";
  const avatarUrl = getAvatarUrl(seller?.avatar);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Профиль
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {sellerLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.profileCard, { backgroundColor: "#1A1610", borderRadius: colors.radius }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
              ) : (
                <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 24 }}>
                  {initials(name)}
                </Text>
              )}
            </View>
            <Text style={[styles.name, { fontFamily: "Inter_700Bold" }]}>{name}</Text>
            {(seller?.dealsCount ?? 0) > 0 && (
              <Text style={[styles.deals, { fontFamily: "Inter_400Regular" }]}>
                {seller?.dealsCount} успешных сделок
              </Text>
            )}
            <View style={styles.contactRow}>
              {seller?.phone && (
                <Pressable
                  onPress={() => Linking.openURL(`tel:${seller.phone}`)}
                  style={[styles.ctaBtn, { backgroundColor: "#DDB45D", borderRadius: 12 }]}
                >
                  <Ionicons name="call-outline" size={16} color="#1A1610" />
                  <Text style={{ color: "#1A1610", fontFamily: "Inter_700Bold" }}>Позвонить</Text>
                </Pressable>
              )}
              {seller?.telegram && (
                <Pressable
                  onPress={() => Linking.openURL(`https://t.me/${seller.telegram?.replace("@", "")}`)}
                  style={[styles.ctaBtn, { backgroundColor: "#2AABEE", borderRadius: 12 }]}
                >
                  <Ionicons name="paper-plane-outline" size={16} color="#FFFFFF" />
                  <Text style={{ color: "#FFFFFF", fontFamily: "Inter_700Bold" }}>Telegram</Text>
                </Pressable>
              )}
            </View>
          </View>

          {sellerListings.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                Объекты продавца
              </Text>
              {sellerListings.map((p) => (
                <PropertyCard key={String(p.id)} property={p} />
              ))}
            </>
          )}

          {sellerListings.length === 0 && !sellerLoading && (
            <View style={styles.empty}>
              <Ionicons name="home-outline" size={36} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8 }}>
                Объявлений пока нет
              </Text>
            </View>
          )}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 16,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
  },
  deals: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  contactRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    paddingTop: 40,
  },
});
