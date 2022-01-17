import { getUserOctokit } from "../util";

type User = {
  octokit: ReturnType<typeof getUserOctokit>;
  [key: string]: any;
};

declare global {
  namespace Express {
    interface Request {
      locals: {
        user: User | null;
      };
    }
  }
}
