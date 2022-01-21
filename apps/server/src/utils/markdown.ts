import path from "path";
import { promises as fs } from "fs";

export async function getMarkdown(relativePath: string) {
  const resolvePath = path.resolve(
    process.cwd(),
    "../../courses/js2-coworkers/docs",
    relativePath
  );
  return await fs.readFile(resolvePath, { encoding: "utf-8" });
}
