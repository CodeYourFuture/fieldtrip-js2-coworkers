import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Router } from "@reach/router";
import { Provider, store } from "src/store";
import { Course, NotFound } from "src/pages";
import { Announcement } from "./components/app";
import "src/assets/styles.css";

ReactDOM.render(
  <Announcement message="Initialising lab..." />,
  document.getElementById("root")
);

store
  .init()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <Provider value={store}>
          <Router>
            <Redirect from="/" to="courses/js2" noThrow />
            <Course path="courses/:id/*" />
            <NotFound default />
          </Router>
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch((err) => {
    console.info("Hey there! Something went wrong while initialising the app.");
    console.info("Maybe you can figure it out from this error:");
    console.error(err);
    ReactDOM.render(
      <Announcement message="Oh noes! Something went wrong" />,
      document.getElementById("root")
    );
  });
