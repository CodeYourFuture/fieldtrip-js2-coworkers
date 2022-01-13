import { Router } from "express";

export const webapp = (router: Router) => {
  router.use(require("express").static("public"));

  router.get("/", (_, res) => {
    res.send("Hello World");
  });
};
