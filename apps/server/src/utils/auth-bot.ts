import type { Probot } from "probot";

export const getInstallationId = async (bot: Probot, username: string) => {
  const semiAuthedBot = await bot.auth();
  const res = await semiAuthedBot.request(
    "GET /users/{username}/installation",
    { username }
  );
  return res.data.id;
};
