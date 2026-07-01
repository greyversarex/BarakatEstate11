import { Router, type Request, type Response } from "express";
import { getAuthUser } from "./auth";
import { ObjectStorageService, UnsupportedImageError } from "../../lib/objectStorage";

const router = Router();
const objectStorageService = new ObjectStorageService();

/**
 * Extract the raw bytes from a base64 payload. The payload may be a full data
 * URL ("data:<mime>;base64,....") or a bare base64 string. The declared MIME is
 * intentionally ignored — the real format is detected from the bytes in
 * ObjectStorageService.saveObject, so a spoofed content type cannot smuggle in
 * an executable file.
 */
function parseImagePayload(input: string): Buffer {
  const match = input.match(/^data:[^;]+;base64,(.*)$/s);
  if (match) {
    return Buffer.from(match[1], "base64");
  }
  return Buffer.from(input, "base64");
}

function publicBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string)?.split(",")[0] || req.get("host");
  return `${proto}://${host}`;
}

router.post("/upload", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { image } = req.body;
    if (!image || typeof image !== "string") {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const buffer = parseImagePayload(image);
    const objectPath = await objectStorageService.saveObject(buffer);

    const path = `/api/storage${objectPath}`;
    const url = `${publicBaseUrl(req)}${path}`;
    res.json({ url, path });
  } catch (err) {
    if (err instanceof UnsupportedImageError) {
      res.status(400).json({
        error: "Unsupported image format. Use JPEG, PNG, WebP, GIF or AVIF.",
      });
      return;
    }
    req.log.error(
      { err, userId: user.id },
      "Image upload failed while saving object to storage",
    );
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
