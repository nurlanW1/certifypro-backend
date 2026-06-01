import { requireAuth } from "../../core/auth";
import { createModuleRouter } from "../foundation/create-router";
import { stubHandler } from "../foundation/stub-handler";

export const brandKitsRouter = createModuleRouter();
brandKitsRouter.use(requireAuth);
brandKitsRouter.get("/", stubHandler("brandKits.list"));
brandKitsRouter.post("/", stubHandler("brandKits.create"));
brandKitsRouter.get("/:id", stubHandler("brandKits.get"));
brandKitsRouter.patch("/:id", stubHandler("brandKits.update"));
brandKitsRouter.delete("/:id", stubHandler("brandKits.delete"));
