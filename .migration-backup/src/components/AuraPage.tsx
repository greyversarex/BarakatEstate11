import type { AuraPageName } from "@/content/aura-pages";
import { auraPages } from "@/content/aura-pages";

const heroMainImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
const heroSideImage =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
const galleryFacadeImage =
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80";
const galleryInteriorImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80";

const lucidePaths = {
  bath: '<path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 5 9"/><path d="M7.2 12a6 6 0 0 0 11.6 0"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 9h2a2 2 0 0 1 2 2v11"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  check: '<path d="M21.8 10A10 10 0 1 1 17 3.3"/><path d="m9 11 3 3L22 4"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  construction: '<path d="M10 13h4"/><path d="m8 21 4-7 4 7"/><path d="M12 14v7"/><path d="M8 4h8"/><path d="M18 8a6 6 0 0 0-12 0v2h12Z"/><path d="M2 10h20"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  key: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  money: '<path d="M16 3h5v5"/><path d="M21 3 12 12"/><path d="M5 12H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2"/><path d="M9 15a3 3 0 1 1 3-3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.63 2.65a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.43-1.2a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.65.63A2 2 0 0 1 22 16.92z"/>',
  parking: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.2 1.2 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.064 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.064a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.14a2.12 2.12 0 0 0-.611-1.878L2.16 9.795a.53.53 0 0 1 .294-.904l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
};

function icon(name: keyof typeof lucidePaths, className = "lucide-inline") {
  return `<svg class="${className}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lucidePaths[name]}</svg>`;
}

const icons = {
  bath: icon("bath"),
  bed: icon("bed"),
  building: icon("building"),
  calendar: icon("calendar"),
  camera: icon("camera"),
  check: icon("check"),
  clipboard: icon("clipboard"),
  construction: icon("construction"),
  globe: icon("globe"),
  handshake: icon("handshake"),
  home: icon("home"),
  key: icon("key"),
  map: icon("map"),
  mapPin: icon("mapPin"),
  message: icon("message"),
  money: icon("money"),
  phone: icon("phone"),
  ruler: icon("ruler"),
  search: icon("search"),
  shield: icon("shield"),
  sparkles: icon("sparkles"),
  smartphone: icon("smartphone"),
  parking: icon("parking"),
  star: icon("star", "lucide-inline lucide-star"),
};

const brandLockup =
  '<span class="brand-logo-lockup"><img src="/barakat.PNG" alt="Barakat Estate" /><span>Barakat Estate</span></span>';
const legacyDomain = "aura" + ".tj";
const oldMapStart = "#1e" + "2d4a 0%,#162" + "13e 40%,#0f" + "172a 100%";
const oldMapShort = "#1e" + "2d4a,#0f" + "172a";

function withRealEstateImages(html: string) {
  return html
    .replace(
      '<div class="hc-img">[[IMG_CITY]]</div>',
      `<div class="hc-img"><img src="${heroMainImage}" alt="Современный жилой дом" loading="lazy" /></div>`,
    )
    .replace(
      '<div class="hc-img" style="height:55%">[[IMG_RENT]]</div>',
      `<div class="hc-img" style="height:55%"><img src="${heroSideImage}" alt="Квартира в аренду" loading="lazy" /></div>`,
    )
    .replace(
      '<div class="gallery-main">[[IMG_CITY]]</div>',
      `<div class="gallery-main"><img src="${heroMainImage}" alt="Главное фото квартиры" /></div>`,
    )
    .replace(
      '<div class="gallery-thumb">[[IMG_FACADE]]</div>',
      `<div class="gallery-thumb"><img src="${galleryFacadeImage}" alt="Фасад дома" loading="lazy" /></div>`,
    )
    .replace(
      `<div class="gallery-thumb">
        [[ICON_HOME]]
        <div class="gallery-count">+12 фото</div>
      </div>`,

      `<div class="gallery-thumb"><img src="${galleryInteriorImage}" alt="Интерьер квартиры" loading="lazy" /><div class="gallery-count">+12 фото</div></div>`,
    );
}

function withBrand(html: string) {
  return html
    .replaceAll(`<div class="footer-logo"><div class="dot"></div>${legacyDomain}</div>`, `<div class="footer-logo">${brandLockup}</div>`)
    .replaceAll(
      `<div class="footer-logo" style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:white;display:flex;align-items:center;gap:8px"><div class="dot"></div>${legacyDomain}</div>`,
      `<div class="footer-logo" style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:600;color:white;display:flex;align-items:center;gap:8px">${brandLockup}</div>`,
    )
    .replaceAll(legacyDomain, "Barakat Estate")
    .replaceAll("Aura Estate", "Barakat Estate")
    .replaceAll("Aura.", "Barakat Estate.")
    .replaceAll("Aura,", "Barakat Estate,")
    .replaceAll("Aura ", "Barakat Estate ")
    .replaceAll(`user@${legacyDomain}`, "staff@barakat.estate")
    .replaceAll(`info@${legacyDomain}`, "info@barakat.estate")
    .replaceAll(oldMapStart, "#2d2515 0%,#1f1a10 48%,#141008 100%")
    .replaceAll(oldMapShort, "#2d2515,#141008");
}

function withLucideIcons(html: string) {
  return html
    .replaceAll("[[ICON_STAR]]", icons.star)
    .replaceAll("[[ICON_MAP_PIN]]", icons.mapPin)
    .replaceAll("[[ICON_BED]]", icons.bed)
    .replaceAll("[[ICON_BATH]]", icons.bath)
    .replaceAll("[[ICON_RULER]]", icons.ruler)
    .replaceAll("[[ICON_CONSTRUCTION]]", icons.construction)
    .replaceAll("[[ICON_BUILDING]]", icons.building)
    .replaceAll("[[ICON_PARKING]]", icons.parking)
    .replaceAll("[[ICON_KEY]]", icons.key)
    .replaceAll("[[ICON_HOME]]", icons.home)
    .replaceAll("[[ICON_MONEY]]", icons.money)
    .replaceAll("[[ICON_CLIPBOARD]]", icons.clipboard)
    .replaceAll("[[ICON_SEARCH]]", icons.search)
    .replaceAll("[[ICON_HANDSHAKE]]", icons.handshake)
    .replaceAll("[[ICON_CAMERA]]", icons.camera)
    .replaceAll("[[ICON_GLOBE]]", icons.globe)
    .replaceAll("[[ICON_MAP]]", icons.map)
    .replaceAll("[[ICON_SMARTPHONE]]", icons.smartphone)
    .replaceAll("[[ICON_MESSAGE]]", icons.message)
    .replaceAll("[[ICON_PHONE]]", icons.phone)
    .replaceAll("[[ICON_CALENDAR]]", icons.calendar)
    .replaceAll("[[ICON_SHIELD]]", icons.shield)
    .replaceAll("[[ICON_SPARKLES]]", icons.sparkles)
    .replaceAll("[[ICON_CHECK]]", icons.check);
}

function withHeroActionIcons(html: string) {
  return html
    .replace(
      '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="m21 21-4.35-4.35"/></svg>',
      icons.search,
    )
    .replace(
      '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>',
      icons.mapPin,
    );
}

export default function AuraPage({ page }: { page: AuraPageName }) {
  const html = withLucideIcons(withHeroActionIcons(withBrand(withRealEstateImages(auraPages[page]))));

  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
