import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { consumeOAuthTokenFromUrl } from "./api/auth.api.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SessionProvider } from "./context/SessionContext.jsx";
import "./index.css";

consumeOAuthTokenFromUrl();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AuthProvider>
  </React.StrictMode>
);
