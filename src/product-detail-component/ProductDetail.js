import styles from "./ProductDetail.module.css";
import { useAxios } from "../custom-hooks/Axios";
import { useNavigate, useParams } from "react-router";
import { useState,useEffect } from "react";
import { discountCalc } from "../misc/util";
import { useCartAndWishlist } from "../context/CartAndWishlistProvider";
import { useProgressState } from "../context/ProgressStateProvider";
import { useToast } from "../context/ToastProvider";
import { Preloader } from "../pre-loader-component/Preloader";

export const ProductDetail = () => {
  const { callApi } = useAxios();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const {
    cartAndWishlistState,
    dispatchToCartAndWishlist,
  } = useCartAndWishlist();
  const navigate = useNavigate();
  const { appState, dispatchAppState } = useProgressState();
  const { dispatchToast } = useToast();
  useEffect(() => {
    (async () => {
      try {
        // const response = await axios.get("/api/cartItems");
        dispatchAppState({ type: "PRODUCT_PAGE_LOADING" });
        const response = await callApi(
          `https://e-com-backend.asohail737.repl.co/products/${productId}`,
          null,
          "get"
        );
        if (response.status === 200) {
          setProduct(() => response.data.data);
          dispatchAppState({ type: "PRODUCT_PAGE_SUCCESS" });
        }
      } catch (error) {
        console.log("Error while populating product detail page", error);
        dispatchAppState({ type: "PRODUCT_PAGE_ERROR" });
      }
    })();
  }, []);

  const addToWishlist = async (product) => {
    try {
      if (
        cart &&
        cart.filter((item) => item.product._id === product._id).length > 0 &&
        cart.filter((item) => item.product._id === product._id)[0]["wishlisted"]
      ) {
        let wishlistId = cart.filter(
          (itemInWishlist) => itemInWishlist.product._id === product._id
        )[0]["_id"];
        dispatchAppState({
          type: "CART_IN_PRODUCT_LOADING",
          payload: { id: product._id },
        });
        const response = await callApi(
          `https://e-com-backend.asohail737.repl.co/cart-items/${wishlistId}`,
          null,
          "delete"
        );

        if (response.status === 200) {
          dispatchAppState({
            type: "CART_IN_PRODUCT_SUCCESS",
            payload: { id: product._id },
          });
          dispatchToast({
            type: "TOAST_TYPE",
            payload: { toastType: "success" },
          });
          dispatchToast({
            type: "TOAST_MESSAGE",
            payload: { toastMessage: "Removed from wishlist" },
          });
          dispatchToast({ type: "TOGGLE_TOAST", payload: true });
          dispatchToCartAndWishlist({
            type: "REMOVE_FROM_WISHLIST",
            payload: { id: wishlistId },
          });
        }
      } else if (
        cart &&
        cart.filter((item) => item.product._id === product._id).length > 0 &&
        cart.filter((item) => item.product._id === product._id)[0][
          "wishlisted"
        ] === false
      ) {
        let wishlistId = cart.filter(
          (itemInWishlist) => itemInWishlist.product._id === product._id
        )[0]["_id"];
        dispatchAppState({
          type: "CART_IN_PRODUCT_LOADING",
          payload: { id: product._id },
        });
        const response = await callApi(
          `https://e-com-backend.asohail737.repl.co/cart-items/${wishlistId}`,
          {
            wishlisted: true,
          },
          "post"
        );

        if (response.status === 200) {
          dispatchAppState({
            type: "CART_IN_PRODUCT_SUCCESS",
            payload: { id: product._id },
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
      } else {
        dispatchAppState({
          type: "CART_IN_PRODUCT_LOADING",
          payload: { id: product._id },
        });
        const response = await callApi(
          "https://e-com-backend.asohail737.repl.co/cart-items",
          {
            product: product._id,
            wishlisted: true,
            quantity: 1,
          },
          "post"
        );
        if (response.status === 201) {
          dispatchAppState({
            type: "CART_IN_PRODUCT_SUCCESS",
            payload: { id: product._id },
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
      }
    } catch (error) {
      dispatchAppState({
        type: "CART_IN_PRODUCT_ERROR",
        payload: { id: product._id },
      });
      dispatchToast({ type: "TOAST_TYPE", payload: { toastType: "error" } });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Some error occurred" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
      console.log("Error while saving to wishlist", error);
    }
  };

  const addToCart = async (product) => {
    try {
      if (
        cart &&
        cart.filter((item) => item.product._id === product._id).length > 0 &&
        cart.filter((item) => item.product._id === product._id)[0]["wishlisted"]
      ) {
        let cartId = cart.filter(
          (itemInWishlist) => itemInWishlist.product._id === product._id
        )[0]["_id"];
        dispatchAppState({
          type: "CART_IN_PRODUCT_LOADING",
          payload: { id: product._id },
        });
        const response = await callApi(
          `https://e-com-backend.asohail737.repl.co/cart-items/${cartId}`,
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
          dispatchAppState({
            type: "CART_IN_PRODUCT_SUCCESS",
            payload: { id: product._id },
          });
          dispatchToCartAndWishlist({
            type: "ADD_TO_CART",
            payload: response.data.data,
          });
        }
      } else {
        dispatchAppState({
          type: "CART_IN_PRODUCT_LOADING",
          payload: { id: product._id },
        });
        const response = await callApi(
          "https://e-com-backend.asohail737.repl.co/cart-items",
          {
            product: product._id,
            wishlisted: false,
            quantity: 1,
          },
          "post"
        );
        if (response.status === 201) {
          dispatchToast({
            type: "TOAST_TYPE",
            payload: { toastType: "success" },
          });
          dispatchToast({
            type: "TOAST_MESSAGE",
            payload: { toastMessage: "Added to cart" },
          });
          dispatchToast({ type: "TOGGLE_TOAST", payload: true });
          dispatchAppState({
            type: "CART_IN_PRODUCT_SUCCESS",
            payload: { id: product._id },
          });
          dispatchToCartAndWishlist({
            type: "ADD_TO_CART",
            payload: response.data.data,
          });
        }
      }
    } catch (error) {
      dispatchToast({ type: "TOAST_TYPE", payload: { toastType: "error" } });
      dispatchToast({
        type: "TOAST_MESSAGE",
        payload: { toastMessage: "Some error occurred" },
      });
      dispatchToast({ type: "TOGGLE_TOAST", payload: true });
      dispatchAppState({
        type: "CART_IN_PRODUCT_ERROR",
        payload: { id: product._id },
      });
      console.log("Error while saving to cart", error);
    }
  };

  const { cart } = cartAndWishlistState;

  const { productPageState, cartStateInProductPage } = appState;

  return (
    <div className={styles.container}>
      {productPageState === "loading" ? (
        <Preloader />
      ) : (
        <>
          <div className={styles.detailImage}>
            <img src={product.image} alt=""></img>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.productDetailCard + " card"}>
              <div role="heading" className="card-heading">
                {product.name}
              </div>

              <div className="card-content">
                <p className={styles.productDesc}>{product.description}</p>
                <span className="product-detail">
                  {product.discount === 0 && <span>Rs {product.price}</span>}
                  {product.discount > 0 && (
                    <>
                      <span>
                        <span style={{ textDecoration: "line-through" }}>
                          Rs {product.price}
                        </span>
                      </span>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          margin: "0 0.5rem",
                        }}
                      >
                        Rs {discountCalc(product.price, product.discount)}
                      </span>
                      <span style={{ fontStyle: "oblique" }}>
                        ({product.discount}% off)
                      </span>
                    </>
                  )}
                </span>
                <span className={styles.productDetail + " product-detail"}>
                  {product.fastDelivery
                    ? "Fast delivery available"
                    : "Standard Delivery"}
                </span>
              </div>
              <div className="card-footer">
                {cart &&
                (cart.filter((item) => item.product._id === product._id)
                  .length === 0 ||
                  cart.filter((item) => item.product._id === product._id)[0][
                    "wishlisted"
                  ] === false) ? (
                  <button
                    onClick={() => addToWishlist(product)}
                    className={
                      cartStateInProductPage.status === "loading" &&
                      cartStateInProductPage.productId === product._id
                        ? "btn disabled outline margin-right large"
                        : "btn primary outline margin-right large"
                    }
                  >
                    wishlist
                  </button>
                ) : (
                  <button
                    onClick={() => addToWishlist(product)}
                    className={
                      cartStateInProductPage.status === "loading" &&
                      cartStateInProductPage.productId === product._id
                        ? "btn disabled outline margin-right large"
                        : "btn primary outline margin-right large"
                    }
                  >
                    wishlisted
                  </button>
                )}
                {!product.inStock ? (
                  <button className="btn disabled margin large">
                    Out of Stock
                  </button>
                ) : cart &&
                  (cart.filter(
                    (itemInCart) => itemInCart.product._id === product._id
                  ).length === 0 ||
                    cart.filter(
                      (itemInCart) => itemInCart.product._id === product._id
                    )[0]["wishlisted"]) ? (
                  <button
                    className={
                      cartStateInProductPage.status === "loading" &&
                      cartStateInProductPage.productId === product._id
                        ? "btn disabled margin-left large"
                        : "btn primary margin-left large"
                    }
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </button>
                ) : (
                  <button
                    className={"btn primary margin-left large"}
                    onClick={() => navigate("/cart")}
                  >
                    Go to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
