"use client";
import React, { createContext, useContext, useState } from "react";

const ParentcraftContext = createContext();

export const ParentcraftContextProvider = ({ children }) => {
  const [refreshData, setRefreshData] = useState(false);

  return (
    <ParentcraftContext.Provider
      value={{
        refreshData,
        setRefreshData,
      }}
    >
      {children}
    </ParentcraftContext.Provider>
  );
};

export const useParentcraftContext = () => {
  return useContext(ParentcraftContext);
};
