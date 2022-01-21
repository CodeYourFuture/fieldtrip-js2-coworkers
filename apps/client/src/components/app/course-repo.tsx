import type { ICourseEnrollment } from "src/models";
import { Button, Link } from "src/components/library";

type Props = {
  onDelete: (...args: any) => any;
  enrollment: ICourseEnrollment;
};

export const CourseRepo = ({ onDelete, enrollment }: Props) => (
  <div className="p-5 space-y-3 rounded bg-slate-50">
    <div className="text-sm font-semibold text-gray-500">
      Project Repository
    </div>
    <Link to={enrollment.repoUrl} className="block text-sm" target="_blank">
      {enrollment.repoUrl.replace("https://github.com/", "")}
    </Link>
    <Button
      size="sm"
      variant="outline"
      className="text-red-500"
      onClick={() => onDelete()}
    >
      Delete repository
    </Button>
  </div>
);
