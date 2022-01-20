import path from "path";
import { promises as fs } from "fs";
import type { AuthenticatedLocals, CourseConfig } from "../types";

export async function compileCourse(
  config: CourseConfig,
  locals: AuthenticatedLocals
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
  this: AuthenticatedLocals | void,
  stage: CourseConfig["stages"][number],
  includeActions: boolean = true
): Promise<CourseConfig["stages"][number]> {
  const summary = await getMarkdown(stage.summary);
  const actions = includeActions
    ? await Promise.all(
        stage.actions.map(compileAction.bind(this as AuthenticatedLocals))
      )
    : [];
  return { ...stage, summary, actions };
}

async function compileAction(
  this: AuthenticatedLocals,
  action: CourseConfig["stages"][number]["actions"][number]
): Promise<CourseConfig["stages"][number]["actions"][number]> {
  const passed =
    typeof action.passed === "function"
      ? Boolean(await action.passed(this))
      : action.passed;
  const url =
    typeof action.url === "function" ? await action.url(this) : action.url;
  return { ...action, url, passed };
}

async function getMarkdown(relativePath: string) {
  const resolvePath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers/docs",
    relativePath
  );
  return await fs.readFile(resolvePath, { encoding: "utf-8" });
}
