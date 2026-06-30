import { Router, type Request, type Response } from "express";
import { getAuthUser } from "./auth";
import { ObjectStorageService } from "../../lib/objectStorage";

const router = Router();
const objectStorageService = new ObjectStorageService();

function parseDataUrl(input: string): { buffer: Buffer; contentType: string } {
  const match = input.match(/^data:([^;]+);base64,(.*)$/s);
  if (match) {
    return { contentType: match[1], buffer: Buffer.from(match[2], "base64") };
  }
  return { contentType: "image/jpeg", buffer: Buffer.from(input, "base64") };
}

function publicBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string)?.split(",")[0] || req.get("host");
  return `${proto}://${host}`;
}

router.post("/upload", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const { image } = req.body;
    if (!image || typeof image !== "string") {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const { buffer, contentType } = parseDataUrl(image);

    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const putRes = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: new Uint8Array(buffer),
    });
    if (!putRes.ok) {
      throw new Error(`Storage PUT failed with status ${putRes.status}`);
    }

    const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
      uploadURL,
      { owner: user.id, visibility: "public" },
    );

    const url = `${publicBaseUrl(req)}/api/storage${objectPath}`;
    res.json({ url, path: `/api/storage${objectPath}` });
  } catch (err) {
    req.log.error({ err }, "Upload failed");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
