import { Router, type Request, type Response } from "express";
import { getErrorMessage } from "../../lib/errors";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuthUser } from "./auth";
import * as bcrypt from "bcryptjs";

const router = Router();

function isDuplicateUsername(err: unknown): boolean {
  let current: unknown = err;
  for (let i = 0; i < 5 && current instanceof Error; i++) {
    const withCode = current as Error & { code?: string; constraint?: string };
    if (withCode.code === "23505") return true;
    if (current.message.includes("admin_users_username_unique") || current.message.includes("duplicate key")) return true;
    current = current.cause;
  }
  return false;
}

router.get("/users", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const rows = await db.select().from(adminUsersTable).orderBy(desc(adminUsersTable.createdAt));
    res.json(rows.map(({ passwordHash: _, ...u }) => u));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.params.id)).limit(1);
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    const { passwordHash: _, ...safeUser } = rows[0];
    res.json(safeUser);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const { password, ...rest } = req.body;
    const passwordHash = await bcrypt.hash(password || "changeme123", 12);
    const [row] = await db.insert(adminUsersTable).values({ ...rest, passwordHash }).returning();
    const { passwordHash: _, ...safeUser } = row;
    res.status(201).json(safeUser);
  } catch (err) {
    if (isDuplicateUsername(err)) {
      res.status(409).json({ error: "Логин уже занят — пользователь с таким username уже существует. Выберите другой логин." });
      return;
    }
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const { password, passwordHash: __, ...rest } = req.body;
    const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date() };
    if (password) updateData.passwordHash = await bcrypt.hash(password, 12);
    const [row] = await db.update(adminUsersTable).set(updateData).where(eq(adminUsersTable.id, req.params.id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    const { passwordHash: _, ...safeUser } = row;
    res.json(safeUser);
  } catch (err) {
    if (isDuplicateUsername(err)) {
      res.status(409).json({ error: "Логин уже занят — пользователь с таким username уже существует. Выберите другой логин." });
      return;
    }
    req.log.error({ err }, "Admin request failed");
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    await db.delete(adminUsersTable).where(eq(adminUsersTable.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
