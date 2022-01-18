import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Router } from "@reach/router";
import { Provider, store } from "src/store";
import { Courses, NotFound } from "src/pages";
import "src/assets/styles.css";

ReactDOM.render(<div />, document.getElementById("root"));

store.init().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider value={store}>
        <Router>
          <Redirect from="/" to="courses/js2" noThrow />
          <Courses path="courses/*" />
          <NotFound default />
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
