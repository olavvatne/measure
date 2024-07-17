import React, { useContext } from "react";
import { NoProjectLoaded } from "../components/redirect";
import ExportButton from "../components/toolbar/ExportButton.jsx";
import SaveProjectButton from "../components/toolbar/SaveProjectButton.jsx";
import { MeasurementsContext } from "../state/MeasurementsContext.js";
import "./ExportPage.css";

export default function OverviewPage() {
  const measurementsContext = useContext(MeasurementsContext);
  const { state } = measurementsContext;

  if (!state.projectLoaded) {
    return <NoProjectLoaded />;
  }
  const measurementsMapping = Object.keys(state.setup).reduce((acc, key) => {
    acc[key] = state.setup[key].name;
    return acc;
  }, {});

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
          data={state.values}
          measurementMapping={measurementsMapping}
        />
      </div>
    </div>
  );
}
