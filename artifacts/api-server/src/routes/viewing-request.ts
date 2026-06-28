import { Router } from "express";
import { db, viewingsTable, listingsTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";

const router = Router();

type ViewingRequest = {
  listingId?: string;
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  message?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

router.post("/viewing-request", async (req, res) => {
  const body = req.body as ViewingRequest;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const date = clean(body.date);
  const time = clean(body.time);
  const listingId = clean(body.listingId);
  const message = clean(body.message);

  if (!name || !phone || !date || !time) {
    res.status(400).json({ error: "Заполните имя, телефон, дату и время" });
    return;
  }

  // Derive the responsible agent and listing title from the listing itself
  // (never trust client-supplied assignee fields).
  let listingTitle = "";
  let employeeId = "";
  let sellerId = "";
  if (listingId) {
    try {
      const rows = await db.select().from(listingsTable)
        .where(or(eq(listingsTable.id, listingId), eq(listingsTable.slug, listingId)))
        .limit(1);
      const listing = rows[0];
      if (listing) {
        listingTitle = listing.title || "";
        employeeId = listing.employeeId || "";
        sellerId = listing.sellerId || "";
      }
    } catch {
      // fall through with empty assignee; admins still see the request
    }
  }

  try {
    await db.insert(viewingsTable).values({
      name, phone, date, time, listingId, listingTitle, employeeId, sellerId, message,
    });
  } catch {
    res.status(500).json({ error: "Failed to save viewing request" });
    return;
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    const text = `📅 *Новая заявка на просмотр!* 📅\n\n🏠 *Объект:* ${listingTitle || "—"}\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n🗓 *Дата:* ${date}\n⏰ *Время:* ${time}\n💬 *Комментарий:* ${message || "Нет комментария"}`;
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
