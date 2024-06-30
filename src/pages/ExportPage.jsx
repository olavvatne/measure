import React, { useContext } from "react";
import { store } from "../store.js";
import SaveProjectButton from "../components/toolbar/SaveProjectButton.jsx";
import ExportButton from "../components/toolbar/ExportButton.jsx";
import "./ExportPage.css";

export default function OverviewPage() {
  const globalState = useContext(store);
  const { state } = globalState;

  return (
    <>
      <SaveProjectButton />
      <ExportButton data={state.images} />
    </>
  );
}
