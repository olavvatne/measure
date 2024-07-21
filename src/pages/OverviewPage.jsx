import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createMeasureTable } from "../components/table";
import { MeasurementsContext } from "../state/MeasurementsContext.js";
import "./OverviewPage.css";
import { NoProjectLoaded } from "../components/redirect";
import { ImagesContext } from "../state/ImagesContext.js";

export default function OverviewPage() {
  const measurementsContext = useContext(MeasurementsContext);
  const imagesContext = useContext(ImagesContext);
  const { state } = measurementsContext;
  const { images } = imagesContext;

  const dataColumnsMap = new Map(Object.entries(state.setup));

  let navigate = useNavigate();

  if (!state.projectLoaded) {
    return <NoProjectLoaded />;
  }

  const memoedRows = React.useMemo(() => {
    let measurementHistoryData = [];
    let rows = { ...images };

    for (const dc of dataColumnsMap.values()) {
      if (!state.history[dc.id]) {
        continue;
      }
      const values = Object.values(state.history[dc.id])
        .filter((m) => m.fromDate > 0)
        .map((m) => {
          m.id = dc.id;
          m.color = dc.color;
          m.type = "calibration";
          return m;
        });
      measurementHistoryData = measurementHistoryData.concat(values);
    }
    return [...measurementHistoryData, ...Object.values(rows)];
  }, [state.history]);

  function onRowClick(row) {
    if (!row?.original?.path) {
      return;
    }
    navigate("/image/" + row.original.id);
  }

  const [tableView, tableControls] = createMeasureTable(
    memoedRows,
    state.values,
    dataColumnsMap,
    onRowClick
  );
  return (
    <div className="overview-container">
      <div className="overview-table-container">{tableView}</div>

      {tableControls}
    </div>
  );
}
