import express from "express";
import { createNodeMiddleware } from "probot";
import * as bots from "../services/bots";
import type { Probot } from "probot";
import type { ApplicationFunction } from "probot/lib/types";
import type { BotConfig } from "../config";

const probot = (params: {
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

export const cyf = probot(bots.cyf);
export const malachi = probot(bots.malachi);
export const uma = probot(bots.uma);
export const amber = probot(bots.amber);
