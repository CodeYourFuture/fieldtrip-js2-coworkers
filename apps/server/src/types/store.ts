import type { Bots } from ".";

export type StoreData = {
  courseId: string;
  enrollment: {
    username: string;
    repoUrl: string;
  };
  triggers: string[];
  installedBots: (keyof Bots)[];
  projectId?: string;
  projectColumns?: { id: number; name: string }[];
};
