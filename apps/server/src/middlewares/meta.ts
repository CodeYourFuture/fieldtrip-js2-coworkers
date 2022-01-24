import { RequestHandler } from "express";
import { Metadata } from "../utils/metadata";

export const meta: RequestHandler = async (req, res, next) => {
  const { bots, user, repo } = req.locals;
  if (!bots.root || !user) return next();

  try {
    const metadataIssue = {
      issue_number: 1,
      owner: user.login,
      repo,
    };
    const metadata = new Metadata(bots.root.octokit, metadataIssue);
    req.locals.meta = await metadata.get();
  } catch {}

  next();
};
