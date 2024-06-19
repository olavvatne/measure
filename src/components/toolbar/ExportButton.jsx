import { Export } from "@phosphor-icons/react";
import React from "react";
import { exportToCsv, matchAndExportToCsv } from "../../utils/csv-exporter";
import { ICON_SIZE } from "./config";

const exportTooltip = "Export data options";

export default function ExportButton({ data }) {
  function toggleDropdown() {
    document.getElementById("export-dropdown").classList.toggle("show");
  }
  return (
    <>
      <button
        title={exportTooltip}
        onClick={toggleDropdown}
        disabled={!Object.keys(data).length > 0}
      >
        <Export size={ICON_SIZE} />
      </button>
      <div id="export-dropdown" className="dropdown-content">
        <a onClick={() => exportToCsv(data)}>Export to csv</a>
        <a onClick={() => matchAndExportToCsv(data)}>Match and export to csv</a>
      </div>
    </>
  );
}
