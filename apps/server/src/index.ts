import express from "express";
import * as routers from "./routers";
import * as bots from "./bots";
import * as middlewares from "./middlewares";
import * as config from "./config";

const server = express();

server.use(middlewares.session);
server.use(middlewares.user);

server.use(middlewares.probot(bots.root, config.bots.root));
server.use(middlewares.probot(bots.amber, config.bots.amber));
server.use(middlewares.probot(bots.malachi, config.bots.malachi));
server.use(middlewares.probot(bots.uma, config.bots.uma));

server.use("/api", routers.api);
server.use("/auth", routers.auth);

server.listen(config.SERVER_PORT, () => {
  console.log("Server listening on port", config.SERVER_PORT);
});
