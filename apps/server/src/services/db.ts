import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import DatabaseSchema, { Enrollments } from "../types/generated";
import { DATABASE_SCHEMA, DATABASE_URL } from "../config";
import { emitter } from "../emitter";

const db = createConnectionPool({
  connectionString: DATABASE_URL,
  schema: DATABASE_SCHEMA || "public",
  onQueryResults: (_, { text }, results) => {
    if (text.startsWith("SELECT")) return;
    if (!isEnrollment(results[0])) return;
    const [result] = results;
    const key = `${result.username}:enrollment:updated`;
    emitter.emit(key, result);
  },
});

const { enrollments } = tables<DatabaseSchema>({
  databaseSchema: require("../types/generated/schema.json"),
});

export { sql, db, enrollments };

const isEnrollment = (result: any): result is Enrollments =>
  typeof result === "object" &&
  result.hasOwnProperty("course_id") &&
  result.hasOwnProperty("username");
