import express from "express";
import * as routers from "./routers";
import * as bots from "./bots";
import * as mw from "./middlewares";

export const app = express();

app.use(mw.cors);
app.use(mw.locals);
app.use(mw.session);
app.use(["/api/user", "/api/courses/:id"], mw.userSession);
app.use("/api/courses/:id", [mw.course, mw.botSessions, mw.store]);

app.use(mw.probot(bots.cyf));
app.use(mw.probot(bots.amber));
app.use(mw.probot(bots.malachi));
app.use(mw.probot(bots.uma));

app.use("/api", routers.api);
app.use("/auth", routers.auth);
