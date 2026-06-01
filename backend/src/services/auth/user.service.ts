import bcrypt from "bcryptjs";
import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import { mapUser, mapUserPublic } from "../../db/mappers";
import type { User, UserPublic } from "../../db/models";
import { config } from "../../config";
import { newId, nowIso } from "../../utils/id";

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  plan?: string;
}): Promise<User> {
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM ${Tables.USERS} WHERE email = ?`)
    .get(params.email.toLowerCase());
  if (existing) throw new Error("Email already registered");

  const id = newId("usr");
  const ts = nowIso();
  const passwordHash = await bcrypt.hash(params.password, config.bcryptRounds);
  db.prepare(
    `INSERT INTO ${Tables.USERS} (id, name, email, password_hash, role, plan, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    params.name,
    params.email.toLowerCase(),
    passwordHash,
    params.role ?? "user",
    params.plan ?? "free",
    ts,
    ts
  );
  return mapUser(db.prepare(`SELECT * FROM ${Tables.USERS} WHERE id = ?`).get(id) as never);
}

export function getUserByEmail(email: string): User | null {
  const row = getDb()
    .prepare(`SELECT * FROM ${Tables.USERS} WHERE email = ?`)
    .get(email.toLowerCase());
  return row ? mapUser(row as never) : null;
}

export function getUserById(id: string): User | null {
  const row = getDb().prepare(`SELECT * FROM ${Tables.USERS} WHERE id = ?`).get(id);
  return row ? mapUser(row as never) : null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export function toPublic(user: User): UserPublic {
  return mapUserPublic(user);
}
