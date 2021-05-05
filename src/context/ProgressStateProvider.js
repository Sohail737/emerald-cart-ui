import React, { useContext, useReducer } from "react";

const ProgressStateContext = React.createContext();

const appStates = {
  success: "success",
  loading: "loading",
  error: "error",
};
const initialAppState = {
  productPageState: "",
  cartState: { status: "", id: "" },
  cartStateInProductPage:{status:"",productId:""},
  wishlistState: { status: "", id: "" }
};

const appStateReducer = (state, action) => {
  switch (action.type) {
    //ProductList
    case "PRODUCT_PAGE_LOADING":
      return { ...state, productPageState: appStates.loading };
    case "PRODUCT_PAGE_SUCCESS":
      return { ...state, productPageState: appStates.success };
    case "PRODUCT_PAGE_ERROR":
      return { ...state, productPageState: appStates.error };
    //Add to cart
    case "CART_LOADING":
      return {
        ...state,
        cartState: { status: appStates.loading, id: action.payload.id },
      };
    case "CART_SUCCESS":
      return {
        ...state,
        cartState: { status: appStates.success, id: action.payload.id },
      };
    case "CART_ERROR":
      return {
        ...state,
        cartState: { status: appStates.error, id: action.payload.id },
      };
      case "CART_IN_PRODUCT_LOADING":
      return {
        ...state,
        cartStateInProductPage: { status: appStates.loading, productId: action.payload.id },
      };
    case "CART_IN_PRODUCT_SUCCESS":
      return {
        ...state,
        cartStateInProductPage: { status: appStates.success, productId: action.payload.id },
      };
    case "CART_IN_PRODUCT_ERROR":
      return {
        ...state,
        cartStateInProductPage: { status: appStates.error, productId: action.payload.id },
      };
    case "WISHLIST_LOADING":
      return {
        ...state,
        wishlistState: { status: appStates.loading, id: action.payload.id },
      };
    case "WISHLIST_SUCCESS":
      return {
        ...state,
        wishlistState: { status: appStates.success, id: action.payload.id },
      };
    case "WISHLIST_ERROR":
      return {
        ...state,
        wishlistState: { status: appStates.error, id: action.payload.id },
      };
  }
};

export const ProgressStateProvider = ({ children }) => {
  const [appState, dispatchAppState] = useReducer(
    appStateReducer,
    initialAppState
  );
  return (
    <ProgressStateContext.Provider value={{ appState, dispatchAppState }}>
      {children}
    </ProgressStateContext.Provider>
  );
};

export const useProgressState = () => useContext(ProgressStateContext);
