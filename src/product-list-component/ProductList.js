import styles from "./ProductList.module.css";
import { discountCalc } from "../misc/util";
import { Filter } from "../filter-component/Filter";
import { useCartAndWishlist } from "../context/CartAndWishlistProvider";
import { useProgressState } from "../context/ProgressStateProvider";
import { useAxios } from "../custom-hooks/Axios";
import { useEffect, useState } from "react";
import { Preloader } from "../pre-loader-component/Preloader";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastProvider";

export const ProductList = ({}) => {
  const {
    cartAndWishlistState,
    dispatchToCartAndWishlist,
  } = useCartAndWishlist();
  const navigate = useNavigate();
  const { callApi } = useAxios();
  const { appState, dispatchAppState } = useProgressState();
  const [productList, setProductList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { dispatchToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        // const response = await axios.get("/api/products");
        dispatchAppState({ type: "PRODUCT_PAGE_LOADING" });
        const response = await callApi(
          "https://e-com-backend.asohail737.repl.co/products",
          null,
          "get"
        );
        console.log({ response });
        if (response.status === 200) {
          dispatchAppState({ type: "PRODUCT_PAGE_SUCCESS" });
          setProductList(response.data.data);
        }
      } catch (error) {
        dispatchAppState({ type: "PRODUCT_PAGE_ERROR" });
        console.log("Error while populating product list", error);
      }
    })();
    return () => {
      callApi(null, null, "cancel");
    };
  }, []);

  // useEffect(() => {
  //   return () => dispatchToast({ type: "TOGGLE_TOAST", payload: false });
  // }, []);

  let filteredData = [];

  // const {
  //   showAllInventory,
  //   showFastDeliveryOnly,
  //   genre,
  //   author,
  //   sortBy,
  // } = useFilter();

  const query = new URLSearchParams(useLocation().search);
  const queryString = `?${decodeURI(query)}`;
  // query=decodeURI(query);
  console.log({ queryString });
  const sortBy = query.get("sortBy");
  let genre = query.get("genre");
  if (genre !== null && genre !== "") {
    genre = genre.split(",");
  } else {
    genre = [];
  }
  let author = query.get("author");
  if (author !== null && author !== "") {
    author = author.split(",");
  } else {
    author = [];
  }
  let showAllInventory = query.get("showOutOfStock");
  let showFastDeliveryOnly = query.get("fastDeliveryOnly");
  let showOffersOnly = query.get("showOffersOnly");

  showAllInventory =
    showAllInventory !== null ? JSON.parse(showAllInventory) : true;
  showFastDeliveryOnly =
    showFastDeliveryOnly !== null ? JSON.parse(showFastDeliveryOnly) : false;
  showOffersOnly = showOffersOnly !== null ? JSON.parse(showOffersOnly) : false;

  const getfilteredData = (
    showAllInventory,
    showFastDeliveryOnly,
    showOffersOnly,
    author,
    genre,
    data
  ) => {
    return data
      .filter((product) => {
        return showAllInventory ? true : product.inStock;
      })
      .filter((product) => {
        return !showFastDeliveryOnly ? true : product.fastDelivery;
      })
      .filter((product) => {
        return showOffersOnly ? product.discount > 0 : true;
      })
      .filter((product) => {
        return genre && genre.length > 0 ? genre.includes(product.genre) : true;
      })
      .filter((product) => {
        return author && author.length > 0
          ? author.includes(product.author)
          : true;
      });
  };

  const getSortedData = (sortBy, data) => {
    if (sortBy === "LOW_TO_HIGH") {
      return data.sort((a, b) => {
        let aPrice = discountCalc(a["price"], a["discount"]);
        let bPrice = discountCalc(b["price"], b["discount"]);
        return aPrice - bPrice;
      });
    } else if (sortBy === "HIGH_TO_LOW") {
      return data.sort((a, b) => {
        let aPrice = discountCalc(a["price"], a["discount"]);
        let bPrice = discountCalc(b["price"], b["discount"]);
        return bPrice - aPrice;
      });
    } else {
      return data;
    }
  };

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

  filteredData = getfilteredData(
    showAllInventory,
    showFastDeliveryOnly,
    showOffersOnly,
    author,
    genre,
    productList
  );

  console.log({ filteredData });

  const sortedData = getSortedData(sortBy, filteredData);

  const { cart } = cartAndWishlistState;

  const { productPageState, cartStateInProductPage } = appState;

  return (
    <div className={styles.productListLayout}>
      {productPageState === "loading" ? (
        <Preloader />
      ) : (
        <>
          <Filter
            showAllInventory={showAllInventory}
            showFastDeliveryOnly={showFastDeliveryOnly}
            showOffersOnly={showOffersOnly}
            author={author}
            genre={genre}
            sortBy={sortBy}
            queryString={queryString}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />

          <div className={styles.productList}>
            {sortedData.map((product) => {
              return (
                // <div className="card-div">
                <div
                  onClick={() => navigate(`/products/${product._id}`)}
                  key={product._id}
                  className={styles.productCard + " card"}
                >
                  <div className="card-img">
                    <img src={product.image} alt="" />
                    <svg
                      onClick={(e) => {
                        addToWishlist(product);
                        e.stopPropagation();
                      }}
                      className={
                        cart &&
                        (cart.filter((item) => item.product._id === product._id)
                          .length === 0 ||
                          cart.filter(
                            (item) => item.product._id === product._id
                          )[0]["wishlisted"] === false)
                          ? styles.wishlistBadge
                          : styles.wishlistBadgeAdded
                      }
                      width="1em"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M256 448a32 32 0 0 1-18-5.57c-78.59-53.35-112.62-89.93-131.39-112.8c-40-48.75-59.15-98.8-58.61-153C48.63 114.52 98.46 64 159.08 64c44.08 0 74.61 24.83 92.39 45.51a6 6 0 0 0 9.06 0C278.31 88.81 308.84 64 352.92 64c60.62 0 110.45 50.52 111.08 112.64c.54 54.21-18.63 104.26-58.61 153c-18.77 22.87-52.8 59.45-131.39 112.8a32 32 0 0 1-18 5.56z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div className="card-detail">
                    <div
                      role="heading"
                      className={styles.productCardHeading + " card-heading"}
                    >
                      {product.name}
                    </div>
                    <div className="card-content">
                      <span className="product-detail">
                        {product.discount === 0 && (
                          <span>Rs {product.price}</span>
                        )}
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            onClick={() => setShowFilter((showFilter) => !showFilter)}
            className={styles.filterButtonContainer}
          >
            <div className={styles.filterButton}>FILTER AND SORT</div>
          </div>
        </>
      )}
    </div>
  );
};
