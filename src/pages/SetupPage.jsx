import React, { useContext } from "react";
import MeasurementsSetup from "../components/configuration/MeasurementsSetup.jsx";
import LoadProjectButton from "../components/toolbar/LoadProjectButton.jsx";
import ReadFolderButton from "../components/toolbar/ReadFolderButton.jsx";
import { MeasurementsContext } from "../state/MeasurementsContext.js";
import "./SetupPage.css";

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
