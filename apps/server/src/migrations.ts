import { sql } from "@databases/pg";
import { DATABASE_SCHEMA } from "./config";

/**
 * Simple no-nonsense migrations
 * These run on startup so MUST be idempotent and non-destructive!!
 * Please don't delete prod data!
 */
export const migrations = [
  sql`
    create schema if not exists ${sql.ident(DATABASE_SCHEMA)};
    create table if not exists ${sql.ident(DATABASE_SCHEMA)}.enrollments (
      username text not null,
      course_id text not null,
      repo_url text not null,
      bots jsonb not null default '[]'::jsonb,
      milestones jsonb not null default '[]'::jsonb,
      hooks jsonb not null default '{}'::jsonb,
      primary key(username, course_id)
    );
  `,
];
