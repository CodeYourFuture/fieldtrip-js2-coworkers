import type {
  AuthenticatedLocals,
  CourseConfig,
  CourseStage,
  CourseAction,
  ActionTrigger,
  Locals,
} from "../types";
import { getMarkdown } from ".";
import { HOST } from "../config";

class CourseMeta {
  config: CourseConfig;
  locals: Locals;

  constructor(config: CourseConfig, locals: Locals) {
    this.config = config;
    this.locals = locals;
  }

  compileMeta = async (): Promise<CourseConfig> => {
    const summary = await getMarkdown(this.config.summary);
    const stages = await Promise.all(
      this.config.stages.map(this.compileStageMeta)
    );

    return { ...this.config, summary, stages };
  };

  compileStageMeta = async (stage: CourseStage): Promise<CourseStage> => {
    const summaryPath =
      typeof stage.summary === "function"
        ? stage.summary(this.locals)
        : stage.summary;
    const summary = await getMarkdown(summaryPath);
    return { ...stage, summary, actions: [] };
  };
}

export class Course extends CourseMeta {
  config: CourseConfig;
  locals: Locals | AuthenticatedLocals;

  constructor(config: CourseConfig, locals: Locals | AuthenticatedLocals) {
    super(config, locals);
    this.config = config;
    this.locals = locals;
  }

  async compile(): Promise<CourseConfig> {
    const meta = await this.compileMeta();
    const stages = await Promise.all(this.config.stages.map(this.compileStage));
    return { ...meta, stages };
  }

  compileStage = async (stage: CourseStage): Promise<CourseStage> => {
    const meta = await this.compileStageMeta(stage);
    const actions = await Promise.all(stage.actions.map(this.compileAction));
    return { ...meta, actions };
  };

  compileAction = async (action: CourseAction): Promise<CourseAction> => {
    if (!Course.isAuthed(this.locals)) {
      throw new Error("Cannot compile action. User is not authenticated");
    }

    let passed;
    if (typeof action.passed === "function") {
      passed = await action.passed(this.locals);
    } else if (typeof action.passed === "boolean") {
      passed = action.passed;
    } else {
      passed = this.wasTriggered(action.id);
    }

    let url =
      typeof action.url === "function"
        ? await action.url(this.locals)
        : action.url;

    if (url.startsWith("/auth")) {
      url = HOST + url;
    }

    return { ...action, url, passed };
  };

  private static isAuthed(
    locals: Locals | AuthenticatedLocals
  ): locals is AuthenticatedLocals {
    return locals.user !== undefined;
  }

  private wasTriggered = (id: string) => {
    return this.locals.meta.triggers?.includes(id) || false;
  };

  private static isTrigger = (
    action: CourseAction
  ): action is CourseAction & { passed: ActionTrigger } => {
    return typeof action.passed === "object";
  };

  static getTriggers = (
    course: CourseConfig
  ): (CourseAction & { passed: ActionTrigger })[] => {
    return course.stages
      .flatMap((stage) => stage.actions)
      .filter(Course.isTrigger);
  };
}
