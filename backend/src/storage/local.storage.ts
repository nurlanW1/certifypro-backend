import fs from "fs";
import path from "path";
import { config } from "../config";
import type { StorageProvider, StoredFile } from "./types";
import { newId } from "../utils/id";
import { sanitizeFileName } from "./paths";

export class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor(basePath = config.storageLocalPath) {
    this.basePath = basePath;
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async save(params: {
    userId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
    storageKey?: string;
  }): Promise<StoredFile> {
    const safe = sanitizeFileName(params.fileName);
    const storageKey =
      params.storageKey?.replace(/\\/g, "/") ??
      path.posix.join("users", params.userId, "files", `${newId("file")}-${safe}`);
    const abs = path.join(this.basePath, storageKey);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, params.buffer);
    const fileUrl = `${config.storagePublicBaseUrl.replace(/\/$/, "")}/api/files/${encodeURIComponent(storageKey)}`;
    return { storageKey, fileUrl, size: params.buffer.length };
  }

  async delete(storageKey: string): Promise<void> {
    const abs = path.join(this.basePath, storageKey);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  }

  getAbsolutePath(storageKey: string): string {
    return path.join(this.basePath, storageKey);
  }
}
