import { apiRequest } from "./client";

export type Workspace = {
  id: string;
  name: string;
  organization: string;
  members: number;
  templates: number;
  generatedAssets: number;
};

export async function getWorkspaces() {
  return apiRequest<{ ok: boolean; items: Workspace[] }>("/api/workspaces");
}
