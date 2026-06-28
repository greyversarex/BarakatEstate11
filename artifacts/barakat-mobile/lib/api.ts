import type { Property } from "./types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL
  || (process.env.EXPO_PUBLIC_DOMAIN ? `https://${process.env.EXPO_PUBLIC_DOMAIN}` : "");

function formatPrice(price: number, currency: string, dealType: string): string {
  const amount = Math.round(price).toLocaleString("ru-RU").replace(/\u00a0/g, " ");
  const suffix = dealType === "rent" ? " /мес" : "";
  const unit = currency === "USD" ? "$" : "с";
  return `${amount} ${unit}${suffix}`;
}

function parseGallery(gallery: string, mainImage: string, baseUrl: string): string[] {
  const toAbsolute = (url: string) => {
    if (!url) return "";
    if (/^(https?:|data:|blob:)/.test(url)) return url;
    return `${baseUrl}${url}`;
  };
  const images: string[] = [];
  const main = toAbsolute(mainImage);
  if (main) images.push(main);
  if (gallery) {
    const parts = gallery.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    for (const p of parts) {
      const abs = toAbsolute(p);
      if (abs && !images.includes(abs)) images.push(abs);
    }
  }
  return images;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
}

function mapListing(entry: Record<string, unknown>): Property {
  const price = Number(entry.price || 0);
  const currency = String(entry.currency || "TJS");
  const dealType = String(entry.dealType || "sale");
  const images = parseGallery(
    String(entry.gallery || ""),
    String(entry.mainImage || ""),
    BASE_URL
  );
  const agentName = String(entry.sellerName || "Продавец");
  const sellerAvatar = String(entry.sellerAvatar || "");
  const avatarAbs = sellerAvatar && !/^(https?:|data:|blob:)/.test(sellerAvatar)
    ? `${BASE_URL}${sellerAvatar}` : sellerAvatar;

  return {
    id: String(entry.slug || entry.id || ""),
    title: String(entry.title || ""),
    price: formatPrice(price, currency, dealType),
    priceNote: dealType === "rent" ? "Аренда" : "Продажа",
    addr: String(entry.address || ""),
    rooms: Number(entry.rooms || 0),
    area: Number(entry.area || 0),
    floor: entry.floor && entry.totalFloors
      ? `${entry.floor}/${entry.totalFloors}`
      : String(entry.floor || "-"),
    type: dealType,
    image: images[0] || "",
    images,
    tag: dealType,
    tagLabel: dealType === "rent" ? "Аренда" : "Продажа",
    sellerId: String(entry.sellerId || ""),
    agent: initials(agentName),
    agentAvatar: avatarAbs,
    agentName,
    deals: 0,
    rating: 5,
    telegram: "",
    instagram: "",
    year: entry.yearBuilt ? String(entry.yearBuilt) : "",
    new: Boolean(entry.isFeatured),
    propertyType: String(entry.propertyType || "Квартира"),
    district: String(entry.district || "Душанбе"),
    features: String(entry.features || ""),
    description: String(entry.description || ""),
    constructionStage: String(entry.constructionStage || ""),
    renovation: String(entry.renovation || ""),
    documentType: String(entry.documentType || ""),
    landmark: String(entry.landmark || ""),
    phone: String(entry.sellerPhone || ""),
    lat: entry.latitude ? Number(entry.latitude) : null,
    lng: entry.longitude ? Number(entry.longitude) : null,
    source: "admin",
  };
}

export async function fetchListings(): Promise<Property[]> {
  if (!BASE_URL) return [];
  const res = await fetch(`${BASE_URL}/api/listings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  const payload = await res.json();
  const rows: Record<string, unknown>[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : [];
  return rows.map(mapListing);
}

export async function fetchReviews(): Promise<unknown[]> {
  if (!BASE_URL) return [];
  const res = await fetch(`${BASE_URL}/api/reviews`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
