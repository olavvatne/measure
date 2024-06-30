import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import {
  DarkModeButton,
  ExportButton,
  LoadProjectButton,
  ReadFolderButton,
  SaveProjectButton,
} from "../components/toolbar";
import { store } from "../store.js";
import "./Root.css";

export default function Root() {
  const globalState = useContext(store);
  const { state } = globalState;

  return (
    <>
      <div className="app-sidebar">
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
      <div className="app-content">
        <Outlet />
      </div>
    </>
  );
}
