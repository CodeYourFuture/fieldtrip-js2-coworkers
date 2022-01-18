import express from "express";
import * as routers from "./routers";
import * as bots from "./bots";
import * as mw from "./middlewares";
import * as config from "./config";

const server = express();

server.use(mw.session);
server.use(mw.user);

server.use(mw.probot(bots.amber));
server.use(mw.probot(bots.malachi));
server.use(mw.probot(bots.uma));
server.use(mw.probot(bots.root));

server.use("/api", routers.api);
server.use("/auth", routers.auth);

server.listen(config.PORT, () => {
  console.log("Server listening on port", config.PORT);
});
