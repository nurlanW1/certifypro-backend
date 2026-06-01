import { apiRequest } from "./client";

export type PlatformOverview = {
  name: string;
  type: string;
  value: string;
  modules: Array<{ id: string; name: string; status: string }>;
};

export async function getPlatformOverview() {
  return apiRequest<PlatformOverview>("/api/platform/overview");
}

export async function healthCheck() {
  return apiRequest<{ ok: boolean; service: string }>("/api/health");
}
