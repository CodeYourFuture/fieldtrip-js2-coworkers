import { Button, H4, Markdown } from "src/components/library";
import { observer } from "mobx-react-lite";
import * as config from "src/config";
import type { FC } from "react";
import type { ICourse } from "src/models";

type Props = {
  stage: ICourse["stages"][number];
};

export const CourseActions: FC<Props> = observer(({ stage }) => (
  <div className="border">
    <div className="px-4 py-3 bg-slate-50">
      <H4>Onboarding steps</H4>
    </div>
    {stage.actionsWithUnlocked.map((action, i) => (
      <div key={i} className="relative px-4 py-3 border-t">
        {!action.unlocked && (
          <div className="absolute inset-0 bg-white opacity-50"></div>
        )}
        <span className="mr-3 text-lg font-medium text-gray-400">
          {String(i + 1)}
        </span>
        <Markdown prose={false}>{action.label}</Markdown>
        {action.unlocked &&
          (action.passed ? (
            <span className="float-right mr-1.5 mt-1 text-sm text-emerald-500">
              Done
            </span>
          ) : action.url !== "" ? (
            <Button
              size="sm"
              className="float-right bg-emerald-500"
              onClick={() => {
                if (
                  action.url.startsWith("http") &&
                  !action.url.startsWith(config.SERVER_URL!)
                ) {
                  window.open(action.url, "_blank");
                } else {
                  window.location.href = action.url;
                }
              }}
            >
              Start
            </Button>
          ) : (
            <span className="float-right text-gray-300">Loading...</span>
          ))}
      </div>
    ))}
  </div>
));
