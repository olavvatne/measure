import React from "react";
import { createRoot } from "react-dom/client";
import ImagePage from "./pages/ImagePage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import { StateProvider } from './store.js';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ImageAccessApi from "./utils/image-access";
import JsonAccessApi from "./utils/json-access";
import {isElectron} from "./utils/platform-util";
import {detectColorScheme} from "./utils/dark-mode";


function App() {
    console.log(isElectron());
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
