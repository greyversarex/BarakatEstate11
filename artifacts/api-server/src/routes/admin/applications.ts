import { Router, type Request, type Response } from "express";
import { getErrorMessage } from "../../lib/errors";
import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

router.get("/applications", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(applicationsTable).orderBy(desc(applicationsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/applications/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(applicationsTable).where(eq(applicationsTable.id, req.params.id)).limit(1);
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/applications", async (req: Request, res: Response) => {
  // Public submission endpoint (no auth): keep the client message generic so DB
  // internals are never leaked to anonymous callers. The real error is logged.
  try {
    const [row] = await db.insert(applicationsTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Application submission failed");
    res.status(400).json({ error: "Не удалось отправить заявку. Проверьте введённые данные." });
  }
});

router.put("/applications/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [row] = await db.update(applicationsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(applicationsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.patch("/applications/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [row] = await db.update(applicationsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(applicationsTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.delete("/applications/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await db.delete(applicationsTable).where(eq(applicationsTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
