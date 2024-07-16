import React, { useContext } from "react";
import { store } from "../../store";
import { Plus } from "@phosphor-icons/react";

const addTooltip = "Add new measurement to project";

export default function AddMeasurementButton() {
  const globalState = useContext(store);
  const { dispatch } = globalState;

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
