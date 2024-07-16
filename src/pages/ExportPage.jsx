import React, { useContext } from "react";
import { store } from "../store.js";
import SaveProjectButton from "../components/toolbar/SaveProjectButton.jsx";
import ExportButton from "../components/toolbar/ExportButton.jsx";
import "./ExportPage.css";
import { NoProjectLoaded } from "../components/redirect";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  if (Object.keys(state.images).length === 0) {
    return <NoProjectLoaded />;
  }
  const measurementsMapping = Object.keys(state.measurements.setup).reduce(
    (acc, key) => {
      acc[key] = state.measurements.setup[key].name;
      return acc;
    },
    {}
  );

  return (
    <div className="export-page-container">
      <div>
        <p>
          Save project to a json file. You can continue adding measurements by
          opening saved file at a later point.
        </p>
        <SaveProjectButton />
        <p>
          Export all measurements to csv file or open a csv file with a
          timestamps column to do a best effort measurements to csv row
          timestamp matching.
        </p>
        <ExportButton
          data={state.images}
          measurementMapping={measurementsMapping}
        />
      </div>
    </div>
  );
}
