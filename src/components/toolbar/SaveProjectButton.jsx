import { DownloadSimple } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { persistState, SCHEMA_VERSION } from "../../persist";
import { ImagesContext } from "../../state/ImagesContext";
import { MeasurementsContext } from "../../state/MeasurementsContext.js";
import { isElectron } from "../../utils/platform-util";
import { ICON_SIZE } from "./config";

const saveTooltip = "Save current project to file";

export default function SaveProjectButton() {
  const measurementsContext = useContext(MeasurementsContext);
  const imagesContext = useContext(ImagesContext);
  const { state } = measurementsContext;
  const { images } = imagesContext;
  const isFileAccessSupport = window.showSaveFilePicker || isElectron();
  return (
    <button
      title={saveTooltip}
      disabled={!isFileAccessSupport}
      onClick={() =>
        window.fileApi.storeJson(
          persistState({
            version: SCHEMA_VERSION,
            measurements: state,
            images: images,
          })
        )
      }
    >
      <DownloadSimple size={ICON_SIZE} />
      Save project
    </button>
  );
}
