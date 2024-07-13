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
    current: {
      og: null,
      ow: null,
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
      case "SetCurrentMeasurerAction": {
        const dateUnix = action.data.dateUnix;
        const measurers = Object.keys(state.measurements.history);
        const newCurrent = {};
        for (let i = 0; i < measurers.length; i++) {
          const m = Object.values(state.measurements.history[measurers[i]]);
          const closestMatch = m.reduce(function (prev, current) {
            const prevDiff = dateUnix - prev.fromDate;
            const currentDiff = dateUnix - current.fromDate;
            if (currentDiff < 0) {
              return prev;
            }

            return prevDiff > currentDiff ? current : prev;
          });
          newCurrent[measurers[i]] = closestMatch;
        }
        newState = {
          ...state,
          measurements: { ...state.measurements, current: newCurrent },
        };
        return newState;
      }
      case "NewMeasureValuesAction": {
        const measureKeys = Object.keys(action.data);
        let newState = { ...state };

        for (let i = 0; i < measureKeys.length; i++) {
          const k = measureKeys[i];
          const d = action.data[k];

          const current = state.measurements.current[k];
          const dateUnix = d.dateUnix;
          const newValues = d.values;
          if (!current || !newValues) {
            continue;
            // return {...state};
          }

          let union = new Set([
            ...Object.keys(newValues),
            ...Object.keys(current),
          ]);
          union.delete("fromDate");
          union.delete("value");
          union.delete("id");
          // union = union.filter(x => x !== "fromDate");
          const uniqueKeys = [...union];
          let isEqual = true;
          for (let i = 0; i < uniqueKeys.length; i++) {
            if (newValues[uniqueKeys[i]] !== current[uniqueKeys[i]]) {
              isEqual = false;
              break;
            }
          }
          newValues.type = "calibration";

          const newImages = {
            ...newState.images,
            [d.id]: {
              ...newState.images[d.id],
              values: {
                ...newState.images[d.id].values,
                [d.name]: d.recordedValues[d.name],
              },
            },
          };

          if (isEqual) {
            newState = { ...newState, images: newImages };
            continue;
          }
          newState = {
            ...newState,
            measurements: {
              ...newState.measurements,
              history: {
                ...newState.measurements.history,
                [d.name]: {
                  ...newState.measurements.history[d.name],
                  [dateUnix + ""]: {
                    ...newValues,
                    fromDate: dateUnix,
                  },
                },
              },
            },
            images: newImages,
          };
        }
        return newState;
      }

      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
