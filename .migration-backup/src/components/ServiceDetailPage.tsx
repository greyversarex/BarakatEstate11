"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  Brush,
  Check,
  ClipboardCheck,
  FileCheck2,
  Hammer,
  PackageCheck,
  PaintBucket,
  Plus,
  Ruler,
  ShieldCheck,
  Sparkles,
  SprayCan,
  TimerReset,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

import type { ServiceDetail } from "@/content/service-details";
import { serviceList } from "@/content/service-details";


const serviceIcons = {
  buyout: BadgeDollarSign,
  repair: Hammer,
  putty: PaintBucket,
  design: Brush,
  cleaning: SprayCan,
  documents: FileCheck2,
} satisfies Record<ServiceDetail["theme"], typeof Sparkles>;

const serviceCardImages: Record<string, string> = {
  "Принимаем заявку и фото": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=640&q=80",
  "Проверяем базовые документы": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80",
  "Согласуем цену и сроки": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=640&q=80",
  "Доводим оформление до конца": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=640&q=80",
  Квартиры: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=640&q=80",
  Дома: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80",
  "Коммерческие помещения": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80",
  "Объекты после ремонта или без отделки": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=80",
  "Замер и техническое задание": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=80",
  "Черновые и чистовые работы": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=640&q=80",
  "Сантехника и электрика": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=640&q=80",
  "Комплектация и декор": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=640&q=80",
  "Квартира перед продажей": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=640&q=80",
  "Объект под аренду": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=640&q=80",
  "Новостройка без отделки": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80",
  "Косметическое обновление": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=640&q=80",
  "Концепция интерьера": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=640&q=80",
  "План мебели": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=640&q=80",
  "Свет и электрика": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=640&q=80",
  "Материалы и цветовые решения": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=640&q=80",
  "Подготовка квартиры к продаже": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=640&q=80",
  "Интерьер для семьи": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=640&q=80",
  "Обновление старого фонда": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=640&q=80",
  "Визуальная упаковка объекта": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=640&q=80",
  "Генеральная уборка": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=640&q=80",
  "Кухня и санузлы": "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=640&q=80",
  "Удаление пыли после ремонта": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=640&q=80",
  "Подготовка перед заселением": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=640&q=80",
  Офисы: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=640&q=80",
  "Проверка права собственности": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80",
  "Подготовка пакета": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=640&q=80",
  "Сопровождение купли-продажи": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=640&q=80",
  "Консультация по рискам": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80",
  "Покупка квартиры": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=640&q=80",
  "Продажа объекта": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=640&q=80",
  Переоформление: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80",
  "Подготовка к сделке": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80",
};

const serviceFallbackImages = {
  buyout: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=640&q=80",
  repair: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=640&q=80",
  putty: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=640&q=80",
  design: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=640&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=640&q=80",
  documents: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80",
} satisfies Record<ServiceDetail["theme"], string>;

const puttyCardImages: Record<string, string> = {
  "Осмотр объекта": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=640&q=80",
  "Подбор материалов": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=640&q=80",
  "Шпаклевка стен": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=640&q=80",
  "Проверка готовой поверхности": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=640&q=80",
  "Экономия бюджета": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80",
  "Меньше подрядчиков": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=640&q=80",
  "Быстрый старт ремонта": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=80",
  "Понятные сроки работ": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=640&q=80",
};

