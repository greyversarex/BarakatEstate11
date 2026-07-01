import { Router, type Request, type Response } from "express";
import { getErrorMessage } from "../../lib/errors";
import { db } from "@workspace/db";
import { viewingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

const VALID_STATUSES = ["new", "read", "completed"] as const;

function ownsViewing(user: { id: string; role: string }, viewing: { sellerId: string; employeeId: string }) {
  return user.role === "admin" || viewing.sellerId === user.id || viewing.employeeId === user.id;
}

router.get("/viewings", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const all = await db.select().from(viewingsTable).orderBy(desc(viewingsTable.createdAt));
    if (user.role === "admin") {
      res.json(all);
    } else {
      res.json(all.filter(v => v.sellerId === user.id || v.employeeId === user.id));
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

async function updateViewing(req: Request, res: Response) {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(viewingsTable).where(eq(viewingsTable.id, req.params.id)).limit(1);
    const existing = rows[0];
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    if (!ownsViewing(user, existing)) { res.status(403).json({ error: "Forbidden" }); return; }

    const status = req.body?.status;
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [row] = await db.update(viewingsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(viewingsTable.id, req.params.id))
      .returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
}

router.put("/viewings/:id", updateViewing);
router.patch("/viewings/:id", updateViewing);

router.delete("/viewings/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(viewingsTable).where(eq(viewingsTable.id, req.params.id)).limit(1);
    const existing = rows[0];
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    if (!ownsViewing(user, existing)) { res.status(403).json({ error: "Forbidden" }); return; }

    await db.delete(viewingsTable).where(eq(viewingsTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
