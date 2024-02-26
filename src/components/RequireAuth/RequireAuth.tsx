import { useLocation, Navigate } from "react-router-dom";

import { selectAuth } from "src/features/auth/authSlice";
import { useAppSelector } from "src/store";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector(selectAuth);
  const location = useLocation();

  if (!auth.jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
