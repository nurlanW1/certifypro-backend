import { config } from "../config";
import { LocalStorageProvider } from "./local.storage";
import { S3StorageProvider } from "./s3.storage";
import type { StorageProvider } from "./types";

let provider: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!provider) {
    if (config.storageDriver === "s3") {
      try {
        provider = new S3StorageProvider();
        console.log("[storage] Using S3-compatible driver");
      } catch (err) {
        console.warn("[storage] S3 init failed, falling back to local:", (err as Error).message);
        provider = new LocalStorageProvider();
      }
    } else {
      provider = new LocalStorageProvider();
      console.log("[storage] Using local filesystem driver");
    }
  }
  return provider;
}

export function resetStorageForTests(): void {
  provider = null;
}
