import path from "path";
import { promises as fs } from "fs";
import { getUser } from "./octokit";
import type { Context } from "./octokit";

export async function getMarkdown(relativePath: string, props: any = {}) {
  const resolvePath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers/docs",
    relativePath
  );
  const content = await fs.readFile(resolvePath, { encoding: "utf-8" });
  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => props[key]);
}

export const getMarkdownOptions = (context: Context) => ({
  user: `@${getUser(context).login}`,
});
