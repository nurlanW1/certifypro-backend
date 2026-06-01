export interface StoredFile {
  storageKey: string;
  fileUrl: string;
  size: number;
}

export interface StorageProvider {
  save(params: {
    userId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
    storageKey?: string;
  }): Promise<StoredFile>;
  delete(storageKey: string): Promise<void>;
  getAbsolutePath(storageKey: string): string | null;
}
