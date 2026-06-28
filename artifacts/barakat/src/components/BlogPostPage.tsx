"use client";

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

import type { BlogPost } from "@/content/blog-posts";
import { blogPostList } from "@/content/blog-posts";

export default function BlogPostPage({ post }: { post: BlogPost }) {
  const others = blogPostList.filter((item) => item.slug !== post.slug).slice(0, 3);

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
          <span className="blog-post-cat">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>

      <section className="blog-post-body-section">
        <div className="container blog-post-body-inner">
          {post.paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          <div className="blog-post-cta">
            <h3>Нужна консультация?</h3>
            <p>Специалисты Barakat Estate помогут с покупкой, продажей и оформлением недвижимости в Душанбе.</p>
            <div className="blog-post-cta-actions">
              <a className="btn-primary" href="tel:+992055077777">Позвонить</a>
              <Link className="btn-secondary" href="/listings">Смотреть объявления</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-post-more">
        <div className="container">
          <h2 className="blog-post-more-head">Другие статьи</h2>
          <div className="blog-post-more-grid">
            {others.map((item) => (
              <Link className="blog-card" href={`/blog/${item.slug}`} key={item.slug}>
                <div
                  className="blog-img"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%), url('${item.image}')`,
                  }}
                >
                  <span className="blog-cat">{item.category}</span>
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
    </main>
  );
}
