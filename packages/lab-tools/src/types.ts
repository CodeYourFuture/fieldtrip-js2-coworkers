export type CourseConfig = {
  title: string;
  module: string;
  summary: string;
  stages: ModuleStage[];
};

export type ModuleStage = {
  key: string;
  label: string;
  summary: string;
};
