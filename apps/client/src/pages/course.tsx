import type { FC } from "react";
import type { RouteComponentProps } from "@reach/router";
import type { CourseConfig } from "@packages/lab-tools";
import { AppLayout } from "src/components/templates";
import {
  Button,
  H1,
  H4,
  Container,
  Markdown,
  Tab,
  Tabs,
  TabPage,
} from "src/components/library";
import useFetch from "use-http";

type Props = { config: CourseConfig };

export const Course: FC<RouteComponentProps & Props> = ({ config }) => {
  const courseStatus = useFetch("/api/courses/js2-project-coworkers", []);
  const newCourse = useFetch("/api/courses/js2-project-coworkers", {
    method: "post",
  });
  const startCourse = () => newCourse.post();

  return (
    <AppLayout>
      <section className="mb-8 bg-slate-50">
        <Container className="py-8 space-y-6">
          <div>
            <H4>{config.module} Module Project</H4>
            <H1>{config.title}</H1>
          </div>
          {courseStatus.data &&
            (courseStatus.data?.active ? (
              "Course started"
            ) : (
              <Button onClick={startCourse}>Start Project</Button>
            ))}
          <div className="w-2/3 text-slate-500">
            <Markdown>{config.summary}</Markdown>
          </div>
        </Container>
      </section>
      <Container>
        <section>
          <div className="mb-6">
            <Tabs>
              {config.stages.map((stage, i) => (
                <Tab key={stage.key} to={stage.key} default={i === 0}>
                  {stage.label}
                </Tab>
              ))}
            </Tabs>
          </div>
          <div className="w-4/5">
            {config.stages.map((stage, i) => (
              <TabPage key={stage.key} match={stage.key}>
                <Markdown>{stage.summary}</Markdown>
              </TabPage>
            ))}
          </div>
        </section>
      </Container>
    </AppLayout>
  );
};
