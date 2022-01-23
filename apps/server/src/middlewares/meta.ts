import { RequestHandler } from "express";
import { metadata } from "../utils/metadata";

export const meta: RequestHandler = async (req, res, next) => {
  const { bots, user, repo } = req.locals;
  if (!bots.root || !user) return next();

  try {
    const kv = await metadata(bots.root.octokit, {
      issue_number: 1,
      owner: user.login,
      repo,
    });
    req.locals.meta = await kv.get();
  } catch {}

  next();
};
