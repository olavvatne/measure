import { Image, Warning } from "@phosphor-icons/react";
import React, { useContext, useState } from "react";
import { ImagesContext } from "../../state/ImagesContext.js";
import { MeasurementsContext } from "../../state/MeasurementsContext.js";
import { isElectron } from "../../utils/platform-util";
import { ICON_SIZE } from "./config";

const imageTooltip = "Open folder containing images";
const notSupportedTooltip = "Measure only works in Chrome or Edge";

export default function ReadFolderButton() {
  const [isLoading, setLoading] = useState(false);
  const imagesContext = useContext(ImagesContext);
  const measurementsContext = useContext(MeasurementsContext);
  const { loadImages } = imagesContext;
  const { dispatch } = measurementsContext;
  // Only edge and chrome support the file access api
  const isFileAccessSupport = !!window.showSaveFilePicker || isElectron();

  async function readFolder() {
    setLoading(true);
    window.imageApi
      .openDialog()
      .then(loadImages)
      .then(() => {
        setLoading(false);
        dispatch({ type: "ImagesChangeAction" });
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <button
      title={!isFileAccessSupport ? notSupportedTooltip : imageTooltip}
      disabled={isLoading || !isFileAccessSupport}
      onClick={() => readFolder()}
    >
      <div style={{ position: "relative" }}>
        {isLoading ? <div className="loader"></div> : null}
        {!isFileAccessSupport ? (
          <Warning
            weight="fill"
            opacity={1}
            size={ICON_SIZE * 0.8}
            style={{ position: "absolute" }}
            color="yellow"
          />
        ) : null}
        <Image size={ICON_SIZE} opacity={isLoading ? 0.2 : 1.0} />
      </div>
      Read folder
    </button>
  );
}
