import React, { createContext, useReducer } from "react";
import { getUniqueShortId } from "../utils/guid";
import {
  fluidContactTemplate,
  newMeasurementTemplate,
} from "../utils/template";

const fluidTemplate = fluidContactTemplate();

const initialState = {
  projectLoaded: false,
  general: {
    name: "",
  },
  values: {},
  setup: fluidTemplate.setup,
  history: fluidTemplate.history,
};

const MeasurementsContext = createContext(initialState);
const { Provider } = MeasurementsContext;

const MeasurementsProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    let newState = null;
    switch (action.type) {
      case "MeasurementSetupChangeAction":
        const { id, key, value } = action.data;
        newState = {
          ...state,
          setup: {
            ...state.setup,
            [id]: {
              ...state.setup[id],
              [key]: value,
            },
          },
        };
        return newState;
      case "HydrateAction":
        newState = action.data;
        newState.projectLoaded = true;
        return newState;
      case "ImagesChangeAction":
        newState = { ...initialState, projectLoaded: true };
        return newState;
      case "RecordMeasurementsAction": {
        const { imageId, dateUnix, measurements } = action.data;
        return {
          ...state,
          values: {
            ...state.values,
            [dateUnix]: {
              id: imageId,
              date: dateUnix,
              data: measurements,
            },
          },
        };
      }
      case "ChangeBoundaryAreaAction": {
        const { measurementId, boundaryArea, dateUnix } = action.data;
        boundaryArea.type = "calibration";
        return {
          ...state,
          history: {
            ...state.history,
            [measurementId]: {
              ...state.history[measurementId],
              [dateUnix + ""]: {
                ...boundaryArea,
                fromDate: dateUnix,
              },
            },
          },
        };
      }
      case "SetupNewMeasurementAction": {
        const id = getUniqueShortId(new Set(Object.keys(state.setup)));
        const newTemplate = newMeasurementTemplate(id);
        return {
          ...state,
          setup: {
            ...state.setup,
            ...newTemplate.setup,
          },
          history: {
            ...state.history,
            ...newTemplate.history,
          },
        };
      }
      case "DeleteMeasurementAction": {
        const { id } = action.data;
        const { [id]: _, ...newSetup } = state.setup;
        const { [id]: __, ...newHistory } = state.history;
        return {
          ...state,
          setup: newSetup,
          history: newHistory,
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

    if (!state.setup[id]) {
      throw Error(`Measurement with id ${id} does not exist`);
    }
    const closestMatch = Object.values(state.history[id]).reduce(function (
      prev,
      current
    ) {
      const prevDiff = dateUnix - prev.fromDate;
      const currentDiff = dateUnix - current.fromDate;
      if (currentDiff < 0) {
        return prev;
      }
      return prevDiff > currentDiff ? current : prev;
    });
    return closestMatch;
  }

  function getCurrentBoundaryAreas(dateUnix) {
    const boundaries = {};
    for (const measureId of Object.keys(state.setup)) {
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

export { MeasurementsContext, MeasurementsProvider };
