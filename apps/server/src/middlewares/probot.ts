import express from "express";
import { createNodeMiddleware } from "probot";
import type { Probot } from "probot";
import type { ApplicationFunction } from "probot/lib/types";

export const probot = (params: {
  app: ApplicationFunction;
  instance: Probot;
}) => {
  return express().use(
    createNodeMiddleware(params.app, { probot: params.instance })
  );
};
