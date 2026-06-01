import { Router, type RouterOptions } from "express";

/** Standard module router (mergeParams for nested resource routes). */
export function createModuleRouter(options?: RouterOptions) {
  return Router({ mergeParams: true, ...options });
}
