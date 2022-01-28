import type {
  CourseConfig,
  CourseStage,
  CourseAction,
  CourseMilestone,
  CourseHook,
  EventAssertion,
  StoreData,
} from "../types";
import { getMarkdown } from ".";
import { HOST } from "../config";

const notNull = (value: any): value is NonNullable<typeof value> =>
  value !== null && value !== undefined;

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

  private static toHook = (
    hook: CourseHook | CourseMilestone | CourseAction
  ): { id: string; hook: EventAssertion } | null => {
    const hookHandler = "hook" in hook ? hook.hook : hook.passed;
    if (typeof hookHandler === "object") {
      return { id: hook.id, hook: hookHandler };
    }
    return null;
  };

  static getHooks = (course: CourseConfig): CourseHook[] => {
    return course.stages
      .flatMap((stage) => [
        ...(stage.actions || []),
        ...(stage.milestones || []),
        ...(stage.hooks || []),
      ])
      .map(CourseAuthed.toHook)
      .filter(notNull);
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
      try {
        passed = await milestone.passed(this.store);
      } catch {
        // @todo handle null
        passed = false;
      }
    } else if (typeof milestone.passed === "boolean") {
      passed = milestone.passed;
    } else {
      passed = this.wasTriggered(milestone.id);
    }

    return { ...milestone, passed };
  };

  compileAction = async (action: CourseAction): Promise<CourseAction> => {
    const { passed } = await this.compileMilestone(action);

    let url;
    if (typeof action.url === "function") {
      try {
        url = await action.url(this.store);
      } catch {
        // @todo handle null
        url = "";
      }
    } else {
      url = action.url;
    }

    if (url.startsWith("/auth")) {
      url = HOST + url;
    }

    return { ...action, url, passed };
  };

  private wasTriggered = (id: string) => {
    return this.store.passed.includes(id) || false;
  };
}
