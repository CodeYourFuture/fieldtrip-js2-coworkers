import { Button, H1, H4, Markdown } from "src/components/library";
import githubIcon from "src/assets/github.svg";
import type { ICourse } from "src/models";
import type { FC } from "react";

type Props = {
  course: ICourse;
  authenticated: boolean;
};
export const CourseHero: FC<Props> = ({ course, authenticated }) => (
  <div className="space-y-6">
    <div>
      <H4 className="mb-1.5">{course.module} Module Project</H4>
      <H1>{course.title}</H1>
    </div>
    {authenticated ? (
      course.enrolled ? (
        <Button variant="outline" disabled>
          Course started
        </Button>
      ) : (
        <Button onClick={course.enroll}>Start Project</Button>
      )
    ) : (
      <Button onClick={() => (window.location.href = "/auth/login")}>
        <img
          src={githubIcon}
          alt="Github mark"
          className="inline-block w-4 mr-2 mb-0.5 color-white"
        />
        Sign in to enroll
      </Button>
    )}
    <div className="w-2/3 text-slate-500">
      <Markdown>{course.summary}</Markdown>
    </div>
  </div>
);
