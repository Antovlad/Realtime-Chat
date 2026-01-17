// polyfill (dacă ai pus varianta cu polyfills.js, import-o aici; altfel ignoră)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
