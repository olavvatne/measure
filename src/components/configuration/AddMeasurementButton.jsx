import { Plus } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { MeasurementsContext } from "../../state/MeasurementsContext.js";

const addTooltip = "Add new measurement to project";

export default function AddMeasurementButton() {
  const measurementsContext = useContext(MeasurementsContext);
  const { dispatch } = measurementsContext;

  return (
    <button
      title={addTooltip}
      onClick={() => {
        dispatch({ type: "SetupNewMeasurementAction" });
      }}
    >
      <Plus />
      Add
    </button>
  );
}
