import type {
  CourseConfig,
  CourseStage,
  CourseAction,
  CourseMilestone,
  CourseHook,
  EventAssertion,
} from "../types";
import { getFile } from "../utils";
import { HOST } from "../config";
import { Enrollments } from "../types";

const notNull = (value: any): value is NonNullable<typeof value> =>
  value !== null && value !== undefined;

export class Course {
  config: CourseConfig;
  state: Enrollments | null;

  constructor(config: CourseConfig, state: Enrollments | null = null) {
    this.config = config;
    this.state = state;
  }

  async compile(): Promise<CourseConfig> {
    const meta = await this.compileMeta();
    if (this.state) {
      const courseAuthed = new CourseAuthed(this.config, this.state);
      const stages = await Promise.all(
        this.config.stages.map(courseAuthed.compileStage)
      );
      return {
        ...meta,
        stages,
        enrollment: {
          repoUrl: this.state.repo_url,
        },
      };
    }
    return meta;
  }

  compileMeta = async (): Promise<CourseConfig> => {
    const summary = await getFile(this.config.summary);
    const stages = await Promise.all(
      this.config.stages.map(this.compileStageMeta)
    );

    return { ...this.config, summary, stages };
  };

  compileStageMeta = async (stage: CourseStage): Promise<CourseStage> => {
    const summaryPath =
      typeof stage.summary === "function"
        ? stage.summary(this.state)
        : stage.summary;
    const summary = await getFile(summaryPath);
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
  state: Enrollments;

  constructor(config: CourseConfig, state: Enrollments) {
    super(config, state);
    this.config = config;
    this.state = state;
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
        passed = await milestone.passed(this.state);
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
        url = await action.url(this.state);
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
    return this.state.milestones.includes(id) || false;
  };
}