const serviceItemIcons: Record<string, typeof Sparkles> = {
  "Осмотр объекта": Ruler,
  "Подбор материалов": PackageCheck,
  "Шпаклевка стен": Brush,
  "Проверка готовой поверхности": BadgeCheck,
  "Экономия бюджета": WalletCards,
  "Меньше подрядчиков": ShieldCheck,
  "Быстрый старт ремонта": TimerReset,
  "Понятные сроки работ": ClipboardCheck,
};

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ServiceIcon = serviceIcons[service.theme];

  return (
    <main className={`service-detail-page service-layout-${service.theme}`} data-theme={service.theme}>
      <section className="service-detail-hero">
        <div className="service-detail-shell service-detail-hero-grid">
          <div className="service-detail-copy">
            <Link className="service-detail-back" href="/services">
              Услуги
            </Link>
            <span className="service-detail-eyebrow">
              <Sparkles size={14} /> {service.eyebrow}
            </span>
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <div className="service-detail-actions" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a className="btn-primary" href="tel:+992055077777">
                Позвонить
              </a>
              <Link className="btn-secondary" href="/listings">
                Смотреть объявления
              </Link>
            </div>
          </div>

          <div className="service-detail-media">
            <Image src={service.image} alt={service.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 48vw" />
            <div className="service-hero-shapes" aria-hidden="true">
              <span className="service-shape service-shape-one"></span>
              <span className="service-shape service-shape-two"></span>
              <span className="service-shape service-shape-three"></span>
            </div>
            <div className="service-detail-float-card">
              <ServiceIcon size={20} />
              <strong>{service.shortTitle}</strong>
              <span>{service.priceLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="service-detail-band">
        <div className="service-detail-shell service-detail-highlights">
          {service.highlights.map((item, index) => (
            <div key={item}>
              <span className="service-highlight-index">{String(index + 1).padStart(2, "0")}</span>
              <Check size={18} />
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      {service.sections.map((section, index) => (
        <section className="service-detail-section" key={section.title}>
          <div className={`service-detail-shell service-detail-info ${index % 2 ? "reverse" : ""}`}>
            <div className="service-detail-text-panel">
              <span className="service-detail-eyebrow">0{index + 1}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
            <div className="service-detail-card-grid">
              {section.items.map((item) => {
                const ItemIcon = serviceItemIcons[item] ?? ServiceIcon;
                const image = puttyCardImages[item] ?? serviceCardImages[item] ?? serviceFallbackImages[service.theme];

                return (
                  <article className="service-detail-card" key={item}>
                    <div className="service-card-thumb" aria-hidden="true">
                      <Image src={image} alt="" fill sizes="160px" />
                    </div>
                    <ItemIcon className="service-card-theme-icon" size={22} />
                    <span></span>
                    <strong>{item}</strong>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="service-detail-section service-detail-muted">
        <div className="service-detail-shell service-detail-faq">
          <div>
            <span className="service-detail-eyebrow">Вопросы</span>
            <h2>Перед заявкой</h2>
          </div>
          <div className="service-detail-faq-list">
            {service.faq.map((item) => (
              <article className={openFaq === item.question ? "open" : ""} key={item.question}>
                <button
                  aria-expanded={openFaq === item.question}
                  onClick={() => setOpenFaq((current) => (current === item.question ? null : item.question))}
                  type="button"
                >
                  <span>{item.question}</span>
                  <Plus size={20} />
                </button>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .beautiful-input { background: rgba(255, 255, 255, 0.6); border: 1px solid var(--gold); transition: all 0.3s ease; text-align: left; backdrop-filter: blur(4px); }
        .beautiful-input:focus { background: white; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); outline: none; }
        .minimal-btn { transition: all 0.3s ease; }
        .minimal-btn:hover { transform: translateY(-2px); filter: brightness(0.95); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3); }
        .minimal-btn:active { transform: translateY(0); }
        @media (max-width: 768px) {
          .service-request-form {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
            gap: 16px !important;
          }
        }
      `}} />
      <section className="service-request-section" style={{ padding: "80px 0", background: "var(--ink)", color: "white", display: "flex", justifyContent: "center" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ color: "white", marginBottom: "12px", fontSize: "32px", fontWeight: 400, textAlign: "center" }}>Оставить заявку</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", fontWeight: 300, textAlign: "center", margin: 0 }}>Заполните форму, и мы свяжемся с вами в ближайшее время для обсуждения деталей.</p>
          </div>
          
          <div style={{ width: "100%", maxWidth: "600px" }}>
            {isSubmitted ? (
              <div style={{ background: "linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%)", border: "1px solid var(--gold)", borderRadius: "20px", padding: "48px 32px", textAlign: "center", color: "var(--ink)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", marginBottom: "24px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)", color: "white", boxShadow: "0 10px 25px rgba(22, 163, 74, 0.4)" }}>
                    <Check size={32} strokeWidth={3} />
                  </div>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 500, marginBottom: "8px" }}>Спасибо за заявку</h3>
                <p style={{ fontSize: "16px", color: "var(--muted)" }}>Мы ответим вам как можно быстрее.</p>
              </div>
            ) : (
              <form 
                className="service-request-form"
                style={{ background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)", border: "1px solid var(--gold)", padding: "48px", borderRadius: "20px", width: "100%", color: "var(--ink)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (phone.replace(/\D/g, "").length < 12) {
                    alert('Пожалуйста, введите корректный номер телефона.');
                    return;
                  }
                  setIsSubmitting(true);
                  
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                    service: service.shortTitle
                  };
                  
                  try {
                    const res = await fetch('/api/service-request', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    
                    if (!res.ok) throw new Error('Ошибка сервера');
                    setIsSubmitted(true);
                  } catch (err) {
                    console.error(err);
                    alert('Ошибка при отправке. Попробуйте позже.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "var(--ink)" }}>Ваше имя</span>
                  <input type="text" name="name" className="beautiful-input" required placeholder="Введите имя" style={{ width: "100%", padding: "16px 20px", borderRadius: "12px", color: "var(--ink)", fontSize: "15px" }} />
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "var(--ink)" }}>Ваш телефон</span>
                  <input type="tel" name="phone" className="beautiful-input" required placeholder="+992 000 00 0000" value={phone} onChange={(e) => {
                    let numbers = e.target.value.replace(/\D/g, "");
                    if (numbers.startsWith("992")) numbers = numbers.slice(3);
                    let formatted = "+992";
                    if (numbers.length > 0) formatted += " " + numbers.substring(0, 3);
                    if (numbers.length > 3) formatted += " " + numbers.substring(3, 5);
                    if (numbers.length > 5) formatted += " " + numbers.substring(5, 9);
                    setPhone(formatted);
                  }} style={{ width: "100%", padding: "16px 20px", borderRadius: "12px", color: "var(--ink)", fontSize: "15px" }} />
                </label>
                <label style={{ display: "block", gridColumn: "1 / -1" }}>
                  <span style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "var(--ink)" }}>Комментарий</span>
                  <textarea name="message" className="beautiful-input" required placeholder="Детали заявки..." style={{ width: "100%", padding: "16px 20px", borderRadius: "12px", color: "var(--ink)", fontSize: "15px", minHeight: "120px", resize: "none" }}></textarea>
                </label>
                <div style={{ textAlign: "center", gridColumn: "1 / -1", marginTop: "8px" }}>
                  <button type="submit" disabled={isSubmitting} className="minimal-btn" style={{ padding: "18px 48px", border: "none", borderRadius: "12px", background: "var(--gold)", color: "var(--ink)", fontWeight: 600, cursor: "pointer", fontSize: "16px", width: "100%", opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>


      <section className="service-detail-section">
        <div className="service-detail-shell">
          <div className="service-detail-more-head">
            <span className="service-detail-eyebrow">Еще услуги</span>
            <h2>Сервисы Barakat Estate</h2>
          </div>
          <div className="service-detail-more-grid">
            {serviceList
              .filter((item) => item.slug !== service.slug)
              .map((item) => (
                <Link className="service-detail-more-card" data-theme={item.theme} href={item.href} key={item.slug}>
                  <strong>{item.shortTitle}</strong>
                  <span>{item.cardText}</span>
                  <b>
                    Подробнее <ArrowRight size={15} />
                  </b>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
