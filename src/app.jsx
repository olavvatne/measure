import React from "react";
import { createRoot } from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import ImagePage from "./pages/ImagePage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import { StateProvider } from './store.js';
import { detectColorScheme } from "./utils/dark-mode";
import ImageAccessApi from "./utils/image-access";
import JsonAccessApi from "./utils/json-access";
import { isElectron } from "./utils/platform-util";


function App() {
    if (!isElectron()) {
        window.imageApi = new ImageAccessApi();
        window.fileApi = new JsonAccessApi();
    }

    return (
        <StateProvider>
            <Router>
                <Routes>
                    <Route  exact={true} path="/"  element={<OverviewPage/>} />
                    <Route  path="/image/:guid" element={<ImagePage />} />
                </Routes>
            </Router>
        </StateProvider>
    );
}


detectColorScheme();
const container = document.getElementById("app-container");
const root = createRoot(container);
root.render(<App />);
