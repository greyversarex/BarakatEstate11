import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const FACTS = [
  { icon: "home-outline" as const, label: "Объектов в базе", value: "200+" },
  { icon: "people-outline" as const, label: "Довольных клиентов", value: "1500+" },
  { icon: "briefcase-outline" as const, label: "Лет на рынке", value: "10+" },
  { icon: "location-outline" as const, label: "Районов Душанбе", value: "6" },
];

const SERVICES_SUMMARY = [
  "Покупка, продажа и аренда недвижимости",
  "Срочный выкуп объектов",
  "Ремонт и дизайн интерьера",
  "Клининговые услуги",
  "Юридическое оформление сделок",
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          О нас
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: "#1A1610" }]}>
          <Text style={[styles.heroTitle, { fontFamily: "Inter_700Bold" }]}>Barakat Estate</Text>
          <Text style={[styles.heroSubtitle, { fontFamily: "Inter_400Regular" }]}>
            Ведущее агентство недвижимости в Душанбе
          </Text>
          <Text style={[styles.heroDesc, { fontFamily: "Inter_400Regular" }]}>
            Мы помогаем людям находить, покупать, продавать и арендовать недвижимость в Таджикистане. Наша команда профессионалов знает рынок изнутри и работает в интересах каждого клиента.
          </Text>
        </View>

        <View style={[styles.factsGrid, { padding: 16 }]}>
          {FACTS.map((f) => (
            <View key={f.label} style={[styles.factCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <Ionicons name={f.icon} size={24} color={colors.primary} />
              <Text style={[styles.factValue, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                {f.value}
              </Text>
              <Text style={[styles.factLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ padding: 16 }}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              Наши услуги
            </Text>
            {SERVICES_SUMMARY.map((s, i) => (
              <View key={i} style={styles.serviceRow}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.serviceText, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}>
                  {s}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, marginTop: 12 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              Почему Barakat?
            </Text>
            <Text style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Мы ставим интересы клиента на первое место. Прозрачность, честные условия и сопровождение на каждом этапе — это не слова, а наш стандарт работы.
            </Text>
            <Text style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8 }]}>
              Мы работаем с объектами в Центре, Сино, Фирдавси, Шохмансуре и других районах Душанбе. Каждый объект проходит проверку перед размещением.
            </Text>
          </View>

          <View style={[styles.contactCard, { backgroundColor: "#1A1610", borderRadius: colors.radius }]}>
            <Text style={[styles.contactTitle, { fontFamily: "Inter_700Bold" }]}>Связаться с нами</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/services")}
              style={[styles.contactBtn, { backgroundColor: "#DDB45D", borderRadius: 12 }]}
            >
              <Text style={{ color: "#1A1610", fontFamily: "Inter_700Bold" }}>Оставить заявку</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/team")}
              style={[styles.contactBtnOutline, { borderColor: "rgba(221,180,93,0.4)", borderRadius: 12 }]}
            >
              <Text style={{ color: "#DDB45D", fontFamily: "Inter_600SemiBold" }}>Наша команда</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
  hero: {
    padding: 24,
    gap: 6,
  },
  heroTitle: {
    fontSize: 28,
    color: "#DDB45D",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  heroDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    marginTop: 8,
  },
  factsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  factCard: {
    width: "47%",
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  factValue: {
    fontSize: 22,
  },
  factLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceText: {
    fontSize: 14,
    lineHeight: 24,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactCard: {
    padding: 20,
    marginTop: 12,
    gap: 10,
  },
  contactTitle: {
    fontSize: 18,
    color: "#DDB45D",
    marginBottom: 4,
  },
  contactBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  contactBtnOutline: {
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
});
