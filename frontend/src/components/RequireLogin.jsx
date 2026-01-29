import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function RequireLogin({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}   // ✅ save full location object
      />
    );
  }

  return children;
}
