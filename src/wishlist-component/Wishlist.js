import { useCartAndWishlist } from "../context/CartAndWishlistProvider";
import { useAxios } from "../custom-hooks/Axios";
import { useProgressState } from "../context/ProgressStateProvider";
import styles from "./Wishlist.module.css";
import { useToast } from "../context/ToastProvider";
import { useNavigate } from "react-router";
import { discountCalc } from "../misc/util";

export const Wishlist = () => {
  const {
    cartAndWishlistState,
    dispatchToCartAndWishlist,
  } = useCartAndWishlist();
  const { callApi } = useAxios();
  const { appState, dispatchAppState } = useProgressState();
  const { dispatchToast } = useToast();
  const navigate = useNavigate();

  const addToCart = async (itemInWishlist) => {
    try {
      dispatchAppState({
        type: "WISHLIST_LOADING",
        payload: { id: itemInWishlist._id },
      });
      const response = await callApi(
        `https://e-com-backend.asohail737.repl.co/cart-items/${itemInWishlist._id}`,
        {
          wishlisted: false,
        },
        "post"
      );
      if (response.status === 200) {
        dispatchToast({
          type: "TOAST_TYPE",
          payload: { toastType: "success" },
        });
        dispatchToast({
          type: "TOAST_MESSAGE",
          payload: { toastMessage: "Added to cart" },
        });
        dispatchToast({ type: "TOGGLE_TOAST", payload: true });
        dispatchToCartAndWishlist({
          type: "ADD_TO_CART",
          payload: response.data.data,
        });
        dispatchAppState({
          type: "WISHLIST_SUCCESS",
          payload: { id: itemInWishlist._id },
        });
      }
    } catch (error) {
      console.log("Error while updating cart : ", error);
      dispatchAppState({
        type: "WISHLIST_ERROR",
        payload: { id: itemInWishlist._id },
      });
      dispatchToast({
        type: "TOAST_TYPE",
        payload: { toastType: "error" },
      });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Error occurred while adding to cart" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      dispatchAppState({
        type: "WISHLIST_LOADING",
        payload: { id },
      });
      const response = await callApi(
        `https://e-com-backend.asohail737.repl.co/cart-items/${id}`,
        null,
        "delete"
      );
      if (response.status === 200) {
        dispatchToCartAndWishlist({
          type: "REMOVE_FROM_WISHLIST",
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
      dispatchAppState({
        type: "WISHLIST_ERROR",
        payload: { id },
      });
      dispatchToast({
        type: "TOAST_TYPE",
        payload: { toastType: "error" },
      });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Error occurred while removing from cart" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
    }
  };

  const { wishlistState } = appState;
  const { cart } = cartAndWishlistState;

  return (
    <div className={styles.wishlist}>
      {cart.filter((item) => item.wishlisted).length === 0 ? (
        <div className={styles.emptyWishList}>
          <h3>Empty Wishlist</h3>
          <p>Your wishlist is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="btn primary large"
          >
            Add Items
          </button>
        </div>
      ) : (
        <>
          <h2 className="margin-left">My Wishlist</h2>
          <div className={styles.wishlistContainer}>
            {cart
              .filter((item) => item.wishlisted)
              .map((itemInWishlist) => {
                return (
                  <div
                    onClick={() =>
                      navigate(`/products/${itemInWishlist.product._id}`)
                    }
                    key={itemInWishlist._id}
                    className={styles.wishlistCard + " card"}
                  >
                    <div className="card-img">
                      <img src={itemInWishlist.product.image} alt="" />
                      <button
                        onClick={(e) => {
                          removeFromWishlist(itemInWishlist._id);
                          e.stopPropagation();
                        }}
                        className={
                          wishlistState.status === "loading" &&
                          wishlistState.id === itemInWishlist._id
                            ? styles.cancelBtn + " btn round disabled"
                            : styles.cancelBtn + " btn round"
                        }
                      >
                        X
                      </button>
                    </div>
                    <div className="card-detail">
                      <div
                        role="heading"
                        className={styles.wishlistCardHeading + " card-heading"}
                      >
                        {itemInWishlist.product.name}
                      </div>
                      <div className="card-content">
                        <span className="product-detail">
                          {itemInWishlist.product.discount === 0 && (
                            <span>Rs {itemInWishlist.product.price}</span>
                          )}
                          {itemInWishlist.product.discount > 0 && (
                            <>
                              <span>
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  Rs {itemInWishlist.product.price}
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
                                  itemInWishlist.product.price,
                                  itemInWishlist.product.discount
                                )}
                              </span>
                              <span style={{ fontStyle: "oblique" }}>
                                ({itemInWishlist.product.discount}% off)
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="card-footer">
                        {wishlistState.status === "loading" &&
                        wishlistState.id === itemInWishlist._id ? (
                          <button
                            className={
                              styles.wishlistCardBtn + " btn disabled margin"
                            }
                          >
                            Moving to Cart
                          </button>
                        ) : (
                          <button
                            className={
                              styles.wishlistCardBtn + " btn primary margin"
                            }
                            onClick={(e) => {
                              addToCart(itemInWishlist);
                              e.stopPropagation();
                            }}
                          >
                            Move to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};
