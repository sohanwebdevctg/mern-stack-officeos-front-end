import { useContext, useEffect, type ReactNode } from "react";
import { AuthContext } from "../Components/AuthProvider/AuthProvider";
import LoadingCom from "../Components/LoadingCom/LoadingCom";
import { Navigate } from "react-router";

interface PrivateRouteProps{
  children: ReactNode
}

const PrivateRoute = ({children}: PrivateRouteProps) => {

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
  const isUserValid = 
    user && 
    user.isActive === true && 
    user.roleName !== null && 
    (user.roleName === "admin" || user.roleName === "manager" || user.roleName === "employee");

  // loading check
  if(loading){
    return <LoadingCom></LoadingCom>
  }

  // redirect user
  if (isUserValid) {
    return children;
  }

  // navigate user user
  return <Navigate to="/login" replace />;
  
};

export default PrivateRoute;