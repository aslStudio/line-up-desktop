import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./router";
import Navbar from "./components/navbar";
import React, { useEffect, KeyboardEvent } from "react";
import { ThemeProvider } from "./router/theme";
import { PrivateRoute } from "./router/private";
import { Provider } from "react-redux";
import store from "./store";

export default function App() {
  useEffect(() => {
    const handleEnterBlur: EventListener = (event) => {
      const keyboardEvent = event as unknown as KeyboardEvent;

      if (keyboardEvent.key === "Enter" && event.target instanceof HTMLInputElement) {
        (event.target as HTMLInputElement).blur();
      }
    };

    document.addEventListener("keypress", handleEnterBlur);

    return () => {
      document.removeEventListener("keypress", handleEnterBlur);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateRoute>
                    <route.component />
                    {route.isPrivate ? <Navbar /> : ""}
                  </PrivateRoute>
                }
              />
            ))}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
