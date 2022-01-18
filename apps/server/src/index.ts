import express from "express";
import * as routers from "./routers";
import * as bots from "./bots";
import * as middlewares from "./middlewares";
import * as config from "./config";

const server = express();

server.use(middlewares.session);
server.use(middlewares.user);

server.use(middlewares.probot(bots.root, config.probot1));
server.use(middlewares.probot(bots.amber, config.probot2));

server.use("/api", routers.api);
server.use("/auth", routers.auth);

server.listen(config.SERVER_PORT, () => {
  console.log("Server listening on port", config.SERVER_PORT);
});
