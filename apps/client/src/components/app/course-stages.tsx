import { Markdown, Tab, Tabs, TabPage } from "src/components/library";
import { CourseStage } from ".";
import type { ICourseStage } from "src/models";

type Props = {
  enrolled: boolean;
  stages: ICourseStage[];
};

export const CourseStages = ({ stages, enrolled }: Props) => (
  <div>
    <div className="mb-4">
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
        {Boolean(stage.actions.length) && enrolled && (
          <CourseStage stage={stage} />
        )}
        <Markdown>{"### Course description\n".concat(stage.summary)}</Markdown>
      </TabPage>
    ))}
  </div>
);
