import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";


const MainLayout = () => {

  // toggle sidebar state
  const [active, setActive] = useState<boolean>(false);

  // sidebar toggle function
  const toggleSideBar = (data: boolean) => {
    setActive(data);
  };

  return (
    <div className="flex justify-between items-center h-screen overflow-hidden bg-base-100">
        {/* navbar (Sidebar) section start */}
        <div 
          className={`${
            active ? "sm:w-[15%] lg:w-[13%] xl:w-[11%] 2xl:w-[10%]" : "sm:w-[7%] lg:w-[5%]" 
          } hidden sm:block h-screen transition-all duration-300 ease-in-out`}
        >
          <Sidebar active={active} toggleSideBar={toggleSideBar} />
        </div>
        {/* navbar (Sidebar) section end */}

        {/* content section start */}
        <div 
          className={`${
            active ? "sm:w-[85%] lg:w-[87%] xl:w-[89%] 2xl:w-[90%]" : "sm:w-[93%] lg:w-[95%]" 
          } h-full bg-base-100 transition-all duration-300 ease-in-out w-full flex flex-col`}
        >
          {/* header section start */}
          <Header />
          {/* header section end */}
          {/* main layout section start */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet /> 
          </div>
          {/* main layout section end */}
        </div>
        {/* content section end */}
      </div>
  );
};

export default MainLayout;