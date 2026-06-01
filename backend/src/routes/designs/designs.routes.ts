import { requireAuth } from "../../core/auth";
import { createModuleRouter } from "../foundation/create-router";
import { stubHandler } from "../foundation/stub-handler";

export const designsRouter = createModuleRouter();
designsRouter.use(requireAuth);

designsRouter.get("/", stubHandler("designs.list"));
designsRouter.post("/", stubHandler("designs.create"));
designsRouter.get("/:id", stubHandler("designs.get"));
designsRouter.get("/:id/versions", stubHandler("designs.versions"));
designsRouter.patch("/:id", stubHandler("designs.update"));
designsRouter.delete("/:id", stubHandler("designs.delete"));
designsRouter.post("/:id/restore", stubHandler("designs.restore"));
designsRouter.post("/:id/duplicate", stubHandler("designs.duplicate"));
