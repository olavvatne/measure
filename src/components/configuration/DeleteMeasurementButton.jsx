import React, { useContext, useRef } from "react";
import { MeasurementsContext } from "../../store";
import { TrashSimple } from "@phosphor-icons/react";
import "./DeleteMeasurementButton.css";

const deleteTooltip = "Delete measurement from project";

export default function DeleteMeasurementButton({
  measurementName,
  measurementId,
}) {
  const dialogRef = useRef(null);
  const measurementsContext = useContext(MeasurementsContext);
  const { dispatch } = measurementsContext;

  function openDialog() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }

  function cancelDialog() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  function DeleteMeasurement() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    dispatch({
      type: "DeleteMeasurementAction",
      data: { id: measurementId },
    });
  }

  return (
    <>
      <button title={deleteTooltip} onClick={openDialog}>
        <TrashSimple />
      </button>
      <dialog ref={dialogRef} className="delete-confirm-dialog">
        <p>
          If deleted all recorded measurements attached to {measurementName}{" "}
          will be lost
        </p>
        <div>
          <button onClick={cancelDialog}>Cancel</button>
          <button onClick={DeleteMeasurement}>Delete</button>
        </div>
      </dialog>
    </>
  );
}
