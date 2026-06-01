export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: string;
  createdAt: string;
  updatedAt: string;
}
