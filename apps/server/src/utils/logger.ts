/**
 * Extracted from https://github.com/probot/probot/blob/master/src/helpers/get-log.ts
 *
 */

import pino from "pino";
import { getTransformStream } from "@probot/pino";
import type { Logger, LoggerOptions } from "pino";
import type { Options, LogLevel } from "@probot/pino";

export type GetLogOptions = {
  level?: LogLevel;
  logMessageKey?: string;
} & Options;

export function getLog(options: GetLogOptions = {}): Logger {
  const { level, logMessageKey, ...getTransformStreamOptions } = options;

  const pinoOptions: LoggerOptions = {
    level: level || "info",
    name: "probot",
    messageKey: logMessageKey || "msg",
  };
  const transform = getTransformStream(getTransformStreamOptions);
  // @ts-ignore TODO: check out what's wrong here
  transform.pipe(pino.destination(1));
  const log = pino(pinoOptions, transform);

  return log;
}
