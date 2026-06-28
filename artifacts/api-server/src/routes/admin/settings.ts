import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getAuthUser } from "./auth";

const router = Router();

const SETTINGS_KEY = "site_profile";

router.get("/profile", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, SETTINGS_KEY)).limit(1);
    if (!rows[0]) {
      res.json({
        name: "Barakat Estate",
        description: "",
        phone: "",
        email: "",
        socials: { instagram: "", telegram: "", facebook: "", whatsapp: "" },
        logoUrl: "",
        avatarUrl: "",
        rating: 0,
        dealsCount: 0,
        experienceYears: 0,
        specializations: "",
        districts: "",
        propertyTypes: "",
        dealTypes: "",
      });
      return;
    }
    res.json(JSON.parse(rows[0].value));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await db.insert(siteSettingsTable)
      .values({ key: SETTINGS_KEY, value: JSON.stringify(req.body) })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: JSON.stringify(req.body), updatedAt: new Date() } });
    res.json(req.body);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
