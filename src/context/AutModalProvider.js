import React, { useState, useContext } from "react";

const AuthModalContext = React.createContext();

export const AuthModalProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(false);
    const showModal = () => {
        setOpenModal((openModal) => (openModal=true));
      };
  return (
    <AuthModalContext.Provider value={{ openModal, setOpenModal ,showModal}}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
