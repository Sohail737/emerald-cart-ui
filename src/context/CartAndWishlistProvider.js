import React, { useReducer, useContext } from "react";
import { discountCalc } from "../misc/util";

const CartAndWishlistContext = React.createContext();

const initialCart = {
  cart: [],
};

const initialCartPrice = {
  price: 0,
  discountedPrice: 0,
};

const cartPriceReducer = (state, action) => {
  const { cart } = action.payload;
  
  return {
    ...state,
    price: cart.reduce((acc, curr) => {
      return acc + Number(curr.price*curr.quantity);
    }, 0),
    discountedPrice: cart.reduce((acc, curr) => {
      return acc + ((curr.price*curr.quantity)-discountCalc(curr.price*curr.quantity, curr.discount));
    }, 0),
  };

  // return cart.reduce((acc,curr)=>{
  //   return{...acc,price:acc.price+curr.price,discountedPrice:acc.discountedPrice+discountCalc(curr.price,curr.discount)}

  // },initialObj)
};

const cartAndWishlistReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT_CART":
      return {
        ...state,
        cart: state.cart.map((cartItem) => {
          if (action.payload.id === cartItem._id) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return { ...cartItem };
        }),
      };
    case "DECREMENT_CART":
      return {
        ...state,
        cart: state.cart.map((cartItem) => {
          if (action.payload.id === cartItem._id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1,
            };
          }
          return { ...cartItem };
        }),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (itemInCart) => itemInCart._id !== action.payload.id
        ),
      };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        cart: state.cart.filter(
          (itemInWishlist) => itemInWishlist._id !== action.payload.id
        ),
      };

    case "ADD_TO_WISHLIST":
      if (
        state.cart.filter(
          (item) =>
            item.product._id === action.payload.product && !item.wishlisted
        ).length > 0
      ) {
        return {
          ...state,
          cart: state.cart.map((wishlistItem) => {
            if (wishlistItem.product._id === action.payload.product) {
              return { ...wishlistItem, wishlisted: true };
            }
            return { ...wishlistItem };
          }),
        };
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              ...action.payload,
            },
          ],
        };
      }

    case "INITIALIZE":
      return { ...state, cart: action.payload };

    case "ADD_TO_CART":
      if (
        state.cart.filter(
          (item) =>
            item.product._id === action.payload.product && item.wishlisted
        ).length > 0
      ) {
        return {
          ...state,
          cart: state.cart.map((cartItem) => {
            if (cartItem.product._id === action.payload.product) {
              return { ...cartItem, wishlisted: false };
            }
            return { ...cartItem };
          }),
        };
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              ...action.payload,
            },
          ],
        };
      }

    default:
      console.log("some error");
  }
};

export const CartAndWishlistProvider = ({ children }) => {
  const [cartAndWishlistState, dispatchToCartAndWishlist] = useReducer(
    cartAndWishlistReducer,
    initialCart
  );

  const [{ price, discountedPrice }, dispatchCartPrice] = useReducer(
    cartPriceReducer,
    initialCartPrice
  );

  return (
    <CartAndWishlistContext.Provider
      value={{
        cartAndWishlistState,
        dispatchToCartAndWishlist,
        price,
        discountedPrice,
        dispatchCartPrice,
      }}
    >
      {children}
    </CartAndWishlistContext.Provider>
  );
};

export const useCartAndWishlist = () => useContext(CartAndWishlistContext);
