import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createHashRouter,
  createBrowserRouter,
} from "react-router-dom";
import ImagePage from "./pages/ImagePage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import ExportPage from "./pages/ExportPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import Root from "./pages/Root.jsx";
import { StateProvider } from "./store.js";
import { detectColorScheme } from "./utils/dark-mode";
import ImageAccessApi from "./utils/image-access";
import JsonAccessApi from "./utils/json-access";
import { isElectron } from "./utils/platform-util";

let createRouter = createHashRouter;
if (!isElectron()) {
  window.imageApi = new ImageAccessApi();
  window.fileApi = new JsonAccessApi();
  createRouter = createBrowserRouter;
}

const router = createRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <SetupPage />,
      },
      {
        path: "overview",
        element: <OverviewPage />,
      },
      {
        path: "export",
        element: <ExportPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/image/:guid",
    element: <ImagePage />,
  },
]);

detectColorScheme();

const container = document.getElementById("app-container");
createRoot(container).render(
  <StateProvider>
    <RouterProvider router={router} />
  </StateProvider>
);
