import { Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthProvider";

export function PrivateRoute({ path, ...props }) {
  const { isUserLoggedIn } = useAuth();

  return isUserLoggedIn ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate state={{ from: path.includes("/")?path:`/account/${path}` }} replace to="/account/login" />
  );
}
