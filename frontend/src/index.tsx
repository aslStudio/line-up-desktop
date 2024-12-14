import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import "./index.css";
import "react-spring-bottom-sheet/dist/style.css";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

setDefaultOptions({ locale: ru });

root.render(<App />);
