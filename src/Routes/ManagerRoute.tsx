import { useContext, useEffect, type ReactNode } from "react";
import { AuthContext } from "../Components/AuthProvider/AuthProvider";
import LoadingCom from "../Components/LoadingCom/LoadingCom";
import { Navigate } from "react-router";

interface ManagerRouteProps {
  children: ReactNode;
}

const ManagerRoute = ({ children }: ManagerRouteProps) => {
  const authInfo = useContext(AuthContext);

  // loading state data change
  useEffect(() => {
    if (authInfo?.loading) {
      authInfo.setLoading(false);
    }
  }, [authInfo]);

  // checking authInfo
  if (!authInfo) return null;

  const { validUser, loading } = authInfo;
  const user = validUser?.user;

  // checking user active, roleName, role condition
  const isManagerValid = 
    user && 
    user.isActive === true && 
    user.roleName === "manager";

  // loading check
  if (loading) {
    return <LoadingCom></LoadingCom>;
  }

  // redirect user
  if (isManagerValid) {
    return children;
  }

  // navigate user
  return <Navigate to="/login" replace />;
};

export default ManagerRoute;