import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestTarget = "body" | "query" | "params";

function validate<T>(target: RequestTarget, schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[target]);
    (req as Request & Record<string, unknown>)[target] = parsed;
    next();
  };
}

export const validateBody = <T>(schema: ZodSchema<T>) => validate("body", schema);
export const validateQuery = <T>(schema: ZodSchema<T>) => validate("query", schema);
export const validateParams = <T>(schema: ZodSchema<T>) => validate("params", schema);
