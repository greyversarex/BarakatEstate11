/* eslint-disable @typescript-eslint/no-unused-vars */
// ── DATA ──
const properties = [];

let adminProperties = [];

window.AuraSettings = {
  districts: [],
  propertyTypes: [],
  dealTypes: []
};

async function loadGlobalSettings() {
  const baseUrl = window.BARAKAT_API_URL || 'https://barakatestateadmin.vercel.app';
  try {
    const res = await fetch(`${baseUrl}/api/profile`, { cache: 'no-store' });
    if (!res.ok) return;
    const { data } = await res.json();
    if (data) {
      if (data.districts) window.AuraSettings.districts = data.districts.split(',').map(s => s.trim()).filter(Boolean);
      if (data.propertyTypes) window.AuraSettings.propertyTypes = data.propertyTypes.split(',').map(s => s.trim()).filter(Boolean);
      if (data.dealTypes) window.AuraSettings.dealTypes = data.dealTypes.split(',').map(s => s.trim()).filter(Boolean);
    }
  } catch (err) {
    console.error('Failed to load global settings', err);
  }
}

function populateSelects() {
  const { propertyTypes, districts, dealTypes } = window.AuraSettings;

  // Update Select Dropdowns
  document.querySelectorAll('select.s-select').forEach(select => {
    const firstOption = select.querySelector('option');
    if (!firstOption) return;
    
    const text = firstOption.textContent.trim();
    if ((text === 'Тип недвижимости' || text === 'Все типы') && propertyTypes.length > 0) {
      select.innerHTML = `<option>${text}</option>` + propertyTypes.map(t => `<option value="${t}">${t}</option>`).join('');
    } else if ((text === 'Город' || text === 'Все районы') && districts.length > 0) {
      select.innerHTML = `<option>${text}</option>` + districts.map(t => `<option value="${t}">${t}</option>`).join('');
    }
  });

  // Update Checkbox Groups
  document.querySelectorAll('.filter-group').forEach(group => {
    const h4 = group.querySelector('h4');
    if (!h4) return;
    const title = h4.textContent.trim();
    
    let itemsToRender = [];
    if (title === 'Тип недвижимости' && propertyTypes.length > 0) itemsToRender = propertyTypes;
    if (title === 'Район' && districts.length > 0) itemsToRender = districts;
    if (title === 'Тип сделки' && dealTypes.length > 0) itemsToRender = dealTypes;

    if (itemsToRender.length > 0) {
      const newHTML = `<h4>${title}</h4>` + itemsToRender.map(item => {
        let val = item, label = item;
        if (title === 'Тип сделки' && item.includes(':')) {
          const parts = item.split(':');
          val = parts[0].trim();
          label = parts[1] ? parts[1].trim() : val;
        }
        return `<label class="filter-check"><input type="checkbox" value="${val}" /><label>${label}</label></label>`;
      }).join('');
      
      group.innerHTML = newHTML;
    }
  });
}

function mediaUrl(media) {
  if (!media) return '';
  if (typeof media === 'string') {
    if (/^(https?:|data:|blob:)/.test(media)) return media;
    const baseUrl = window.BARAKAT_API_URL || 'https://barakatestateadmin.vercel.app';
    return `${baseUrl}${media}`;
  }
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.attributes || raw;
  const url = item?.url;
  if (!url) return '';
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  const baseUrl = window.BARAKAT_API_URL || 'https://barakatestateadmin.vercel.app';
  return `${baseUrl}${url}`;
}

function relationData(relation) {
  return relation?.data?.attributes || relation?.data || relation?.attributes || relation || null;
}

function mapDistrict(value) {
  const labels = {
    center: 'Центр',
    ismoili_somoni: 'И. Сомони',
    sino: 'Сино',
    firdavsi: 'Фирдавси',
    shohmansur: 'Шохмансур',
    other: 'Душанбе',
  };
  return labels[value] || value || 'Душанбе';
}

function mapPropertyType(value) {
  const labels = {
    apartment: 'Квартира',
    studio: 'Студия',
    house: 'Дом',
    commercial: 'Коммерческая',
    new_building: 'Новостройка',
  };
  return labels[value] || value || 'Квартира';
}

function formatAdminPrice(item) {
  let rawPrice = Number(item.price || 0);
  if ((item.currency || 'USD') === 'USD') {
    rawPrice = Math.round(rawPrice * 10.6);
  }
  const amount = rawPrice.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
  const suffix = item.monthlyPrice ? ' /мес' : '';
  return `${amount} с${suffix}`;
}

function mapAdminListing(entry) {
  const item = entry?.attributes || entry;
  const employee = relationData(item.employee);
  const seller = relationData(item.seller);
  const location = relationData(item.location) || relationData(item.coordinates) || item.geo || {};
  let galleryArray = [];
  if (Array.isArray(item.gallery?.data)) galleryArray = item.gallery.data;
  else if (Array.isArray(item.gallery)) galleryArray = item.gallery;
  else if (typeof item.gallery === 'string') galleryArray = item.gallery.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  
  const galleryImages = galleryArray.map(mediaUrl).filter(Boolean);
  const mainImage = mediaUrl(item.mainImage?.data || item.mainImage) || galleryImages[0] || '';
  const images = [...new Set([mainImage, ...galleryImages].filter(Boolean))];
  const sellerAvatar = mediaUrl(seller?.avatar?.data || seller?.avatar) || mediaUrl(item.sellerAvatar) || mediaUrl(employee?.avatar?.data || employee?.avatar);
  const fallbackName = seller?.name || item.sellerName || employee?.fullName || 'Продавец';
  const sellerPhone = seller?.phone || item.sellerPhone || employee?.phone || '';
  const latitude = getPropertyCoordinate(item, location, 'lat');
  const longitude = getPropertyCoordinate(item, location, 'lng');

  return normalizeProperty({
    id: item.slug || entry.documentId || entry.id,
    title: item.title,
    price: formatAdminPrice(item),
    priceNote: item.dealType === 'rent' ? 'Аренда' : 'Продажа',
    addr: item.address,
    rooms: item.rooms || 0,
    area: item.area || 0,
    floor: item.floor && item.totalFloors ? `${item.floor}/${item.totalFloors}` : String(item.floor || '-'),
    type: item.dealType || 'sale',
    image: mainImage || '',
    images,
    tag: item.dealType === 'rent' ? 'rent' : 'sale',
    tagLabel: item.dealType === 'rent' ? 'Аренда' : 'Продажа',
    sellerId: item.sellerId || seller?.id || '',
    agent: initials(fallbackName),
    agentAvatar: sellerAvatar,
    agentName: fallbackName,
    deals: seller?.dealsCount || employee?.dealsCount || 0,
    rating: seller?.rating || employee?.rating || 5,
    telegram: seller?.telegram || '',
    instagram: seller?.instagram || '',
    year: item.yearBuilt || '',
    new: Boolean(item.isFeatured),
    propertyType: mapPropertyType(item.propertyType),
    district: mapDistrict(item.district),
    features: Array.isArray(item.features) ? item.features.join(' ') : item.features || '',
    description: item.description || '',
    constructionStage: item.constructionStage || '',
    renovation: item.renovation || '',
    documentType: item.documentType || '',
    landmark: item.landmark || '',
    phone: sellerPhone,
    mapX: item.mapX ? `${item.mapX}%` : '',
    mapY: item.mapY ? `${item.mapY}%` : '',
    lat: latitude,
    lng: longitude,
    source: 'admin',
  });
}

