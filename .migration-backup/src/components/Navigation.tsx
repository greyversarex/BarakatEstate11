"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Главная", match: "home" },
  { href: "/listings", label: "Объявления", match: "listings" },
  { href: "/map", label: "Карта", match: "map" },
  { href: "/services", label: "Услуги", match: "services" },
  { href: "/team", label: "Сотрудники", match: "team" },
  { href: "/about", label: "О нас", match: "about" },
];

function activePage(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] || "home";
}

export default function Navigation() {
  const pathname = usePathname();
  const current = activePage(pathname);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val || val === "+" || val === "+9" || val === "+99" || val === "+992" || val === "+992 ") {
      setPhone("");
      return;
    }
    const digits = val.replace(/\D/g, "");
    let phoneDigits = digits;
    if (digits.startsWith("992")) {
      phoneDigits = digits.slice(3);
    }
    if (phoneDigits.length === 0) {
      setPhone("+992 ");
      return;
    }
    let formatted = "+992 ";
    if (phoneDigits.length > 0) formatted += phoneDigits.substring(0, 3);
    if (phoneDigits.length > 3) formatted += " " + phoneDigits.substring(3, 5);
    if (phoneDigits.length > 5) formatted += " " + phoneDigits.substring(5, 9);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        body: JSON.stringify({ name, phone, service: "Общая заявка с сайта", message }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setSuccess(false);
          setName("");
          setPhone("");
          setMessage("");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <nav id="nav">
      <Link className="nav-logo" href="/" onClick={() => setOpen(false)}>
        <Image src="/barakat.PNG" alt="Barakat Estate" width={100} height={78} priority />
      </Link>

      <div className={`nav-links${open ? " mobile-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={current === link.match ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <button 
          className="btn-primary" 
          onClick={() => setModalOpen(true)}
          style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer", background: "var(--gold)", color: "var(--ink)", whiteSpace: "nowrap" }}
        >
          Оставить заявку
        </button>
        <Link href="/favorites" className="nav-favorites-btn" aria-label="Избранное">
          <Heart size={18} strokeWidth={2} />
        </Link>
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      </div>

      </nav>

      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "400px", position: "relative" }}>
            <button 
              onClick={() => setModalOpen(false)} 
              style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}
            >
              &times;
            </button>
            {!success && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "#0f172a", textAlign: "center" }}>Оставить заявку</h3>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", textAlign: "center" }}>Оставьте свои контакты, и мы свяжемся с вами в ближайшее время.</p>
              </>
            )}
            
            {success ? (
              <div style={{ textAlign: "center", padding: "40px 0 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "72px", height: "72px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "20px", color: "#15803d", margin: "0 0 8px 0", fontWeight: "700" }}>Заявка отправлена!</h4>
                  <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>Мы свяжемся с вами в ближайшее время</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input 
                  type="text" 
                  placeholder="Ваше имя" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{ padding: "14px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", width: "100%" }}
                />
                <input 
                  type="tel" 
                  placeholder="+992 000 00 0000" 
                  required 
                  value={phone} 
                  onChange={handlePhoneChange} 
                  onFocus={() => { if (!phone) setPhone("+992 ") }}
                  style={{ padding: "14px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", width: "100%" }}
                />
                <textarea 
                  placeholder="Комментарий" 
                  rows={3}
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  style={{ padding: "14px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", width: "100%", resize: "none" }}
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ padding: "14px", borderRadius: "10px", background: "var(--gold)", color: "var(--ink)", fontWeight: "600", fontSize: "15px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", transition: "opacity 0.2s", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Отправка..." : "Отправить"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
