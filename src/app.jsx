import React, { useContext } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import { NoImageWithId } from "./components/redirect";
import ExportPage from "./pages/ExportPage.jsx";
import ImagePage from "./pages/ImagePage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import Root from "./pages/Root.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import { ImagesContext, ImagesProvider } from "./state/ImagesContext.js";
import {
  MeasurementsContext,
  MeasurementsProvider,
} from "./state/MeasurementsContext.js";
import { ViewProvider } from "./state/ViewContext.js";
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
const AppRoot = () => {
  const measurementsContext = useContext(MeasurementsContext);
  const imagesContext = useContext(ImagesContext);
  const { state, getCurrentBoundaryAreas } = measurementsContext;
  const { images } = imagesContext;

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
        const image = images[params.guid];
        if (!image) {
          throw "Not found";
        }
        const record = {
          date: image.date,
          id: params.guid,
          data: {},
        };
        for (const m of Object.keys(state.values)) {
          const measurementData = state.values[m]?.[image.date];
          if (measurementData) {
            record.data[m] = measurementData.value;
          }
        }
        const areas = getCurrentBoundaryAreas(image.date || 0);
        return { image, areas, record };
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
  <ImagesProvider>
    <MeasurementsProvider>
      <ViewProvider>
        <AppRoot />
      </ViewProvider>
    </MeasurementsProvider>
  </ImagesProvider>
  // </StrictMode>
);
