import path from "path";
import { promises as fs } from "fs";
import type { CourseConfig } from "./types";

export async function compile(config: CourseConfig): Promise<string> {
  const summary = await getMarkdown(config.summary);
  const stages = await Promise.all(
    config.stages.map(async (stage) => ({
      ...stage,
      summary: await getMarkdown(stage.summary),
    }))
  );
  const configWithInlineMarkdown = { ...config, summary, stages };
  return `module.exports = ${JSON.stringify(configWithInlineMarkdown)}`;
}

async function getMarkdown(relativePath: string) {
  const resolvePath = path.resolve(process.cwd(), relativePath);
  return await fs.readFile(resolvePath, { encoding: "utf-8" });
}
