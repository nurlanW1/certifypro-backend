import type { BillingPlan } from "../../db/models";
import { listPlansFromDb } from "./billing-limits.service";

export function listBillingPlans(): BillingPlan[] {
  return listPlansFromDb();
}
