import { useLocation, Navigate } from "react-router-dom";

import { useAppSelector } from "./store";
import { selectAuth } from "./features/auth/authSlice";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector(selectAuth);
  const location = useLocation();

  if (!auth.jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