async function loadAdminProperties() {
  const baseUrl = window.BARAKAT_API_URL || 'https://barakatestateadmin.vercel.app';

  try {
    const params = [
      'sort=createdAt:desc',
      'pagination[pageSize]=100',
    ].join('&');
    const response = await fetch(`${baseUrl}/api/listings?${params}`, { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json();
    adminProperties = (payload.data || []).map(mapAdminListing);
  } catch {
    adminProperties = [];
  }
}

function initials(name) {
  return (name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function normalizeNumber(value) {
  const match = String(value || '').replace(',', '.').match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function normalizeCoordinate(value, axis = 'lat') {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;
  if (Array.isArray(value) && value.length >= 2) {
    return normalizeNumber(value[axis === 'lat' ? 1 : 0]);
  }
  if (typeof value === 'object') {
    const lat = value.lat ?? value.latitude ?? value.latitud ?? value.latitude ?? null;
    const lng = value.lng ?? value.longitude ?? value.long ?? value.lng ?? null;
    return normalizeNumber(axis === 'lat' ? lat ?? lng : lng ?? lat);
  }
  return normalizeNumber(value);
}

function getPropertyCoordinate(item, location, axis) {
  const candidates = axis === 'lat'
    ? [item.lat, item.latitude, location?.lat, location?.latitude, location?.coordinates, location?.geo, item.geo]
    : [item.lng, item.longitude, location?.lng, location?.longitude, location?.coordinates, location?.geo, item.geo];

  for (const candidate of candidates) {
    const normalized = normalizeCoordinate(candidate, axis);
    if (typeof normalized === 'number') return normalized;
  }
  return null;
}

function splitFeatures(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || '')
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function districtFromAddress(address) {
  let districts = ['Центр', 'И. Сомони', 'Сино', 'Фирдавси', 'Шохмансур', 'Сарахиёт'];
  if (window.AuraSettings?.districts?.length) districts = window.AuraSettings.districts;
  return districts.find((district) => String(address || '').includes(district)) || '';
}

function normalizeProperty(property) {
  return {
    propertyType: 'Квартира',
    district: districtFromAddress(property.addr),
    features: 'Парковка, Лифт, Балкон, Мебель, Охрана',
    description: '',
    ...property,
  };
}

function getAllProperties() {
  return [...adminProperties, ...properties.map(normalizeProperty)];
}

function findPropertyById(id) {
  return getAllProperties().find((property) => String(property.id) === String(id));
}

const lucideIcons = {
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 9h2a2 2 0 0 1 2 2v11"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
  keyRound: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.14a2.12 2.12 0 0 0-.611-1.878L2.16 9.795a.53.53 0 0 1 .294-.904l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  construction: '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="M14 6l7.7 7.7"/><path d="m8 6 8 8"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
};

function lucideIcon(name, className = 'lucide-inline', size = 16) {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lucideIcons[name] || ''}</svg>`;
}

// ── FAVORITES (localStorage) ──
const FAV_KEY = 'barakat_favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch { return []; }
}

function saveFavorites(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  updateNavFavBadge();
}

function isFavoriteProperty(id) {
  return getFavorites().includes(String(id));
}

function toggleFav(button) {
  const id = button.dataset.propId;
  if (!id) return;
  const favs = getFavorites();
  const index = favs.indexOf(String(id));
  if (index === -1) {
    favs.push(String(id));
    button.classList.add('active');
    button.dataset.fav = 'true';
  } else {
    favs.splice(index, 1);
    button.classList.remove('active');
    button.dataset.fav = 'false';
  }
  saveFavorites(favs);
}

function updateNavFavBadge() {
  const badge = document.getElementById('nav-fav-count');
  const count = getFavorites().length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderFavoritesPage() {
  const grid = document.getElementById('favorites-grid');
  const countEl = document.getElementById('favorites-count');
  if (!grid) return;

  const favIds = getFavorites();
  const items = getAllProperties().filter((p) => favIds.includes(String(p.id)));

  if (countEl) {
    countEl.textContent = items.length
      ? `Сохранено объектов: ${items.length}`
      : 'У вас пока нет избранных объектов';
  }

  grid.innerHTML = items.length
    ? items.map((p) => propCard(p)).join('')
    : '<div class="seller-empty" style="grid-column:1/-1;text-align:center;padding:60px 20px"><p style="font-size:17px;color:var(--muted)">Нажмите ♡ на карточке объявления,<br>чтобы добавить его в избранное</p></div>';
}

// ── RENDER CARDS ──
function propCard(p, onclick) {
  const isFav = isFavoriteProperty(p.id);
  const imgs = (p.images && p.images.length > 0) ? p.images : [p.image];
  const uniqueImgs = [...new Set(imgs.filter(Boolean))];
  const slideId = `slider-${p.id}-${Math.random().toString(36).slice(2,7)}`;

  const slides = uniqueImgs.map((src, i) =>
    `<img src="${src}" alt="${p.addr}" loading="lazy" class="prop-slide${i === 0 ? ' active' : ''}" />`
  ).join('');

  const dots = uniqueImgs.length > 1
    ? `<div class="prop-dots">${uniqueImgs.map((_, i) => `<span class="prop-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`).join('')}</div>`
    : '';

  const counter = uniqueImgs.length > 1
    ? `<div class="prop-img-counter"><span>1</span>/${uniqueImgs.length}</div>`
    : '';

  return `<div class="prop-card" onclick="${onclick||`navigate('property','${p.id}')`}" style="animation-delay:${Math.random()*.3}s">
    <div class="prop-img" id="${slideId}" data-slide="0" data-total="${uniqueImgs.length}">
      ${slides}
      <div class="prop-img-gradient"></div>
      <div class="prop-tags">
        <span class="tag tag-${p.tag}">${p.tagLabel}</span>
        ${p.new?'<span class="tag tag-new">Новое</span>':''}
      </div>
      <button class="prop-fav${isFav ? ' active' : ''}" onclick="event.stopPropagation();toggleFav(this)" aria-label="Добавить в избранное" data-prop-id="${p.id}" data-fav="${isFav ? 'true' : 'false'}">${lucideIcon('heart', 'lucide-fav')}</button>
      ${counter}
      ${dots}
      ${uniqueImgs.length > 1 ? `
        <button class="prop-slider-btn prev" onclick="event.stopPropagation();slideCard('${slideId}',-1)" aria-label="Назад">‹</button>
        <button class="prop-slider-btn next" onclick="event.stopPropagation();slideCard('${slideId}',1)" aria-label="Вперед">›</button>
      ` : ''}
    </div>
    <div class="prop-body">
      <div class="prop-price-row">
        <div class="prop-price">${p.price}</div>
        <div class="prop-price-note">${p.priceNote}${p.propertyType ? ` &middot; ${p.propertyType}` : ''}</div>
      </div>
      <div class="prop-addr">${lucideIcon('mapPin')} ${p.addr} ${p.landmark ? `<span style="opacity: 0.7; font-size: 0.9em;">(Ор: ${p.landmark})</span>` : ''}</div>
      <div class="prop-meta" style="flex-direction: column; gap: 10px; height: auto; overflow: visible; white-space: normal; align-items: flex-start;">
        <div style="display: flex; gap: 18px; flex-wrap: wrap; width: 100%;">
          <span>${lucideIcon('bed')} <strong>${p.rooms}</strong> комн</span>
          <span>${lucideIcon('ruler')} <strong>${p.area}</strong> м²</span>
          <span>${lucideIcon('building2')} <strong>${p.floor}</strong> эт</span>
        </div>
        ${(p.renovation && p.renovation !== 'Любая') || (p.constructionStage && p.constructionStage !== 'Любая') || (p.documentType && p.documentType !== 'Любой') ? `
        <div style="display: flex; gap: 18px; flex-wrap: wrap; width: 100%;">
          ${p.renovation && p.renovation !== 'Любая' ? `<span>${lucideIcon('sparkles')} ${p.renovation}</span>` : ''}
          ${p.constructionStage && p.constructionStage !== 'Любая' ? `<span>${lucideIcon('construction')} ${p.constructionStage}</span>` : ''}
          ${p.documentType && p.documentType !== 'Любой' ? `<span>${lucideIcon('clipboard')} ${p.documentType}</span>` : ''}
        </div>` : ''}
      </div>
      <div class="prop-agent">
        <div class="agent-ava">${p.agentAvatar ? `<img src="${p.agentAvatar}" alt="${p.agentName}" />` : p.agent}</div>
        <div>
          <strong onclick="event.stopPropagation();navigate('profile','${p.sellerId || ''}')">${p.agentName}</strong>
        </div>
      </div>
    </div>
  </div>`;
}

function slideCard(sliderId, dir) {
  const container = document.getElementById(sliderId);
  if (!container) return;
  const slides = container.querySelectorAll('.prop-slide');
  const dots = container.querySelectorAll('.prop-dot');
  const counter = container.querySelector('.prop-img-counter span');
  const total = slides.length;
  if (total <= 1) return;

  let current = Number(container.dataset.slide || 0);
  current = (current + dir + total) % total;
  container.dataset.slide = current;

  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  if (counter) counter.textContent = current + 1;
}

function initCardSliders() {
  document.querySelectorAll('.prop-img[data-total]').forEach((container) => {
    const total = Number(container.dataset.total);
    if (total <= 1 || container.dataset.autoSlide) return;
    container.dataset.autoSlide = 'true';

    const id = container.id;
    const interval = 3000 + Math.random() * 2000;
    setInterval(() => {
      if (!document.getElementById(id)) return;
      slideCard(id, 1);
    }, interval);

    // Dot click
    container.querySelectorAll('.prop-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = Number(dot.dataset.i);
        const current = Number(container.dataset.slide || 0);
        slideCard(id, target - current);
      });
    });
  });
}

function renderCards(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = getAllProperties().slice(0, count || getAllProperties().length);
  container.innerHTML = items.length
    ? items.map(p => propCard(p)).join('')
    : `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 20px;">${lucideIcon('search', '', 32)}</div>
        <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Объявлений пока нет</h3>
        <p style="font-size: 15px; color: var(--muted); max-width: 400px; margin: 0; line-height: 1.5;">В данный момент база данных пуста. Объекты появятся здесь сразу после того, как администратор их опубликует.</p>
      </div>`;
}

function renderMapResults() {
  const el = document.getElementById('map-results-list');
  if (!el) return;

  const items = getFilteredMapProperties();
  el.innerHTML = items.length ? items.map((p) => `
    <div class="map-card" onclick="navigate('property','${p.id}')">
      <div class="map-card-img"><img src="${p.image}" alt="${p.addr}" loading="lazy" /></div>
      <div class="map-card-info">
        <div class="map-card-price">${p.price}</div>
        <div class="map-card-addr">${lucideIcon('mapPin')} ${p.addr}</div>
        ${typeof p.lat === 'number' && typeof p.lng === 'number' ? `<div class="map-card-coords">${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}</div>` : ''}
        <div class="map-card-meta">
          <span>${lucideIcon('bed')} ${p.rooms} комн</span>
          <span>${lucideIcon('ruler')} ${p.area} м²</span>
        </div>
      </div>
    </div>
  `).join('') : `<div style="padding: 60px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="width: 64px; height: 64px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 16px;">
        ${lucideIcon('mapPin', '', 28)}
      </div>
      <h3 style="font-size: 18px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Ничего не найдено</h3>
      <p style="font-size: 14px; color: var(--muted); line-height: 1.5; margin: 0;">На карте пока нет опубликованных объектов, соответствующих вашим критериям.</p>
    </div>`;

  const count = document.getElementById('map-results-count');
  if (count) {
    count.textContent = `Показано: ${items.length} объектов`;
  }

  const fullMap = document.getElementById('yandex-full-map');
  if (fullMap && fullMap._ymap) {
    addYandexMarkers(fullMap, items);
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(existing));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function loadYandexMap() {
  return new Promise((resolve) => {
    if (window.ymaps && window.ymaps.Map) return resolve(window.ymaps);
    if (window.__ymapsLoading) return resolve(window.__ymapsLoading);

    window.__ymapsLoading = new Promise((res) => {
      const checkYmaps = setInterval(() => {
        if (window.ymaps && window.ymaps.ready) {
          clearInterval(checkYmaps);
          window.ymaps.ready(() => res(window.ymaps));
        }
      }, 100);
    });
    return resolve(window.__ymapsLoading);
  });
}

function createYandexMap(elementId, center, zoom = 12) {
  const container = document.getElementById(elementId);
  if (!container || !window.ymaps) return null;
  if (container._ymap) return container._ymap;

  const map = new window.ymaps.Map(container, {
    center: center,
    zoom: zoom,
    controls: ['zoomControl', 'fullscreenControl']
  });

  container._ymap = map;
  container._ymapMarkers = new window.ymaps.GeoObjectCollection();
  map.geoObjects.add(container._ymapMarkers);
  return map;
}

function addYandexMarkers(container, items) {
  if (!container || !container._ymap || !window.ymaps) return;
  const markersCollection = container._ymapMarkers;
  markersCollection.removeAll();

  const validItems = (items || []).filter((item) => typeof item.lat === 'number' && typeof item.lng === 'number');
  
  const MarkerLayout = window.ymaps.templateLayoutFactory.createClass('<div class="ymap-custom-marker"></div>');

  validItems.forEach((item) => {
    const balloonContent = `
      <div class="ymap-balloon-card" onclick="navigate('property', '${item.id}')" style="cursor: pointer;">
        <img src="${Array.isArray(item.images) && item.images.length ? item.images[0] : item.image}" alt="${item.addr}" />
        <div class="ymap-balloon-info">
          <div class="ymap-balloon-price">${item.price}</div>
          <div class="ymap-balloon-addr">${item.addr}</div>
          <div class="ymap-balloon-meta">
            <span>${item.rooms ? item.rooms + ' комн' : ''}</span>
            <span>${item.area ? item.area + ' м²' : ''}</span>
          </div>
        </div>
      </div>
    `;

    const marker = new window.ymaps.Placemark([item.lat, item.lng], {
      balloonContent: balloonContent
    }, {
      iconLayout: MarkerLayout,
      iconShape: { type: 'Circle', coordinates: [0, 0], radius: 10 },
      balloonPanelMaxMapArea: 0,
      hideIconOnBalloonOpen: false,
      balloonOffset: [0, -15]
    });

    marker.events.add('mouseenter', function (e) {
      e.get('target').balloon.open();
    });

    markersCollection.add(marker);
  });

  if (validItems.length > 0) {
    container._ymap.setBounds(markersCollection.getBounds(), { checkZoomRange: true, zoomMargin: 30 }).then(() => {
        if(container._ymap.getZoom() > 16) container._ymap.setZoom(16);
    });
  }
}

async function initYandexMaps() {
  await loadYandexMap().catch(() => null);
  if (!window.ymaps) return;

  const preview = document.getElementById('preview-yandex-map');
  if (preview) {
    createYandexMap('preview-yandex-map', [38.556, 68.783], 12);
    addYandexMarkers(preview, getAllProperties());
  }

  const full = document.getElementById('yandex-full-map');
  if (full) {
    createYandexMap('yandex-full-map', [38.556, 68.783], 12);
    addYandexMarkers(full, getFilteredMapProperties());
  }
}

function renderPropertyDetailMap(property) {
  if (!property || typeof property.lat !== 'number' || typeof property.lng !== 'number') return;
  const container = document.getElementById('detail-yandex-map');
  if (!container) return;

  return loadYandexMap().then(() => {
    const map = createYandexMap('detail-yandex-map', [property.lat, property.lng], 15);
    if (!map) return;

    addYandexMarkers(container, [property]);
    map.setCenter([property.lat, property.lng], 15);
    const coords = document.getElementById('detail-map-coords');
    if (coords) coords.textContent = `${property.lat.toFixed(5)}, ${property.lng.toFixed(5)}`;
  }).catch(() => null);
}

// ── ROUTING ──
function routeForPage(page) {
  const routes = {
    home: '/',
    listings: '/listings',
    services: '/services',
    map: '/map',
    property: '/property',
    favorites: '/favorites',
    agent: '/profile',
    profile: '/profile',
  };
  return routes[page] || '/';
}

function setupHomeServices() {
  const cards = document.querySelectorAll('#page-home .services-section:not(.services-catalog-section) .service-card');
  const hrefs = ['/buy-property', '/repair', '/design', '/document-registration'];
  cards.forEach((card, index) => {
    const href = hrefs[index];
    if (!href || card.dataset.hrefReady === 'true') return;
    card.dataset.hrefReady = 'true';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('click', () => {
      window.location.href = href;
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = href;
      }
    });
  });
}

async function hydrateAuraPage(page) {
  // Show skeleton loader
  const skeletonHtml = Array(6).fill(`
    <div class="prop-card" style="border: 1px solid var(--border); box-shadow: none;">
      <div class="prop-img" style="background: #e2e8f0; animation: pulse 1.5s infinite;"></div>
      <div class="prop-body">
        <div style="height: 24px; background: #e2e8f0; width: 40%; border-radius: 6px; margin-bottom: 12px; animation: pulse 1.5s infinite;"></div>
        <div style="height: 16px; background: #e2e8f0; width: 80%; border-radius: 4px; margin-bottom: 16px; animation: pulse 1.5s infinite;"></div>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <div style="height: 16px; background: #e2e8f0; width: 25%; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
          <div style="height: 16px; background: #e2e8f0; width: 25%; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
          <div style="height: 16px; background: #e2e8f0; width: 25%; border-radius: 4px; animation: pulse 1.5s infinite;"></div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: auto; border-top: 1px solid var(--border); padding-top: 16px;">
          <div style="width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
          <div style="height: 16px; background: #e2e8f0; width: 40%; border-radius: 4px; margin-top: 8px; animation: pulse 1.5s infinite;"></div>
        </div>
      </div>
    </div>
  `).join('');
  
  const grids = ['featured-grid', 'listings-grid', 'favorites-grid', 'agent-grid'];
  grids.forEach(id => {
    const grid = document.getElementById(id);
    if (grid) grid.innerHTML = skeletonHtml;
  });

  await loadGlobalSettings();
  populateSelects();
  await loadAdminProperties();
  renderCatalogState();

  if (page === 'home') {
    setupHomeServices();
    renderCards('featured-grid', 6);
    setupHomeCarousel();
  }
  if (page === 'listings') {
    setupListingFilters();
    renderFilteredListings();
  }
  if (page === 'map') {
    setupMapFilters();
    renderMapResults();
  }
  if (page === 'property') renderPropertyDetail();
  if (page === 'favorites') renderFavoritesPage();
  if (page === 'agent') renderCards('agent-grid', 6);
  setupServiceRequestForm();
  await initYandexMaps();
  initCardSliders();
}

function setupServiceRequestForm() {
  // Setup phone formatting
  const phoneInputs = document.querySelectorAll('.phone-input');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let numbers = e.target.value.replace(/\D/g, "");
      if (numbers.startsWith("992")) numbers = numbers.slice(3);
      let formatted = "+992";
      if (numbers.length > 0) formatted += " " + numbers.substring(0, 3);
      if (numbers.length > 3) formatted += " " + numbers.substring(3, 5);
      if (numbers.length > 5) formatted += " " + numbers.substring(5, 9);
      e.target.value = formatted;
    });
  });

  const forms = document.querySelectorAll('.service-request-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput && phoneInput.value.replace(/\D/g, "").length < 12) {
        alert('Пожалуйста, введите корректный номер телефона.');
        return;
      }
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const serviceType = form.dataset.service || 'Общая заявка';
      const container = form.closest('.service-request-container');
      const successBlock = container?.querySelector('.service-request-success');
      
      try {
        btn.textContent = 'Отправка...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        
        const formData = new FormData(form);
        const data = {
          name: formData.get('name'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          service: serviceType
        };
        
        const res = await fetch('/api/service-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!res.ok) throw new Error('Ошибка сервера');
        
        form.reset();
        if (container && successBlock) {
          form.style.display = 'none';
          successBlock.style.display = 'block';
        } else {
          alert('Заявка успешно отправлена!');
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка при отправке. Попробуйте позже.');
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    });
  });
}

function renderCatalogState() {
  const allProps = getAllProperties();
  const total = allProps.length;
  
  const uniqueSellers = new Set(allProps.map(p => p.agent || p.agentName || 'Unknown')).size;
  const uniqueDistricts = new Set(allProps.map(p => p.district || p.addr || 'Unknown')).size;

  document.querySelectorAll('.stat-num').forEach((el, index) => {
    if (index === 0) el.innerHTML = `<span class="total-num">${total}</span><span>+</span>`;
  });
  document.querySelectorAll('.listings-count').forEach((el) => {
    el.innerHTML = `Найдено: <strong>${total} объектов</strong>`;
  });
  document.querySelectorAll('.total-num').forEach((el) => {
    el.textContent = total;
  });
  document.querySelectorAll('.total-sellers').forEach((el) => {
    el.textContent = uniqueSellers;
  });
  document.querySelectorAll('.total-districts').forEach((el) => {
    el.textContent = uniqueDistricts;
  });
  document.querySelectorAll('#map-results-count').forEach((el) => {
    el.textContent = `Показано: ${total} объектов`;
  });
  document.querySelectorAll('.map-home-results-count').forEach((el) => {
    el.textContent = `${total} объектов на карте`;
  });
}

function setupHomeCarousel() {
  const track = document.querySelector('.hero-cards-track');
  const container = document.querySelector('.hero-cards');
  if (!track || !container) return;

  track.querySelectorAll('.carousel-clone').forEach((clone) => clone.remove());

  const originalCards = Array.from(track.children).filter((card) => !card.classList.contains('carousel-clone'));
  const cloneCount = Math.max(2, originalCards.length);

  const prependClones = originalCards.slice(-cloneCount).map((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('carousel-clone');
    return clone;
  });
  const appendClones = originalCards.slice(0, cloneCount).map((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('carousel-clone');
    return clone;
  });

  prependClones.reverse().forEach((clone) => track.prepend(clone));
  appendClones.forEach((clone) => track.append(clone));

  window.heroCarouselOriginalCount = originalCards.length;
  window.heroCarouselCloneCount = cloneCount;
  window.heroCarouselIndex = cloneCount;

  if (window.heroCarouselTimer) window.clearInterval(window.heroCarouselTimer);

  window.slideHeroCards = function(direction) {
    const track = document.querySelector('.hero-cards-track');
    if (!track) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    window.heroCarouselIndex += direction;
    window.updateHeroCarousel();

    const resetIndex = () => {
      track.removeEventListener('transitionend', resetIndex);
      const cloneCount = window.heroCarouselCloneCount;
      const originalCount = window.heroCarouselOriginalCount;
      if (window.heroCarouselIndex < cloneCount) {
        window.heroCarouselIndex += originalCount;
      } else if (window.heroCarouselIndex >= cloneCount + originalCount) {
        window.heroCarouselIndex -= originalCount;
      } else {
        return;
      }
      window.updateHeroCarousel(true);
    };

    track.addEventListener('transitionend', resetIndex, { once: true });
  };

  window.updateHeroCarousel = function(skipTransition = false) {
    const track = document.querySelector('.hero-cards-track');
    const container = document.querySelector('.hero-cards');
    if (!track || !container) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    track.style.transition = skipTransition ? 'none' : 'transform .6s cubic-bezier(0.25, 1, 0.5, 1)';
    // overlap logic: gap is 0, margin is -40px both sides, so effective width is cardWidth - 80px
    const cardWidth = 280; 
    const effectiveWidth = cardWidth - 80;
    const containerWidth = container.getBoundingClientRect().width;
    const centeredOffset = window.heroCarouselIndex * effectiveWidth - (containerWidth - cardWidth) / 2 - 40; 
    
    track.style.transform = `translateX(${-centeredOffset}px)`;

    cards.forEach((card, index) => {
      const isActive = index === window.heroCarouselIndex;
      const isPrev = index === window.heroCarouselIndex - 1;
      const isNext = index === window.heroCarouselIndex + 1;
      card.classList.toggle('active', isActive);
      card.classList.toggle('prev', isPrev);
      card.classList.toggle('next', isNext);
    });
  };

  window.updateHeroCarousel(true);
  window.heroCarouselTimer = window.setInterval(() => window.slideHeroCards(1), 3500);
}

function navigate(page, id) {
  const url = routeForPage(page);
  if (page === 'profile' && id) {
    window.location.href = `${url}?seller=${encodeURIComponent(id)}`;
    return;
  }
  window.location.href = id ? `${url}?id=${encodeURIComponent(id)}` : url;
}

function navigateWithFilters() {
  const page = document.getElementById('page-home');
  if (!page) return navigate('listings');

  const selects = page.querySelectorAll('.search-row .s-select');
  const type = selects[0]?.value || '';
  
  const ext = document.getElementById('extended-filters-panel');
  const stage = ext?.querySelectorAll('.s-select')[1]?.value || '';
  const district = ext?.querySelectorAll('.s-select')[2]?.value || '';
  const renovation = ext?.querySelectorAll('.s-select')[3]?.value || '';
  const inputs = ext?.querySelectorAll('.s-input') || [];
  const minArea = inputs[0]?.value || '';
  const maxArea = inputs[1]?.value || '';
  const minFloor = inputs[2]?.value || '';
  const maxFloor = inputs[3]?.value || '';
  const landmark = inputs[4]?.value || '';
  
  const params = new URLSearchParams();
  if (type && type !== 'Тип недвижимости') params.set('type', type);
  if (stage && stage !== 'Любая') params.set('stage', stage);
  if (district && district !== 'Все районы') params.set('district', district);
  if (renovation && renovation !== 'Выберите типы ремонта') params.set('renovation', renovation);
  if (landmark) params.set('landmark', landmark);
  if (maxArea) params.set('maxArea', maxArea);

  const roomLabel = page.querySelector('#home-room-label');
  const rooms = roomLabel ? roomLabel.dataset.val : '';
  if (rooms && rooms !== 'Любой') params.set('rooms', rooms);

  const activeTab = page.querySelector('.s-tab.active');
  if (activeTab) {
    if (activeTab.textContent.includes('Купить')) params.set('deal', 'Продажа');
    if (activeTab.textContent.includes('Снять')) params.set('deal', 'Аренда');
  }

  const qs = params.toString();
  const url = routeForPage('listings');
  window.location.href = qs ? `${url}?${qs}` : url;
}

function setSearchTab(el, type) {
  document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function filterChip(el) {
  const group = el.parentElement;
  group?.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderFilteredListings();
}

window.selectHomeRoom = function(el, val) {
  const container = document.getElementById('home-room-chips');
  if (container) {
    container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  }
  el.classList.add('active');
  
  const label = document.getElementById('home-room-label');
  if (label) {
    label.dataset.val = val;
    label.textContent = val === 'Любой' ? 'Комнат' : val + ' комн.';
  }
}

function setupListingFilters() {
  const page = document.querySelector('.listings-page');
  if (!page || page.dataset.filtersReady === 'true') return;
  page.dataset.filtersReady = 'true';

  page.querySelectorAll('input, select').forEach((control) => {
    control.addEventListener('input', renderFilteredListings);
    control.addEventListener('change', renderFilteredListings);
  });
  page.querySelectorAll('.s-btn, .listings-filter-sidebar .btn-primary').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      renderFilteredListings();
    });
  });
  page.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChip(chip);
      const roomGroup = chip.closest('.filter-group');
      if (roomGroup?.querySelector('h4')?.textContent?.trim() === 'Комнат') {
        roomGroup.dataset.roomSelected = 'true';
      }
      window.setTimeout(renderFilteredListings, 0);
    });
  });
}

function selectedCheckboxValues(title) {
  const groups = Array.from(document.querySelectorAll('.filter-group'));
  const group = groups.find((item) => item.querySelector('h4')?.textContent?.trim() === title);
  if (!group) return [];
  return Array.from(group.querySelectorAll('.filter-check'))
    .filter((label) => label.querySelector('input')?.checked)
    .map((label) => label.textContent.trim());
}

function getRoomFilter() {
  const roomGroup = Array.from(document.querySelectorAll('.filter-group')).find(
    (item) => item.querySelector('h4')?.textContent?.trim() === 'Комнат',
  );
  if (roomGroup?.dataset.roomSelected !== 'true') return '';
  return roomGroup?.querySelector('.filter-chip.active')?.textContent?.trim() || '';
}

function getListingsFilters() {
  const search = document.querySelector('.listings-page .s-input')?.value?.trim().toLowerCase() || '';
  const propertyTypeSelect = document.querySelectorAll('.listings-page .s-select')[0];
  const roomsSelect = document.querySelectorAll('.listings-page .s-select')[1];
  const sortSelect = document.querySelector('.sort-select');
  const priceGroup = Array.from(document.querySelectorAll('.filter-group')).find(
    (item) => item.querySelector('h4')?.textContent?.trim() === 'Цена (TJS)'
  );
  const priceInputs = priceGroup?.querySelectorAll('input[type="number"]');
  const minPrice = priceInputs ? Number(priceInputs[0]?.value) : 0;
  const maxPrice = priceInputs ? Number(priceInputs[1]?.value) : 0;

  const areaGroup = Array.from(document.querySelectorAll('.filter-group')).find(
    (item) => item.querySelector('h4')?.textContent?.trim() === 'Площадь (м²)'
  );
  const areaInputs = areaGroup?.querySelectorAll('input[type="number"]');
  const minArea = areaInputs ? Number(areaInputs[0]?.value) : 0;
  const maxArea = areaInputs ? Number(areaInputs[1]?.value) : urlParams.get('maxArea') ? Number(urlParams.get('maxArea')) : 0;

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    search: search || urlParams.get('landmark') || '', // Map landmark to search
    propertyType: propertyTypeSelect?.value !== 'Все типы' ? propertyTypeSelect?.value : (urlParams.get('type') || ''),
    rooms: roomsSelect?.value || '',
    sort: sortSelect?.value || '',
    deals: selectedCheckboxValues('Тип сделки').length ? selectedCheckboxValues('Тип сделки') : (urlParams.get('deal') ? [urlParams.get('deal')] : []),
    types: selectedCheckboxValues('Тип недвижимости').length ? selectedCheckboxValues('Тип недвижимости') : (urlParams.get('type') ? [urlParams.get('type')] : []),
    districts: selectedCheckboxValues('Район').length ? selectedCheckboxValues('Район') : (urlParams.get('district') ? [urlParams.get('district')] : []),
    features: selectedCheckboxValues('Особенности'),
    roomChip: getRoomFilter(),
    minPrice: minPrice,
    maxPrice: maxPrice,
    minArea: minArea,
    maxArea: maxArea,
    renovation: urlParams.get('renovation') || '',
    constructionStages: selectedCheckboxValues('Стадия строительства').length ? selectedCheckboxValues('Стадия строительства') : (urlParams.get('stage') ? [urlParams.get('stage')] : []),
    documentTypes: selectedCheckboxValues('Документ'),
  };
}

function getMapFilters() {
  const page = document.querySelector('.map-page');
  if (!page) return { search: '', activeChips: [] };
  const search = page.querySelector('.map-topbar .s-input')?.value.trim().toLowerCase() || '';
  const activeChips = Array.from(page.querySelectorAll('.filter-chip.active')).map((chip) => chip.textContent.trim());
  return { search, activeChips };
}

function getFilteredMapProperties() {
  const filters = getMapFilters();
  return getAllProperties().filter((property) => propertyMatchesMapFilters(property, filters));
}

function propertyMatchesMapFilters(property, filters) {
  if (!filters || !filters.activeChips.length) return true;
  if (filters.search) {
    const text = `${property.addr} ${property.district || ''} ${property.propertyType || ''} ${property.description || ''}`.toLowerCase();
    if (!text.includes(filters.search)) return false;
  }

  if (filters.activeChips.includes('Все')) return true;

  if (filters.activeChips.includes('Продажа') && property.type !== 'sale') return false;
  if (filters.activeChips.includes('Аренда') && property.type !== 'rent') return false;

  const roomChips = filters.activeChips.filter((chip) => chip.endsWith('комн'));
  if (roomChips.length) {
    const matchesRoom = roomChips.some((chip) => {
      if (chip === '3+ комн') return Number(property.rooms) >= 3;
      const value = Number(chip.split(' ')[0]);
      return Number(property.rooms) === value;
    });
    if (!matchesRoom) return false;
  }

  return true;
}

function setupMapFilters() {
  const page = document.querySelector('.map-page');
  if (!page || page.dataset.mapFiltersReady === 'true') return;
  page.dataset.mapFiltersReady = 'true';

  const searchInput = page.querySelector('.map-topbar .s-input');
  if (searchInput) {
    searchInput.addEventListener('input', renderMapResults);
  }

  const chips = Array.from(page.querySelectorAll('.filter-chip'));
  const allChip = chips.find((chip) => chip.textContent.trim() === 'Все');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const label = chip.textContent.trim();
      if (label === 'Все') {
        chips.forEach((item) => item.classList.toggle('active', item === chip));
      } else {
        chip.classList.toggle('active');
        if (allChip) allChip.classList.remove('active');
        const anySelected = chips.some((item) => item !== allChip && item.classList.contains('active'));
        if (!anySelected && allChip) allChip.classList.add('active');
      }
      renderMapResults();
    });
  });
}

function propertyMatchesFilters(property, filters) {
  const text = `${property.addr} ${property.district || ''} ${property.propertyType || ''} ${property.description || ''}`.toLowerCase();
  if (filters.search && !text.includes(filters.search)) return false;

  if (filters.propertyType && filters.propertyType !== 'Все типы' && property.propertyType !== filters.propertyType) return false;
  if (filters.rooms && filters.rooms !== 'Комнат') {
    const selectedRooms = Number(filters.rooms.replace('+', ''));
    if (filters.rooms.includes('+') ? Number(property.rooms) < selectedRooms : Number(property.rooms) !== selectedRooms) return false;
  }
  if (filters.roomChip) {
    const selectedRooms = Number(filters.roomChip.replace('+', ''));
    if (filters.roomChip.includes('+') ? Number(property.rooms) < selectedRooms : Number(property.rooms) !== selectedRooms) return false;
  }

  if (filters.deals.length) {
    const dealLabel = property.type === 'rent' ? 'Аренда' : 'Продажа';
    if (!filters.deals.includes(dealLabel)) return false;
  }
  if (filters.types.length && !filters.types.includes(property.propertyType || 'Квартира')) return false;
  if (filters.districts.length && !filters.districts.some((district) => property.addr.includes(district) || property.district === district)) return false;
  if (filters.features.length) {
    const featureText = `${property.features || ''} ${property.description || ''}`.toLowerCase();
    if (!filters.features.every((feature) => featureText.includes(feature.toLowerCase()))) return false;
  }

  const price = normalizeNumber(property.price);
  if (filters.minPrice && price < filters.minPrice) return false;
  if (filters.maxPrice && price > filters.maxPrice) return false;

  const area = Number(property.area);
  if (filters.minArea && area < filters.minArea) return false;
  if (filters.maxArea && area > filters.maxArea) return false;
  if (filters.renovation && property.renovation !== filters.renovation) return false;
  if (filters.constructionStages.length && !filters.constructionStages.includes(property.constructionStage)) return false;
  if (filters.documentTypes.length && !filters.documentTypes.includes(property.documentType)) return false;

  return true;
}

function sortProperties(items, sort) {
  const sorted = [...items];
  if (sort === 'Сначала дешевле') sorted.sort((a, b) => normalizeNumber(a.price) - normalizeNumber(b.price));
  if (sort === 'Сначала дороже') sorted.sort((a, b) => normalizeNumber(b.price) - normalizeNumber(a.price));
  if (sort === 'Новые первые') sorted.sort((a, b) => Number(Boolean(b.new)) - Number(Boolean(a.new)));
  return sorted;
}

function renderFilteredListings() {
  const container = document.getElementById('listings-grid');
  if (!container) return;

  const filters = getListingsFilters();
  const items = sortProperties(getAllProperties().filter((property) => propertyMatchesFilters(property, filters)), filters.sort);
  container.innerHTML = items.length
    ? items.map((property) => propCard(property)).join('')
    : `<div style="grid-column: 1/-1; padding: 80px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 20px;">${lucideIcon('search')}</div>
        <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Ничего не найдено</h3>
        <p style="font-size: 15px; color: var(--muted); max-width: 400px; margin: 0; line-height: 1.5;">По выбранным фильтрам нет подходящих объявлений. Попробуйте изменить параметры поиска.</p>
      </div>`;

  const count = document.querySelector('.listings-count');
  if (count) count.innerHTML = `Найдено: <strong>${items.length} объектов</strong>`;

  const loadMoreBtn = document.querySelector('.listings-main .btn-secondary')?.parentElement;
  if (loadMoreBtn) {
    loadMoreBtn.style.display = items.length === 0 ? 'none' : 'block';
  }
}

function renderPropertyDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  const property = id ? findPropertyById(id) : null;
  if (!property) {
    const detail = document.querySelector('.prop-detail');
    if (detail) {
      detail.innerHTML = '<div class="seller-empty property-empty">Выберите опубликованное объявление из каталога. Сейчас реальных объявлений пока нет.</div>';
    }
    return;
  }

  const detailPrice = document.querySelector('.detail-price');
  const detailPricePer = document.querySelector('.detail-price-per');
  const detailTitle = document.querySelector('.detail-title');
  const detailAddr = document.querySelector('.detail-addr');
  const detailDesc = document.querySelector('.detail-desc');
  const priceDisplay = document.querySelector('.price-display');
  const priceNote = document.querySelector('.price-note');
  const contactAvatar = document.querySelector('.ca-ava');
  const contactName = document.querySelector('.ca-info strong');
  const contactMeta = document.querySelector('.ca-info small');
  const contactAgent = document.querySelector('.contact-agent');
  const amenitiesGrid = document.querySelector('.amenities-grid');
  const detailChips = document.querySelector('.detail-chips');

  if (detailChips) {
    let chipsHtml = '';
    if (property.propertyType) {
      chipsHtml += `<div class="detail-chip">${lucideIcon('keyRound')} ${property.propertyType}</div>`;
    }
    if (property.rooms) {
      const roomNum = Number(property.rooms) || 0;
      const roomText = roomNum === 1 ? 'комната' : (roomNum > 1 && roomNum < 5) ? 'комнаты' : 'комнат';
      chipsHtml += `<div class="detail-chip">${lucideIcon('bed')} ${property.rooms} ${roomText}</div>`;
    }
    if (property.area) {
      chipsHtml += `<div class="detail-chip">${lucideIcon('ruler')} ${property.area} м²</div>`;
    }
    if (property.floor) {
      chipsHtml += `<div class="detail-chip">${lucideIcon('building2')} ${property.floor} эт</div>`;
    }
    if (property.renovation && property.renovation !== 'Любая') {
      chipsHtml += `<div class="detail-chip">${lucideIcon('sparkles')} ${property.renovation}</div>`;
    }
    if (property.constructionStage && property.constructionStage !== 'Любая') {
      chipsHtml += `<div class="detail-chip">${lucideIcon('construction')} ${property.constructionStage}</div>`;
    }
    if (property.documentType && property.documentType !== 'Любой') {
      chipsHtml += `<div class="detail-chip">${lucideIcon('clipboard')} ${property.documentType}</div>`;
    }
    detailChips.innerHTML = chipsHtml;
  }

  if (detailPrice) detailPrice.textContent = property.price;
  if (detailPricePer) {
    detailPricePer.textContent = property.area ? `≈ ${Math.round(normalizeNumber(property.price) / Number(property.area)) || '-'} смн/м²` : '';
  }
  if (detailTitle) detailTitle.textContent = property.title || property.addr;
  if (detailAddr) detailAddr.innerHTML = `${lucideIcon('mapPin')} ${property.addr}`;
  if (detailDesc) detailDesc.textContent = property.description || 'Описание пока не добавлено.';
  if (priceDisplay) priceDisplay.textContent = property.price;
  if (priceNote) priceNote.textContent = `${property.priceNote} · ${property.area} м² · ${property.rooms} комн`;
  const detailLocationDistrict = document.getElementById('detail-location-district');
  const detailLocationAddress = document.getElementById('detail-location-address');
  const detailLocationCoords = document.getElementById('detail-location-coords');
  const detailMapOverlay = document.getElementById('detail-map-overlay');

  if (detailLocationDistrict) detailLocationDistrict.textContent = property.district || '—';
  if (detailLocationAddress) detailLocationAddress.textContent = property.addr || 'Адрес не указан';
  if (detailLocationCoords) {
    detailLocationCoords.textContent = (typeof property.lat === 'number' && typeof property.lng === 'number')
      ? `${property.lat.toFixed(5)}, ${property.lng.toFixed(5)}`
      : 'Координаты не указаны';
  }
  if (detailMapOverlay) {
    detailMapOverlay.innerHTML = `${lucideIcon('mapPin')} ${property.addr || 'Посмотреть на карте'}${
      typeof property.lat === 'number' && typeof property.lng === 'number' ? '' : ''
    }`;
  }
  if (contactAvatar) {
    contactAvatar.innerHTML = property.agentAvatar
      ? `<img src="${property.agentAvatar}" alt="${property.agentName}" />`
      : property.agent;
  }
  if (contactName) contactName.textContent = property.agentName;
  if (contactMeta) {
    contactMeta.innerHTML = '';
  }
  
  const contactPhoneDisplay = document.getElementById('contact-phone-display');
  const contactWhatsapp = document.getElementById('contact-whatsapp');
  const contactTelegram = document.getElementById('contact-telegram');

  if (contactPhoneDisplay) {
    const phone = property.phone || '+992 000 00 00 00';
    contactPhoneDisplay.textContent = phone;
    contactPhoneDisplay.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  }
  if (contactWhatsapp) {
    const phoneNum = (property.phone || '').replace(/[^0-9]/g, '');
    contactWhatsapp.href = phoneNum ? `https://wa.me/${phoneNum}` : '#';
    if (phoneNum) contactWhatsapp.target = '_blank';
    contactWhatsapp.onclick = phoneNum ? null : () => showNotif('Номер не указан');
  }
  if (contactTelegram) {
    const phoneNum = (property.phone || '').replace(/[^0-9]/g, '');
    contactTelegram.href = phoneNum ? `https://t.me/+${phoneNum}` : '#';
    if (phoneNum) contactTelegram.target = '_blank';
    contactTelegram.onclick = phoneNum ? null : () => showNotif('Номер не указан');
  }
  if (contactAgent) {
    contactAgent.onclick = () => {
      if (property.sellerId) {
        navigate('profile', property.sellerId);
        return;
      }
      showNotif(property.phone ? `${property.agentName}: ${property.phone}` : `${property.agentName}: контакты в объявлении`);
    };
  }

  if (amenitiesGrid) {
    const amenities = splitFeatures(property.features);
    amenitiesGrid.innerHTML = amenities.length
      ? amenities.map((feature) => `<div class="amenity">${lucideIcon('check', 'lucide-inline amenity-icon')}<span>${feature}</span></div>`).join('')
      : '<div class="amenity amenity-empty">Удобства пока не указаны</div>';
  }

  const galleryMain = document.querySelector('.gallery-main');
  const galleryThumbs = document.querySelector('.gallery-thumbs');
  const images = Array.isArray(property.images) && property.images.length
    ? property.images
    : property.image ? [property.image] : [];

  if (galleryMain) {
    galleryMain.innerHTML = images.length
      ? `<img src="${images[0]}" alt="${property.title || property.addr}" />`
      : '<div class="gallery-empty">Изображения пока не указаны</div>';
  }

  if (galleryThumbs) {
    galleryThumbs.innerHTML = images.length > 1
      ? images.slice(1).map((src, index) => `
        <div class="gallery-thumb">
          <img src="${src}" alt="${property.title || property.addr} ${index + 2}" loading="lazy" />
        </div>
      `).join('')
      : '';
  }

  renderPropertyDetailMap(property);
}

function getFavoriteIds() {
  const value = window.localStorage.getItem('barakatFavorites');
  try {
    return JSON.parse(value || '[]');
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids) {
  window.localStorage.setItem('barakatFavorites', JSON.stringify([...new Set(ids.map(String))]));
}

function isFavoriteProperty(id) {
  return getFavoriteIds().includes(String(id));
}

function getFavoriteProperties() {
  const ids = getFavoriteIds();
  return getAllProperties().filter((property) => ids.includes(String(property.id)));
}

function toggleFavoriteId(id) {
  const ids = getFavoriteIds();
  const value = String(id);
  const index = ids.indexOf(value);
  if (index >= 0) ids.splice(index, 1);
  else ids.push(value);
  saveFavoriteIds(ids);
  return ids.includes(value);
}

function renderFavoritesPage() {
  const container = document.getElementById('favorites-grid');
  const count = document.getElementById('favorites-count');
  const items = getFavoriteProperties();
  if (count) count.innerHTML = `Избранное: <strong>${items.length}</strong>`;
  if (!container) return;
  container.innerHTML = items.length
    ? items.map((property) => propCard(property)).join('')
    : `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 20px;">${lucideIcon('heart', '', 32)}</div>
        <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">В избранном пусто</h3>
        <p style="font-size: 15px; color: var(--muted); max-width: 400px; margin: 0; line-height: 1.5;">Добавляйте понравившиеся объявления в избранное, чтобы вернуться к ним позже.</p>
      </div>`;
}

function toggleFav(btn) {
  const id = btn.dataset.propId;
  if (!id) return;
  const isFav = toggleFavoriteId(id);
  btn.dataset.fav = String(isFav);
  btn.classList.toggle('active', isFav);
  btn.innerHTML = lucideIcon('heart', 'lucide-fav');
  if (window.location.pathname === '/favorites') {
    renderFavoritesPage();
  }
}

function setupServiceRequestForm() {
  const form = document.getElementById('service-request-form');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';

  document.querySelectorAll('[data-service-request]').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-service-request') || '';
      const select = form.querySelector('[name="service"]');
      if (select && service) select.value = service;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.querySelector('[name="name"]')?.focus();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      service: String(formData.get('service') || ''),
      message: String(formData.get('message') || ''),
    };

    if (button) {
      button.disabled = true;
      button.textContent = 'Отправляем...';
    }

    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Не удалось отправить заявку');
      form.reset();
      showNotif('Заявка отправлена в Telegram');
    } catch (error) {
      showNotif(error instanceof Error ? error.message : 'Не удалось отправить заявку');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Отправить заявку';
      }
    }
  });
}

