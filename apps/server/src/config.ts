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

export const HOST = getEnv("HOST");
export const PORT = getEnv("PORT");

export const SESSION_KEY1 = getEnv("SESSION_KEY1");
export const SESSION_KEY2 = getEnv("SESSION_KEY2");

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const createBotConfig = (i: number) => ({
  NAME: getEnv(`GH_APP${i}_NAME`),
  APP_ID: getEnv(`GH_APP${i}_ID`),
  GITHUB_CLIENT_ID: getEnv(`GH_APP${i}_CLIENT_ID`),
  GITHUB_CLIENT_SECRET: getEnv(`GH_APP${i}_CLIENT_SECRET`),
  PRIVATE_KEY: getEnv(`GH_APP${i}_PRIVATE_KEY`),
  WEBHOOK_PATH: getEnv(`GH_APP${i}_WEBHOOK_PATH`),
  WEBHOOK_SECRET: getEnv(`GH_APP${i}_WEBHOOK_SECRET`),
  WEBHOOK_PROXY_URL: getEnv(`GH_APP${i}_WEBHOOK_PROXY_URL`),
});

export const bots = {
  root: createBotConfig(1),
  amber: createBotConfig(2),
  malachi: createBotConfig(3),
  uma: createBotConfig(4),
};

export type BotConfig = ReturnType<typeof createBotConfig>;
