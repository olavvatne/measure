import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createMeasureTable } from "../components/table";
import { store } from "../store.js";
import "./OverviewPage.css";
import { NoProjectLoaded } from "../components/redirect";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  let navigate = useNavigate();

  if (Object.keys(state.images).length === 0) {
    return <NoProjectLoaded />;
  }

  const data = React.useMemo(() => {
    let og = Object.values(state.measurements.history.og);
    let ow = Object.values(state.measurements.history.ow);
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
      {tableView}
      {tableControls}
    </div>
  );
}
