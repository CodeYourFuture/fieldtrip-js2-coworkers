import { pick } from "lodash";

require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const getEnv = (...keys: string[]): string => {
  const value = process.env[keys[0]];
  if (typeof value !== "string") {
    if (keys.length > 1) {
      return getEnv(...keys.slice(1));
    }
    throw new Error(`Config value for ${keys[0]} is not defined`);
  }
  return value;
};

export const APP_ID = getEnv("APP_ID");
export const GITHUB_CLIENT_ID = getEnv("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnv("GITHUB_CLIENT_SECRET");
export const SERVER_PORT = getEnv("SERVER_PORT");
export const PROXY_URL = getEnv("PROXY_URL");
export const PRIVATE_KEY = getEnv("PRIVATE_KEY");
export const SESSION_KEY1 = getEnv("SESSION_KEY1");
export const SESSION_KEY2 = getEnv("SESSION_KEY2");
export const WEBHOOK_SECRET = getEnv("WEBHOOK_SECRET");
export const WEBHOOK_PROXY_URL = getEnv("WEBHOOK_PROXY_URL");

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const probotConfig = {
  APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PORT: SERVER_PORT,
  PRIVATE_KEY,
  WEBHOOK_SECRET,
  WEBHOOK_PROXY_URL,
};
