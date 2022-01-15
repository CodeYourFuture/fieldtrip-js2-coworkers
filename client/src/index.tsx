import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Router } from "@reach/router";
import { Home } from "src/pages";
import { Play } from "src/pages/play";
import "src/assets/defaults.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Redirect from="/" to="/js2" noThrow />
      <Home path="/js2/*" />
      <Play path="/play" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
