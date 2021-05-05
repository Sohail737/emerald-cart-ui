import { Cart } from "./cart-component/Cart";
import { Wishlist } from "./wishlist-component/Wishlist";
import "./App.css";
import { ProductList } from "./product-list-component/ProductList";
import { useCartAndWishlist } from "./context/CartAndWishlistProvider";
import { useState, useEffect } from "react";
import { useAxios } from "./custom-hooks/Axios";
import {Navigation} from "./nav-component/Navigation"
import {routeNames} from "./misc/Constants"
import {Route,Routes} from "react-router-dom";
import { Home } from "./home-component/Home";
import { Toast } from "./toast-component/Toast";
import { useToast } from "./context/ToastProvider";
import { ProductDetail } from "./product-detail-component/ProductDetail";
import { Account } from "./account-component/Account";
import { Login } from "./login-component/Login";
import { Signup } from "./signup-component/Signup";
import { AccountDetail } from "./account-detail-component/AccountDetail";
import { PrivateRoute } from "./PrivateRoutes";

function App() {
  const { cartAndWishlistState, dispatchToCartAndWishlist } = useCartAndWishlist();
  // const [route, setRoute] = useState("productList");
  // const [productList, setProductList] = useState([]);
  const { callApi } = useAxios();
  const {toastMessage,toastType}=useToast();

  useEffect(() => {
    (async () => {
      try {
        // const response = await axios.get("/api/cartItems");
        const response = await callApi("https://e-com-backend.asohail737.repl.co/cart-items", null, "get");
        if (response.status === 200) {
          dispatchToCartAndWishlist({
            type: "INITIALIZE",
            payload: response.data.data.cartItems,
          });
        }
      } catch (error) {
        console.log("Error while populating cart", error);
      }
    })();

    return () => {
      callApi(null, null, "cancel");
    };
  }, []);

  return (
    <div className="App">
      <Navigation/>
      <Toast message={toastMessage} type={toastType} duration={3000} />
      {/* {route === routeNames.productList && <ProductList route={route} setRoute={setRoute} />}
      {route === routeNames.cart && <Cart />}
      {route === routeNames.wishlist && <Wishlist setRoute={setRoute}/>} */}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/products" element={<ProductList/>}></Route>
        <Route path="/products/:productId" element={<ProductDetail/>}></Route>
        <PrivateRoute path="/cart" element={<Cart/>}></PrivateRoute>
        <PrivateRoute path="/wishlist" element={<Wishlist/>}></PrivateRoute>
        <Route path="/account" element={<Account />}>
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <PrivateRoute path="details" element={<AccountDetail />}></PrivateRoute>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
