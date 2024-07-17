import { DownloadSimple } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { persistState, SCHEMA_VERSION } from "../../persist";
import { MeasurementsContext } from "../../store";
import { ICON_SIZE } from "./config";
import { isElectron } from "../../utils/platform-util";
import { ImagesContext } from "../../state/ImagesContext";

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
