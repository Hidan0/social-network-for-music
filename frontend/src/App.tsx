import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";

import Register from "./pages/Register";

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/register" component={Register} />
      </Routes>
    </>
  );
};

export default App;
