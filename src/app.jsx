import React, { StrictMode, useContext } from "react";
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
import { StateProvider, store } from "./store.js";
import { detectColorScheme } from "./utils/dark-mode";
import ImageAccessApi from "./utils/image-access";
import JsonAccessApi from "./utils/json-access";
import { isElectron } from "./utils/platform-util";
import { NoImageWithId } from "./components/redirect";

let createRouter = createHashRouter;
if (!isElectron()) {
  window.imageApi = new ImageAccessApi();
  window.fileApi = new JsonAccessApi();
  createRouter = createBrowserRouter;
}
const AppRoot = () => {
  const globalState = useContext(store);
  const { state, getCurrentBoundaryAreas } = globalState;
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
      loader: ({ params }) => {
        const record = state.images[params.guid];
        if (!record) {
          throw "Not found";
        }
        const areas = getCurrentBoundaryAreas(record?.date || 0);
        return { record, areas };
      },
      errorElement: <NoImageWithId />,
    },
  ]);

  return <RouterProvider router={router} />;
};

detectColorScheme();

const container = document.getElementById("app-container");
createRoot(container).render(
  // <StrictMode>
  <StateProvider>
    <AppRoot />
  </StateProvider>
  // </StrictMode>
);
