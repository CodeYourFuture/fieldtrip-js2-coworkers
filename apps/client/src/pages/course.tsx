import type { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { observer } from "mobx-react-lite";
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
import { ICourse } from "src/models";
import { useMst } from "src/store";
import githubIcon from "src/assets/github.svg";

type Props = { course: ICourse };

export const Course: FC<RouteComponentProps & Props> = observer(
  ({ course }) => {
    const { user } = useMst();
    return (
      <AppLayout>
        <section className="mb-8 bg-slate-50">
          <Container className="py-8 space-y-6">
            <div>
              <H4 className="mb-1.5">{course.module} Module Project</H4>
              <H1>{course.title}</H1>
            </div>
            {user ? (
              course.status?.active ? (
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
          </Container>
        </section>
        <Container>
          <section>
            <div className="mb-6">
              <Tabs>
                {course.stages.map((stage, i) => (
                  <Tab key={stage.key} to={stage.key} default={i === 0}>
                    {stage.label}
                  </Tab>
                ))}
              </Tabs>
            </div>
            <div className="w-4/5">
              {course.stages.map((stage) => (
                <TabPage key={stage.key} match={stage.key}>
                  <Markdown>{stage.summary}</Markdown>
                </TabPage>
              ))}
            </div>
          </section>
        </Container>
      </AppLayout>
    );
  }
);