// ── NOTIFICATION ──
function showNotif(msg) {
  const n = document.getElementById('notif');
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

// ── SCROLL EFFECTS ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  // reveal
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
});

// ── LOADER ──
function hideLoader() {
  document.getElementById('loader')?.classList.add('hidden');
}

// ── RANGE INPUTS ──
function initRangeInputs() {
  document.querySelectorAll('.range-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const isPrice = e.target.max > 1000;
      
      const valsContainer = e.target.nextElementSibling;
      if (valsContainer && valsContainer.classList.contains('range-vals')) {
        const spans = valsContainer.querySelectorAll('span');
        if (spans.length >= 2) {
          const formatted = isPrice ? val.toLocaleString('ru-RU').replace(/,/g, ' ') + ' смн' : val + ' м²';
          spans[0].textContent = 'до ' + formatted;
        }
      }

      const percent = ((val - e.target.min) / (e.target.max - e.target.min)) * 100;
      e.target.style.background = `linear-gradient(to right, #d4af37 0%, #d4af37 ${percent}%, #444 ${percent}%, #444 100%)`;
    });
    
    // Trigger initial state
    input.dispatchEvent(new Event('input'));
  });
}

window.hydrateAuraPage = async function(page) {
  if (!window.__globalDataLoaded) {
    await Promise.all([
      typeof loadGlobalSettings === 'function' ? loadGlobalSettings() : Promise.resolve(),
      typeof loadAdminProperties === 'function' ? loadAdminProperties() : Promise.resolve()
    ]);
    if (typeof populateSelects === 'function') populateSelects();
    window.__globalDataLoaded = true;
  }
  if (typeof renderCatalogState === 'function') renderCatalogState();

  if (page === 'home' || page === '') {
    setupHomeServices();
    renderCards('featured-grid', 6);
    if (typeof setupHomeCarousel === 'function') setupHomeCarousel();
    initYandexMaps();
    initRangeInputs();
    await loadReviews();
  } else if (page === 'favorites') {
    renderFavoritesPage();
  } else if (page === 'team') {
    await loadTeam();
  } else if (page === 'listings') {
    if (typeof setupListingFilters === 'function') setupListingFilters();
    if (typeof renderFilteredListings === 'function') renderFilteredListings();
  } else if (page === 'map') {
    if (typeof setupMapFilters === 'function') setupMapFilters();
    if (typeof renderMapResults === 'function') renderMapResults();
    const fullMap = document.getElementById('yandex-full-map');
    if (fullMap && !fullMap._ymap && typeof loadYandexMap === 'function') {
      loadYandexMap().then(() => {
        createYandexMap('yandex-full-map', [38.5598, 68.7870], 12);
        renderMapResults();
      });
    }
  } else if (page === 'property') {
    if (typeof renderPropertyDetail === 'function') renderPropertyDetail();
    if (typeof initCardSliders === 'function') initCardSliders();
  }
};

