import { createModuleRouter } from "../foundation/create-router";
import { asyncHandler } from "../../middleware/async-handler";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { requireAuth, signToken } from "../../core/auth";
import { sendError, sendSuccess } from "../../core/http";
import { validateBody } from "../../validation";
import type { z } from "zod";
import { loginSchema, registerSchema } from "../../validation/schemas/auth.schema";
import * as userService from "../../services/auth/user.service";

type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;

export const authRouter = createModuleRouter();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as RegisterBody;
    const user = await userService.createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    const token = signToken(user.id, user.role);
    sendSuccess(res, { token, user: userService.toPublic(user) }, 201);
  })
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as LoginBody;
    const user = userService.getUserByEmail(body.email);
    if (!user || !(await userService.verifyPassword(user, body.password))) {
      sendError(res, 401, "AUTH_INVALID_CREDENTIALS", "Invalid email or password");
      return;
    }
    const token = signToken(user.id, user.role);
    sendSuccess(res, { token, user: userService.toPublic(user) });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, { user: req.user });
  })
);
