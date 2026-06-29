import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(title: string): string {
  const base = (title || "post")
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "post"}-${Date.now()}`;
}

router.get("/blog", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const all = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
    res.json(all);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, req.params.id)).limit(1);
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const body = { ...req.body };
    const slug = slugify(body.title);
    const [row] = await db.insert(blogPostsTable).values({ ...body, slug }).returning();
    res.status(201).json(row);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

async function updatePost(req: Request, res: Response) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const body = { ...req.body };
    delete body.slug;
    const [row] = await db.update(blogPostsTable).set({ ...body, updatedAt: new Date() }).where(eq(blogPostsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

router.put("/blog/:id", updatePost);
router.patch("/blog/:id", updatePost);

router.delete("/blog/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
