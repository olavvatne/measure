import React from "react";
import * as ReactDOM from "react-dom";
import ImageView from "./components/ImageView.jsx";
import OverviewView from "./components/OverviewView.jsx";
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
                    <Route  exact={true} path="/"  element={<OverviewView/>} />
                    <Route  path="/image/:guid" element={<ImageView />} />
                </Routes>
            </Router>
        </StateProvider>
    );
}




function render() {
  ReactDOM.render(<App />, document.getElementById("app-container"));
}

detectColorScheme();
render();
