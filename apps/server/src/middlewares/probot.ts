import express from "express";
import { createNodeMiddleware } from "probot";
import type { Probot } from "probot";
import type { ApplicationFunction } from "probot/lib/types";
import type { BotConfig } from "../config";

export const probot = (params: {
  app: ApplicationFunction;
  instance: Probot;
  config: BotConfig;
}) => {
  return express().use(
    createNodeMiddleware(params.app, {
      probot: params.instance,
      webhooksPath: params.config.WEBHOOK_PATH,
    })
  );
};
