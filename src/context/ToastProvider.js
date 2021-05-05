import React, { useContext, useReducer, useState } from "react";

const ToastContext = React.createContext();

const initialState = {
  showToast: false,
  toastType: "",
  toastMessage: "",
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_TOAST":
      return { ...state, showToast: action.payload };
    case "TOAST_TYPE":
      return { ...state, toastType: action.payload.toastType };
    case "TOAST_MESSAGE":
      return { ...state, toastMessage: action.payload.toastMessage };
  }
};

export const ToastProvider = ({ children }) => {
//   const [showToast, setShowToast] = useState(false);

  const [{showToast, toastType,toastMessage}, dispatchToast] = useReducer(toastReducer, initialState);

  return (
    <ToastContext.Provider value={{showToast, toastType,toastMessage,dispatchToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
