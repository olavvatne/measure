import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createMeasureTable } from "../components/table";
import { store } from "../store.js";
import "./OverviewPage.css";
import { NoProjectLoaded } from "../components/redirect";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  const dataColumnsMap = new Map(Object.entries(state.measurements.setup));

  let navigate = useNavigate();

  if (Object.keys(state.images).length === 0) {
    return <NoProjectLoaded />;
  }

  const data = React.useMemo(() => {
    let measurementHistoryData = [];
    for (const dc of dataColumnsMap.values()) {
      if (!state.measurements.history[dc.id]) {
        continue;
      }
      const values = Object.values(state.measurements.history[dc.id])
        .filter((m) => m.fromDate > 0)
        .map((m) => {
          m.id = dc.id;
          m.color = dc.color;
          return m;
        });
      measurementHistoryData = measurementHistoryData.concat(values);
    }
    return [...measurementHistoryData, ...Object.values(state.images)];
  }, [state.images]);

  function onRowClick(row) {
    if (!row?.original?.path) {
      return;
    }
    navigate("/image/" + row.original.id);
  }

  const [tableView, tableControls] = createMeasureTable(
    data,
    dataColumnsMap,
    onRowClick
  );
  return (
    <div>
      {tableView}
      {tableControls}
    </div>
  );
}
