import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";

import Register from "./pages/Register";
import Login from "./pages/Login";

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Routes>
    </>
  );
};

export default App;
