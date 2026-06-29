export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  createdAt?: string;
}

export const BLOG_API_BASE = import.meta.env.VITE_ADMIN_API_URL || "";

export function toParagraphs(content: string): string[] {
  return (content || "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
