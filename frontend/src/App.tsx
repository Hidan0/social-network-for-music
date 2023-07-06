import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <>
      <h1>Hello World</h1>
      <Routes>
        <Route path="/" component={App} /> {/* 👈 Define the home page route */}
      </Routes>
    </>
  );
};

export default App;
