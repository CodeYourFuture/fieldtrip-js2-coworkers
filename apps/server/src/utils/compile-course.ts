import path from "path";
import { promises as fs } from "fs";
import type { CourseConfig } from "../types";

export async function compileCourse(
  config: CourseConfig
): Promise<CourseConfig> {
  const summary = await getMarkdown(config.summary);
  const stages = await Promise.all(
    config.stages.map(async (stage) => ({
      ...stage,
      summary: await getMarkdown(stage.summary),
    }))
  );
  return { ...config, summary, stages };
}

async function getMarkdown(relativePath: string) {
  const resolvePath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers",
    relativePath
  );
  return await fs.readFile(resolvePath, { encoding: "utf-8" });
}
