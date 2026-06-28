import type { Property } from "./types";

const ADMIN_API = process.env.EXPO_PUBLIC_API_URL
  || (process.env.EXPO_PUBLIC_DOMAIN ? `https://${process.env.EXPO_PUBLIC_DOMAIN}` : "https://barakatestateadmin.vercel.app");

function mediaUrl(media: unknown): string {
  if (!media) return "";
  if (typeof media === "string") {
    if (/^(https?:|data:|blob:)/.test(media)) return media;
    return `${ADMIN_API}${media}`;
  }
  const raw = Array.isArray(media) ? (media as unknown[])[0] : media;
  // @ts-ignore
  const item = raw?.attributes || raw;
  // @ts-ignore
  const url = item?.url;
  if (!url) return "";
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${ADMIN_API}${url}`;
}

function relationData(relation: unknown): unknown {
  // @ts-ignore
  return relation?.data?.attributes || relation?.data || relation?.attributes || relation || null;
}

function mapDistrict(value: string): string {
  const labels: Record<string, string> = {
    center: "Центр",
    ismoili_somoni: "И. Сомони",
    sino: "Сино",
    firdavsi: "Фирдавси",
    shohmansur: "Шохмансур",
    other: "Душанбе",
  };
  return labels[value] || value || "Душанбе";
}

function mapPropertyType(value: string): string {
  const labels: Record<string, string> = {
    apartment: "Квартира",
    studio: "Студия",
    house: "Дом",
    commercial: "Коммерческая",
    new_building: "Новостройка",
  };
  return labels[value] || value || "Квартира";
}

function formatAdminPrice(item: Record<string, unknown>): string {
  let rawPrice = Number(item.price || 0);
  if ((item.currency as string || "USD") === "USD") {
    rawPrice = Math.round(rawPrice * 10.6);
  }
  const amount = rawPrice.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
  const suffix = item.monthlyPrice ? " /мес" : "";
  return `${amount} с${suffix}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function mapAdminListing(entry: Record<string, unknown>): Property {
  // @ts-ignore
  const item: Record<string, unknown> = entry?.attributes || entry;
  const employee = relationData(item.employee) as Record<string, unknown> | null;
  const seller = relationData(item.seller) as Record<string, unknown> | null;

  let galleryArray: unknown[] = [];
  // @ts-ignore
  if (Array.isArray(item.gallery?.data)) galleryArray = item.gallery.data as unknown[];
  else if (Array.isArray(item.gallery)) galleryArray = item.gallery as unknown[];
  else if (typeof item.gallery === "string")
    galleryArray = (item.gallery as string).split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);

  const galleryImages = galleryArray.map(mediaUrl).filter(Boolean);
  // @ts-ignore
  const mainImage = mediaUrl(item.mainImage?.data || item.mainImage) || galleryImages[0] || "";
  const images = [...new Set([mainImage, ...galleryImages].filter(Boolean))];

  const sellerAvatar =
    // @ts-ignore
    mediaUrl(seller?.avatar?.data || seller?.avatar) ||
    mediaUrl(item.sellerAvatar) ||
    // @ts-ignore
    mediaUrl(employee?.avatar?.data || employee?.avatar);
  const fallbackName =
    (seller?.name as string) || (item.sellerName as string) || (employee?.fullName as string) || "Продавец";
  const sellerPhone = (seller?.phone as string) || (item.sellerPhone as string) || (employee?.phone as string) || "";

  return {
    id: (item.slug as string) || (entry.documentId as string) || (entry.id as string),
    title: (item.title as string) || "",
    price: formatAdminPrice(item),
    priceNote: item.dealType === "rent" ? "Аренда" : "Продажа",
    addr: (item.address as string) || "",
    rooms: (item.rooms as number) || 0,
    area: (item.area as number) || 0,
    floor:
      item.floor && item.totalFloors
        ? `${item.floor}/${item.totalFloors}`
        : String(item.floor || "-"),
    type: (item.dealType as string) || "sale",
    image: mainImage || "",
    images,
    tag: item.dealType === "rent" ? "rent" : "sale",
    tagLabel: item.dealType === "rent" ? "Аренда" : "Продажа",
    sellerId: (item.sellerId as string) || (seller?.id as string) || "",
    agent: initials(fallbackName),
    agentAvatar: sellerAvatar,
    agentName: fallbackName,
    deals: (seller?.dealsCount as number) || (employee?.dealsCount as number) || 0,
    rating: (seller?.rating as number) || (employee?.rating as number) || 5,
    telegram: (seller?.telegram as string) || "",
    instagram: (seller?.instagram as string) || "",
    year: (item.yearBuilt as string) || "",
    new: Boolean(item.isFeatured),
    propertyType: mapPropertyType(item.propertyType as string),
    district: mapDistrict(item.district as string),
    features: Array.isArray(item.features)
      ? (item.features as string[]).join(" ")
      : (item.features as string) || "",
    description: (item.description as string) || "",
    constructionStage: (item.constructionStage as string) || "",
    renovation: (item.renovation as string) || "",
    documentType: (item.documentType as string) || "",
    landmark: (item.landmark as string) || "",
    phone: sellerPhone,
    lat: null,
    lng: null,
    source: "admin",
  };
}

export async function fetchListings(): Promise<Property[]> {
  const params = "sort=createdAt:desc&pagination[pageSize]=100";
  const res = await fetch(`${ADMIN_API}/api/listings?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  const payload = await res.json();
  return (payload.data || []).map(mapAdminListing);
}

export async function fetchReviews(): Promise<unknown[]> {
  const res = await fetch(`${ADMIN_API}/api/reviews`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
