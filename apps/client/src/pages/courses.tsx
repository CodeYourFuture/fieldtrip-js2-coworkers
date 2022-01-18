import type { FC } from "react";
import type { RouteComponentProps } from "@reach/router";
import { Router } from "@reach/router";
import { useMst } from "src/store";
import { Course, NotFound } from "src/pages";

export const Courses: FC<RouteComponentProps> = () => {
  const { courseList } = useMst();
  return (
    <Router>
      {courseList.map((course) => (
        <Course key={course.id} path={`${course.id}/*`} course={course} />
      ))}
      <NotFound default />
    </Router>
  );
};
