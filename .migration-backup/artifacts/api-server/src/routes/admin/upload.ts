import { Router, type Request, type Response } from "express";
import { getAuthUser } from "./auth";

const router = Router();

router.post("/upload", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const { image } = req.body;
    if (!image) { res.status(400).json({ error: "No image provided" }); return; }
    const url = image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;
    res.json({ url });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
