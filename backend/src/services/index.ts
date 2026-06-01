/**
 * Service layer entry — domain modules export from subfolders in later phases.
 */
export * as auth from "./auth";
export * from "./auth/user.service";

// Legacy flat services (Phase 2 will move into domain folders)
export * as events from "./events";
export * as designs from "./design.service";
export * as templates from "./templates";
export * as uploads from "./uploads";
export * as exports from "./exports";
export * as brandKits from "./brand-kit.service";
export * as billing from "./billing";
export * as payments from "./payments";
export * as activity from "./activity";
export * as admin from "./admin";
export * as audit from "./audit.service";
