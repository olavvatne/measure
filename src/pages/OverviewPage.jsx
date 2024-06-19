import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createMeasureTable } from "../components/table";
import {
  DarkModeButton,
  ExportButton,
  LoadProjectButton,
  ReadFolderButton,
  SaveProjectButton,
} from "../components/toolbar";
import { store } from "../store.js";
import "./OverviewPage.css";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  let navigate = useNavigate();

  const data = React.useMemo(() => {
    let og = Object.values(state.historicMeasurer.og);
    let ow = Object.values(state.historicMeasurer.ow);
    og = og
      .filter((m) => m.fromDate > 0)
      .map((m) => {
        m.id = "og";
        return m;
      });
    ow = ow
      .filter((m) => m.fromDate > 0)
      .map((m) => {
        m.id = "ow";
        return m;
      });
    return [...og, ...ow, ...Object.values(state.images)];
  }, [state.images]);

  function onRowClick(row) {
    if (!row?.original?.path) {
      return;
    }
    navigate("/image/" + row.original.id);
  }

  const [tableView, tableControls] = createMeasureTable(data, onRowClick);
  return (
    <div>
      <div className="top-bar">
        <div>
          <ReadFolderButton />
          <ExportButton data={state.images} />
        </div>
        <DarkModeButton />
        <div>
          <SaveProjectButton />
          <LoadProjectButton />
        </div>
      </div>
      {tableView}
      {tableControls}
    </div>
  );
}
