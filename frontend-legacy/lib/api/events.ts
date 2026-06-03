import { apiRequest } from "./client";
import { authHeaders } from "@/lib/auth/session";

export type ApiEvent = {
  id: string;
  userId: string;
  name: string;
  type: string;
  organizationName: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
  language: string;
  participantEstimate: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = {
  name: string;
  type?: string;
  organizationName?: string;
  date?: string;
  location?: string;
  description?: string;
  language?: string;
  participantEstimate?: number;
  status?: "draft" | "active" | "archived";
};

export async function createEvent(input: CreateEventInput): Promise<ApiEvent> {
  return apiRequest<ApiEvent>("/api/events", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}
