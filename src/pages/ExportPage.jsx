import React, { useContext } from "react";
import { store } from "../store.js";
import SaveProjectButton from "../components/toolbar/SaveProjectButton.jsx";
import ExportButton from "../components/toolbar/ExportButton.jsx";
import "./ExportPage.css";
import { NoProjectLoaded } from "../components/redirect";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  if (Object.keys(state.images).length === 0) {
    return <NoProjectLoaded />;
  }

  return (
    <div style={{ display: "flex" }}>
      <SaveProjectButton />
      <ExportButton data={state.images} />
    </div>
  );
}
