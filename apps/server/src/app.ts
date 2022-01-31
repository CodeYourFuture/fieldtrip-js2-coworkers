import express from "express";
import * as routers from "./routers";
import * as mw from "./middlewares";

export const app = express();

app.use(mw.cors);
app.use(mw.locals);
app.use(mw.session);
app.use([mw.cyf, mw.amber, mw.malachi, mw.uma]);
app.use(["/api/user", "/api/courses/:id"], mw.userSession);
app.use("/api/courses/:id", [mw.course, mw.db, mw.botSessions]);
app.use("/api", routers.api);
app.use("/auth", routers.auth);
