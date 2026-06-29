"use client";

import { useEffect, useState } from "react";
import { Link } from "wouter";

import { BLOG_API_BASE, type BlogPost } from "@/content/blog-posts";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${BLOG_API_BASE}/api/blog`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page active" id="page-blog">
      <div className="header-padding" />
      <section
        className="listings-hero"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(30, 45, 74, 0.82) 0%, rgba(212, 175, 55, 0.5) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          paddingTop: 130,
          paddingBottom: 70,
          textAlign: "center",
          position: "relative",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
          </div>
          <h1 style={{ color: "white", fontSize: 48, fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 12, textShadow: "0 4px 16px rgba(0,0,0,0.4)", lineHeight: 1.1 }}>Блог</h1>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 18, fontWeight: 500, maxWidth: 640, margin: "0 auto", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            Полезные статьи и новости рынка недвижимости Душанбе от экспертов Barakat Estate.
          </p>
        </div>
      </section>

      <section style={{ padding: "72px 0", background: "var(--cream)" }}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--muted)" }}>Загрузка статей...</p>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted)" }}>Статьи скоро появятся.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
              {posts.map((post) => (
                <Link className="blog-card" href={`/blog/${post.slug}`} key={post.id || post.slug}>
                  <div
                    className="blog-img"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%), url('${post.image}')`,
                    }}
                  >
                    {post.category && <span className="blog-cat">{post.category}</span>}
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <span className="blog-more">Подробнее</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
