import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { getObjectAclPolicy } from "../lib/objectAcl";

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

async function streamResponse(response: Response, fetched: globalThis.Response) {
  response.status(fetched.status);
  fetched.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-disposition") return;
    response.setHeader(key, value);
  });
  if (fetched.body) {
    const nodeStream = Readable.fromWeb(fetched.body as ReadableStream<Uint8Array>);
    nodeStream.pipe(response);
  } else {
    response.end();
  }
}

/**
 * GET /storage/objects/*
 * Serve uploaded object entities. Files uploaded by admins are stored with a
 * public ACL, so these are served without authentication. Pass ?download to
 * force a file download instead of inline display.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const aclPolicy = await getObjectAclPolicy(objectFile);
    if (aclPolicy?.visibility !== "public") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    applyDownloadHeader(req, res);
    const fetched = await objectStorageService.downloadObject(objectFile);
    await streamResponse(res, fetched);
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

/**
 * GET /storage/public-objects/*
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS (unconditionally public).
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    applyDownloadHeader(req, res);
    const fetched = await objectStorageService.downloadObject(file);
    await streamResponse(res, fetched);
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

export default router;
