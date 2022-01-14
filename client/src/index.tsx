import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import { App } from "./app";
import "src/assets/tailwind.output.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App path="/*" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
