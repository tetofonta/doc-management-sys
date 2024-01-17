import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App/App";

const root = ReactDOM.createRoot(
    document.getElementById("root") ||
        (function () {
            throw new Error();
        })(),
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
