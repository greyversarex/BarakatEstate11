import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

router.get("/listings", async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const all = await db.select().from(listingsTable).orderBy(desc(listingsTable.createdAt));
    if (user?.role === "admin") {
      res.json(all);
    } else if (user) {
      res.json(all.filter(l => l.sellerId === user.id || l.employeeId === user.id));
    } else {
      res.json(all.filter(l => l.status === "published"));
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/listings/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(listingsTable).where(eq(listingsTable.id, req.params.id)).limit(1);
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/listings", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const slug = (req.body.title || "listing").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const [row] = await db.insert(listingsTable).values({ ...req.body, slug }).returning();
    res.status(201).json(row);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

async function updateListing(req: Request, res: Response) {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [row] = await db.update(listingsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(listingsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

router.put("/listings/:id", updateListing);
router.patch("/listings/:id", updateListing);

router.delete("/listings/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await db.delete(listingsTable).where(eq(listingsTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
