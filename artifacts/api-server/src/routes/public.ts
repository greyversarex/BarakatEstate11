import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { listingsTable, reviewsTable, adminUsersTable, siteSettingsTable, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/listings", async (req: Request, res: Response) => {
  try {
    let query = db.select().from(listingsTable).orderBy(desc(listingsTable.createdAt));
    const rows = await query;
    const published = rows.filter(l => l.status === "published");
    const { featured, dealType, propertyType, district, minPrice, maxPrice, search } = req.query as Record<string, string>;
    let results = published;
    if (featured === "true") results = results.filter(l => l.isFeatured);
    if (dealType) results = results.filter(l => l.dealType === dealType);
    if (propertyType) results = results.filter(l => l.propertyType === propertyType);
    if (district) results = results.filter(l => l.district === district);
    if (minPrice) results = results.filter(l => l.price >= Number(minPrice));
    if (maxPrice) results = results.filter(l => l.price <= Number(maxPrice));
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/listings/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(listingsTable).where(eq(listingsTable.id, req.params.id)).limit(1);
    if (!rows[0] || rows[0].status !== "published") { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.status, "published")).orderBy(desc(blogPostsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:slug", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
    if (!rows[0] || rows[0].status !== "published") { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reviews", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(reviewsTable).where(eq(reviewsTable.status, "approved")).orderBy(desc(reviewsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req: Request, res: Response) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    const sellerId = typeof req.body?.sellerId === "string" && req.body.sellerId.trim() ? req.body.sellerId.trim() : null;
    if (!name || !text) {
      res.status(400).json({ error: "Имя и текст отзыва обязательны" });
      return;
    }
    const [created] = await db
      .insert(reviewsTable)
      .values({ name, text, sellerId, status: "pending" })
      .returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "site_profile")).limit(1);
    if (!rows[0]) {
      res.json({ name: "Barakat Estate", description: "", phone: "", email: "", socials: {} });
      return;
    }
    res.json(JSON.parse(rows[0].value));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(adminUsersTable).orderBy(desc(adminUsersTable.createdAt));
    res.json(rows.map(({ passwordHash: _, ...u }) => u));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
