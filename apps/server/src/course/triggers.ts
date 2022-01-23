import { CourseAction } from "@packages/courses/types";

export const triggers: CourseAction["passed"] = {
  "issues.closed": (event) => event.issue.number === 1,
};
