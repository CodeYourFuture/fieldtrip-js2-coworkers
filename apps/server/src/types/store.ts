import type { Bots } from ".";

export type StoreData = {
  courseId: string;
  enrollment: {
    username: string;
    repoUrl: string;
  };
  passed: string[];
  installedBots: Bots[];
  // @todo provide generic function for creating course configs
  // to type hook results
  hooks: Record<string, any>;
};
