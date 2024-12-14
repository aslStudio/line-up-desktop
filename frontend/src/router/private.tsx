import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: ReactNode;
}

const pathnames = ["/login", "/registration", "/password-reset"];
export function PrivateRoute({ children }: PrivateRouteProps) {
  //@ts-ignore
  const token = useSelector((state) => state.auth.access_token);
  const location = useLocation();

  if (pathnames.includes(location.pathname) && token) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  if (!pathnames.includes(location.pathname) && !token) {
    return (
      <Navigate
        to='/login'
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
