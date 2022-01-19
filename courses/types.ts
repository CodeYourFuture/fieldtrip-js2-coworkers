/**
 * This is a bit awkward, but it's not possible to import directly from server
 * because to have server as a dependency would create a circular dependency between it and courses.
 * Ultimately, we probably do want to export types from the server and have it as a dependency of courses.
 * The server could then either pull course as a package built in a separate workflow outside the monorepo
 * i.e. from the npm registry or as a distinct build stage in the monorepo.
 * */

export * from "../apps/server/src/types";
