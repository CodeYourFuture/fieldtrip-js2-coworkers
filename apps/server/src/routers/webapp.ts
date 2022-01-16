import express, { Router } from "express";
import { isProd } from "../config";

export const webapp = (router: Router) => {
  // CRA handles proxying to /api and /auth in dev
  if (isProd) {
    const staticServer = express.static("../client/build");
    router.use(staticServer);
    router.use("*", staticServer);
  }
};
