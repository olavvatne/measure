import React, {createContext, useReducer} from 'react';

const initialState = {
    images: {

    },
    currentMeasurer: {
      og: null,
      ow: null,
    },
    historicMeasurer: {
      og: {
        "0": {
          fromDate: 0,
          offsetWidth: 200,
          offsetHeight: 100,
          x: 20,
          y: 100,
          minValue: 1,
          maxValue: 18,
          minLocation: null,
          maxLocation: null,
        }
      },
      ow: {
        "0": {
          fromDate: 0,
          x: 320,
          y: 100,
          offsetWidth: 200,
          offsetHeight: 100,
          minValue: 1,
          maxValue: 18,
          minLocation: null,
          maxLocation: null,
        }
      },
    },
    view: {
      scale: 1, 
      pointX: 0, 
      pointY: 0, 
    }
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    let newState = null;
    switch(action.type) {
      case 'ViewChangeAction':
        newState = {...state, view: action.data };
        return newState;
      case 'ImagesChangeAction':
        newState = {...state, images: action.data };
        return newState;
      case 'SetCurrentMeasurerAction': {
        const dateUnix = action.data.dateUnix;
        const measurers = Object.keys(state.historicMeasurer);
        const newCurrent = {};
        for (let i = 0; i < measurers.length; i ++) {
          const m = Object.values(state.historicMeasurer[measurers[i]]);
          const closestMatch = m.reduce(function(prev, current) {
            const prevDiff = dateUnix - prev.fromDate;
            const currentDiff = dateUnix - current.fromDate;
            if (currentDiff < 0) {
              return prev;
            }
            
            return (prevDiff > currentDiff) ? current : prev
          }); 
          newCurrent[measurers[i]] = closestMatch;
        }
        newState = {...state, currentMeasurer: newCurrent };
        return newState;
      }
      case 'NewMeasureValuesAction': {
        const current = state.currentMeasurer[action.data.name];
        const dateUnix = action.data.dateUnix;
        const newValues = action.data.values;
        if (!current || !newValues) {
          return {...state};
        }
        let union = new Set([...Object.keys(newValues), ...Object.keys(current)]);
        union.delete("fromDate");
        // union = union.filter(x => x !== "fromDate");
        const uniqueKeys = [...union];
        let isEqual = true;
        for (let i = 0; i < uniqueKeys.length; i++) {
          if (newValues[uniqueKeys[i]] !== current[uniqueKeys[i]]) {
            isEqual = false;
            break;
          }
        }
        if(isEqual) {
          return {...state};
        }
       
        newState = {...state, historicMeasurer: {...state.historicMeasurer,
          [action.data.name]: { ...state.historicMeasurer[action.data.name],
            [dateUnix + ""]: {
              ...newValues,
              fromDate: dateUnix,
            }
          }
        }};
      }
      return newState;

      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export {store, StateProvider};