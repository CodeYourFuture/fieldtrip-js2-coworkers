import type {
  CourseConfig,
  CourseStage,
  CourseAction,
  CourseMilestone,
  ActionTrigger,
  StoreData,
} from "../types";
import { getMarkdown } from ".";
import { HOST } from "../config";

export class Course {
  config: CourseConfig;
  store: StoreData | null;

  constructor(config: CourseConfig, store: StoreData | null = null) {
    this.config = config;
    this.store = store;
  }

  async compile(): Promise<CourseConfig> {
    const meta = await this.compileMeta();
    if (this.store?.enrollment) {
      const courseAuthed = new CourseAuthed(this.config, this.store);
      const stages = await Promise.all(
        this.config.stages.map(courseAuthed.compileStage)
      );
      return { ...meta, stages, enrollment: this.store.enrollment };
    }
    return meta;
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
        ? stage.summary(this.store)
        : stage.summary;
    const summary = await getMarkdown(summaryPath);
    return { ...stage, summary, actions: [], milestones: [] };
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
      .filter(CourseAuthed.isTrigger);
  };
}

class CourseAuthed extends Course {
  config: CourseConfig;
  store: StoreData;

  constructor(config: CourseConfig, meta: StoreData) {
    super(config, meta);
    this.config = config;
    this.store = meta;
  }

  compileStage = async (stage: CourseStage): Promise<CourseStage> => {
    const meta = await this.compileStageMeta(stage);
    const actions = await Promise.all(
      (stage.actions || []).map(this.compileAction)
    );
    const milestones = await Promise.all(
      (stage.milestones || []).map(this.compileMilestone)
    );
    return { ...meta, actions, milestones };
  };

  compileMilestone = async (
    milestone: CourseMilestone
  ): Promise<CourseMilestone> => {
    let passed;
    if (typeof milestone.passed === "function") {
      passed = await milestone.passed(this.store);
    } else if (typeof milestone.passed === "boolean") {
      passed = milestone.passed;
    } else {
      passed = this.wasTriggered(milestone.id);
    }

    return { ...milestone, passed };
  };

  compileAction = async (action: CourseAction): Promise<CourseAction> => {
    const { passed } = await this.compileMilestone(action);

    let url =
      typeof action.url === "function"
        ? await action.url(this.store)
        : action.url;

    if (url.startsWith("/auth")) {
      url = HOST + url;
    }

    return { ...action, url, passed };
  };

  private wasTriggered = (id: string) => {
    return this.store.triggers.includes(id) || false;
  };
}
