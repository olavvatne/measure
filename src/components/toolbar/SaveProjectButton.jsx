import { DownloadSimple } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { persistState } from "../../persist";
import { store } from "../../store";
import { ICON_SIZE } from "./config";
import { isElectron } from "../../utils/platform-util";

const saveTooltip = "Save current project to file";

export default function SaveProjectButton() {
  const globalState = useContext(store);
  const { state } = globalState;
  const isFileAccessSupport = window.showSaveFilePicker || isElectron();
  return (
    <button
      title={saveTooltip}
      disabled={!isFileAccessSupport}
      onClick={() => window.fileApi.storeJson(persistState(state))}
    >
      <DownloadSimple size={ICON_SIZE} />
    </button>
  );
}
