import { Image, Warning } from "@phosphor-icons/react";
import * as dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { store } from "../../store";
import { createHash } from "../../utils/guid.js";
import { isElectron } from "../../utils/platform-util";
import { ICON_SIZE } from "./config";

const imageTooltip = "Open folder containing images";
const notSupportedTooltip = "Measure only works in Chrome or Edge";

export default function ReadFolderButton() {
  const [isLoading, setLoading] = useState(false);
  const globalState = useContext(store);
  const { dispatch } = globalState;
  // Only edge and chrome support the file access api
  const isFileAccessSupport = !!window.showSaveFilePicker || isElectron();

  async function readFolder() {
    setLoading(true);
    window.imageApi
      .openDialog()
      .then(async (files) => {
        var data = {};
        for (let i = 0; i < files.length; i++) {
          const guid = await createHash(files[i].path);
          const nextId =
            i >= files.length - 1 ? null : await createHash(files[i + 1].path);
          const prevId = i <= 0 ? null : await createHash(files[i - 1].path);
          data[guid] = {
            id: guid,
            type: "data",
            path: files[i].path,
            date: dayjs(files[i].date).unix(),
            values: {},
            nextId,
            prevId,
          };
        }
        setLoading(false);
        dispatch({ type: "ImagesChangeAction", data });
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
