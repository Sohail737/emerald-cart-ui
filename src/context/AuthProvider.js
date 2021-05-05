import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

const initialAuthState = {
  name: "",
  email: "",
  password: "",
  isUserSignedUp: false,
  isUserLoggedIn: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_CREDENTIALS":
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
        password: action.payload.password,
      };

    case "CLEAR_CREDENTIALS":
      return { ...state, name: "", email: "", password: "" };

    case "SIGNUP_USER":
      return { ...state, isUserSignedUp: true };

    case "LOGIN_USER":
      return { ...state, isUserLoggedIn: true };

    case "LOGOUT_USER":
      return { ...state, isUserLoggedIn: false };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [
    { name, email, password, isUserSignedUp, isUserLoggedIn },
    dispatchAuth,
  ] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  useEffect(() => {
    const loginStatus = JSON.parse(localStorage?.getItem("login"));

    if (loginStatus?.isUserLoggedIn) {
      dispatchAuth({ type: "LOGIN_USER" });
    }
    if (loginStatus?.name && loginStatus?.email) {
      dispatchAuth({
        type: "SET_CREDENTIALS",
        payload: {
          name: loginStatus.name,
          email: loginStatus.email,
        },
      });
    }
  }, []);

  const logoutUser = () => {
    dispatchAuth({ type: "CLEAR_CREDENTIALS" });
    dispatchAuth({ type: "LOGOUT_USER" });
    localStorage?.removeItem("login");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        name,
        email,
        password,
        isUserSignedUp,
        isUserLoggedIn,
        logoutUser,
        dispatchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
