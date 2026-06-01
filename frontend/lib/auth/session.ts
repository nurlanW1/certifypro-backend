const AUTH_TOKEN_KEY = "gildia_auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
