import { getDb } from "./client";
import { newId, nowIso } from "../utils/id";
import { stringifyJson } from "../utils/json";
import { PLAN_LIMITS } from "../config";

export function seedDefaults(): void {
  const db = getDb();
  const planCount = db.prepare("SELECT COUNT(*) as c FROM billing_plans").get() as {
    c: number;
  };
  if (planCount.c === 0) {
    const ts = nowIso();
    const plans = [
      { id: "plan_free", name: "Free", slug: "free", price: 0, limits: PLAN_LIMITS.free },
      { id: "plan_pro", name: "Pro", slug: "pro", price: 299_000, limits: PLAN_LIMITS.pro },
      {
        id: "plan_event",
        name: "Event package",
        slug: "event_package",
        price: 990_000,
        limits: PLAN_LIMITS.event_package,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO billing_plans (
        id, name, slug, price_monthly, currency, features_json, limits_json, is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, 'UZS', ?, ?, 1, ?, ?)
    `);
    for (const p of plans) {
      stmt.run(
        p.id,
        p.name,
        p.slug,
        p.price,
        stringifyJson(["editor", "export", "templates", "event_builder"]),
        stringifyJson(p.limits),
        ts,
        ts
      );
    }
    console.log("[db] Seeded billing plans");
  }

  const ensurePlans = [
    {
      id: "plan_pro_yearly",
      name: "Pro (yillik)",
      slug: "pro_yearly",
      price: 2_490_000,
      limits: PLAN_LIMITS.pro,
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      slug: "enterprise",
      price: 0,
      limits: PLAN_LIMITS.enterprise,
    },
  ];
  const upsert = db.prepare(`
    INSERT INTO billing_plans (
      id, name, slug, price_monthly, currency, features_json, limits_json, is_active, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, 'UZS', ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `);
  const tsUpsert = nowIso();
  for (const p of ensurePlans) {
    const exists = db.prepare("SELECT id FROM billing_plans WHERE slug = ?").get(p.slug);
    if (!exists) {
      upsert.run(
        p.id,
        p.name,
        p.slug,
        p.price,
        stringifyJson(["editor", "export", "templates", "event_builder", "team"]),
        stringifyJson(p.limits),
        p.slug === "enterprise" ? 0 : 1,
        tsUpsert,
        tsUpsert
      );
    }
  }

  if (planCount.c > 0) {
    const rows = db.prepare("SELECT id, slug, limits_json FROM billing_plans").all() as {
      id: string;
      slug: string;
      limits_json: string;
    }[];
    for (const row of rows) {
      if (!row.limits_json || row.limits_json === "{}") {
        const limits = PLAN_LIMITS[row.slug] ?? PLAN_LIMITS.free;
        db.prepare("UPDATE billing_plans SET limits_json = ? WHERE id = ?").run(
          stringifyJson(limits),
          row.id
        );
      }
    }
  }

  const tplCount = db.prepare("SELECT COUNT(*) as c FROM templates").get() as { c: number };
  if (tplCount.c === 0) {
    const ts = nowIso();
    db.prepare(`
      INSERT INTO templates (
        id, product_type, name, description, category, size, orientation,
        default_canvas_data_json, preview_url, is_premium, is_active, tags_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).run(
      newId("tpl"),
      "certificate",
      "Classic certificate",
      "Default conference certificate layout",
      "Certificates",
      "A4",
      "landscape",
      stringifyJson({ elements: [] }),
      null,
      0,
      stringifyJson([]),
      ts,
      ts
    );
    console.log("[db] Seeded starter template");
  }
}
