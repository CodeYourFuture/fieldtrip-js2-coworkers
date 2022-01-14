import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import { Home } from "src/pages";
import "src/assets/tailwind.output.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Home path="/*" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
