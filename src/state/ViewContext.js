import React, { createContext, useState } from "react";

const ViewContext = createContext();

const ViewProvider = ({ children }) => {
  const [view, setView] = useState({
    editor: { scale: 1, pointX: 0, pointY: 0 },
  });

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};

export { ViewContext, ViewProvider };
