import { createReadStream, existsSync } from "fs";
import { mkdir, writeFile, stat } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class UnsupportedImageError extends Error {
  constructor(message = "Unsupported image format") {
    super(message);
    this.name = "UnsupportedImageError";
    Object.setPrototypeOf(this, UnsupportedImageError.prototype);
  }
}

/**
 * Extensions we are willing to serve, mapped to their content type. SVG is
 * intentionally excluded: it can embed inline <script>, and served from our own
 * origin that becomes a stored-XSS vector (an uploaded SVG opened by an admin
 * could steal their session). Only raster formats are allowed.
 */
const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

interface ImageFormat {
  ext: string;
  contentType: string;
}

/**
 * Detect the real image format from the buffer's magic bytes, ignoring any
 * client-supplied MIME type (which can be spoofed). Returns null for anything
 * that is not a supported raster image — including SVG, HTML, or scripts
 * disguised with an image extension.
 */
function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { ext: ".jpg", contentType: "image/jpeg" };
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: ".png", contentType: "image/png" };
  }
  if (buffer.length >= 6 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) {
    return { ext: ".gif", contentType: "image/gif" };
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { ext: ".webp", contentType: "image/webp" };
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp" &&
    ["avif", "avis"].includes(buffer.toString("ascii", 8, 12))
  ) {
    return { ext: ".avif", contentType: "image/avif" };
  }
  return null;
}

/**
 * Directory where uploaded objects live. Defaults to `<cwd>/data/uploads` for
 * local/dev; in production set UPLOAD_DIR to a path backed by a persistent
 * volume (see deploy/docker-compose.yml) so files survive container rebuilds.
 */
export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return configured;
  }
  return path.resolve(process.cwd(), "data/uploads");
}

export interface StoredObject {
  absPath: string;
  contentType: string;
  size: number;
}

export class ObjectStorageService {
  /**
   * Persist an image buffer to disk and return its public object path
   * (e.g. "/objects/<uuid>.jpg"). The extension is derived from the buffer's
   * real magic bytes; non-image content is rejected with UnsupportedImageError.
   */
  async saveObject(buffer: Buffer): Promise<string> {
    const format = detectImageFormat(buffer);
    if (!format) {
      throw new UnsupportedImageError();
    }
    const dir = getUploadDir();
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${format.ext}`;
    await writeFile(path.join(dir, filename), buffer);
    return `/objects/${filename}`;
  }

  /**
   * Resolve a public object path ("/objects/<filename>") to an absolute path on
   * disk, guarding against path traversal. Throws ObjectNotFoundError when the
   * path is malformed or the file does not exist.
   */
  private resolveObjectPath(objectPath: string): string {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    // path.basename strips any directory components, so "../../etc/passwd"
    // collapses to "passwd" and can never escape the upload directory.
    const filename = path.basename(objectPath.slice("/objects/".length));
    if (!filename || filename === "." || filename === "..") {
      throw new ObjectNotFoundError();
    }
    const absPath = path.join(getUploadDir(), filename);
    if (!existsSync(absPath)) {
      throw new ObjectNotFoundError();
    }
    return absPath;
  }

  async getObject(objectPath: string): Promise<StoredObject> {
    const absPath = this.resolveObjectPath(objectPath);
    const ext = path.extname(absPath).toLowerCase();
    const contentType = EXT_TO_CONTENT_TYPE[ext] ?? "application/octet-stream";
    const { size } = await stat(absPath);
    return { absPath, contentType, size };
  }

  createReadStream(absPath: string) {
    return createReadStream(absPath);
  }
}
