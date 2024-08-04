import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CapstoneContext } from "./CapstoneContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <CapstoneContext>
        <App />
      </CapstoneContext>
    </Router>
  </React.StrictMode>
);
