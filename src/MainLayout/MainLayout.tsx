import { Outlet } from "react-router";


const MainLayout = () => {
  return (
    <div>
      {/* this is main layout */}
      <Outlet></Outlet>
    </div>
  );
};

export default MainLayout;