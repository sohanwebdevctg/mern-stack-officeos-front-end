import { useNavigate, Link } from "react-router";
import img from "../../../public/login/logImg.png";
import { setUser } from "../../utilities/localstorage";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";

const Login = () => {

  const authInfo = useContext(AuthContext);
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);


  // form submit handle
  const logFun = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!authInfo) return;
    const form = event.target as HTMLFormElement;

    // collect the form input data
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
  
    // send user data
    const loginData = { email, password };

    console.log("Login Data Collected:", loginData);

    try {
      // 🚀 ১. গ্লোবাল এবং লোকাল লোডিং চালু হলো
      authInfo.setLoading(true);
      setBtnLoading(true);

      // 📡 ২. লগইন এপিআই কল
      const response = await axios.post(authInfo.apiEndPoints.login, loginData);

      if (response.data) {
        const userData = response.data.user; 

        if (userData && userData.isActive === false) {
          Swal.fire({
            title: "Account Inactive!",
            text: "Your account is currently disabled. Please contact the administrator.",
            icon: "error",
          });
          
          authInfo.setLoading(false);
          setBtnLoading(false);
          return;
        }
        setUser(response.data);
        authInfo.setValidUser(response.data);

        Swal.fire({
          title: "Welcome Back!",
          text: response.data.message || "Logged in successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      }

    } catch (error: any) {
      const axiosError = error as AxiosError<{ message: string }>;
            Swal.fire({
              title: "Login Failed!",
              text: axiosError.response?.data?.message || "Invalid email or password. Please try again.",
              icon: "error",
            });
    } finally {
      authInfo.setLoading(false);
      setBtnLoading(false);
    }
  };

  return (
    <>
      <div className="my-8 xl:my-10 bg-white h-full sm:h-screen flex items-center px-5">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-10 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto">
            <form
              onSubmit={logFun}
              className="w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-3 sm:gap-5"
            >
              {/* Left Side: Login Fields */}
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">
                    Login
                  </h3>
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Email</span>
                  </label><br></br>
                  <input type="email" placeholder="enter your valid email" className="input input-bordered w-full" name="email" required/>
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Password</span>
                  </label>
                  <input type="password" placeholder="enter your valid password" className="input input-bordered w-full" name="password" required />
                </div>
                
                {/* Submit Button */}
                <div className="form-control mt-6 w-full">
                  <button type="submit" disabled={btnLoading} className="btn bg-red-500 hover:bg-red-600 text-white w-full font-bold">
                    {btnLoading ? "Logging in..." : "Login Account"}
                  </button>
                </div>

                {/* Registration Page Link */}
                <p className="text-center text-sm mt-4 text-base-content/70">
                  You have no account?{" "} <Link to="/registration" className="text-red-500 hover:underline font-medium"> Registration here</Link>
                </p>
              </div>

              {/* Right Side: Image Layout */}
              <div className="flex-1 bg-red-500 h-full w-full overflow-hidden">
                <div className="h-80 sm:h-96 md:h-102 lg:h-[500px] xl:h-[520px] 2xl:h-[540px] w-full flex justify-center items-center">
                  <img src={img} alt="Register Layout Banner" className="h-full w-full object-cover" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;