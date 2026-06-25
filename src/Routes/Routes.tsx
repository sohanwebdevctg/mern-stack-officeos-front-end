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
import CreatePost from "../Pages/CreatePost/CreatePost";
import UpdateSinglePost from "../Pages/UpdateSinglePost/UpdateSinglePost";
import CreateAttendance from "../Pages/CreateAttendance/CreateAttendance";
import AdminAttendance from "../Pages/AdminAttendance/AdminAttendance";
import ManagerAttendance from "../Pages/ManagerAttendance/ManagerAttendance";




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
    {
      path: '/createPost',
      element: <CreatePost></CreatePost>
    },
    {
      path: '/updateSinglePost/:id',
      element: <UpdateSinglePost></UpdateSinglePost>
    },
    {
      path: '/createAttendance',
      element: <CreateAttendance></CreateAttendance>
    },
    {
      path: '/adminAttendance',
      element: <AdminRoute><AdminAttendance></AdminAttendance></AdminRoute>
    },
    {
      path: '/managerAttendance',
      element: <ManagerRoute><ManagerAttendance></ManagerAttendance></ManagerRoute>
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