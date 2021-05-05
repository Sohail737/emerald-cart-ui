import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { CartAndWishlistProvider } from "./context/CartAndWishlistProvider";
import { ProgressStateProvider } from "./context/ProgressStateProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CartAndWishlistProvider>
          <ProgressStateProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ProgressStateProvider>
      </CartAndWishlistProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
