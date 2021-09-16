import React from "react";
import * as ReactDOM from "react-dom";
import ImageView from "./components/ImageView.jsx";
import OverviewView from "./components/OverviewView.jsx";
import { StateProvider } from './store.js';
import { HashRouter as Router, Route, } from "react-router-dom";
import ImageAccessApi from "./utils/image-access";
import {isElectron} from "./utils/platform-util";
import {detectColorScheme} from "./utils/dark-mode";


function App() {
    console.log(isElectron());
    if (!isElectron()) {
        const api = new ImageAccessApi();
        window.fileApi = api;
    }

    return (
        <StateProvider>
            <Router>
                <div>
                <Route exact={true} path="/">
                    <OverviewView/>
                </Route>
                <Route path="/image/:guid">
                    <ImageView />
                </Route>
                </div>
            </Router>
        </StateProvider>
    );
}




function render() {
  ReactDOM.render(<App />, document.getElementById("app-container"));
}

detectColorScheme();
render();
