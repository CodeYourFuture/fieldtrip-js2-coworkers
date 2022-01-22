import type {
  AuthenticatedLocals,
  CourseConfig,
  CourseStage,
  CourseAction,
  Locals,
} from "../types";
import { getMarkdown } from ".";

export async function compileCourse(
  config: CourseConfig,
  locals: AuthenticatedLocals
): Promise<CourseConfig> {
  const meta = await compileCourseMeta(config, locals);
  const stages = await Promise.all(
    config.stages.map((stage) => compileStage.bind(locals)(stage))
  );
  return { ...meta, stages };
}

export async function compileCourseMeta(
  config: CourseConfig,
  locals: Locals
): Promise<CourseConfig> {
  const summary = await getMarkdown(config.summary);
  const stages = await Promise.all(
    config.stages.map(compileStageMeta.bind(locals))
  );

  return { ...config, summary, stages };
}

async function compileStageMeta(
  this: Locals,
  stage: CourseStage
): Promise<CourseStage> {
  const summaryPath =
    typeof stage.summary === "function" ? stage.summary(this) : stage.summary;
  const summary = await getMarkdown(summaryPath);
  return { ...stage, summary, actions: [] };
}

async function compileStage(
  this: AuthenticatedLocals,
  stage: CourseStage
): Promise<CourseStage> {
  const meta = await compileStageMeta.apply(this, [stage]);
  const actions = await Promise.all(
    stage.actions.map(compileAction.bind(this))
  );
  return { ...meta, actions };
}

async function compileAction(
  this: AuthenticatedLocals,
  action: CourseAction
): Promise<CourseAction> {
  const passed =
    typeof action.passed === "function"
      ? Boolean(await action.passed(this))
      : action.passed;
  const url =
    typeof action.url === "function" ? await action.url(this) : action.url;
  return { ...action, url, passed };
}
