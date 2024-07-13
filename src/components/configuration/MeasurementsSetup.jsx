import React from "react";
import PropTypes from "prop-types";
import "./MeasurementsSetup.css";
import { TrashSimple } from "@phosphor-icons/react";

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
          {/* <button>
            <TrashSimple />
          </button> */}
        </li>
      ))}
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
