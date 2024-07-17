import { UploadSimple } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { hydrateState } from "../../persist";
import { MeasurementsContext } from "../../store";
import { ICON_SIZE } from "./config";
import { isElectron } from "../../utils/platform-util";
import { ImagesContext } from "../../state/ImagesContext";

const loadTooltip = "Load exisiting project";

export default function LoadProjectButton() {
  const measurementsContext = useContext(MeasurementsContext);
  const imagesContext = useContext(ImagesContext);
  const { dispatch } = measurementsContext;
  const { setImages } = imagesContext;
  const isFileAccessSupport = window.showSaveFilePicker || isElectron();

  async function onLoadAppData() {
    try {
      const jsonData = await window.fileApi.loadJson();
      if (jsonData == null) {
        return;
      }
      const data = hydrateState(jsonData);
      setImages(data.images);
      dispatch({ type: "HydrateAction", data: data.measurements });
    } catch (error) {
      console.error(error);
    }
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
