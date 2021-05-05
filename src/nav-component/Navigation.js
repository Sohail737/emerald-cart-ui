import { routeNames } from "../misc/Constants";
import { useCartAndWishlist } from "../context/CartAndWishlistProvider";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";
import { NavigationAside } from "../nav-aside-component/NavigationAside";
import { useState } from "react";

export const Navigation = ({}) => {
  const { cartAndWishlistState } = useCartAndWishlist();
  const [isAsideOpen, setIsAsideOpen] = useState(false);


  const cartLength = cartAndWishlistState.cart.filter(
    (item) => !item.wishlisted
  ).length;
  const wishlistLength = cartAndWishlistState.cart.filter(
    (item) => item.wishlisted
  ).length;

  return (
    <>
    <NavigationAside isAsideOpen={isAsideOpen} setIsAsideOpen={setIsAsideOpen}/>
    <div className={styles.header}>
      <div className={styles.logo}>
        <img
          src="../../assets/logo.png"
          alt=""
        ></img>
      </div>
      <nav className={styles.heading}>
        <ul className="nav">
          <li className="nav-item">
            {/* <a
              className={styles.cartWishlist}
              onClick={() => routeHandler(routeNames.productList)}
            >
            </a> */}
            <NavLink to="/" className={styles.navPills}>
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"
                  fill="currentColor"
                ></path>
              </svg>
              {/* <span>ProductList</span> */}
            </NavLink>
          </li>
          <li className="nav-item">
            {/* <a
              className={styles.cartWishlist}
              onClick={() => routeHandler(routeNames.productList)}
            >
            </a> */}
            <NavLink to="/products" className={styles.navPills}>
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  d="M5 6h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zm15.16 1.8c-.09-.46-.5-.8-.98-.8H4.82c-.48 0-.89.34-.98.8l-1 5c-.12.62.35 1.2.98 1.2H4v5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-5h4v5c0 .55.45 1 1 1s1-.45 1-1v-5h.18c.63 0 1.1-.58.98-1.2l-1-5zM12 18H6v-4h6v4z"
                  fill="currentColor"
                ></path>
              </svg>
              {/* <span>ProductList</span> */}
            </NavLink>
          </li>

          <li className="nav-item">
            {/* <a
              className={styles.cartWishlist}
              onClick={() => routeHandler(routeNames.wishlist)}
            >
              
            </a> */}
            <NavLink to="/wishlist" className={styles.cartWishlist}>
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"
                  fill="currentColor"
                ></path>
              </svg>
              {/* <span>Wishlist</span> */}
              {wishlistLength > 0 && (
                <span className="badge">{wishlistLength}</span>
              )}
            </NavLink>
          </li>
          <li className="nav-item">
            {/* <a
              className={styles.cartWishlist}
              onClick={() => routeHandler(routeNames.cart)}
            >
             
            </a> */}
            <NavLink to="/cart" className={styles.cartWishlist}>
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25c0-.05.01-.09.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
                  fill="currentColor"
                ></path>
              </svg>
              {/* <span>Cart</span> */}
              {cartLength > 0 && <span className="badge">{cartLength}</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
      <div onClick={()=>setIsAsideOpen(isAsideOpen=>!isAsideOpen)} className={styles.hamburger}>
        <svg width="1em" height="1em" viewBox="0 0 15 15">
          <g fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </div>
    </div>
    </>
    
  );
};
