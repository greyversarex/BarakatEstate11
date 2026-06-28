import { Router } from "express";
import { db, applicationsTable } from "@workspace/db";

const router = Router();

type ServiceRequest = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

router.post("/service-request", async (req, res) => {
  const body = req.body as ServiceRequest;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const service = clean(body.service);
  const message = clean(body.message);

  if (!name || !phone || !service) {
    res.status(400).json({ error: "Заполните имя, телефон и услугу" });
    return;
  }

  try {
    await db.insert(applicationsTable).values({ name, phone, service, message });
  } catch {
    res.status(500).json({ error: "Failed to save application" });
    return;
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    const text = `🌟 *Новая заявка с сайта!* 🌟\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n🛠 *Услуга:* ${service}\n💬 *Сообщение:* ${message || "Нет сообщения"}`;
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
