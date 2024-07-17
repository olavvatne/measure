import React, { useContext } from "react";
import LoadProjectButton from "../components/toolbar/LoadProjectButton.jsx";
import ReadFolderButton from "../components/toolbar/ReadFolderButton.jsx";
import MeasurementsSetup from "../components/configuration/MeasurementsSetup.jsx";
import "./SetupPage.css";
import { MeasurementsContext } from "../store.js";

export default function SetupPage() {
  const measurementsContext = useContext(MeasurementsContext);
  const { dispatch, state } = measurementsContext;
  return (
    <div className="setup-page-container">
      <div>
        <p>
          Start a measurement project by either loading a project file or
          reading a folder containing an image sequence
        </p>
        <LoadProjectButton />
        <ReadFolderButton />
        <MeasurementsSetup
          measurements={Object.values(state.setup)}
          onSetupChange={(id, key, value) =>
            dispatch({
              type: "MeasurementSetupChangeAction",
              data: { id, key, value },
            })
          }
        />
      </div>
    </div>
  );
}
