import type { FC } from "react";
import type { RouteComponentProps } from "@reach/router";
import type { ModuleConfig } from "@packages/course-utils";
import { AppLayout } from "src/components/templates";
import {
  H1,
  H4,
  Container,
  Button,
  Tab,
  Tabs,
  TabPage,
} from "src/components/library";

type Props = { config: ModuleConfig };

export const ModuleHome: FC<RouteComponentProps & Props> = ({ config }) => {
  return (
    <AppLayout>
      <section className="mb-8 bg-slate-50">
        <Container className="py-8 space-y-6">
          <div>
            <H4>{config.module} Module Project</H4>
            <H1>{config.title}</H1>
          </div>
          <Button>Start Project</Button>
          <div className="w-2/3 text-slate-500">{config.summary}</div>
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
                {stage.summary}
              </TabPage>
            ))}
          </div>
        </section>
      </Container>
    </AppLayout>
  );
};
