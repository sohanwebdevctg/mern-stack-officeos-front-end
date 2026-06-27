import { useContext } from "react";
import { FaRegEye, FaUsers } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoLogOut } from "react-icons/io5";
import { MdAddShoppingCart, MdDashboard, MdViewInAr } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { FaClipboardUser } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router"; 
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { HiOutlineEye } from "react-icons/hi";


// add props typescript
interface NavbarProps {
  active: boolean;
  toggleSideBar: (data: boolean) => void;
}

const Sidebar = ({ active, toggleSideBar }: NavbarProps) => {

  const authInfo = useContext(AuthContext);

  // navigation the user
  const navigate = useNavigate();

  if (!authInfo) return null;

  const {validUser, logOut} = authInfo;
  const user = validUser?.user;

  // logout function
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "You are now Logged out",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    });
  };

  // admin router list
  const adminRouter = <>
    <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/allUserAdmin">AllUserAdmin</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/allUserAdmin"><FaUsers className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
    <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/allProductAdmin">AllProductAdmin</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/allProductAdmin"><MdViewInAr className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
  </>;

  // manager router list
  const managerRouter = <>
    <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/allUserManager">AllUserManager</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/allUserManager"><FaUsers className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
  </>;

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
          <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/">Home</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/"><MdDashboard className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
          {/* Post Link */}
          <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/allPost">Post</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/allPost"><IoIosCreate className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
          {/* Attendance Link */}
          <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/createAttendance">Attendance</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/createAttendance"><FaClipboardUser className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
          {/* Product Link */}
          <li>{active ? (<NavLink className={({ isActive }) => isActive ? "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm font-bold text-red-500" : "sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-sm text-white"} to="/createProduct">Create Product</NavLink>) : (<NavLink className={({ isActive }) => isActive ? "text-red-500" : "text-white"} to="/createProduct"><MdAddShoppingCart className="text-xl xl:text-3xl mx-auto" /></NavLink>)}</li>
          {/* UserOrder Link - Admin Only */}
          {user?.roleName === "admin" && (adminRouter)}
          {/* UserOrder Link - manager Only */}
          {user?.roleName === "manager" && (managerRouter)}
        </ul>

        {/* LogOut Button */}
        <div onClick={handleLogOut} className="cursor-pointer">
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