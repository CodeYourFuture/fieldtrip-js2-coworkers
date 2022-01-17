#!/usr/bin/env node
// @ts-check

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
  .command(
    "build",
    "Compile a course",
    (yargs) =>
      yargs
        .option("in", {
          alias: "i",
          type: "string",
          default: "config",
          description: "The source file or directory",
        })
        .option("out", {
          alias: "o",
          type: "string",
          default: "dist",
          description: "The target file or directory",
        })
        .option("watch", {
          alias: "w",
          type: "boolean",
          description: "Watch the source folder for changes",
        }),

    (argv) => {
      require("./build")(argv).catch(console.log);
    }
  )
  .parse();
