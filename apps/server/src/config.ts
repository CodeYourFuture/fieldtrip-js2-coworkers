require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
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

export const GH_APP_NAME = getEnv("GH_APP_NAME");
export const GH_APP_ID = getEnv("GH_APP_ID");
export const GH_APP_CLIENT_ID = getEnv("GH_APP_CLIENT_ID");
export const GH_APP_CLIENT_SECRET = getEnv("GH_APP_CLIENT_SECRET");
export const GH_APP_PRIVATE_KEY = getEnv("GH_APP_PRIVATE_KEY");
export const GH_APP_WEBHOOK_PROXY_URL = getEnv("GH_APP_WEBHOOK_PROXY_URL");
export const GH_APP_WEBHOOK_SECRET = getEnv("GH_APP_WEBHOOK_SECRET");
export const PROXY_URL = getEnv("PROXY_URL");
export const SERVER_PORT = getEnv("SERVER_PORT");
export const SESSION_KEY1 = getEnv("SESSION_KEY1");
export const SESSION_KEY2 = getEnv("SESSION_KEY2");

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const probotConfig = {
  APP_ID: GH_APP_ID,
  GITHUB_CLIENT_ID: GH_APP_CLIENT_ID,
  GITHUB_CLIENT_SECRET: GH_APP_CLIENT_SECRET,
  PORT: SERVER_PORT,
  PRIVATE_KEY: GH_APP_PRIVATE_KEY,
  WEBHOOK_SECRET: GH_APP_WEBHOOK_SECRET,
  WEBHOOK_PROXY_URL: GH_APP_WEBHOOK_PROXY_URL,
};
