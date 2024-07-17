import React, { createContext, useReducer } from "react";
import { getUniqueShortId } from "./utils/guid";
import { fluidContactTemplate, newMeasurementTemplate } from "./utils/template";

const fluidTemplate = fluidContactTemplate();

const initialState = {
  version: 2,
  images: {},
  general: {
    name: "",
  },
  measurements: {
    values: {},
    setup: fluidTemplate.setup,
    history: fluidTemplate.history,
  },
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    let newState = null;
    switch (action.type) {
      case "MeasurementSetupChangeAction":
        const { id, key, value } = action.data;
        newState = {
          ...state,
          measurements: {
            ...state.measurements,
            setup: {
              ...state.measurements.setup,
              [id]: {
                ...state.measurements.setup[id],
                [key]: value,
              },
            },
          },
        };
        return newState;
      case "HydrateAction":
        newState = action.data;
        return newState;
      case "ImagesChangeAction":
        newState = { ...state, images: action.data };
        return newState;
      case "RecordMeasurementsAction": {
        const { imageId, dateUnix, measurements } = action.data;
        return {
          ...state,
          measurements: {
            ...state.measurements,
            values: {
              ...state.measurements.values,
              [dateUnix]: {
                id: imageId,
                date: dateUnix,
                data: measurements,
              },
            },
          },
        };
      }
      case "ChangeBoundaryAreaAction": {
        const { measurementId, boundaryArea, dateUnix } = action.data;
        boundaryArea.type = "calibration";
        return {
          ...state,
          measurements: {
            ...state.measurements,
            history: {
              ...state.measurements.history,
              [measurementId]: {
                ...state.measurements.history[measurementId],
                [dateUnix + ""]: {
                  ...boundaryArea,
                  fromDate: dateUnix,
                },
              },
            },
          },
        };
      }
      case "SetupNewMeasurementAction": {
        const id = getUniqueShortId(
          new Set(Object.keys(state.measurements.setup))
        );
        const newTemplate = newMeasurementTemplate(id);
        return {
          ...state,
          measurements: {
            ...state.measurements,
            setup: {
              ...state.measurements.setup,
              ...newTemplate.setup,
            },
            history: {
              ...state.measurements.history,
              ...newTemplate.history,
            },
          },
        };
      }
      case "DeleteMeasurementAction": {
        const { id } = action.data;
        const { [id]: _, ...newSetup } = state.measurements.setup;
        const { [id]: __, ...newHistory } = state.measurements.history;
        return {
          ...state,
          measurements: {
            ...state.measurements,
            setup: newSetup,
            history: newHistory,
          },
        };
      }
      default:
        throw new Error();
    }
  }, initialState);

  function getCurrentBoundaryArea(id, dateUnix) {
    if (dateUnix === undefined) {
      throw Error("unix time not provided");
    }

    if (!state.measurements.setup[id]) {
      throw Error(`Measurement with id ${id} does not exist`);
    }
    const closestMatch = Object.values(state.measurements.history[id]).reduce(
      function (prev, current) {
        const prevDiff = dateUnix - prev.fromDate;
        const currentDiff = dateUnix - current.fromDate;
        if (currentDiff < 0) {
          return prev;
        }
        return prevDiff > currentDiff ? current : prev;
      }
    );
    return closestMatch;
  }

  function getCurrentBoundaryAreas(dateUnix) {
    const boundaries = {};
    for (const measureId of Object.keys(state.measurements.setup)) {
      boundaries[measureId] = getCurrentBoundaryArea(measureId, dateUnix);
    }
    return boundaries;
  }
  return (
    <Provider
      value={{
        state,
        dispatch,
        getCurrentBoundaryArea,
        getCurrentBoundaryAreas,
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
