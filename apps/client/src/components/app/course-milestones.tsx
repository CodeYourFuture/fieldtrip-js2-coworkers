import { H4 } from "src/components/library";
import { observer } from "mobx-react-lite";
import type { FC } from "react";
import type { ICourse } from "src/models";

type Props = {
  stage: ICourse["stages"][number];
};

export const CourseMilestones: FC<Props> = observer(({ stage }) => (
  <div className="border">
    <div className="px-4 py-3 bg-slate-50">
      <H4>Milestones</H4>
    </div>
    {stage.milestonesWithUnlocked.map((action, i) => (
      <div key={i} className="relative px-4 py-3 border-t">
        {!action.unlocked && (
          <div className="absolute inset-0 bg-white opacity-50"></div>
        )}
        <span className="mr-3 text-lg font-medium text-gray-400">
          {String(i + 1)}
        </span>
        {action.label}
        {action.unlocked && action.passed && (
          <span className="float-right mr-1.5 mt-1 text-sm text-emerald-500">
            Done
          </span>
        )}
      </div>
    ))}
  </div>
));
