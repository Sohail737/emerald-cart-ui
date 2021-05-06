import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { CartAndWishlistProvider } from "./context/CartAndWishlistProvider";
import { ProgressStateProvider } from "./context/ProgressStateProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider";
import { AuthProvider } from "./context/AuthProvider";
import { AuthModalProvider, useAuthModal } from "./context/AutModalProvider";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <AuthModalProvider>
          <CartAndWishlistProvider>
            <ProgressStateProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ProgressStateProvider>
          </CartAndWishlistProvider>
        </AuthModalProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
