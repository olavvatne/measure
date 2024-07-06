import { UploadSimple } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { hydrateState } from "../../persist";
import { store } from "../../store";
import { ICON_SIZE } from "./config";
import { isElectron } from "../../utils/platform-util";

const loadTooltip = "Load exisiting project";

export default function LoadProjectButton() {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const isFileAccessSupport = window.showSaveFilePicker || isElectron();

  async function onLoadAppData() {
    const jsonData = await window.fileApi.loadJson();
    const data = hydrateState(jsonData);
    dispatch({ type: "HydrateAction", data });
  }

  return (
    <button
      disabled={!isFileAccessSupport}
      title={loadTooltip}
      onClick={onLoadAppData}
    >
      <UploadSimple size={ICON_SIZE} />
      Load project
    </button>
  );
}
