import type { FC } from "react";
import type { RouteComponentProps } from "@reach/router";
import { AppLayout } from "src/components/templates";
import {
  H1,
  H4,
  Container,
  Button,
  Input,
  Tab,
  Tabs,
} from "src/components/library";
import { Summary, Week1 } from "src/content/js2";

export const Home: FC<RouteComponentProps> = () => {
  return (
    <AppLayout>
      <section className="mb-8 bg-slate-50">
        <Container className="py-8 space-y-6">
          <div>
            <H4>JS2 Module Project</H4>
            <H1>Co-worker discovery tools</H1>
          </div>
          <Button>Start Project</Button>
          <p className="w-2/3 text-slate-500">
            <Summary />
          </p>
        </Container>
      </section>
      <Container>
        <section>
          <div className="mb-6">
            <Tabs>
              <Tab to="week-1" default>
                Week 1
              </Tab>
              <Tab to="week-2">Week 2</Tab>
              <Tab to="week-3">Week 3</Tab>
            </Tabs>
          </div>
          <div className="w-4/5">
            <Week1 />
            <div className="mb-3">
              <Input type="checkbox" />
              Review project brief
            </div>
          </div>
        </section>
      </Container>
    </AppLayout>
  );
};
