"use client";

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

import { BLOG_API_BASE, toParagraphs, type BlogPost } from "@/content/blog-posts";

export default function BlogPostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [others, setOthers] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPost(null);
    Promise.all([
      fetch(`${BLOG_API_BASE}/api/blog/${encodeURIComponent(slug)}`).then((res) => (res.ok ? res.json() : null)),
      fetch(`${BLOG_API_BASE}/api/blog`).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([single, list]) => {
        if (!active) return;
        setPost(single && single.id ? single : null);
        const arr: BlogPost[] = Array.isArray(list) ? list : [];
        setOthers(arr.filter((item) => item.slug !== slug).slice(0, 3));
      })
      .catch(() => {
        if (active) setPost(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="blog-post-page">
        <div className="container" style={{ padding: "160px 0 120px", textAlign: "center", color: "var(--muted)" }}>
          Загрузка статьи...
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="blog-post-page">
        <div className="container" style={{ padding: "160px 0 120px", textAlign: "center" }}>
          <h1 style={{ marginBottom: 16 }}>Статья не найдена</h1>
          <Link className="btn-secondary" href="/blog">Вернуться в блог</Link>
        </div>
      </main>
    );
  }

  const paragraphs = toParagraphs(post.content);

  return (
    <main className="blog-post-page">
      <section
        className="blog-post-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30, 45, 74, 0.78) 0%, rgba(30, 45, 74, 0.45) 100%), url('${post.image}')`,
        }}
      >
        <div className="container blog-post-hero-inner">
          <Link className="blog-post-back" href="/blog">
            <ArrowLeft size={16} /> Блог
          </Link>
          {post.category && <span className="blog-post-cat">{post.category}</span>}
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>

      <section className="blog-post-body-section">
        <div className="container blog-post-body-inner">
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          <div className="blog-post-cta">
            <h3>Нужна консультация?</h3>
            <p>Специалисты <span className="brand-gold">Barakat Estate</span> помогут с покупкой, продажей и оформлением недвижимости в Душанбе.</p>
            <div className="blog-post-cta-actions">
              <a className="btn-primary" href="tel:+992201077771">Позвонить</a>
              <Link className="btn-secondary" href="/listings">Смотреть объявления</Link>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="blog-post-more">
          <div className="container">
            <h2 className="blog-post-more-head">Другие статьи</h2>
            <div className="blog-post-more-grid">
              {others.map((item) => (
                <Link className="blog-card" href={`/blog/${item.slug}`} key={item.id || item.slug}>
                  <div
                    className="blog-img"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%), url('${item.image}')`,
                    }}
                  >
                    {item.category && <span className="blog-cat">{item.category}</span>}
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-title">{item.title}</h3>
                    <p className="blog-excerpt">{item.excerpt}</p>
                    <span className="blog-more">Подробнее</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
