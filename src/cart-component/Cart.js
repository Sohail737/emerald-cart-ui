import { useCartAndWishlist } from "../context/CartAndWishlistProvider";
import { useAxios } from "../custom-hooks/Axios";
import { useProgressState } from "../context/ProgressStateProvider";
import { useToast } from "../context/ToastProvider";
import styles from "./Cart.module.css";
import { discountCalc, cartPriceCalculator } from "../misc/util";
import { useNavigate } from "react-router";

export const Cart = () => {
  const {
    cartAndWishlistState,
    dispatchToCartAndWishlist,
  } = useCartAndWishlist();
  const { callApi } = useAxios();
  const navigate=useNavigate();

  const { appState, dispatchAppState } = useProgressState();
  const { dispatchToast } = useToast();

  const addToWishlist = async (itemInCart) => {
    try {
      dispatchAppState({
        type: "CART_LOADING",
        payload: { id: itemInCart._id },
      });
      const response = await callApi(
        `https://e-com-backend.asohail737.repl.co/cart-items/${itemInCart._id}`,
        {
          wishlisted: true,
        },
        "post"
      );

      if (response.status === 200) {
        dispatchAppState({
          type: "CART_SUCCESS",
          payload: { id: response.data.data._id },
        });
        dispatchToast({
          type: "TOAST_TYPE",
          payload: { toastType: "success" },
        });
        dispatchToast({
          type: "TOAST_MESSAGE",
          payload: { toastMessage: "Added to wishlist" },
        });
        dispatchToast({ type: "TOGGLE_TOAST", payload: true });
        dispatchToCartAndWishlist({
          type: "ADD_TO_WISHLIST",
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.log("Error while adding from cart to wishlist", error);
      dispatchAppState({
        type: "CART_ERROR",
        payload: { id: itemInCart._id },
      });
      dispatchToast({
        type: "TOAST_TYPE",
        payload: { toastType: "error" },
      });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Error while adding to wishlist" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
    }
  };
  const changeCartQuantity = async (itemInCart, operation) => {
    try {
      if (operation === "inc") {
        dispatchAppState({
          type: "CART_LOADING",
          payload: { id: itemInCart._id },
        });
        const response = await callApi(
          `https://e-com-backend.asohail737.repl.co/cart-items/${itemInCart._id}`,
          { quantity: itemInCart.quantity + 1 },
          "post"
        );
        if (response.status === 200) {
          dispatchToCartAndWishlist({
            type: "INCREMENT_CART",
            payload: { id: itemInCart._id },
          });
          dispatchAppState({
            type: "CART_SUCCESS",
            payload: { id: itemInCart._id },
          });
          dispatchToast({
            type: "TOAST_TYPE",
            payload: { toastType: "success" },
          });
          dispatchToast({
            type: "TOAST_MESSAGE",
            payload: { toastMessage: "Product quantity increased" },
          });
          dispatchToast({ type: "TOGGLE_TOAST", payload: true });
        }
      } else {
        if (itemInCart.quantity > 1) {
          dispatchAppState({
            type: "CART_LOADING",
            payload: { id: itemInCart._id },
          });
          const response = await callApi(
            `https://e-com-backend.asohail737.repl.co/cart-items/${itemInCart._id}`,
            { quantity: itemInCart.quantity - 1 },
            "post"
          );
          if (response.status === 200) {
            dispatchToCartAndWishlist({
              type: "DECREMENT_CART",
              payload: { id: itemInCart._id },
            });
            dispatchAppState({
              type: "CART_SUCCESS",
              payload: { id: itemInCart._id },
            });

            dispatchToast({
              type: "TOAST_TYPE",
              payload: { toastType: "success" },
            });
            dispatchToast({
              type: "TOAST_MESSAGE",
              payload: { toastMessage: "Product quantity decreased" },
            });
            dispatchToast({ type: "TOGGLE_TOAST", payload: true });
          }
        }
      }
    } catch (error) {
      console.log("Error while updating cart : ", error);
      dispatchAppState({
        type: "CART_ERROR",
        payload: { id: itemInCart._id },
      });
      dispatchToast({
        type: "TOAST_TYPE",
        payload: { toastType: "error" },
      });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Error while changing quantity" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
    }
  };

  const removeFromCart = async (id) => {
    try {
      dispatchAppState({
        type: "CART_LOADING",
        payload: { id },
      });
      const response = await callApi(
        `https://e-com-backend.asohail737.repl.co/cart-items/${id}`,
        null,
        "delete"
      );
      if (response.status === 200) {
        dispatchAppState({
          type: "CART_SUCCESS",
          payload: { id },
        });
        dispatchToCartAndWishlist({
          type: "REMOVE_FROM_CART",
          payload: { id },
        });

        dispatchToast({
          type: "TOAST_TYPE",
          payload: { toastType: "success" },
        });
        dispatchToast({
          type: "TOAST_MESSAGE",
          payload: { toastMessage: "Removed from cart" },
        });
        dispatchToast({ type: "TOGGLE_TOAST", payload: true });
      }
    } catch (err) {
      console.log("err while deleting from cart", err);
      dispatchAppState({
        type: "CART_ERROR",
        payload: { id },
      });
      dispatchToast({
        type: "TOAST_TYPE",
        payload: { toastType: "error" },
      });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Error occurred whle removing from cart" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
    }
  };

  const { cartState } = appState;
  const { cart } = cartAndWishlistState;

  const { price, discountedPrice } = cartPriceCalculator(cart);

  return (
    <div className={styles.cart}>
      {cart.filter((item) => !item.wishlisted).length === 0 ? (
        <div className={styles.emptyCart}>
          <h3>Empty Cart</h3>
          <p>Your cart is empty</p>
          <button onClick={()=>navigate('/products')} className="btn primary large">Shop Now</button>
        </div>
      ) : (
        <>
          <h2 className="margin-left">My Cart</h2>

          <div className={styles.cartContainer}>
            <ul className={styles.cartDetails + " stacked-list"}>
              {cart
                .filter((item) => !item.wishlisted)
                .map((itemInCart) => {
                  return (
                    <li className="list-item" key={itemInCart._id}>
                      <div className={styles.cartItem}>
                        <div className={styles.cartContent}>
                          <div className={styles.cartImg}>
                            <img src={itemInCart.product.image} alt="" />
                          </div>
                          <div className={styles.cartDescription}>
                            <div role="heading" className={styles.cartHeading}>
                              {itemInCart.product.name}
                            </div>

                            <div className={styles.cardContentDescription}>
                              <span className={styles.productDescription}>
                                <span>
                                  <span
                                    style={{ textDecoration: "line-through" }}
                                  >
                                    Rs {itemInCart.product.price}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    margin: "0 0.5rem",
                                  }}
                                >
                                  Rs{" "}
                                  {discountCalc(
                                    itemInCart.product.price,
                                    itemInCart.product.discount
                                  )}
                                </span>
                                <span style={{ fontStyle: "oblique" }}>
                                  ({itemInCart.product.discount}% off)
                                </span>
                              </span>
                              <span className={styles.productDescription}>
                                {itemInCart.product.fastDelivery
                                  ? "Fast delivery available"
                                  : "Standard Delivery"}
                              </span>
                              {/* <span className={styles.productDescription}>
                                Seller {itemInCart.seller}
                              </span> */}
                            </div>
                          </div>
                        </div>
                        <div className={styles.cartFooter}>
                          <div className={styles.cartButtonQuantity}>
                            <button
                              className={
                                cartState.status == "loading" &&
                                cartState.id === itemInCart._id
                                  ? "btn round disabled"
                                  : "btn round"
                              }
                              onClick={() =>
                                changeCartQuantity(itemInCart, "inc")
                              }
                            >
                              +
                            </button>
                            <span
                              className={styles.cartQuantity + " margin-lr"}
                            >
                              {itemInCart.quantity}
                            </span>
                            <button
                              className={
                                cartState.status == "loading" &&
                                cartState.id === itemInCart._id
                                  ? "btn round disabled"
                                  : "btn round"
                              }
                              onClick={() =>
                                changeCartQuantity(itemInCart, "dec")
                              }
                            >
                              -
                            </button>
                          </div>
                          <div className={styles.cartButtonRemoveMove}>
                            <button
                              className={
                                cartState.status === "loading" &&
                                cartState.id === itemInCart._id
                                  ? "btn primary outline disabled margin-right"
                                  : "btn primary outline margin-right"
                              }
                              onClick={() => addToWishlist(itemInCart)}
                            >
                              wishlist
                            </button>
                            <button
                              className={
                                cartState.status === "loading" &&
                                cartState.id === itemInCart._id
                                  ? "btn primary outline disabled margin-right"
                                  : "btn primary outline margin-right"
                              }
                              onClick={() => removeFromCart(itemInCart._id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div className={styles.cartPriceDetails}>
              <div role="heading" className={styles.cartPriceDetailsHeading}>
                Price Details
              </div>
              <div className={styles.cartPriceDetailsPills}>
                <div className={styles.key}>Price</div>
                <div className={styles.value}>Rs {price}</div>
              </div>
              <div className={styles.cartPriceDetailsPills}>
                <div className={styles.key}>Discount</div>
                <div className={styles.value}>-Rs {discountedPrice}</div>
              </div>
              <div className={styles.cartPriceDetailsPills + " bold"}>
                <div className={styles.keyTotal}>Total Amount</div>
                <div className={styles.valueTotal}>
                  Rs {(price - discountedPrice).toFixed(2)}
                </div>
              </div>
              <div role="footer" className={styles.cartPriceDetailsFooter}>
                You will save Rs {discountedPrice} on this order
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
