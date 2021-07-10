import React, {createContext, useReducer} from 'react';

const initialState = {
    images: {

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
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export {store, StateProvider};