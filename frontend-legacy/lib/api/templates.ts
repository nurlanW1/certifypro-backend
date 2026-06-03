import { apiRequest } from "./client";

export type TemplateCatalogResponse = {
  ok: boolean;
  categories: string[];
  types: Array<"free" | "premium">;
};

export async function getTemplateCatalog() {
  return apiRequest<TemplateCatalogResponse>("/api/templates/catalog");
}
