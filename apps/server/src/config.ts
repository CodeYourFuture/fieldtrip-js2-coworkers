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

export const SERVER_PORT = getEnv("SERVER_PORT");
export const PROXY_URL = getEnv("PROXY_URL");

export const SESSION_KEY1 = getEnv("SESSION_KEY1");
export const SESSION_KEY2 = getEnv("SESSION_KEY2");

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const probot1 = {
  NAME: getEnv("GH_APP1_NAME"),
  APP_ID: getEnv("GH_APP1_ID"),
  GITHUB_CLIENT_ID: getEnv("GH_APP1_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnv("GH_APP1_CLIENT_SECRET"),
  PRIVATE_KEY: getEnv("GH_APP1_PRIVATE_KEY"),
  WEBHOOK_PATH: getEnv("GH_APP1_WEBHOOK_PATH"),
  WEBHOOK_SECRET: getEnv("GH_APP1_WEBHOOK_SECRET"),
  WEBHOOK_PROXY_URL: getEnv("GH_APP1_WEBHOOK_PROXY_URL"),
};

export const probot2 = {
  NAME: getEnv("GH_APP2_NAME"),
  APP_ID: getEnv("GH_APP2_ID"),
  GITHUB_CLIENT_ID: getEnv("GH_APP2_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnv("GH_APP2_CLIENT_SECRET"),
  PRIVATE_KEY: getEnv("GH_APP2_PRIVATE_KEY"),
  WEBHOOK_PATH: getEnv("GH_APP2_WEBHOOK_PATH"),
  WEBHOOK_SECRET: getEnv("GH_APP2_WEBHOOK_SECRET"),
  WEBHOOK_PROXY_URL: getEnv("GH_APP2_WEBHOOK_PROXY_URL"),
};

export const bots = {
  root: probot1,
  amber: probot2,
};
