import { API_URL } from "@/lib/constants/env";
import { ApiError } from "@/lib/api/errors";

export { API_URL };

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path, API_URL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, headers, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `So‘rov muvaffaqiyatsiz (${response.status})`
    try {
      const body = (await response.json()) as {
        message?: string
        error?: string | { message?: string; code?: string }
      }
      if (typeof body.error === "object" && body.error?.message) {
        message = body.error.message
      } else if (typeof body.error === "string") {
        message = body.error
      } else {
        message = body.message || message
      }
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(response.status, message)
  }

  const json = (await response.json()) as {
    success?: boolean
    data?: T
    items?: unknown
    meta?: unknown
  } &
    T

  if (json && typeof json === "object" && Array.isArray(json.items)) {
    return json as T
  }
  if (json && typeof json === "object" && "data" in json && json.data !== undefined) {
    return json.data as T
  }
  return json as T
}
