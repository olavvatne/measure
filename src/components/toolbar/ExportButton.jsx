import { Export } from "@phosphor-icons/react";
import * as dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { exportToCsv, matchAndExportToCsv } from "../../utils/csv-exporter";
import { ICON_SIZE } from "./config";

const tooltip = "Export project";

function checkIfDuplicateExists(arr) {
  return new Set(arr).size !== arr.length;
}

export default function ExportButton({ data, measurementMapping }) {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  function toggleDropdown() {
    menuRef.current.classList.toggle("show");
  }
  useEffect(() => {
    const handleHide = (event) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        menuRef.current.classList.remove("show");
      }
    };

    document.addEventListener("click", handleHide);

    return () => {
      document.removeEventListener("click", handleHide);
    };
  }, []);

  function constructRows() {
    if (checkIfDuplicateExists(Object.values(measurementMapping))) {
      throw "Measurement names are not unique";
    }
    const valuesPerUnixDate = {};
    for (const m of Object.keys(measurementMapping)) {
      for (const [d, v] of Object.entries(data[m] || {})) {
        const unix = parseInt(d);
        if (!valuesPerUnixDate.hasOwnProperty(unix)) {
          const parsedDate = dayjs.unix(unix);
          valuesPerUnixDate[unix] = {
            date: parsedDate.format("MM/DD/YY"),
            time: parsedDate.format("HH:mm:ss"),
            unix: unix,
          };
        }
        valuesPerUnixDate[unix][measurementMapping[m]] = v.value;
      }
    }

    return Object.values(valuesPerUnixDate);
  }

  return (
    <>
      <button
        ref={buttonRef}
        title={tooltip}
        onClick={toggleDropdown}
        style={{ position: "relative" }}
        disabled={!Object.keys(data).length > 0}
      >
        <Export size={ICON_SIZE} />
        Export
        <div
          id="export-dropdown"
          className="dropdown-content"
          ref={menuRef}
          style={{ position: "absolute", top: "60px" }}
        >
          <a onClick={() => exportToCsv(constructRows())}>Export to csv</a>
          <a
            onClick={() =>
              matchAndExportToCsv(constructRows(), measurementMapping)
            }
          >
            Match and export to csv
          </a>
        </div>
      </button>
    </>
  );
}
