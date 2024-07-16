import React from "react";
import PropTypes from "prop-types";
import "./MeasurementsSetup.css";
import { TrashSimple } from "@phosphor-icons/react";
import AddMeasurementButton from "./AddMeasurementButton.jsx";
import DeleteMeasurementButton from "./DeleteMeasurementButton.jsx";

export default function MeasurementsSetup({ measurements, onSetupChange }) {
  return (
    <ul className="measurements-setup">
      {measurements.map((x) => (
        <li key={x.id}>
          <label htmlFor={"name"}>
            Name
            <input
              id={"name"}
              value={x.name}
              onChange={(c) => onSetupChange(x.id, "name", c.target.value)}
            ></input>
          </label>
          <label htmlFor={"color"}>
            Color
            <input
              id={"color"}
              type="color"
              value={x.color}
              onChange={(c) => onSetupChange(x.id, "color", c.target.value)}
            ></input>
          </label>
          <DeleteMeasurementButton
            measurementId={x.id}
            measurementName={x.name}
          />
        </li>
      ))}
      <li className="add-container">
        <AddMeasurementButton />
      </li>
    </ul>
  );
}

MeasurementsSetup.propTypes = {
  measurements: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSetupChange: PropTypes.func.isRequired,
};
