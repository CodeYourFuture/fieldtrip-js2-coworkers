/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: f8llL41QuhkPNgpc2/NvZHYx33kAgo8QkTRbrhQX7gqa017bpYjZOvMFWTB0sAcgBvUmMcLWH3hVY4x82Q6WXA==
 */

/* eslint-disable */
// tslint:disable

interface Tasks {
  /**
   * @default 0
   */
  attempts: number
  /**
   * @default '{}'::jsonb
   */
  context: any
  /**
   * @default now()
   */
  execute_at: Date
  /**
   * @default nextval('tasks_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'tasks_id'}
  /**
   * @default false
   */
  locked: boolean
  name: string
  /**
   * @default '{}'::jsonb
   */
  params: any
  parent_id: (number) | null
  /**
   * @default 0
   */
  priority: number
  status: string
}
export default Tasks;

interface Tasks_InsertParameters {
  /**
   * @default 0
   */
  attempts?: number
  /**
   * @default '{}'::jsonb
   */
  context?: any
  /**
   * @default now()
   */
  execute_at?: Date
  /**
   * @default nextval('tasks_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'tasks_id'}
  /**
   * @default false
   */
  locked?: boolean
  name: string
  /**
   * @default '{}'::jsonb
   */
  params?: any
  parent_id?: (number) | null
  /**
   * @default 0
   */
  priority?: number
  status: string
}
export type {Tasks_InsertParameters}