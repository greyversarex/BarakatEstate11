import { Router } from "express";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/sellers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.id, id))
      .limit(1);
    if (!rows[0]) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const { passwordHash: _, ...seller } = rows[0];
    res.json(seller);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
