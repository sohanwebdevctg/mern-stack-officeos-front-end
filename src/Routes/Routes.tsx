import { createBrowserRouter } from "react-router";
import MainLayout from "../MainLayout/MainLayout";
import ErrorCom from "../Components/ErrorCom/ErrorCom";

// all router her
const router = createBrowserRouter([
  { path: "/", 
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorCom></ErrorCom>,
    children: [
    { 
      index: true, 
      element: <h2>this is home</h2> 
    },
    { 
      path: '/about', 
      element: <h1>about</h1>
    }
    ]
  },
]);

export default router;