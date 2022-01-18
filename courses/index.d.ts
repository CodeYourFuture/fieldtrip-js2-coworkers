export type CourseConfig = {
  id: string;
  title: string;
  module: string;
  summary: string;
  stages: Stage[];
};

export type Stage = {
  key: string;
  label: string;
  summary: string;
};

declare const index: CourseConfig[];

export default index;
