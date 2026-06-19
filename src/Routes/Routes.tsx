import { createBrowserRouter } from "react-router";
import MainLayout from "../MainLayout/MainLayout";

// all router her
const router = createBrowserRouter([
  { path: "/", 
    element: <MainLayout></MainLayout>,
    children: [
    { 
      index: true, 
      element: <h2>this is home</h2> 
    },
    { 
      path: '/about', 
      element: <h2>this is about</h2> 
    }
    ]
  },
]);

export default router;