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
// import axios from "axios";



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
      element: <AllUserAdmin></AllUserAdmin>
    },
    {
      path: '/allUserManager',
      element: <AllUserManager></AllUserManager>
    },
    { 
      path: '/singleUser/:id',
      element: <SingleUser></SingleUser>
    }
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