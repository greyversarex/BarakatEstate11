import { NextResponse } from "next/server";

type ServiceRequest = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ServiceRequest;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const service = clean(body.service);
  const message = clean(body.message);

  if (!name || !phone || !service) {
    return NextResponse.json({ error: "Заполните имя, телефон и услугу" }, { status: 400 });
  }

  // Save to Admin DB
  const adminApi = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : (process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://barakatestateadmin.vercel.app");
  
  try {
    const response = await fetch(`${adminApi}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, service, message }),
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to save application" }, { status: 502 });
    }
  } catch (e) {
    console.error("Failed to save lead to admin DB:", e);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

  // Send to Telegram
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
          text: text,
          parse_mode: "Markdown",
        }),
      });
    } catch (e) {
      console.error("Failed to send telegram message:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
