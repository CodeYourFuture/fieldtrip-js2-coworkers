import path from "path";
import { promises as fs } from "fs";
import type { Locals, CourseConfig } from "../types";

export async function compileCourse(
  config: CourseConfig,
  locals: Locals
): Promise<CourseConfig> {
  const meta = await compileCourseMeta(config);
  const stages = await Promise.all(
    config.stages.map((stage) => compileStage.bind(locals)(stage))
  );
  return { ...meta, stages };
}

export async function compileCourseMeta(
  config: CourseConfig
): Promise<CourseConfig> {
  const summary = await getMarkdown(config.summary);
  const stages = await Promise.all(
    config.stages.map((stage) => compileStage(stage, false))
  );

  return { ...config, summary, stages };
}

async function compileStage(
  this: Locals | void,
  stage: CourseConfig["stages"][number],
  includeActions: boolean = true
): Promise<CourseConfig["stages"][number]> {
  const summary = await getMarkdown(stage.summary);
  const actions = includeActions
    ? await Promise.all(stage.actions.map(compileAction.bind(this as Locals)))
    : [];
  return { ...stage, summary, actions };
}

async function compileAction(
  this: Locals,
  action: CourseConfig["stages"][number]["actions"][number]
): Promise<CourseConfig["stages"][number]["actions"][number]> {
  const { passed } = action;
  const passedResult =
    typeof passed === "function" ? Boolean(await passed(this)) : passed;
  return { ...action, passed: passedResult };
}

async function getMarkdown(relativePath: string) {
  const resolvePath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers/docs",
    relativePath
  );
  return await fs.readFile(resolvePath, { encoding: "utf-8" });
}
