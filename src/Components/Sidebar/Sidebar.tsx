import { useState } from "react";
import { FaEdit, FaUserCircle, FaUsers, FaUserShield, FaWpforms } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoLogOut } from "react-icons/io5";
import { MdDashboard, MdNotificationAdd } from "react-icons/md";
import { NavLink } from "react-router"; 
import Swal from "sweetalert2";


// import { getUser, removeUser } from "../../utilities/localstorage";

// add props typescript
interface NavbarProps {
  active: boolean;
  toggleSideBar: (data: boolean) => void;
}

const Sidebar = ({ active, toggleSideBar }: NavbarProps) => {

  const [validUser] = useState<{ userType: string } | null>({ userType: "admin" });


  // const [validUser, setValidUser] = useState(() => getUser());

  // logout function
  const logOutFun = () => {
    // removeUser();
    
    Swal.fire({
      position: "center",
      icon: "success",
      title: "You are now Logged out",
      showConfirmButton: false,
      timer: 1000,
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      {/* desktop content section start */}
      <div className="bg-black bg-opacity-90 h-full flex flex-col justify-around items-center">
        <div>
          {active ? (
            <IoClose 
              onClick={() => toggleSideBar(!active)} 
              className="text-red-500 text-xl xl:text-2xl 2xl:text-3xl cursor-pointer" 
            />
          ) : (
            <GiHamburgerMenu 
              onClick={() => toggleSideBar(!active)} 
              className="text-red-500 text-xl xl:text-2xl cursor-pointer" 
            />
          )}
        </div>
        <ul className="flex flex-col gap-2 md:gap-3">
          {/* Home Link */}
          <li>
            {active ? (
              <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/about">Home</NavLink>
            ) : (
              <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/"><MdDashboard className="text-xl xl:text-3xl mx-auto" /></NavLink>
            )}
          </li>

          {/* UserOrder Link - Admin Only */}
          {validUser?.userType === "admin" && (
            <li>
              {active ? (
                <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/user-order-table">UserOrder</NavLink>
              ) : (
                <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/user-order-table"><MdNotificationAdd className="text-xl xl:text-3xl mx-auto" /></NavLink>
              )}
            </li>
          )}

          {/* AllUsers Link - Admin Only */}
          {validUser?.userType === "admin" && (
            <li>
              {active ? (
                <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/all-users">AllUsers</NavLink>
              ) : (
                <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/all-users"><FaUsers className="text-xl xl:text-3xl mx-auto" /></NavLink>
              )}
            </li>
          )}

          {/* Order Link - Regular User Only */}
          {validUser?.userType === "user" && (
            <li>
              {active ? (
                <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/order-table">Order</NavLink>
              ) : (
                <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/order-table"><FaEdit className="text-xl xl:text-3xl mx-auto" /></NavLink>
              )}
            </li>
          )}

          {/* CreateUsers Link - Admin Only */}
          {validUser?.userType === "admin" && (
            <li>
              {active ? (
                <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/create-users">CreateUsers</NavLink>
              ) : (
                <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/create-users"><FaUserShield className="text-xl xl:text-3xl mx-auto" /></NavLink>
              )}
            </li>
          )}

          {/* CreateProduct Link - Admin Only */}
          {validUser?.userType === "admin" && (
            <li>
              {active ? (
                <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/create-product">CreateProduct</NavLink>
              ) : (
                <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/create-product"><FaWpforms className="text-xl xl:text-3xl mx-auto" /></NavLink>
              )}
            </li>
          )}

          {/* UserProfile Link */}
          <li>
            {active ? (
              <NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/user-profile">UserProfile</NavLink>
            ) : (
              <NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/user-profile"><FaUserCircle className="text-xl xl:text-3xl mx-auto" /></NavLink>
            )}
          </li>
        </ul>

        {/* LogOut Button */}
        <div onClick={logOutFun} className="cursor-pointer">
          {active ? (
            <button className="sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500">LogOut</button>
          ) : (
            <IoLogOut className="text-2xl xl:text-3xl mx-auto text-red-500" />
          )}
        </div>
      </div>
      {/* desktop content section end */}
    </>
  );
};

export default Sidebar;