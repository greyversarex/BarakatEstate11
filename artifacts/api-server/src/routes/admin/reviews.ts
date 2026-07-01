import { Router, type Request, type Response } from "express";
import { getErrorMessage } from "../../lib/errors";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

router.get("/reviews", async (req: Request, res: Response) => {
  try {
    const user = await getAuthUser(req);
    const rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
    if (user?.role === "admin") {
      res.json(rows);
    } else {
      res.json(rows.filter(r => r.status === "approved"));
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reviews/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(reviewsTable).where(eq(reviewsTable.id, req.params.id)).limit(1);
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req: Request, res: Response) => {
  // Public submission endpoint (no auth): keep the client message generic so DB
  // internals are never leaked to anonymous callers. The real error is logged.
  try {
    const [row] = await db.insert(reviewsTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Review submission failed");
    res.status(400).json({ error: "Не удалось отправить отзыв. Проверьте введённые данные." });
  }
});

router.put("/reviews/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [row] = await db.update(reviewsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(reviewsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.patch("/reviews/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [row] = await db.update(reviewsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(reviewsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.delete("/reviews/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await db.delete(reviewsTable).where(eq(reviewsTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
