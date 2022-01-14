import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Router } from "@reach/router";
import { Home } from "src/pages";
import "src/assets/defaults.css";
import "src/assets/tailwind.output.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Redirect from="/" to="/js2" noThrow />
      <Home path="/js2/*" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
