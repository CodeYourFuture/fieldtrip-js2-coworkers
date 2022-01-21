import type { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { observer } from "mobx-react-lite";
import { AppLayout } from "src/components/templates";
import { Container } from "src/components/library";
import { CourseHero, CourseStages, CourseRepo } from "src/components/app";
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
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2">
              <CourseStages
                stages={course.stages}
                enrolled={Boolean(course.enrollment)}
              />
            </div>
            <div className="col-span-1 pt-4">
              {course.enrollment && (
                <CourseRepo
                  onDelete={course.delete}
                  enrollment={course.enrollment}
                />
              )}
            </div>
          </div>
        </section>
      </Container>
    </AppLayout>
  );
});
