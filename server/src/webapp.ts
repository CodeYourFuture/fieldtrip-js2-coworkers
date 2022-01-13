import express, { Router } from "express";

export const webapp = (router: Router) => {
  const staticServer = express.static("../client/build");
  router.use(staticServer);
  router.use("*", staticServer);
};
