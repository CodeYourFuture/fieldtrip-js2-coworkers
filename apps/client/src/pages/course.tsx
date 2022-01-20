import type { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { observer } from "mobx-react-lite";
import { AppLayout } from "src/components/templates";
import {
  Container,
  Markdown,
  Tab,
  Tabs,
  TabPage,
} from "src/components/library";
import { CourseHero, CourseStage } from "src/components/app";
import { useMst } from "src/store";
import { Announcement } from "src/components/app";

interface Props extends RouteComponentProps {
  id?: string;
}

export const Course: FC<Props> = observer(({ id }) => {
  const { user, courses } = useMst();
  const course = courses.get(id!);
  if (!course) return <Announcement message="Loading course...." />;
  return (
    <AppLayout>
      <section className="mb-8 bg-slate-50">
        <Container className="py-8">
          <CourseHero course={course} authenticated={Boolean(user)} />
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
          <div className="w-2/3">
            {course.stages.map((stage) => (
              <TabPage key={stage.key} match={stage.key}>
                {Boolean(stage.actions.length) && course.enrolled && (
                  <CourseStage stage={stage} />
                )}
                <Markdown>
                  {"### Course description\n".concat(stage.summary)}
                </Markdown>
              </TabPage>
            ))}
          </div>
        </section>
      </Container>
    </AppLayout>
  );
});
