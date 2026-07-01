import { Router, type IRouter, type Request, type Response } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

function applyDownloadHeader(req: Request, res: Response) {
  if (req.query.download !== undefined) {
    const raw = req.path.split("/").pop() || "download";
    const filename = decodeURIComponent(raw);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/"/g, "")}"`,
    );
  }
}

/**
 * GET /storage/objects/*
 * Serve uploaded object entities from the local upload directory. Files are
 * uploaded by admins and served publicly. Pass ?download to force a file
 * download instead of inline display.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const { absPath, contentType, size } =
      await objectStorageService.getObject(objectPath);

    applyDownloadHeader(req, res);
    res.setHeader("Content-Type", contentType);
    // Never let the browser MIME-sniff an uploaded file into something
    // executable (e.g. treating a crafted upload as HTML/JS on our origin).
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Length", String(size));
    res.setHeader("Cache-Control", "public, max-age=3600");

    const stream = objectStorageService.createReadStream(absPath);
    stream.on("error", (err) => {
      req.log.error({ err }, "Error streaming object");
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve object" });
      } else {
        res.destroy(err);
      }
    });
    stream.pipe(res);
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error, path: req.path }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error, path: req.path }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
