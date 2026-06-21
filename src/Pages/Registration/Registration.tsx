import { useNavigate, Link } from "react-router";
import img from "../../../public/login/logImg.png";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";

const Register = () => {
  const authInfo = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  console.log(navigate);

  

  // form submit handle
  const registerFun = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!authInfo) return;

    const form = event.target as HTMLFormElement;

    // collect the form input data
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    
    // image file input element
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      Swal.fire({
        title: "Weak Password!",
        text: "Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, and one number!",
        icon: "warning",
      });
      return;
    }
    setLoading(true);
    
    // Whether the file was actually selected by the user and the first file (`[0]`) was taken as an object
    const imageFile = imageInput.files ? imageInput.files[0] : null;

    // send multiple form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // registration api
    try{
      const response = await axios.post(authInfo?.apiEndPoints?.registration, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        Swal.fire({
          title: "Success!",
          text: response.data.message || "Registration successful! Redirecting to login...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // if use registration user navigate the login
        navigate("/login");
      }
    }catch(error){
      const axiosError = error as AxiosError<{ message: string }>;
      Swal.fire({
        title: "Registration Failed!",
        text: axiosError.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
      });
    }finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="my-8 xl:my-10 bg-white h-full sm:h-screen flex items-center px-5">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-10 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto">
            <form
              onSubmit={registerFun}
              className="w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-3 sm:gap-5"
            >
              {/* Left Side: Registration Fields */}
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">
                    Registration
                  </h3>
                </div>

                {/* Full Name Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Full Name</span>
                  </label>
                  <input type="text" placeholder="enter your full name" className="input input-bordered w-full" name="name" required/>
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
                  <input type="password" placeholder="create a strong password" className="input input-bordered w-full" name="password" required />
                </div>

                {/* Profile Image File Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Profile Image (Optional)</span>
                  </label>
                  {/* 🛠️ এখানে accept="image/*" দিয়ে দেওয়া হলো যাতে ইউজার শুধু ইমেজ ফাইলই সিলেক্ট করতে পারে */}
                  <input type="file" accept="image/*" className="file-input input-bordered w-full" name="image" />
                </div>
                
                {/* Submit Button */}
                <div className="form-control mt-6 w-full">
                  <button type="submit" disabled={loading} className="btn bg-red-500 hover:bg-red-600 text-white w-full font-bold">
                    {loading ? "User Created..." : "Register Account"}
                  </button>
                </div>

                {/* Login Page Link */}
                <p className="text-center text-sm mt-4 text-base-content/70">
                  Already have an account?{" "} <Link to="/login" className="text-red-500 hover:underline font-medium"> Log In here</Link>
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

export default Register;