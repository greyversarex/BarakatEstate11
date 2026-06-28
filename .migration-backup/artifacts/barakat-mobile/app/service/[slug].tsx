import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SERVICES: Record<string, { title: string; eyebrow: string; description: string; highlights: string[]; cta: string; icon: string }> = {
  "buy-property": {
    title: "Срочный выкуп недвижимости",
    eyebrow: "Продажа без ожидания",
    description: "Быстро оцениваем объект, согласуем понятные условия и сопровождаем сделку до безопасного расчета.",
    highlights: ["Оценка за короткий срок", "Прозрачные условия", "Проверка документов", "Сопровождение сделки"],
    cta: "Получить оценку",
    icon: "key-outline",
  },
  repair: {
    title: "Ремонт под ключ",
    eyebrow: "Подготовка объекта",
    description: "Организуем ремонт от замера и сметы до финального декора.",
    highlights: ["Смета до старта", "Контроль этапов", "Подбор материалов", "Финальная приемка"],
    cta: "Рассчитать ремонт",
    icon: "hammer-outline",
  },
  putty: {
    title: "Шпаклевка в подарок",
    eyebrow: "Специальная акция",
    description: "Бесплатная шпаклевка стен при покупке жилья через агентство.",
    highlights: ["Бесплатно при покупке", "Проверенные материалы", "Контроль качества", "Готовность к финишной отделке"],
    cta: "Узнать условия",
    icon: "construct-outline",
  },
  design: {
    title: "Дизайнерские услуги",
    eyebrow: "Интерьер и планировка",
    description: "Разрабатываем планировки, 3D-визуализации и визуальную концепцию.",
    highlights: ["Планировочные решения", "3D-визуализация", "Подбор материалов", "Подготовка к ремонту"],
    cta: "Заказать дизайн",
    icon: "color-palette-outline",
  },
  cleaning: {
    title: "Клининговые услуги",
    eyebrow: "Чистый объект для показа",
    description: "Подготовим объект к продаже, аренде, фотосъемке или заселению.",
    highlights: ["Профессиональные клинеры", "Быстрый выезд", "После ремонта", "Подготовка к показу"],
    cta: "Заказать уборку",
    icon: "water-outline",
  },
  "document-registration": {
    title: "Оформление документов",
    eyebrow: "Юридическое сопровождение",
    description: "Помогаем подготовить, проверить и оформить документы для сделки.",
    highlights: ["Проверка документов", "Консультация по сделке", "Сопровождение оформления", "Контроль сроков"],
    cta: "Получить консультацию",
    icon: "document-text-outline",
  },
};

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const service = SERVICES[slug ?? "buy-property"] ?? SERVICES["buy-property"];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Заполните поля", "Укажите имя и номер телефона");
      return;
    }
    setSending(true);
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const base = domain ? `https://${domain}` : "";
      const res = await fetch(`${base}/api/service-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: service.title, name: name.trim(), phone: phone.trim(), message: message.trim() }),
      });
      if (res.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSent(true);
      } else {
        Alert.alert("Ошибка", "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch {
      Alert.alert("Ошибка", "Нет соединения. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          {service.title}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View style={[styles.heroCard, { backgroundColor: "#1A1610", borderRadius: colors.radius }]}>
          <Text style={[styles.eyebrow, { fontFamily: "Inter_600SemiBold" }]}>{service.eyebrow}</Text>
          <Text style={[styles.heroTitle, { fontFamily: "Inter_700Bold" }]}>{service.title}</Text>
          <Text style={[styles.heroDesc, { fontFamily: "Inter_400Regular" }]}>{service.description}</Text>
        </View>

        <View style={[styles.highlightsCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
            Что включено
          </Text>
          {service.highlights.map((h, i) => (
            <View key={i} style={styles.highlight}>
              <View style={[styles.checkIcon, { backgroundColor: colors.primary + "30" }]}>
                <Ionicons name="checkmark" size={14} color={colors.accent} />
              </View>
              <Text style={[styles.highlightText, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>{h}</Text>
            </View>
          ))}
        </View>

        {sent ? (
          <View style={[styles.successCard, { backgroundColor: "#F0FFF0", borderColor: "#68D391", borderRadius: colors.radius }]}>
            <Ionicons name="checkmark-circle" size={36} color="#38A169" />
            <Text style={[styles.successTitle, { fontFamily: "Inter_700Bold" }]}>Заявка отправлена!</Text>
            <Text style={[styles.successText, { fontFamily: "Inter_400Regular" }]}>
              Мы свяжемся с вами в ближайшее время
            </Text>
          </View>
        ) : (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              {service.cta}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background, borderRadius: 12, fontFamily: "Inter_400Regular" }]}
              placeholder="Ваше имя *"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background, borderRadius: 12, fontFamily: "Inter_400Regular" }]}
              placeholder="Номер телефона *"
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background, borderRadius: 12, fontFamily: "Inter_400Regular" }]}
              placeholder="Комментарий (необязательно)"
              placeholderTextColor={colors.mutedForeground}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Pressable
              onPress={handleSubmit}
              disabled={sending}
              style={[styles.submitBtn, { backgroundColor: sending ? colors.muted : colors.primary, borderRadius: 14 }]}
            >
              {sending ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <>
                  <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
                    {service.cta}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.primaryForeground} />
                </>
              )}
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  heroCard: {
    padding: 20,
    marginBottom: 12,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    color: "#DDB45D",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    lineHeight: 30,
  },
  heroDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 22,
    marginTop: 4,
  },
  highlightsCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  highlightText: {
    fontSize: 14,
  },
  formCard: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  submitBtn: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  successCard: {
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    color: "#276749",
  },
  successText: {
    fontSize: 14,
    color: "#48BB78",
    textAlign: "center",
    lineHeight: 20,
  },
});
