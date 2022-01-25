import type {
  AuthenticatedLocals,
  CourseConfig,
  CourseStage,
  CourseAction,
  CourseMilestone,
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
    return { ...stage, summary, actions: [], milestones: [] };
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
    const actions = await Promise.all(
      (stage.actions || []).map(this.compileAction)
    );
    const milestones = await Promise.all(
      (stage.milestones || []).map(this.compileMiestone)
    );
    return { ...meta, actions, milestones };
  };

  compileMiestone = async (
    milestone: CourseMilestone
  ): Promise<CourseMilestone> => {
    if (!Course.isAuthed(this.locals)) {
      throw new Error("Cannot compile milestone. User is not authenticated");
    }

    let passed;
    if (typeof milestone.passed === "function") {
      passed = await milestone.passed(this.locals);
    } else if (typeof milestone.passed === "boolean") {
      passed = milestone.passed;
    } else {
      passed = this.wasTriggered(milestone.id);
    }

    return { ...milestone, passed };
  };

  compileAction = async (action: CourseAction): Promise<CourseAction> => {
    if (!Course.isAuthed(this.locals)) {
      throw new Error("Cannot compile milestone. User is not authenticated");
    }

    const { passed } = await this.compileMiestone(action);

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
    action: CourseMilestone
  ): action is CourseMilestone & { passed: ActionTrigger } => {
    return typeof action.passed === "object";
  };

  static getTriggers = (
    course: CourseConfig
  ): (CourseMilestone & { passed: ActionTrigger })[] => {
    return course.stages
      .flatMap((stage) => [
        ...(stage.actions || []),
        ...(stage.milestones || []),
      ])
      .filter(Course.isTrigger);
  };
}
