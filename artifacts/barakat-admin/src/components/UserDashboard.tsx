

const ADMIN_API = '/api/admin';

const TOKEN_KEY = 'barakat_admin_token';
const getToken = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64 = ""] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function openPhoto(src: string): void {
  if (!src.startsWith("data:")) {
    window.open(src, "_blank", "noopener,noreferrer");
    return;
  }
  try {
    const url = URL.createObjectURL(dataUrlToBlob(src));
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "photo.jpg";
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    /* ignore: malformed data url */
  }
}

function downloadPhoto(src: string, index = 0): void {
  if (src.startsWith("data:")) {
    try {
      const url = URL.createObjectURL(dataUrlToBlob(src));
      const a = document.createElement("a");
      a.href = url;
      a.download = `photo-${index + 1}.jpg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      /* ignore: malformed data url */
    }
    return;
  }
  const sep = src.includes("?") ? "&" : "?";
  const a = document.createElement("a");
  a.href = `${src}${sep}download=1`;
  a.rel = "noopener noreferrer";
  a.click();
}


import {
  Building2,
  CheckCircle2,
  Contact,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  MessageSquare,
  Image as ImageIcon,
  Users,
  Settings,
  X,
  Edit2,
  PlusCircle,
  Inbox,
  Star,
  CalendarClock,
  Bell,
  Home,
  Tag,
  Calculator,
  Zap,
  Newspaper,
  Download,
  Eye,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { AuthUser, Listing, Profile, PublishStatus, Application, Banner, User, BlogPost } from "@/lib/types";

type Tab =
  | "listings"
  | "profile"
  | "applications"
  | "users"
  | "settings"
  | "reviews"
  | "viewings"
  | "blog"
  | "app_rent"
  | "app_sell"
  | "app_appraisal"
  | "app_buyout"
  | "app_other";

const APPLICATION_CATEGORIES: Array<{ id: Tab; label: string; service: string; icon: React.ReactNode }> = [
  { id: "app_rent", label: "Сдать в аренду", service: "Сдать в аренду", icon: <Home size={18} /> },
  { id: "app_sell", label: "Продажа", service: "Объявление для продажи", icon: <Tag size={18} /> },
  { id: "app_appraisal", label: "Оценка", service: "Оценка стоимости", icon: <Calculator size={18} /> },
  { id: "app_buyout", label: "Срочный выкуп", service: "Срочный выкуп", icon: <Zap size={18} /> },
];

const KNOWN_APP_SERVICES = APPLICATION_CATEGORIES.map((c) => c.service);

function isAppTab(tab: Tab): boolean {
  return tab === "app_other" || APPLICATION_CATEGORIES.some((c) => c.id === tab);
}

function appServiceFor(tab: Tab): string | null {
  return APPLICATION_CATEGORIES.find((c) => c.id === tab)?.service ?? null;
}

function appPredicate(tab: Tab): (a: any) => boolean {
  if (tab === "app_other") return (a) => !KNOWN_APP_SERVICES.includes(a?.service);
  const service = appServiceFor(tab);
  return (a) => a?.service === service;
}

function endpointFor(tab: Tab): string {
  return isAppTab(tab) ? "applications" : tab;
}

function tabForService(service: string): Tab {
  return APPLICATION_CATEGORIES.find((c) => c.service === service)?.id ?? "app_other";
}

type FormState = {
  listings: Partial<Listing>;
  profile: Partial<Profile>;
  applications: Partial<Application>;

  users: Partial<AuthUser>;
  settings: Partial<Profile>;
  reviews: any;
  viewings: any;
  blog: Partial<BlogPost>;
  app_rent: Partial<Application>;
  app_sell: Partial<Application>;
  app_appraisal: Partial<Application>;
  app_buyout: Partial<Application>;
  app_other: Partial<Application>;
};

function getTabs(role: string): Array<{ id: Tab; label: string; icon: React.ReactNode }> {
  const baseTabs = [
    { id: "listings" as Tab, label: role === "admin" ? "Все объявления" : "Мои объявления", icon: <Building2 size={18} /> },
  ];
  
  if (role === "admin") {
    return [
      ...baseTabs,
      ...APPLICATION_CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
      { id: "app_other" as Tab, label: "Другие заявки", icon: <Inbox size={18} /> },
      { id: "viewings" as Tab, label: "Просмотры", icon: <CalendarClock size={18} /> },
      { id: "reviews" as Tab, label: "Отзывы", icon: <Star size={18} /> },
      { id: "blog" as Tab, label: "Блог", icon: <Newspaper size={18} /> },
      { id: "users" as Tab, label: "Пользователи", icon: <Users size={18} /> },
      { id: "settings" as Tab, label: "Настройки сайта", icon: <Settings size={18} /> },
    ];
  }

  return [
    ...baseTabs,
    { id: "viewings" as Tab, label: "Просмотры", icon: <CalendarClock size={18} /> },
    { id: "profile" as Tab, label: "Мой профиль", icon: <Contact size={18} /> },
  ];
}

const emptyForms: FormState = {
  listings: {
    title: "",
    dealType: "sale",
    propertyType: "Квартира",
    price: 0,
    district: "Душанбе",
    address: "",
    rooms: 1,
    area: 0,
    floor: 1,
    totalFloors: 1,
    yearBuilt: new Date().getFullYear(),
    description: "",
    features: "",
    latitude: 38.5598,
    longitude: 68.787,
    mainImage: "",
    gallery: "",
    isFeatured: false,
    isNew: false,
    isUrgent: false,
    isHero: false,
    status: "published",
    documentType: "",
  },
  profile: {
    name: "",
    description: "",
    phone: "",
    email: "",
    socials: { instagram: "", telegram: "", whatsapp: "", facebook: "" },
    avatarUrl: "",
    specializations: "",
    rating: 5,
    dealsCount: 0,
    experienceYears: 0,
  },
  applications: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  app_rent: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  app_sell: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  app_appraisal: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  app_buyout: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  app_other: { name: "", phone: "", service: "", message: "", photos: "", status: "new" },
  reviews: { name: "", text: "", sellerId: "", status: "pending" },
  viewings: {},
  blog: { title: "", category: "", excerpt: "", image: "", content: "", status: "draft" },

  users: { username: "", name: "", email: "", phone: "", whatsapp: "", telegram: "", instagram: "", facebook: "", avatar: "", bio: "", rating: 5, dealsCount: 0, experienceYears: 0, specializations: "", role: "seller" },
  settings: {
    name: "Barakat", description: "", phone: "", email: "",
    socials: { instagram: "", telegram: "", whatsapp: "", facebook: "" },
    avatarUrl: "", specializations: "", rating: 5, dealsCount: 0, experienceYears: 0,
    districts: "Центр, Исмоили Сомони, Сино, Фирдавси, Шохмансур",
    propertyTypes: "Квартира, Вторичка, Новостройки, Котлован, Дома, Дом, Земельные участки, Коммерческая, Дача, Парковка, Комната",
    dealTypes: "sale:Продажа, rent:Аренда",
  },
};

function cloneForm<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toNumber(value: FormDataEntryValue | null) {
  return Number(value || 0);
}

function toStatus(value: FormDataEntryValue | null): PublishStatus {
  return value === "published" ? "published" : "draft";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxSize = 1600, quality = 0.82): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return readFileAsDataUrl(file);
  }
  try {
    const objectUrl = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Не удалось загрузить изображение"));
      image.src = objectUrl;
    });
    let { width, height } = img;
    if (width > maxSize || height > maxSize) {
      const scale = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas context");
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return readFileAsDataUrl(file);
  }
}

async function uploadFile(file: File): Promise<string> {
  try {
    const image = await compressImage(file);
    const res = await authFetch(`${ADMIN_API}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка сервера: ${res.status}`);
    }
    const data = await res.json();
    if (!data.url) {
      throw new Error("Сервер не вернул URL файла");
    }
    return data.url;
  } catch (err: any) {
    console.error("uploadFile error:", err);
    throw new Error(err.message || "Ошибка при отправке файла на сервер");
  }
}

async function prepareImageFields(data: FormData) {
  const mainImageFile = data.get("mainImageFile");
  if (mainImageFile instanceof File && mainImageFile.size > 0) {
    const url = await uploadFile(mainImageFile);
    data.set("mainImage", url);
  }

  const galleryFiles = data.getAll("galleryFiles").filter((item) => item instanceof File && item.size > 0) as File[];
  const uploadedGalleryUrls: string[] = [];

  for (const file of galleryFiles) {
    const url = await uploadFile(file);
    uploadedGalleryUrls.push(url);
  }

  const textGallery = String(data.get("gallery") || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (uploadedGalleryUrls.length > 0 || textGallery.length > 0) {
    data.set("gallery", [...uploadedGalleryUrls, ...textGallery].join("\n"));
  }
}

function userToProfile(user: AuthUser): Partial<Profile> {
  return {
    name: user.name,
    description: user.bio,
    phone: user.phone,
    email: user.email,
    socials: {
      instagram: user.instagram,
      telegram: user.telegram,
      whatsapp: user.whatsapp,
      facebook: user.facebook,
    },
    avatarUrl: user.avatar,
    rating: user.rating,
    dealsCount: user.dealsCount,
    experienceYears: user.experienceYears,
    specializations: user.specializations,
  };
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKeyCounter, setFormKeyCounter] = useState(0);
  const [form, setForm] = useState<FormState>(cloneForm(emptyForms));
  const [query, setQuery] = useState("");
  const [statusFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<Partial<Profile>>(emptyForms.settings);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allViewings, setAllViewings] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const reqIdRef = useRef(0);

  const appUnseen = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of APPLICATION_CATEGORIES) {
      m[c.id] = allApplications.filter((a) => a.service === c.service && a.status === "new").length;
    }
    m["app_other"] = allApplications.filter((a) => !KNOWN_APP_SERVICES.includes(a.service) && a.status === "new").length;
    return m;
  }, [allApplications]);

  const totalUnseen = useMemo(
    () => allApplications.filter((a) => a.status === "new").length,
    [allApplications],
  );

  const recentUnseen = useMemo(
    () => allApplications.filter((a) => a.status === "new").slice(0, 8),
    [allApplications],
  );

  const tabBadges = useMemo(() => {
    const m: Record<string, number> = { ...appUnseen };
    m["viewings"] = allViewings.filter((v) => v.status === "new").length;
    m["reviews"] = allReviews.filter((r) => r.status === "pending").length;
    return m;
  }, [appUnseen, allViewings, allReviews]);

  useEffect(() => {
    authFetch(`${ADMIN_API}/auth/me`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not auth");
      })
      .then((data) => {
        setCurrentUser(data.user);
        setForm((prev) => ({ ...prev, profile: userToProfile(data.user) }));
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthReady(true));
      
    authFetch(`${ADMIN_API}/profile`).then(res => res.ok && res.json()).then(data => {
      if (data?.data) {
        setGlobalSettings(data.data);
        setForm(prev => ({ ...prev, settings: data.data }));
      }
    });
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === "profile" || activeTab === "settings") return [];
    const matchesCategory = isAppTab(activeTab) ? appPredicate(activeTab) : () => true;
    return items.filter((item) => {
      if (!matchesCategory(item)) return false;
      const text = JSON.stringify(item).toLowerCase();
      const matchesSearch = text.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter || !("status" in item);
      return matchesSearch && matchesStatus;
    });
  }, [items, query, statusFilter, activeTab]);

  useEffect(() => {
    if (!currentUser) return;
    void loadData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function refreshApplications() {
    if (currentUser?.role !== "admin") return;
    const fetchList = async (path: string, set: (v: any[]) => void) => {
      try {
        const res = await authFetch(`${ADMIN_API}/${path}?admin=1`);
        const payload = await res.json();
        set(Array.isArray(payload) ? payload : payload.data || []);
      } catch {
        // non-fatal: this badge simply won't update this cycle
      }
    };
    await Promise.allSettled([
      fetchList("applications", setAllApplications),
      fetchList("viewings", setAllViewings),
      fetchList("reviews", setAllReviews),
    ]);
  }

  useEffect(() => {
    if (currentUser?.role !== "admin") return;
    void refreshApplications();
    const timer = window.setInterval(() => void refreshApplications(), 20000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!notifOpen) return;
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function loadData(tab: Tab) {
    if (tab === "profile" || tab === "settings") return;
    const myId = ++reqIdRef.current;
    setLoading(true);
    try {
      const res = await authFetch(`${ADMIN_API}/${endpointFor(tab)}?admin=1`);
      const payload = await res.json();
      if (reqIdRef.current !== myId) return;
      setItems(Array.isArray(payload) ? payload : (payload.data || []));
      setForm((prev) => ({ ...prev, profile: userToProfile(currentUser!) }));
    } finally {
      if (reqIdRef.current === myId) setLoading(false);
    }
  }

  async function markCategorySeen(tab: Tab, rows: any[]) {
    const predicate = appPredicate(tab);
    const unseen = rows.filter((a) => predicate(a) && a.status === "new");
    if (unseen.length === 0) return;
    await Promise.all(
      unseen.map((a) =>
        authFetch(`${ADMIN_API}/applications/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        }),
      ),
    );
    await loadData(tab);
    await refreshApplications();
  }

  async function openAppCategory(tab: Tab) {
    const myId = ++reqIdRef.current;
    setLoading(true);
    let rows: any[] = [];
    try {
      const res = await authFetch(`${ADMIN_API}/applications?admin=1`);
      const payload = await res.json();
      rows = Array.isArray(payload) ? payload : payload.data || [];
      if (reqIdRef.current !== myId) return;
      setItems(rows);
    } finally {
      if (reqIdRef.current === myId) setLoading(false);
    }
    // User navigated away while loading — don't mark or reload a stale category.
    if (reqIdRef.current !== myId) return;
    await markCategorySeen(tab, rows);
  }

  async function handleLogout() {
    await authFetch(`${ADMIN_API}/auth/logout`, { method: "POST" });
    clearToken();
    setCurrentUser(null);
    setItems([]);
    setEditingId(null);
    setActiveTab("listings");
    setForm(cloneForm(emptyForms));
  }

  function startCreate() {
    setEditingId(null);
    setFormKeyCounter((k) => k + 1);
    setForm((prev) => ({
      ...prev,
      [activeTab]: activeTab === "profile" && currentUser ? userToProfile(currentUser) : activeTab === "settings" ? globalSettings : cloneForm((emptyForms as any)[activeTab]),
    }));
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setEditingId(null);
    setQuery("");
    setNotifOpen(false);
    setForm((prev) => ({
      ...prev,
      [tab]: tab === "profile" && currentUser ? userToProfile(currentUser) : tab === "settings" ? globalSettings : cloneForm((emptyForms as any)[tab]),
    }));
    if (isAppTab(tab)) void openAppCategory(tab);
    else loadData(tab);
  }

  function startEdit(item: Listing) {
    setEditingId(item.id);
    setForm((prev) => ({ ...prev, [activeTab]: cloneForm(item) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeItem(id: string) {
    if (!window.confirm("Удалить?")) return;
    await authFetch(`${ADMIN_API}/${endpointFor(activeTab)}/${id}`, { method: "DELETE" });
    await loadData(activeTab);
    if (isAppTab(activeTab)) await refreshApplications();
    setToast("Удалено");
  }

  async function togglePublish(item: any) {
    const status: PublishStatus = item.status === "published" ? "draft" : "published";
    await authFetch(`${ADMIN_API}/${activeTab}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadData(activeTab);
    setToast(status === "published" ? "Опубликовано" : "Скрыто");
  }
  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      const data = new FormData(event.currentTarget);
      if (activeTab === "profile") {
        const avatarFile = data.get("avatarFile");
        if (avatarFile instanceof File && avatarFile.size > 0) {
          const url = await uploadFile(avatarFile);
          data.set("avatar", url);
        }
      } else if (activeTab === "listings") {
        await prepareImageFields(data);
      } else if (activeTab === "blog") {
        const imageFile = data.get("imageFile");
        if (imageFile instanceof File && imageFile.size > 0) {
          const url = await uploadFile(imageFile);
          data.set("image", url);
        }
      }

      const payload = buildPayload(activeTab, data);

      if (activeTab === "profile") {
        const response = await authFetch(`${ADMIN_API}/auth/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const profilePayload = await response.json();
        if (!response.ok) {
          setToast(profilePayload.error || "Профиль не сохранен");
          setLoading(false);
          return;
        }
        setCurrentUser(profilePayload.user);
        setForm((prev) => ({ ...prev, profile: userToProfile(profilePayload.user) }));
        setToast("Профиль обновлен");
        setLoading(false);
        return;
      }

      const url = activeTab === "settings" ? `${ADMIN_API}/profile` : editingId ? `${ADMIN_API}/${activeTab}/${editingId}` : `${ADMIN_API}/${activeTab}`;
      const method = activeTab === "settings" ? "PUT" : editingId ? "PATCH" : "POST";

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setToast(err.error || "Ошибка сохранения");
        setLoading(false);
        return;
      }

      if (activeTab === "settings") {
        const json = await response.json();
        setGlobalSettings(json.data);
        setForm(prev => ({ ...prev, settings: json.data }));
      } else {
        await loadData(activeTab);
        startCreate();
      }
      
      setToast("Сохранено");
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  }
  if (!authReady) return <main className="min-h-screen bg-slate-50" />;
  if (!currentUser) return <AuthScreen onAuth={(user) => setCurrentUser(user)} />;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans p-0 lg:p-8 flex justify-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-0 lg:gap-8">
        
        {/* SIDEBAR / TOPBAR */}
        <aside className="w-full lg:w-72 shrink-0 bg-white lg:rounded-2xl shadow-sm border-b lg:border border-slate-200 p-4 lg:p-6 flex flex-col sticky top-0 lg:top-8 z-30 h-auto lg:h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between lg:mb-8 px-2 lg:px-0">
            <img src="/barakat.PNG" alt="Barakat Estate" className="w-20 lg:w-28 h-auto object-contain" />
            <button onClick={handleLogout} type="button" className="lg:hidden p-2 text-red-600 hover:bg-red-50 rounded-xl transition">
              <LogOut size={20} />
            </button>
          </div>
          
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto mt-4 lg:mt-0 pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {getTabs(currentUser.role).map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                type="button"
                className={`flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-xl transition font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id ? "bg-yellow-50 text-yellow-800 shadow-inner" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
                {tabBadges[tab.id] > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {tabBadges[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={handleLogout} 
              type="button"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition font-medium text-sm"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 min-w-0 flex flex-col gap-6 lg:gap-8 p-4 lg:p-0">
          
          {/* TOPBAR */}
          <header className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {getTabs(currentUser.role).find((tab) => tab.id === activeTab)?.label}
            </h1>
            {currentUser.role === "admin" && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  aria-label="Уведомления"
                >
                  <Bell size={22} />
                  {totalUnseen > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                      {totalUnseen}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-800 text-sm">
                      Новые заявки ({totalUnseen})
                    </div>
                    {recentUnseen.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-400 text-sm">Нет новых заявок</div>
                    ) : (
                      <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {recentUnseen.map((a) => (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() => switchTab(tabForService(a.service))}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition"
                            >
                              <div className="font-medium text-slate-800 text-sm truncate">{a.name || "Без имени"}</div>
                              <div className="text-xs text-slate-500 truncate">{a.service || "Без категории"} · {a.phone}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </header>

          {/* MAIN FORMS */}
          {activeTab !== "reviews" && activeTab !== "viewings" && !isAppTab(activeTab) && !(["listings", "applications"].includes(activeTab) && !editingId && currentUser?.role === "admin") && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-8">
              {activeTab !== "settings" && activeTab !== "profile" && (
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {activeTab === "users" ? (editingId ? "Редактировать пользователя" : "Новый пользователь") :
                     activeTab === "applications" ? (editingId ? "Редактировать заявку" : "Создать заявку") :
                     activeTab === "blog" ? (editingId ? "Редактировать статью" : "Создать статью") :
                     (editingId ? "Редактировать объявление" : "Создать объявление")}
                  </h2>
                  {!(["listings", "applications"].includes(activeTab) && currentUser?.role === "admin") && (
                    <button 
                      onClick={startCreate} 
                      type="button" 
                      className="flex items-center gap-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-lg transition"
                    >
                      <Plus size={16} /> Новое
                    </button>
                  )}
                </div>
              )}

              <form key={`${activeTab}-${editingId || "new"}-${formKeyCounter}`} onSubmit={submitForm}>
                {renderForm(activeTab, form, loading, currentUser, async (fieldName, newVal) => {
                  const updatedSettings = { ...form.settings, [fieldName]: newVal };
                  setForm(prev => ({ ...prev, settings: updatedSettings }));
                  
                  const response = await authFetch(`${ADMIN_API}/profile`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedSettings),
                  });
                  
                  if (!response.ok) {
                    setToast("Ошибка при сохранении");
                  } else {
                    setToast("Сохранено!");
                  }
                })}
              </form>
            </div>
          )}

          {/* DATA GRID */}
          {activeTab !== "profile" && activeTab !== "settings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-semibold text-slate-800">
                  {activeTab === "listings" ? "Список объявлений" : (activeTab === "applications" || isAppTab(activeTab)) ? "Список заявок" : activeTab === "viewings" ? "Заявки на просмотр" : activeTab === "reviews" ? "Список отзывов" : activeTab === "blog" ? "Список статей" : "Пользователи"}
                </h2>
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    aria-label="Поиск"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Поиск..."
                    value={query}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                    <Search className="mx-auto text-slate-300 mb-3" size={32} />
                    <p className="text-slate-500 font-medium">Ничего не найдено</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <article key={item.id} className="group flex flex-col sm:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                      
                      {activeTab === "listings" && (
                        <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden relative">
                          {item.mainImage ? (
                            <img className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={item.mainImage} alt={item.title} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <Building2 size={32} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {item.status === "published" ? "Опубликовано" : "Черновик"}
                            </span>
                            {item.isFeatured && (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm bg-yellow-100 text-yellow-700">
                                В Избранном
                              </span>
                            )}
                            {item.isNew && (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm bg-blue-100 text-blue-700">
                                Новое
                              </span>
                            )}
                            {item.isUrgent && (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm bg-red-100 text-red-700">
                                Срочно
                              </span>
                            )}
                            {item.isHero && (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm bg-emerald-100 text-emerald-700">
                                В витрине
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900/75 text-white backdrop-blur-sm" title="Количество просмотров">
                              <Eye size={13} />
                              {(item.views ?? 0).toLocaleString("ru-RU")}
                            </span>
                          </div>
                        </div>
                      )}

                      {activeTab === "blog" && (
                        <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden relative">
                          {item.image ? (
                            <img className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={item.image} alt={item.title} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <Newspaper size={32} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {item.status === "published" ? "Опубликовано" : "Черновик"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                        <div>
                          {activeTab === "listings" && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.title}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex gap-2 items-center">
                                <span className="text-slate-800 font-bold">{item.price} TJS</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{item.propertyType}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{item.district}</span>
                              </div>
                            </>
                          )}
                          
                          {activeTab === "blog" && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.title}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex flex-col gap-1">
                                {item.category && <span className="w-fit px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-700">{item.category}</span>}
                                {item.excerpt && <span className="line-clamp-2">{item.excerpt}</span>}
                              </div>
                            </>
                          )}

                          {(activeTab === "applications" || isAppTab(activeTab)) && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.name}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex flex-col gap-1">
                                <span>Телефон: {item.phone}</span>
                                <span>Услуга: {item.service}</span>
                                {item.district && <span>Район: {item.district}</span>}
                                {item.landmark && <span>Ориентир: {item.landmark}</span>}
                                {item.message && <span className="text-slate-700 whitespace-pre-line border-l-2 border-slate-200 pl-2 my-1">{item.message}</span>}
                                {item.photos && (
                                  <div className="flex flex-wrap gap-2 my-1">
                                    {item.photos.split("\n").filter(Boolean).filter((src: string) => /^(data:image\/(jpeg|jpg|png|webp);base64,|https?:\/\/|\/)/.test(src)).map((src: string, i: number) => (
                                      <div key={i} className="relative group">
                                        <button type="button" onClick={() => openPhoto(src)} className="p-0 border-0 bg-transparent cursor-pointer block" title="Открыть фото">
                                          <img src={src} alt={`Фото ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => downloadPhoto(src, i)}
                                          className="absolute bottom-0.5 right-0.5 p-1 rounded-md bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
                                          title="Скачать фото"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold mt-1 ${item.status === 'new' ? 'bg-red-100 text-red-700' : item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status === 'new' ? 'Новая' : item.status === 'completed' ? 'Завершена' : 'Просмотрена'}</span>
                              </div>
                            </>
                          )}

                          {activeTab === "viewings" && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.name}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex flex-col gap-1">
                                <span>Телефон: {item.phone}</span>
                                <span className="text-slate-700 font-semibold">🗓 {item.date} в {item.time}</span>
                                {item.listingTitle && <span>Объект: {item.listingTitle}</span>}
                                {item.message && <span className="text-slate-700 italic border-l-2 border-slate-200 pl-2 my-1">Комментарий: {item.message}</span>}
                                <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold mt-1 ${item.status === 'new' ? 'bg-red-100 text-red-700' : item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {item.status === 'new' ? 'Новая' : item.status === 'completed' ? 'Завершена' : 'Просмотрена'}
                                </span>
                              </div>
                            </>
                          )}

                          {activeTab === "reviews" && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.name}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex flex-col gap-1">
                                <span className="text-slate-700 italic border-l-2 border-slate-200 pl-2 my-1">"{item.text}"</span>
                                <span>Агент: {item.sellerId ? "ID: " + item.sellerId : "Общий"}</span>
                                <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold mt-1 ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {item.status === 'pending' ? 'На модерации' : item.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                                </span>
                              </div>
                            </>
                          )}                          {activeTab === "users" && (
                            <>
                              <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.username}</h3>
                              <div className="text-slate-500 text-sm font-medium mb-4 flex flex-col gap-1">
                                <span>Роль: <span className="font-bold">{item.role === 'admin' ? 'Админ' : 'Продавец'}</span></span>
                                <span>Имя: {item.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                          {activeTab !== "applications" && !isAppTab(activeTab) && activeTab !== "reviews" && activeTab !== "viewings" && (
                            <button onClick={() => startEdit(item)} type="button" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-yellow-600 transition bg-slate-50 hover:bg-yellow-50 px-3 py-1.5 rounded-lg">
                              <Pencil size={14} /> Редактировать
                            </button>
                          )}
                          {isAppTab(activeTab) && item.status !== "completed" && (
                            <button onClick={async () => {
                              await authFetch(`${ADMIN_API}/applications/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "completed" }) });
                              await loadData(activeTab);
                              await refreshApplications();
                            }} type="button" className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 size={14} /> Завершить
                            </button>
                          )}
                          {activeTab === "viewings" && (
                            <div className="flex gap-2">
                              {item.status === "new" && (
                                <button onClick={async () => {
                                  await authFetch(`${ADMIN_API}/viewings/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "read" }) });
                                  await loadData("viewings");
                                }} type="button" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                                  <CheckCircle2 size={14} /> Просмотрено
                                </button>
                              )}
                              {item.status !== "completed" && (
                                <button onClick={async () => {
                                  await authFetch(`${ADMIN_API}/viewings/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "completed" }) });
                                  await loadData("viewings");
                                }} type="button" className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg">
                                  <CheckCircle2 size={14} /> Завершить
                                </button>
                              )}
                            </div>
                          )}
                          {(activeTab === "listings" || activeTab === "blog") && (
                            <button onClick={() => togglePublish(item)} type="button" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-600 transition bg-slate-50 hover:bg-green-50 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 size={14} /> {item.status === "published" ? "Скрыть" : "Опубликовать"}
                            </button>
                          )}
                          {activeTab === "reviews" && (
                            <div className="flex gap-2">
                              {item.status !== "approved" && (
                                <button onClick={async () => {
                                  await authFetch(`${ADMIN_API}/reviews/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) });
                                  await loadData("reviews");
                                }} type="button" className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg">
                                  <CheckCircle2 size={14} /> Одобрить
                                </button>
                              )}
                              {item.status !== "rejected" && (
                                <button onClick={async () => {
                                  await authFetch(`${ADMIN_API}/reviews/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "rejected" }) });
                                  await loadData("reviews");
                                }} type="button" className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                                  <X size={14} /> Отклонить
                                </button>
                              )}
                            </div>
                          )}
                          <button onClick={() => removeItem(item.id)} type="button" className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg ml-auto">
                            <Trash2 size={14} /> Удалить
                          </button>
                        </div>
                      </div>

                    </article>
                  ))
                )}
              </div>
            </div>
          )}

        </section>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm break-words bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl font-medium text-sm animate-in fade-in slide-in-from-bottom-4">
          {toast.length > 160 ? `${toast.slice(0, 160)}…` : toast}
        </div>
      )}
    </main>
  );
}

// -------------------------------------------------------------
// AUTH SCREEN
// -------------------------------------------------------------
function AuthScreen({ onAuth }: { onAuth: (user: AuthUser) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const url = isLogin ? `${ADMIN_API}/auth/login` : `${ADMIN_API}/auth/register`;
    const body = isLogin ? { username, password } : { username, password, name };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Ошибка");
        return;
      }
      if (payload.token) saveToken(payload.token);
      onAuth(payload.user as AuthUser);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-5">
        <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          {isLogin ? <KeyRound size={28} /> : <UserPlus size={28} />}
        </div>
        
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">{isLogin ? "С возвращением" : "Регистрация"}</h1>
          <p className="text-sm text-slate-500 mt-1">{isLogin ? "Войдите в панель управления" : "Создайте аккаунт продавца"}</p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Логин</span>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          
          {!isLogin && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700">Имя</span>
              <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          )}
          
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Пароль</span>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center">{error}</div>}
        
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm" disabled={loading} type="submit">
          {loading ? "Загрузка..." : (isLogin ? "Войти" : "Зарегистрироваться")}
        </button>
        
        <button type="button" className="text-sm text-slate-500 hover:text-slate-800 font-medium transition" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Нет аккаунта? Создать" : "Уже есть аккаунт? Войти"}
        </button>
      </form>
    </main>
  );
}

// -------------------------------------------------------------
// DATA BUILDER
// -------------------------------------------------------------
function buildPayload(tab: Tab, data: FormData) {
  if (tab === "profile" || tab === "settings") {
    return {
      name: String(data.get("name") || ""),
      bio: String(data.get("description") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      whatsapp: String(data.get("whatsapp") || ""),
      telegram: String(data.get("telegram") || ""),
      instagram: String(data.get("instagram") || ""),
      avatar: String(data.get("avatar") || ""),
      specializations: String(data.get("specializations") || ""),
      rating: toNumber(data.get("rating")),
      dealsCount: toNumber(data.get("dealsCount")),
      experienceYears: toNumber(data.get("experienceYears")),
      districts: String(data.get("districts") || ""),
      propertyTypes: String(data.get("propertyTypes") || ""),
      dealTypes: String(data.get("dealTypes") || ""),
    };
  }

  if (tab === "applications") {
    return {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      service: String(data.get("service") || ""),
      message: String(data.get("message") || ""),
      status: String(data.get("status") || "new"),
    };
  }



  if (tab === "blog") {
    return {
      title: String(data.get("title") || ""),
      category: String(data.get("category") || ""),
      excerpt: String(data.get("excerpt") || ""),
      image: String(data.get("image") || ""),
      content: String(data.get("content") || ""),
      status: toStatus(data.get("status")),
    };
  }

  if (tab === "users") {
    return {
      username: String(data.get("username") || ""),
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      role: String(data.get("role") || "seller"),
      password: String(data.get("password") || ""),
    };
  }

  return {
    title: String(data.get("title") || ""),
    dealType: data.get("dealType") === "rent" ? "rent" : "sale",
    propertyType: String(data.get("propertyType") || "Квартира"),
    price: toNumber(data.get("price")),
    district: String(data.get("district") || ""),
    address: String(data.get("address") || ""),
    rooms: toNumber(data.get("rooms")),
    area: toNumber(data.get("area")),
    floor: toNumber(data.get("floor")),
    totalFloors: toNumber(data.get("totalFloors")),
    yearBuilt: toNumber(data.get("yearBuilt")),
    description: String(data.get("description") || ""),
    features: String(data.get("features") || ""),
    constructionStage: String(data.get("constructionStage") || ""),
    renovation: String(data.get("renovation") || ""),
    documentType: String(data.get("documentType") || ""),
    landmark: String(data.get("landmark") || ""),
    latitude: toNumber(data.get("latitude")),
    longitude: toNumber(data.get("longitude")),
    mapX: toNumber(data.get("mapX")),
    mapY: toNumber(data.get("mapY")),
    mainImage: String(data.get("mainImage") || ""),
    gallery: String(data.get("gallery") || ""),
    isFeatured: data.get("isFeatured") === "on",
    isNew: data.get("isNew") === "on",
    isUrgent: data.get("isUrgent") === "on",
    isHero: data.get("isHero") === "on",
    status: toStatus(data.get("status")),
  };
}

// -------------------------------------------------------------
// FORM COMPONENTS
// -------------------------------------------------------------
function FormSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      {title && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

function Field({ name, title, value, type = "text", colSpan = 1, autoComplete }: { name: string; title: string; value?: string | number; type?: string; colSpan?: 1 | 2 | 3 | "full"; autoComplete?: string }) {
  const spanClass = colSpan === "full" ? "col-span-1 md:col-span-2 lg:col-span-3" : colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  return (
    <label className={`flex flex-col gap-1.5 ${spanClass}`}>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      <input 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm text-slate-900"
        defaultValue={value ?? ""} 
        name={name} 
        type={type} 
        step={type === "number" ? "any" : undefined} 
        autoComplete={autoComplete}
      />
    </label>
  );
}

function TextArea({ name, title, value, rows = 3, colSpan = "full" }: { name: string; title: string; value?: string; rows?: number; colSpan?: 1 | 2 | 3 | "full" }) {
  const spanClass = colSpan === "full" ? "col-span-1 md:col-span-2 lg:col-span-3" : colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  return (
    <label className={`flex flex-col gap-1.5 ${spanClass}`}>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      <textarea 
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm text-slate-900 resize-y"
        defaultValue={value ?? ""} 
        name={name} 
        rows={rows} 
      />
    </label>
  );
}

type ListItem = {
  id: string;
  value: string;
};

function ListManager({ name, title, value = "", colSpan = "full", placeholder = "Введите значение...", onSave }: { name: string; title: string; value?: string; colSpan?: 1 | 2 | 3 | "full"; placeholder?: string; onSave?: (fieldName: string, newVal: string) => Promise<void> }) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setItems(value.split(",").map((t: string) => ({ id: Math.random().toString(36).substring(7), value: t.trim() })).filter(i => i.value));
    }
  }, [value]);

  const startEdit = (item: ListItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const handleSave = async (newItems: ListItem[], actionId: string) => {
    const val = newItems.map(i => i.value).join(", ");
    if (onSave) {
      setSavingId(actionId);
      try {
        await onSave(name, val);
        setItems(newItems);
        setEditingId(null);
        setEditValue("");
      } catch (err) {
        console.error(err);
      } finally {
        setSavingId(null);
      }
    } else {
      setItems(newItems);
      setEditingId(null);
      setEditValue("");
    }
  };

  const saveEdit = async () => {
    if (editingId === "new") {
      if (editValue.trim()) {
        const newItem = { id: Math.random().toString(36).substring(7), value: editValue.trim() };
        await handleSave([...items, newItem], "new");
      } else {
        setEditingId(null);
      }
    } else if (editingId) {
      if (editValue.trim()) {
        const newItems = items.map(i => i.id === editingId ? { ...i, value: editValue.trim() } : i);
        await handleSave(newItems, editingId);
      } else {
        const newItems = items.filter(i => i.id !== editingId);
        await handleSave(newItems, "delete-" + editingId);
      }
    }
  };

  const addNew = () => {
    setEditingId("new");
    setEditValue("");
  };

  const removeItem = async (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    await handleSave(newItems, "delete-" + id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const spanClass = colSpan === "full" ? "col-span-1 md:col-span-2 lg:col-span-3" : colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";

  return (
    <div className={`flex flex-col gap-4 ${spanClass} mb-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <span className="text-sm font-bold text-slate-700">{title}</span>
        <button 
          type="button" 
          onClick={addNew}
          disabled={editingId === "new"}
          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-yellow-950 rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
        >
          <PlusCircle size={16} /> Добавить
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col justify-between gap-3 p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-yellow-300 transition-colors group min-h-[120px]">
            {editingId === item.id ? (
              <div className="flex flex-col gap-3 w-full h-full">
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm font-medium disabled:opacity-50"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={saveEdit}
                  disabled={savingId === item.id}
                />
                <button type="button" disabled={savingId === item.id} onMouseDown={(e) => e.preventDefault()} onClick={saveEdit} className="w-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 py-2 rounded-lg hover:bg-slate-200 transition-colors mt-auto disabled:opacity-50">
                  {savingId === item.id ? "Загрузка..." : "Сохранить"}
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-semibold text-slate-800 break-words">{item.value}</span>
                <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => startEdit(item)} disabled={!!savingId} className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 hover:text-yellow-700 hover:bg-yellow-50 hover:border-yellow-200 rounded-lg transition-colors disabled:opacity-50">
                    <Edit2 size={14} /> Изменить
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)} disabled={!!savingId} className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors disabled:opacity-50">
                    {savingId === "delete-" + item.id ? "Удаление..." : <><Trash2 size={14} /> Удалить</>}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {editingId === "new" && (
          <div className="flex flex-col gap-3 p-4 bg-yellow-50 border border-yellow-300 shadow-sm rounded-xl min-h-[120px]">
            <input
              autoFocus
              type="text"
              placeholder={placeholder}
              className="w-full bg-white border border-yellow-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm font-medium disabled:opacity-50"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              disabled={savingId === "new"}
            />
            <button type="button" disabled={savingId === "new"} onMouseDown={(e) => e.preventDefault()} onClick={saveEdit} className="text-sm font-bold text-yellow-900 bg-yellow-300 border border-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">
              {savingId === "new" ? "Загрузка..." : "Сохранить"}
            </button>
          </div>
        )}
        
        {items.length === 0 && editingId !== "new" && (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <span className="text-sm font-medium text-slate-400">Список пуст. Нажмите «Добавить», чтобы создать первую запись.</span>
          </div>
        )}
      </div>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={items.map(i => i.value).join(", ")} />
    </div>
  );
}

function Select({ name, title, value, options, colSpan = 1 }: { name: string; title: string; value?: string; options: Array<[string, string]>; colSpan?: 1 | 2 | 3 | "full" }) {
  const spanClass = colSpan === "full" ? "col-span-1 md:col-span-2 lg:col-span-3" : colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  return (
    <label className={`flex flex-col gap-1.5 ${spanClass}`}>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      <select 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm text-slate-900 appearance-none"
        defaultValue={value} 
        name={name}
      >
        {options.map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
    </label>
  );
}

function FileUpload({ name, title, multiple = false, colSpan = "full" }: { name: string; title: string; multiple?: boolean; colSpan?: 1 | 2 | 3 | "full" }) {
  const spanClass = colSpan === "full" ? "col-span-1 md:col-span-2 lg:col-span-3" : colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  return (
    <label className={`flex flex-col gap-1.5 ${spanClass}`}>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      <input 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
        name={name} 
        type="file" 
        accept="image/*" 
        multiple={multiple}
      />
    </label>
  );
}

function renderForm(tab: Tab, form: FormState, loading: boolean, currentUser: AuthUser | null, onFieldSave?: (fieldName: string, newVal: string) => Promise<void>) {
  const values = form[tab];

  if (tab === "profile") {
    const item = values as Partial<Profile>;
    const isAdmin = currentUser?.role === "admin";
    
    return (
      <div className="flex flex-col gap-8">
        <FormSection title="Основная информация">
          <Field name="name" title="Имя" value={item.name} colSpan={2} />
          {!isAdmin && <Field name="specializations" title="Специализация" value={item.specializations} colSpan={1} />}
          
          {!isAdmin && (
            <>
              <FileUpload name="avatarFile" title="Загрузить новое фото / аватар" colSpan={2} />
              <Field name="avatar" title="Или укажите URL аватара" value={item.avatarUrl} colSpan={1} />
              <TextArea name="description" title="О себе" value={item.description} rows={4} colSpan="full" />
            </>
          )}
        </FormSection>

        {!isAdmin && (
          <FormSection title="Контакты и Соцсети">
            <Field name="phone" title="Телефон" value={item.phone} />
            <Field name="email" title="Email" value={item.email} />
            <Field name="whatsapp" title="WhatsApp" value={item.socials?.whatsapp} />
            <Field name="telegram" title="Telegram" value={item.socials?.telegram} />
            <Field name="instagram" title="Instagram" value={item.socials?.instagram} />
          </FormSection>
        )}

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm text-sm" type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить настройки"}
          </button>
        </div>
      </div>
    );
  }

  if (tab === "settings") {
    const item = values as Partial<Profile>;

    return (
      <div className="flex flex-col gap-8 pb-8">
        {/* Contacts section removed as requested */}
        <FormSection title="Справочники (Значения через запятую)">
          <ListManager name="districts" title="Районы" value={item.districts} placeholder="Например: Сино" onSave={onFieldSave} />
          <ListManager name="propertyTypes" title="Типы недвижимости" value={item.propertyTypes} placeholder="Например: Квартира" onSave={onFieldSave} />
          <ListManager name="dealTypes" title="Типы сделок (формат value:Label)" value={item.dealTypes} placeholder="Например: sale:Продажа" onSave={onFieldSave} />
        </FormSection>
      </div>
    );
  }

  if (tab === "users") {
    const item = values as Partial<AuthUser>;
    return (
      <div className="flex flex-col gap-8">
        <FormSection title="Пользователь">
          <Field name="username" title="Логин" value={item.username} autoComplete="new-password" />
          <Field name="name" title="Имя" value={item.name} autoComplete="new-password" />
          <Field name="password" title="Пароль" value="" type="password" autoComplete="new-password" />
          <Select name="role" title="Роль" value={item.role} options={[["seller", "Продавец"], ["admin", "Админ"]]} />
        </FormSection>
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm text-sm" type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    );
  }

  if (tab === "blog") {
    const item = values as Partial<BlogPost>;
    return (
      <div className="flex flex-col gap-8">
        <FormSection title="Статья">
          <Field name="title" title="Заголовок" value={item.title} colSpan={2} />
          <Field name="category" title="Категория" value={item.category} />
          <TextArea name="excerpt" title="Краткое описание (анонс)" value={item.excerpt} rows={2} colSpan="full" />
          <input type="hidden" name="image" value={item.image || ""} />
          <div className="col-span-full flex flex-col gap-2">
            <FileUpload name="imageFile" title="Обложка статьи (Файл)" colSpan="full" />
            {item.image && (
              <div className="mt-1">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Текущая обложка:</span>
                <img src={item.image} alt="Обложка" className="h-24 w-auto rounded-lg object-cover border border-slate-200" />
              </div>
            )}
          </div>
          <TextArea name="content" title="Текст статьи (абзацы разделяйте пустой строкой)" value={item.content} rows={12} colSpan="full" />
          <Select name="status" title="Статус публикации" value={item.status} options={[["draft", "Черновик"], ["published", "Опубликовано"]]} />
        </FormSection>
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm text-sm" type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить статью"}
          </button>
        </div>
      </div>
    );
  }

  if (tab === "applications") {
    const item = values as Partial<Application>;
    return (
      <div className="flex flex-col gap-8">
        <FormSection title="Заявка">
          <Field name="name" title="Имя" value={item.name} />
          <Field name="phone" title="Телефон" value={item.phone} />
          <Field name="service" title="Услуга" value={item.service} />
          <Field name="district" title="Район" value={item.district || ""} />
          <Field name="landmark" title="Ориентир" value={item.landmark || ""} />
          <Select name="status" title="Статус" value={item.status} options={[["new", "Новая"], ["processed", "Обработана"]]} />
          <TextArea name="message" title="Сообщение" value={item.message} rows={4} />
        </FormSection>
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm text-sm" type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    );
  }



  const item = values as Partial<Listing>;
  return (
    <div className="flex flex-col gap-8">
      <FormSection title="Общая информация">
        <Field name="title" title="Название объявления" value={item.title} colSpan={2} />
        <Select name="dealType" title="Тип сделки" value={item.dealType} options={[["sale", "Продажа"], ["rent", "Аренда"]]} />
        <Select name="propertyType" title="Тип недвижимости" value={item.propertyType || "Квартира"} options={[["Квартира", "Квартира"], ["Вторичка", "Вторичка"], ["Новостройки", "Новостройки"], ["Котлован", "Котлован"], ["Дома", "Дома"], ["Дом", "Дом"], ["Земельные участки", "Земельные участки"], ["Коммерческая", "Коммерческая"], ["Дача", "Дача"], ["Парковка", "Парковка"], ["Комната", "Комната"]]} />
        <Field name="price" title="Цена (TJS)" type="number" value={item.price} colSpan={2} />
      </FormSection>

      <FormSection title="Параметры объекта">
        <Field name="rooms" title="Комнаты" type="number" value={item.rooms} />
        <Field name="area" title="Площадь (м²)" type="number" value={item.area} />
        <Field name="yearBuilt" title="Год постройки" type="number" value={item.yearBuilt} />
        <Field name="floor" title="Этаж" type="number" value={item.floor} />
        <Field name="totalFloors" title="Всего этажей" type="number" value={item.totalFloors} />
        <Select name="constructionStage" title="Стадия строительства" value={item.constructionStage || ""} options={[["", "Любая"], ["Построен", "Построен"], ["Строится", "Строится"], ["Котлован", "Котлован"]]} />
        <Select name="renovation" title="Ремонт" value={item.renovation || ""} options={[["", "Любая"], ["С ремонтом", "С ремонтом"], ["Без ремонта (коробка)", "Без ремонта (коробка)"], ["Евроремонт", "Евроремонт"], ["Дизайнерский", "Дизайнерский"]]} />
        <Select name="documentType" title="Документ" value={item.documentType || ""} options={[["", "Любой"], ["Договор", "Договор"], ["Техпаспорт", "Техпаспорт"]]} />
      </FormSection>

      <FormSection title="Расположение">
        <Select name="district" title="Район" value={item.district || ""} options={[["Центр", "Центр"], ["Исмоили Сомони", "Исмоили Сомони"], ["Сино", "Сино"], ["Фирдавси", "Фирдавси"], ["Шохмансур", "Шохмансур"]]} />
        <Field name="address" title="Адрес" value={item.address} />
        <Field name="landmark" title="Ориентир" value={item.landmark || ""} />
        <div className="col-span-full grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <Field name="latitude" title="Latitude (Широта)" type="number" value={item.latitude} />
          <Field name="longitude" title="Longitude (Долгота)" type="number" value={item.longitude} />
        </div>
      </FormSection>

      <FormSection title="Медиа и Описание">
        <input type="hidden" name="mainImage" value={item.mainImage || ""} />
        <input type="hidden" name="gallery" value={item.gallery || ""} />

        <div className="col-span-full flex flex-col gap-2">
          <FileUpload name="mainImageFile" title="Главное фото (Файл)" colSpan="full" />
          {item.mainImage && (
            <div className="mt-1">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Текущее главное фото:</span>
              <img src={item.mainImage} alt="Текущее главное фото" className="h-24 w-auto rounded-lg object-cover border border-slate-200" />
            </div>
          )}
        </div>

        <div className="col-span-full flex flex-col gap-2">
          <FileUpload name="galleryFiles" title="Галерея (Множественный выбор)" multiple colSpan="full" />
          {item.gallery && (
            <div className="mt-1">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Текущие фото галереи:</span>
              <div className="flex flex-wrap gap-2">
                {item.gallery.split("\n").map((url, i) => {
                  const trimmedUrl = url.trim();
                  if (!trimmedUrl) return null;
                  return (
                    <img key={i} src={trimmedUrl} alt={`Галерея ${i}`} className="h-16 w-auto rounded-lg object-cover border border-slate-200" />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <TextArea name="features" title="Удобства (обязательно через запятую)" value={item.features} rows={2} colSpan="full" />
        <TextArea name="description" title="Детальное описание" value={item.description} rows={5} colSpan="full" />
      </FormSection>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 px-5 py-5 sm:-mx-8 sm:-mb-8 sm:px-8 sm:py-6 rounded-b-2xl">
        <div className="flex items-center gap-6">
          <Select name="status" title="Статус публикации" value={item.status} options={[["draft", "Черновик"], ["published", "Опубликовано"]]} />
          
          <label className="flex items-center gap-3 cursor-pointer group mt-6">
            <input 
              type="checkbox" 
              name="isFeatured" 
              defaultChecked={item.isFeatured} 
              className="w-5 h-5 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700 group-hover:text-yellow-600 transition">В Избранное (Featured)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group mt-6">
            <input 
              type="checkbox" 
              name="isNew" 
              defaultChecked={item.isNew} 
              className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">Новое</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group mt-6">
            <input 
              type="checkbox" 
              name="isUrgent" 
              defaultChecked={item.isUrgent} 
              className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700 group-hover:text-red-600 transition">Срочно</span>
          </label>

          {currentUser?.role === "admin" && (
            <label className="flex items-start gap-3 cursor-pointer group mt-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <input 
                type="checkbox" 
                name="isHero" 
                defaultChecked={item.isHero} 
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
              <span className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition">Показывать в витрине на главной</span>
                <span className="text-xs text-slate-500 mt-0.5">Объявление попадёт в большую карусель в самом верху главной страницы сайта</span>
              </span>
            </label>
          )}
        </div>

        <button className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition shadow-sm text-sm w-full sm:w-auto mt-6 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить объявление"}
        </button>
      </div>
    </div>
  );
}
