import { Export } from "@phosphor-icons/react";
import React, { useEffect, useRef } from "react";
import { exportToCsv, matchAndExportToCsv } from "../../utils/csv-exporter";
import { ICON_SIZE } from "./config";

const tooltip = "Export project";

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
          <a onClick={() => exportToCsv(data, measurementMapping)}>
            Export to csv
          </a>
          <a onClick={() => matchAndExportToCsv(data, measurementMapping)}>
            Match and export to csv
          </a>
        </div>
      </button>
    </>
  );
}
