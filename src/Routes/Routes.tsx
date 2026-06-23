import { createBrowserRouter } from "react-router";
import MainLayout from "../MainLayout/MainLayout";
import ErrorCom from "../Components/ErrorCom/ErrorCom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Registration from "../Pages/Registration/Registration";
import PrivateRoute from "./PrivateRoute";
import SingleUser from "../Pages/SingleUser/SingleUser";
import AllUserAdmin from "../Pages/AllUserAdmin/AllUserAdmin";
import AllUserManager from "../Pages/AllUserManager/AllUserManager";
import UpdateSingleUser from "../Pages/UpdateSingleUser/UpdateSingleUser";
import AllPost from "../Pages/AllPost/AllPost";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";




// all router her
const router = createBrowserRouter([
  { path: "/", 
    element: <PrivateRoute><MainLayout></MainLayout></PrivateRoute>,
    errorElement: <ErrorCom></ErrorCom>,
    children: [
    { 
      index: true, 
      element: <Home></Home>
    },
    {
      path: '/allUserAdmin',
      element: <AdminRoute><AllUserAdmin></AllUserAdmin></AdminRoute>
    },
    {
      path: '/allUserManager',
      element: <ManagerRoute><AllUserManager></AllUserManager></ManagerRoute>
    },
    { 
      path: '/singleUser/:id',
      element: <SingleUser></SingleUser>
    },
    { 
      path: '/updateSingleUser/:id',
      element: <UpdateSingleUser></UpdateSingleUser>
    },
    { 
      path: '/allPost',
      element: <AllPost></AllPost>
    },
    ]
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/registration',
    element: <Registration></Registration>
  },
]);

export default router;