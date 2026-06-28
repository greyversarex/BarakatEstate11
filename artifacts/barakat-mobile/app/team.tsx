import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
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
import { useQuery } from "@tanstack/react-query";

import { useColors } from "@/hooks/useColors";

const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

interface Agent {
  id: number | string;
  name?: string;
  fullName?: string;
  role?: string;
  phone?: string;
  telegram?: string;
  avatar?: string;
  dealsCount?: number;
  rating?: number;
}

function getAvatarUrl(avatar: string | undefined): string {
  if (!avatar) return "";
  if (/^https?:/.test(avatar)) return avatar;
  return `${BASE_URL}${avatar}`;
}

async function fetchTeam(): Promise<Agent[]> {
  if (!BASE_URL) return [];
  const res = await fetch(`${BASE_URL}/api/users`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function TeamScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data: team, isLoading } = useQuery<Agent[]>({
    queryKey: ["team"],
    queryFn: fetchTeam,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Наша команда
        </Text>
        <View style={{ width: 22 }} />
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
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Профессионалы с глубоким знанием рынка недвижимости Душанбе
          </Text>

          {(!team || team.length === 0) ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="people-outline" size={40} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8 }}>
                Информация о команде временно недоступна
              </Text>
            </View>
          ) : (
            team.map((agent) => {
              const name = agent.fullName || agent.name || "Специалист";
              const avatarUrl = getAvatarUrl(agent.avatar);
              return (
                <View
                  key={String(agent.id)}
                  style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    ) : (
                      <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 20 }}>
                        {initials(name)}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                      {name}
                    </Text>
                    {agent.role && (
                      <Text style={[styles.role, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                        {agent.role}
                      </Text>
                    )}
                    <View style={styles.stats}>
                      {(agent.dealsCount ?? 0) > 0 && (
                        <View style={styles.stat}>
                          <Ionicons name="checkmark-circle-outline" size={13} color={colors.primary} />
                          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                            {agent.dealsCount} сделок
                          </Text>
                        </View>
                      )}
                      {(agent.rating ?? 0) > 0 && (
                        <View style={styles.stat}>
                          <Ionicons name="star" size={13} color={colors.primary} />
                          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                            {agent.rating}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.actions}>
                    {agent.phone && (
                      <Pressable
                        onPress={() => Linking.openURL(`tel:${agent.phone}`)}
                        style={[styles.actionBtn, { backgroundColor: colors.muted }]}
                      >
                        <Ionicons name="call-outline" size={18} color={colors.accent} />
                      </Pressable>
                    )}
                    {agent.telegram && (
                      <Pressable
                        onPress={() => Linking.openURL(`https://t.me/${agent.telegram?.replace("@", "")}`)}
                        style={[styles.actionBtn, { backgroundColor: "#2AABEE20" }]}
                      >
                        <Ionicons name="paper-plane-outline" size={18} color="#2AABEE" />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
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
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { alignItems: "center", paddingTop: 60 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 16 },
  role: { fontSize: 13, marginTop: 2 },
  stats: { flexDirection: "row", gap: 10, marginTop: 4 },
  stat: { flexDirection: "row", alignItems: "center", gap: 3 },
  actions: { gap: 6 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
