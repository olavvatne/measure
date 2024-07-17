import { UploadSimple } from "@phosphor-icons/react";
import React, { useContext, useRef, useState } from "react";
import { hydrateState } from "../../persist";
import { ImagesContext } from "../../state/ImagesContext";
import { MeasurementsContext } from "../../state/MeasurementsContext.js";
import { isElectron } from "../../utils/platform-util";
import { ICON_SIZE } from "./config";

const loadTooltip = "Load exisiting project";

export default function LoadProjectButton() {
  const dialogRef = useRef(null);
  const [error, setError] = useState(null);
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
      console.err(error);
      setError(error.message);
      dialogRef.current.showModal();
    }
  }

  return (
    <>
      <button
        disabled={!isFileAccessSupport}
        title={loadTooltip}
        onClick={onLoadAppData}
      >
        <UploadSimple size={ICON_SIZE} />
        Load project
      </button>
      <dialog ref={dialogRef}>
        <p>Could not load project:</p>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </>
  );
}
