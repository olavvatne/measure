import React, {useState, useContext} from "react";
import * as ReactDOM from "react-dom";
import ImageView from "./components/ImageView.jsx";
import OverviewView from "./components/OverviewView.jsx";
import { StateProvider } from './store.js';
import { HashRouter as Router, Route, } from "react-router-dom";

function App() {
    // const [darkMode, setDarkMode] = useState(window.darkMode.current && window.darkMode.current());
    // const containerClass = darkMode ? "dark-mode" : "light-mode";
    // window.darkMode.onUpdated(async (sender, data) => {
    //     setDarkMode(data)
    // });
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

render();