import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SERVICES = [
  {
    slug: "buy-property",
    title: "Срочный выкуп",
    description: "Оценка объекта и быстрая сделка без лишней волокиты",
    icon: "key-outline" as const,
    eyebrow: "Продажа без ожидания",
    color: "#8F6728",
  },
  {
    slug: "repair",
    title: "Ремонт под ключ",
    description: "Смета, подбор материалов и контроль подрядчиков",
    icon: "hammer-outline" as const,
    eyebrow: "Подготовка объекта",
    color: "#5C7A4A",
  },
  {
    slug: "putty",
    title: "Шпаклевка в подарок",
    description: "Бесплатная шпаклевка стен при покупке жилья через агентство",
    icon: "construct-outline" as const,
    eyebrow: "Специальная акция",
    color: "#4A6B8A",
  },
  {
    slug: "design",
    title: "Дизайн интерьера",
    description: "Планировки, 3D-визуализации и стильная упаковка объекта",
    icon: "color-palette-outline" as const,
    eyebrow: "Интерьер и планировка",
    color: "#7A4A7A",
  },
  {
    slug: "cleaning",
    title: "Клининговые услуги",
    description: "Уборка перед показом, после ремонта или перед заселением",
    icon: "water-outline" as const,
    eyebrow: "Чистый объект для показа",
    color: "#4A8A7A",
  },
  {
    slug: "document-registration",
    title: "Оформление документов",
    description: "Проверка, подготовка и юридическое сопровождение сделки",
    icon: "document-text-outline" as const,
    eyebrow: "Юридическое сопровождение",
    color: "#6B4A3C",
  },
];

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Услуги
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Всё для вашей недвижимости
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map((service) => (
          <Pressable
            key={service.slug}
            onPress={() => router.push({ pathname: "/service/[slug]", params: { slug: service.slug } })}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: service.color + "20", borderRadius: 14 }]}>
              <Ionicons name={service.icon} size={28} color={service.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.eyebrow, { color: service.color, fontFamily: "Inter_600SemiBold" }]}>
                {service.eyebrow}
              </Text>
              <Text style={[styles.cardTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
                {service.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {service.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}

        <View style={[styles.contactCard, { backgroundColor: "#1A1610", borderRadius: colors.radius }]}>
          <Text style={[styles.contactTitle, { fontFamily: "Inter_700Bold" }]}>
            Нужна консультация?
          </Text>
          <Text style={[styles.contactSubtitle, { fontFamily: "Inter_400Regular" }]}>
            Оставьте заявку — мы свяжемся в ближайшее время
          </Text>
          <Pressable
            onPress={() => router.push({ pathname: "/service/[slug]", params: { slug: "buy-property" } })}
            style={[styles.contactBtn, { backgroundColor: "#DDB45D", borderRadius: 12 }]}
          >
            <Text style={{ color: "#1A1610", fontFamily: "Inter_700Bold", fontSize: 14 }}>
              Оставить заявку
            </Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
          <Pressable
            onPress={() => router.push("/team")}
            style={[styles.infoBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, flex: 1 }]}
          >
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
              Наша команда
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/about")}
            style={[styles.infoBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, flex: 1 }]}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
              О компании
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactCard: {
    padding: 20,
    marginTop: 8,
    gap: 8,
  },
  contactTitle: {
    fontSize: 18,
    color: "#DDB45D",
  },
  contactSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
  contactBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
  },
});