async function submitReview(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Загрузка...';

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    text: formData.get('text'),
    sellerId: null, // Global review for the whole site
  };

  try {
    const baseUrl = window.BARAKAT_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Ошибка отправки');
    showNotif('Ваш отзыв успешно отправлен на модерацию!');
    form.reset();
    document.getElementById('modal-review').style.display = 'none';
  } catch (error) {
    showNotif('Не удалось отправить отзыв. Попробуйте позже.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Отправить отзыв';
  }
}

window.openReviewModal = function() {
  let modal = document.getElementById('modal-review');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-review';
    modal.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;align-items:center;justify-content:center;padding:20px;";
    modal.innerHTML = `
      <div style="background:white;padding:32px;border-radius:24px;width:100%;max-width:400px;position:relative;">
        <button onclick="document.getElementById('modal-review').style.display='none'" style="position:absolute;top:16px;right:16px;border:none;background:transparent;font-size:24px;cursor:pointer;color:#64748b;">&times;</button>
        <h3 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#0f172a;text-align:center;">Оставить отзыв</h3>
        <p style="font-size:14px;color:#64748b;margin-bottom:24px;text-align:center;">Поделитесь вашим впечатлением о работе с нами.</p>
        <form id="form-review" style="display:flex;flex-direction:column;gap:16px;" onsubmit="submitReview(event)">
          <input type="text" name="name" required placeholder="Ваше имя" style="padding:14px 16px;border-radius:10px;border:1px solid #cbd5e1;font-size:15px;color:#0f172a;outline:none;font-family:inherit;"/>
          <textarea name="text" required placeholder="Ваш отзыв" rows="4" style="padding:14px 16px;border-radius:10px;border:1px solid #cbd5e1;font-size:15px;resize:none;color:#0f172a;outline:none;font-family:inherit;"></textarea>
          <button type="submit" style="padding:14px;background:var(--gold);color:var(--ink);font-weight:600;border:none;border-radius:10px;cursor:pointer;font-size:15px;margin-top:8px;font-family:inherit;">Отправить отзыв</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
}

async function loadReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container) return;
  try {
    const baseUrl = window.BARAKAT_API_URL || 'https://barakatestateadmin.vercel.app';
    const res = await fetch(`${baseUrl}/api/reviews`);
    if (!res.ok) return;
    const { data } = await res.json();
    const approvedReviews = data.filter(r => r.status === 'approved');
    if (approvedReviews.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 20px;">${lucideIcon('message-square', '', 32)}</div>
        <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Отзывов пока нет</h3>
        <p style="font-size: 15px; color: var(--muted); max-width: 400px; margin: 0; line-height: 1.5;">Станьте первым, кто оставит отзыв о нашей работе!</p>
      </div>`;
      return;
    }

    container.innerHTML = approvedReviews.map(r => `
      <div style="flex:0 0 300px; background:linear-gradient(145deg, #ffffff 0%, #f9fbfd 100%); padding:24px; border-radius:20px; box-shadow:0 8px 24px rgba(0,0,0,0.06); border:1px solid rgba(212, 175, 55, 0.2); display:flex; flex-direction:column; gap:16px; position:relative; scroll-snap-align:start;">
        <div style="position:absolute; top:16px; right:16px; color:rgba(212, 175, 55, 0.12);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        </div>
        <div style="flex:1;">
          <p style="font-size:15px; line-height:1.6; color:var(--ink); font-style:italic; position:relative; z-index:2; margin:0; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden;">"${r.text}"</p>
          ${r.text.length > 160 ? `<button onclick="const p = this.previousElementSibling; if(p.style.display==='block'){ p.style.display='-webkit-box'; this.innerHTML='Читать далее'; } else { p.style.display='block'; this.innerHTML='Скрыть <span style=\\'font-size:16px; margin-left:4px;\\'>&uarr;</span>'; }" style="background:none; border:none; color:var(--gold); font-size:14px; font-weight:600; padding:0; margin-top:8px; cursor:pointer; display:flex; align-items:center;">Читать далее</button>` : ''}
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-top: 4px;">
          <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--gold) 0%, #B89025 100%); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:18px; box-shadow:0 4px 12px rgba(212, 175, 55, 0.3);">
            ${r.name.charAt(0).toUpperCase()}
          </div>
          <div style="font-weight:700; font-size:15px; color:#0f172a;">${r.name}</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load reviews', err);
  }
}

// loadReviews() is now called via hydrateAuraPage

// Form logic for static pages
document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (form.classList && form.classList.contains('service-request-form')) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Отправка...';
    }
    
    const formData = new FormData(form);
    const service = form.getAttribute('data-service') || 'Общая заявка';
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message') || '',
      service
    };
    
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      
      const successDiv = form.parentElement.querySelector('.service-request-success');
      if (successDiv) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
      } else {
        alert('Заявка отправлена!');
        form.reset();
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Попробуйте позже.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Отправить заявку';
      }
    }
  }
});

document.addEventListener('input', (e) => {
  if (e.target.matches('.phone-input') || (e.target.type === 'tel' && !e.target.hasAttribute('value'))) {
    let val = e.target.value;
    if (!val || val === "+" || val === "+9" || val === "+99" || val === "+992" || val === "+992 ") {
      e.target.value = "";
      return;
    }
    const digits = val.replace(/\D/g, "");
    let phoneDigits = digits;
    if (digits.startsWith("992")) {
      phoneDigits = digits.slice(3);
    }
    if (phoneDigits.length === 0) {
      e.target.value = "+992 ";
      return;
    }
    let formatted = "+992 ";
    if (phoneDigits.length > 0) formatted += phoneDigits.substring(0, 3);
    if (phoneDigits.length > 3) formatted += " " + phoneDigits.substring(3, 5);
    if (phoneDigits.length > 5) formatted += " " + phoneDigits.substring(5, 9);
    e.target.value = formatted;
  }
});

document.addEventListener('focusin', (e) => {
  if (e.target.matches('.phone-input') || (e.target.type === 'tel' && !e.target.hasAttribute('value'))) {
    if (!e.target.value) {
      e.target.value = "+992 ";
    }
  }
});

async function loadTeam() {
  const container = document.getElementById('team-grid');
  if (!container) return;
  try {
    const baseUrl = 'https://barakatestateadmin.vercel.app';
    const res = await fetch(`${baseUrl}/api/users`);
    if (!res.ok) throw new Error('Network response was not ok');
    const payload = await res.json();
    const data = payload.data || payload;
    
    const activeEmployees = (Array.isArray(data) ? data : []).filter(e => e.role === 'seller');
    
    if (activeEmployees.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: 20px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Сотрудники не найдены</h3>
        <p style="font-size: 15px; color: var(--muted); max-width: 400px; margin: 0; line-height: 1.5;">В данный момент список сотрудников пуст.</p>
      </div>`;
      return;
    }

    container.innerHTML = activeEmployees.map(emp => `
      <div onclick="navigate('profile', '${emp.id}')" style="cursor: pointer; background: white; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 10px 25px rgba(0,0,0,0.08)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)'; this.style.transform='none'">
        
        <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin-bottom: 16px; background: var(--cream); border: 1px solid var(--border);">
          <img src="${emp.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${emp.name || emp.fullName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"/>
        </div>
        
        <h3 style="font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 4px 0;">${emp.name || emp.fullName}</h3>
        <div style="font-size: 13px; font-weight: 600; color: var(--gold); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">${emp.position || emp.specializations || 'Агент по недвижимости'}</div>
        
        <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
          <a href="tel:${emp.phone || ''}" onclick="event.stopPropagation()" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); color: var(--gold); display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='var(--gold)'; this.style.color='white'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'; this.style.color='var(--gold)'; this.style.transform='none'" title="Телефон">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </a>
          <a href="${emp.whatsapp ? 'https://wa.me/' + emp.whatsapp.replace(/\D/g, '') : '#'}" onclick="event.stopPropagation()" target="_blank" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(37, 211, 102, 0.1); color: #25D366; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#25D366'; this.style.color='white'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(37, 211, 102, 0.1)'; this.style.color='#25D366'; this.style.transform='none'" title="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
          </a>
          <a href="${emp.telegram ? (emp.telegram.startsWith('http') ? emp.telegram : 'https://t.me/' + emp.telegram.replace('@', '')) : '#'}" onclick="event.stopPropagation()" target="_blank" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0, 136, 204, 0.1); color: #0088cc; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#0088cc'; this.style.color='white'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 136, 204, 0.1)'; this.style.color='#0088cc'; this.style.transform='none'" title="Telegram">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/></svg>
          </a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load team', err);
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center;">
      <h3 style="font-size: 20px; font-weight: 600; color: var(--ink); margin: 0 0 8px 0;">Ошибка загрузки</h3>
      <p style="color: var(--muted);">Не удалось загрузить список сотрудников. Пожалуйста, обновите страницу.</p>
    </div>`;
  }
}

// loadTeam() is now called via hydrateAuraPage
