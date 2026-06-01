import { apiRequest } from "./client";

export type AuthPayload = {
  email: string;
  password: string;
  fullName?: string;
};

export type AuthResponse = {
  token?: string;
  user?: { id: string; email: string; fullName?: string };
  message?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

// TODO: connect once backend /api/auth endpoints are implemented.
export async function login(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// TODO: connect once backend /api/auth endpoints are implemented.
export async function register(payload: AuthPayload) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// TODO: connect once backend /api/auth/forgot-password is implemented.
export async function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<{ message?: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// TODO: connect once backend /api/auth/verify-email is implemented.
export async function verifyEmail(payload: VerifyEmailPayload) {
  return apiRequest<AuthResponse>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// TODO: connect once backend /api/auth/resend-verification is implemented.
export async function resendVerification(email: string) {
  return apiRequest<{ message?: string }>("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
