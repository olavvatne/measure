import React, { createContext, useReducer } from "react";

const initialState = {
  version: 2,
  images: {},
  general: {
    name: "",
  },
  measurements: {
    setup: {
      og: {
        id: "og",
        color: "#FF0000",
        name: "O/G",
      },
      ow: {
        id: "ow",
        color: "#0000FF",
        name: "O/W",
      },
    },
    history: {
      og: {
        0: {
          fromDate: 0,
          offsetWidth: 200,
          offsetHeight: 100,
          x: 20,
          y: 100,
          minValue: 1,
          maxValue: 18,
        },
      },
      ow: {
        0: {
          fromDate: 0,
          x: 320,
          y: 100,
          offsetWidth: 200,
          offsetHeight: 100,
          minValue: 1,
          maxValue: 18,
        },
      },
    },
  },
  view: {
    scale: 1,
    pointX: 0,
    pointY: 0,
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
      case "ViewChangeAction":
        newState = { ...state, view: action.data };
        return newState;
      case "HydrateAction":
        newState = action.data;
        return newState;
      case "TableChangeAction":
        newState = { ...state, table: { ...state.table, ...action.data } };
        return newState;
      case "ImagesChangeAction":
        newState = { ...state, images: action.data };
        return newState;
      case "RecordMeasurementsAction": {
        const { imageId, measurements } = action.data;
        const newImages = {
          ...state.images,
          [imageId]: {
            ...state.images[imageId],
            values: {
              ...state.images[imageId]?.values,
              ...measurements,
            },
          },
        };
        return { ...state, images: newImages };
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
