import { PgTaskQ } from "@djgrant/pg-taskq";
import * as config from "../config";

export const taskq = new PgTaskQ({
  db: { connectionString: config.DATABASE_URL },
  schema: config.DATABASE_SCHEMA,
  logLevel: "debug",
  processQueueEvery: 500,
  concurrency: 8,
  maxAttempts: 4,
  backoffDelay: "30 seconds",
  backoffDecay: "exponential",
  timeout: "1 minute",
  dependencies: async () => ({}),
});
