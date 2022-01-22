import { Markdown, Tab, Tabs, TabPage } from "src/components/library";
import { CourseActions } from ".";

import type { ICourseStage } from "src/models";

type Props = {
  enrolled: boolean;
  stages: ICourseStage[];
};

export const CourseStages = ({ stages, enrolled }: Props) => (
  <div>
    <div className="relative mb-7">
      <div className="absolute bottom-0 w-full h-1 border-b -z-10"></div>
      <Tabs>
        {stages.map((stage, i) => (
          <Tab key={stage.key} to={stage.key} default={i === 0}>
            {stage.label}
          </Tab>
        ))}
      </Tabs>
    </div>
    {stages.map((stage) => (
      <TabPage key={stage.key} match={stage.key}>
        <div className="space-y-8">
          <Markdown>{stage.summary}</Markdown>
          {stage.actions.length > 0 && enrolled && (
            <CourseActions stage={stage} />
          )}
        </div>
      </TabPage>
    ))}
  </div>
);
