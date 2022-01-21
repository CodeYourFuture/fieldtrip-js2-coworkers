import { createProbot as createProbotOrig } from "probot";
import { getLog } from "./logger";
import * as config from "../config";
import type { BotConfig } from "../config";

export const createProbot = (botConfig: BotConfig) => {
  if (config.isDev && botConfig.WEBHOOK_PROXY_URL) {
    const SmeeClient = require("smee-client");
    const smee = new SmeeClient({
      source: botConfig.WEBHOOK_PROXY_URL,
      target: `http://localhost:${config.PORT}${botConfig.WEBHOOK_PATH}`,
    });
    smee.start();
  }
  return createProbotOrig({
    overrides: {
      appId: botConfig.APP_ID,
      privateKey: botConfig.PRIVATE_KEY,
      secret: botConfig.WEBHOOK_SECRET,
      log: getLog(),
    },
  });
};
