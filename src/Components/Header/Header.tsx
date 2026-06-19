import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { Link, NavLink } from "react-router";
import Swal from "sweetalert2";

// ⏳ ভবিষ্যতে যখন localstorage ফাইল রেডি হবে, তখন এই নিচের লাইনটি আন-কমেন্ট করে নেবেন:
// import { getUser, removeUser } from "../../utilities/localstorage";

const Header = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  
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

  // handle the mobile bar scroller
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Content section start */}
      <div className={`${active ? "fixed top-0 right-0 left-0 z-50 sm:sticky" : "sticky top-0 z-50"}`}>
        <div className="w-full h-14 bg-red-500 shadow-md flex justify-between items-center px-3 xl:px-5">
          <div>
            <h2 className="text-lg xl:text-xl text-white font-bold italic tracking-wide">OfficeOS (ERP)</h2>
          </div>
          
          <div className="flex justify-center items-center gap-4">
            <div className="md:hidden flex items-center">
              {toggle ? (
                <IoClose onClick={() => setToggle(!toggle)} className="text-white text-2xl cursor-pointer" />
              ) : (
                <GiHamburgerMenu onClick={() => setToggle(!toggle)} className="text-white text-xl cursor-pointer" />
              )}
            </div>
            
            {/* profile link */}
            <Link to="/" className="avatar">
              <div className="w-8 lg:w-9 rounded-full ring ring-white/50 ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img 
                  alt="User Profile"
                  src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png" 
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Content section end */}

      {/* Mobile drawer content section start */}
      <div 
        className={`${
          toggle ? "top-14 bottom-0 right-0 left-0" : "top-14 -left-full right-full bottom-0"
        } fixed transition-all duration-300 ease-in-out bg-base-900/95 z-50 md:hidden backdrop-blur-sm`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      >
        <ul className="flex flex-col justify-center items-center h-full w-full gap-5 p-6">
          <li onClick={() => setToggle(!toggle)}>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
              }
              to="/about"
            >
              Home
            </NavLink>
          </li>
          
          {validUser?.userType === "admin" && (
            <li onClick={() => setToggle(!toggle)}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
                }
                to="/user-order-table"
              >
                UserOrder
              </NavLink>
            </li>
          )}

          {validUser?.userType === "admin" && (
            <li onClick={() => setToggle(!toggle)}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
                }
                to="/all-users"
              >
                AllUsers
              </NavLink>
            </li>
          )}

          {validUser?.userType === "user" && (
            <li onClick={() => setToggle(!toggle)}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
                }
                to="/order-table"
              >
                Order
              </NavLink>
            </li>
          )}

          {validUser?.userType === "admin" && (
            <li onClick={() => setToggle(!toggle)}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
                }
                to="/create-users"
              >
                CreateUsers
              </NavLink>
            </li>
          )}

          {validUser?.userType === "admin" && (
            <li onClick={() => setToggle(!toggle)}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
                }
                to="/create-product"
              >
                CreateProduct
              </NavLink>
            </li>
          )}

          <li onClick={() => setToggle(!toggle)}>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-base font-bold text-red-500" : "text-base text-white hover:text-red-400 transition"
              }
              to="/user-profile"
            >
              UserProfile
            </NavLink>
          </li>

          <li onClick={() => { setToggle(!toggle); logOutFun(); }}>
            <button className="text-base font-bold text-red-500 hover:text-red-400 cursor-pointer transition">
              LogOut
            </button>
          </li>
        </ul>
      </div>
      {/* Mobile drawer content section end */}
    </>
  );
};

export default Header;