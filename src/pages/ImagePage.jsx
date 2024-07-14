import {
  ArrowLeft,
  ArrowRight,
  Lock,
  MagnifyingGlass,
  Rows,
} from "@phosphor-icons/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  ImageAutoSave,
  ImageMoverArea,
  ImageNavigateButton,
  ImageTimestamp,
  MeasurementImage,
  MovableLineMeasureArea,
} from "../components/editor";
import { store } from "../store.js";
import { debounce } from "../utils/debounce.js";
import { useKeypress } from "../utils/KeypressHook.jsx";
import "./ImagePage.css";

const nextTooltip = "Go to the next image";
const previousTooltip = "Go to the previous image";
const viewTooltip =
  "Image can be zoomed and moved if toggled on to green. " +
  "If toggled off you can modify the measuring widgets";
const menuTooltip = "Go back to overview";
const lockTooltip = "Lock mode disabled movement of widgets";

const ICON_SIZE = 24;

export default function ImagePage() {
  const { record, areas } = useLoaderData();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [imageMode, setImageMode] = useState(false);
  const [lockMode, setLockMode] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [data, setData] = useState({
    record: record,
    isDirty: false,
    measurements: record?.values,
    boundaryAreas: areas,
  });

  const saveData = useCallback((data) => {
    console.log("auto-save");
    dispatch({
      type: "RecordMeasurementsAction",
      data: {
        imageId: data.record.id,
        measurements: data.measurements,
      },
    });
    if (!data.boundaryAreas) {
      return;
    }
    for (const mid of Object.keys(data.boundaryAreas)) {
      if (
        JSON.stringify(data.boundaryAreas[mid]) === JSON.stringify(areas[mid])
      ) {
        continue;
      }
      dispatch({
        type: "ChangeBoundaryAreaAction",
        data: {
          measurementId: mid,
          boundaryArea: data.boundaryAreas[mid],
          dateUnix: data.record.date,
        },
      });
      setIsAutoSaving(false);
    }
  }, []);

  const debouncedSaveData = useCallback(debounce(saveData, 100), [saveData]);

  useEffect(() => {
    if (data.isDirty) {
      setIsAutoSaving(true);
      debouncedSaveData(data);
    }
  }, [data, debouncedSaveData]);

  useEffect(() => {
    setData({
      record: record,
      measurements: record?.values,
      boundaryAreas: areas,
      isDirty: false,
    });
  }, [record.id]);

  useKeypress(
    "q",
    () => {
      setImageMode(!imageMode);
    },
    [imageMode]
  );

  useKeypress(
    "w",
    () => {
      setLockMode(!lockMode);
    },
    [lockMode]
  );

  return (
    <div className="image-container">
      <div className="image-toolbar">
        <ImageNavigateButton path={"/overview"} tooltip={menuTooltip}>
          <Rows size={ICON_SIZE} />
        </ImageNavigateButton>
        <div style={{ display: "flex" }}>
          <button
            title={viewTooltip}
            className={imageMode ? "active" : ""}
            onClick={() => setImageMode(!imageMode)}
          >
            <MagnifyingGlass size={ICON_SIZE} />
          </button>
          <button
            title={lockTooltip}
            className={lockMode ? "active" : ""}
            onClick={() => setLockMode(!lockMode)}
          >
            <Lock size={ICON_SIZE} />
          </button>
        </div>
        <div className="controls">
          {record?.prevId ? (
            <ImageNavigateButton
              path={"/image/" + record.prevId}
              tooltip={previousTooltip}
              hotkey="ArrowLeft"
            >
              <ArrowLeft size={ICON_SIZE} />
            </ImageNavigateButton>
          ) : null}
          {record?.nextId ? (
            <ImageNavigateButton
              path={"/image/" + record.nextId}
              tooltip={nextTooltip}
              hotkey="ArrowRight"
            >
              <ArrowRight size={ICON_SIZE} />
            </ImageNavigateButton>
          ) : null}
        </div>
      </div>
      <ImageTimestamp imageDate={record.date} />
      <ImageAutoSave isAutoSaving={isAutoSaving} />
      <ImageMoverArea imageMode={imageMode}>
        {Object.values(state.measurements.setup).map((x) => (
          <MovableLineMeasureArea
            key={
              JSON.stringify(data.boundaryAreas?.[x.id]) +
              JSON.stringify(data.measurements?.[x.id] || null) +
              record.id +
              [x.id]
            }
            imageId={record.id}
            name={x.id}
            displayName={x.name}
            color={x.color}
            disabled={imageMode || lockMode}
            value={data.measurements?.[x.id]}
            setValue={(v) =>
              setData({
                ...data,
                isDirty: true,
                measurements: { ...data.measurements, [x.id]: v },
              })
            }
            measureValues={data.boundaryAreas?.[x.id]}
            setMeasureValues={(v) =>
              setData({
                ...data,
                isDirty: true,
                boundaryAreas: { ...data.boundaryAreas, [x.id]: v },
              })
            }
          />
        ))}
        <MeasurementImage imagePath={record.path} />
      </ImageMoverArea>
    </div>
  );
}
