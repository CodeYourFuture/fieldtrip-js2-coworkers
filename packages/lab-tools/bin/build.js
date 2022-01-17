// @ts-check
const path = require("path");
const { promises: fs } = require("fs");
const { compile } = require("../dist");

const resolvePath = (relativePath) => path.resolve(process.cwd(), relativePath);

/** @type {(argv: import('yargs').Arguments<{ in: string; out: string; watch?: boolean }>) => Promise<void>} */
module.exports = async function build(argv) {
  const config = require(path.resolve(process.cwd(), argv.in));
  const compiledConfig = await compile(config);
  await fs.mkdir(resolvePath("./dist"), { recursive: true });
  await fs.writeFile(resolvePath("dist/index.js"), compiledConfig);
  await fs.writeFile(resolvePath("dist/index.d.ts"), declarationFile);
};

const declarationFile = `
import type { CourseConfig } from "@packages/lab-tools";
declare const _default: CourseConfig;
export default _default;
`;
