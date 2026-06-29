import { Router } from "express";
import { db, applicationsTable } from "@workspace/db";

const router = Router();

type ServiceRequest = {
  name?: string;
  phone?: string;
  service?: string;
  district?: string;
  landmark?: string;
  message?: string;
  photos?: unknown;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

const MAX_PHOTOS = 8;
const MAX_PHOTO_LEN = 3_500_000; // ~3.5MB per data URL
const PHOTO_RE = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/;

function normalizePhotos(value: unknown): string {
  const arr = Array.isArray(value) ? value : value ? [value] : [];
  return arr
    .map((v) => String(v || "").trim())
    .filter((v) => v.length > 0 && v.length <= MAX_PHOTO_LEN && PHOTO_RE.test(v))
    .slice(0, MAX_PHOTOS)
    .join("\n");
}

router.post("/service-request", async (req, res) => {
  const body = req.body as ServiceRequest;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const service = clean(body.service);
  const district = clean(body.district);
  const landmark = clean(body.landmark);
  const message = clean(body.message);
  const photos = normalizePhotos(body.photos);

  if (!name || !phone || !service) {
    res.status(400).json({ error: "Заполните имя, телефон и услугу" });
    return;
  }

  try {
    await db.insert(applicationsTable).values({ name, phone, service, district, landmark, message, photos });
  } catch {
    res.status(500).json({ error: "Failed to save application" });
    return;
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    const text = `🌟 *Новая заявка с сайта!* 🌟\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n🛠 *Услуга:* ${service}\n📍 *Район:* ${district || "—"}\n🧭 *Ориентир:* ${landmark || "—"}\n💬 *Сообщение:* ${message || "Нет сообщения"}`;
    try {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: "Markdown",
        }),
      });
    } catch {
      // Telegram notification failure is non-fatal
    }
  }

  res.json({ ok: true });
});

export default router;
