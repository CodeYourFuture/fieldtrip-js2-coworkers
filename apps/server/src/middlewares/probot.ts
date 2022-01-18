import express from "express";
import { createNodeMiddleware, createProbot } from "probot";
import * as config from "../config";
import { getLog } from "../utils";
import type { ApplicationFunction } from "probot/lib/types";
import type { BotConfig } from "../config";

export const probot = (bot: ApplicationFunction, botConfig: BotConfig) => {
  if (config.isDev && botConfig.WEBHOOK_PATH) {
    const SmeeClient = require("smee-client");
    const smee = new SmeeClient({
      source: botConfig.WEBHOOK_PROXY_URL,
      target: `http://localhost:${config.PORT}${botConfig.WEBHOOK_PATH}`,
    });
    smee.start();
  }
  return express().use(
    createNodeMiddleware(bot, {
      probot: createProbot({
        overrides: {
          appId: botConfig.APP_ID,
          privateKey: botConfig.PRIVATE_KEY,
          secret: botConfig.WEBHOOK_SECRET,
          webhookPath: botConfig.WEBHOOK_PATH,
          log: getLog(),
        },
      }),
    })
  );
};
