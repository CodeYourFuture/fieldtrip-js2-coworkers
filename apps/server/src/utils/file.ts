import path from "path";
import qs from "qs";
import { promises as fs } from "fs";

export async function getFile(
  relativePath: string,
  props?: Record<string, string>
) {
  const [relativeFilePath, query] = relativePath.split("?");
  const queryProps = qs.parse(query);

  const allProps = { ...props, ...queryProps } as typeof queryProps &
    typeof props;

  const absPath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers/docs",
    relativeFilePath
  );

  const content = await fs.readFile(absPath, { encoding: "utf-8" });

  if (!Object.keys(allProps).length) return content;

  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    if (key in allProps) {
      return allProps[key as keyof typeof allProps];
    }
    return "";
  });
}
