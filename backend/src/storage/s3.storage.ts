import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "../config";
import type { StorageProvider, StoredFile } from "./types";
import { newId } from "../utils/id";
import { sanitizeFileName } from "./paths";

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicBase: string;

  constructor() {
    const { endpoint, region, bucket, accessKeyId, secretAccessKey, publicBaseUrl } =
      config.s3;
    if (!bucket || !accessKeyId || !secretAccessKey) {
      throw new Error("S3 storage requires S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY");
    }
    this.bucket = bucket;
    this.publicBase =
      publicBaseUrl?.replace(/\/$/, "") ||
      `${endpoint?.replace(/\/$/, "")}/${bucket}`;
    this.client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: boolEndpoint(endpoint),
    });
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
      params.storageKey ??
      `users/${params.userId}/files/${newId("file")}-${safe}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey.replace(/\\/g, "/"),
        Body: params.buffer,
        ContentType: params.mimeType,
      })
    );
    const fileUrl = `${this.publicBase}/${storageKey.replace(/\\/g, "/")}`;
    return { storageKey, fileUrl, size: params.buffer.length };
  }

  async delete(storageKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey.replace(/\\/g, "/"),
      })
    );
  }

  getAbsolutePath(): string | null {
    return null;
  }
}

function boolEndpoint(endpoint?: string): boolean {
  return Boolean(endpoint && (endpoint.includes("r2.cloudflarestorage") || endpoint.includes("localhost")));
}
