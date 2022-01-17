import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Router } from "@reach/router";
import { Course } from "src/pages";
import { Play } from "src/pages/play";
import js2 from "@courses/js2-coworkers";
import "src/assets/styles.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Redirect from="/" to="/js2" noThrow />
      <Course path="/js2/*" config={js2} />
      <Play path="/play" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
