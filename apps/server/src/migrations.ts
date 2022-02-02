import { sql } from "@databases/pg";
import { DATABASE_SCHEMA } from "./config";

/**
 * Simple no-nonsense migrations
 * These run on startup so MUST be replayable and non-destructive!!
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
  sql`
    create table if not exists ${sql.ident(DATABASE_SCHEMA)}.events (
      trigger_id text not null,
      username text not null,
      course_id text not null,
      payload jsonb not null,
      event_name text not null,
      bot_name text not null,
      installation_id integer not null,
      primary key (trigger_id, username, course_id)
    );
  `,
  sql`
    -- Ordered queue – tasks are executed in sequential order by priority
    create or replace function taskq_extension_on_success () returns trigger as $$
    declare
      next_priority integer;
      current_priority_still_running boolean;
    begin
      select true 
      into current_priority_still_running
      from ${sql.ident(DATABASE_SCHEMA)}.tasks
      where status != 'success'
      and name = new.name
      and priority = new.priority;
      if (current_priority_still_running = true) then
        return new;
      end if;
      next_priority := new.priority + 1;	
      update tasks
      set status = 'pending'
      where name = new.name
      and status = 'sequenced'
      and priority <= next_priority;
      return new;
    end
    $$ language plpgsql volatile;

    create or replace function taskq_extension_on_added () returns trigger as $$
    declare
      current_priority integer;
      next_priority integer;
    begin
      select priority 
      into current_priority
      from ${sql.ident(DATABASE_SCHEMA)}.tasks
      where status = 'success'
      and name = new.name
      order by priority desc
      limit 1;
      next_priority := coalesce(current_priority, -1) + 1;
      if new.priority <= next_priority then 
        new.status = 'pending';
      end if;
      return new;
    end
    $$ language plpgsql volatile;

    drop trigger if exists taskq_extension_task_added 
    on ${sql.ident(DATABASE_SCHEMA)}.tasks;

    create trigger taskq_extension_task_added 
    before insert on ${sql.ident(DATABASE_SCHEMA)}.tasks
    for each row when (new.status = 'sequenced')
    execute procedure taskq_extension_on_added();

    drop trigger if exists taskq_extension_task_status_success 
    on ${sql.ident(DATABASE_SCHEMA)}.tasks;
    
    create trigger taskq_extension_task_status_success
    after update on ${sql.ident(DATABASE_SCHEMA)}.tasks
    for each row when (new.status = 'success')
    execute procedure taskq_extension_on_success();
  `,
];
