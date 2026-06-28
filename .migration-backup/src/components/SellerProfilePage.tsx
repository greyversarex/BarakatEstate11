"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Phone, Star } from "lucide-react";

type Seller = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  avatar: string;
  bio: string;
  rating: number;
  dealsCount: number;
  experienceYears: number;
  specializations: string;
  role: string;
};

type Listing = {
  id: string;
  slug?: string;
  title: string;
  dealType: "sale" | "rent";
  price: number;
  currency: "USD" | "TJS";
  address: string;
  district: string;
  rooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  mainImage: { url: string } | string | null;
  sellerId: string;
  status: "draft" | "published"; 
};

type AuraRuntimeWindow = Window &
  typeof globalThis & {
    mapAdminListing?: (item: Listing) => unknown;
    propCard?: (item: unknown) => string;
    initCardSliders?: () => void;
  };

function formatPrice(value: number, currency: string) {
  let rawPrice = Number(value || 0);
  if (currency === "USD" || !currency) {
    rawPrice = Math.round(rawPrice * 10.6);
  }
  const amount = rawPrice.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
  return `${amount} смн`;
}

void formatPrice;

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "B"
  );
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function socialUrl(type: "telegram" | "instagram", value: string) {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  const clean = value.replace(/^@/, "");
  return type === "telegram" ? `https://t.me/${clean}` : `https://instagram.com/${clean}`;
}

function PropertyCard({ item }: { item: Listing }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runtimeWindow = window as AuraRuntimeWindow;

    if (runtimeWindow.mapAdminListing && runtimeWindow.propCard) {
      // Use the global parser to match exactly what the rest of the site expects
      const mapped = runtimeWindow.mapAdminListing(item);
      
      if (containerRef.current) {
        // Render the exact same HTML template as the main page
        containerRef.current.innerHTML = runtimeWindow.propCard(mapped);
        
        // Initialize the slider logic for this new card
        setTimeout(() => {
          if (runtimeWindow.initCardSliders) {
            runtimeWindow.initCardSliders();
          }
        }, 50);
      }
    }
  }, [item]);

  // Use display: contents so the injected <a> tag becomes a direct child of the CSS grid
  return <div ref={containerRef} style={{ display: 'contents' }} />;
}

export default function SellerProfilePage() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("seller") || "";
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://barakatestateadmin.vercel.app";

    async function loadSeller() {
      if (!sellerId) {
        setError("Продавец не выбран");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [sellerResponse, listingsResponse] = await Promise.all([
          fetch(`/api/sellers/${encodeURIComponent(sellerId)}`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/listings`, { cache: "no-store" }),
        ]);

        if (!sellerResponse.ok) {
          throw new Error("Продавец не найден");
        }

        const sellerPayload = await sellerResponse.json();
        const listingsPayload = await listingsResponse.json();
        const sellerListings = ((listingsPayload.data || []) as Listing[]).filter(
          (item) => item.sellerId === sellerId && item.status !== "draft",
        );

        if (!ignore) {
          setSeller(sellerPayload.data);
          setListings(sellerListings);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить профиль");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadSeller();

    return () => {
      ignore = true;
    };
  }, [sellerId]);

  if (loading) {
    return (
      <main className="agent-page">
        <section className="listings-section">
          <div className="container">
            <div className="seller-public-empty">Загружаем профиль продавца...</div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !seller) {
    return (
      <main className="agent-page">
        <section className="listings-section">
          <div className="container">
            <div className="seller-public-empty">{error || "Профиль продавца не найден"}</div>
          </div>
        </section>
      </main>
    );
  }

  const avatarText = initials(seller.name);
  const profileLine = seller.bio || `${seller.specializations || "Продавец недвижимости"} · Barakat Estate`;
  const whatsapp = seller.whatsapp || seller.phone;
  const telegramUrl = socialUrl("telegram", seller.telegram);
  const instagramUrl = socialUrl("instagram", seller.instagram);

  return (
    <main className="agent-page">
      <section className="agent-hero">
        <div className="agent-hero-inner">
          <div className="agent-avatar">
            {seller.avatar ? (
              <Image src={seller.avatar} alt={seller.name} width={120} height={120} unoptimized />
            ) : (
              avatarText
            )}
          </div>

          <div className="agent-info">
            <h1>{seller.name}</h1>
            <p>{profileLine}</p>
            <div className="agent-badges">
              <span className="agent-badge">{seller.dealsCount || 0} сделок</span>
              <span className="agent-badge">
                <CheckCircle size={14} /> Проверен
              </span>
              {seller.specializations ? <span className="agent-badge">{seller.specializations}</span> : null}
            </div>
          </div>

        </div>
      </section>

      <section className="seller-contact-strip">
        <div className="container seller-contact-inner">
          {seller.phone ? (
            <a className="seller-contact-link contact-link-phone" href={`tel:${seller.phone}`}>
              <div className="icon-wrap" style={{ color: '#25D366', backgroundColor: 'rgba(37,211,102,0.1)' }}>
                <Phone size={24} />
              </div>
              <span>
                <small style={{ textTransform: 'uppercase' }}>Телефон</small>
                <strong>{seller.phone}</strong>
              </span>
            </a>
          ) : null}
          {whatsapp ? (
            <a className="seller-contact-link contact-link-wa" href={`https://wa.me/${phoneDigits(whatsapp)}`}>
              <div className="icon-wrap" style={{ backgroundColor: 'transparent' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="34" height="34" />
              </div>
              <span>
                <small style={{ textTransform: 'uppercase' }}>WhatsApp</small>
                <strong>{whatsapp}</strong>
              </span>
            </a>
          ) : null}
          {telegramUrl ? (
            <a className="seller-contact-link contact-link-tg" href={telegramUrl}>
              <div className="icon-wrap" style={{ backgroundColor: 'transparent' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" width="28" height="28" />
              </div>
              <span>
                <small style={{ textTransform: 'uppercase' }}>Telegram</small>
                <strong>{seller.telegram}</strong>
              </span>
            </a>
          ) : null}
          {instagramUrl ? (
            <a className="seller-contact-link contact-link-ig" href={instagramUrl}>
              <div className="icon-wrap" style={{ backgroundColor: 'transparent' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="28" height="28" />
              </div>
              <span>
                <small style={{ textTransform: 'uppercase' }}>Instagram</small>
                <strong>{seller.instagram}</strong>
              </span>
            </a>
          ) : null}
          {seller.email ? (
            <a className="seller-contact-link contact-link-email" href={`mailto:${seller.email}`}>
              <div className="icon-wrap" style={{ backgroundColor: 'transparent' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Email" width="28" height="28" />
              </div>
              <span>
                <small style={{ textTransform: 'uppercase' }}>Email</small>
                <strong>{seller.email}</strong>
              </span>
            </a>
          ) : null}
        </div>
      </section>


      <section className="listings-section">
        <div className="container">
          <div className="section-header seller-agent-section-head">
            <div className="section-eyebrow">Объявления</div>
            <h2 className="section-title">
              Объявления <strong style={{ color: 'var(--gold-dark)', fontWeight: 800, fontSize: '0.85em' }}>{seller.name}</strong>
            </h2>
          </div>

          {listings.length ? (
            <div className="grid-3">
              {listings.map((item) => (
                <PropertyCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="seller-public-empty">У продавца пока нет опубликованных объявлений.</div>
          )}
        </div>
      </section>
    </main>
  );
}
