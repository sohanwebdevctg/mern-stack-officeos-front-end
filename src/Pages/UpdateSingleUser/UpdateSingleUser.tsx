import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

interface UserData {
  _id: string;
  name: string;
  email: string;
  image: string;
  roleName: string;
  isActive: boolean;
  password: string
}

const UpdateSingleUser = () => {

  const {id} = useParams<{id:string}>();
  const navigate = useNavigate();
  const authInfo = useContext(AuthContext);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo; 
  const token = validUser?.token;

  // get user data
  useEffect(() => {
    const getFreshUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/singleUser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(response.data?.data || response.data?.user || response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    if (id) {
      getFreshUserData();
    }
  }, [id, baseURL, token]);


  // update form submit handle
  const updateFun = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    // checking authInfo
    if (!authInfo) return;

    const form = event.target as HTMLFormElement;

    // collect the form input data
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    
    // image file input element
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    // checking password and validation
    if (password && password.trim() !== "") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        Swal.fire({
          title: "Weak Password!",
          text: "Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, and one number!",
          icon: "warning",
        });
        return;
      }
    }
    setBtnLoading(true);
    authInfo.setLoading(true);
    
    // Whether the file was actually selected by the user and the first file (`[0]`) was taken as an object
    const imageFile = imageInput.files ? imageInput.files[0] : null;

    // send multiple form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (password && password.trim() !== "") {
      formData.append("password", password);
    }
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // update api
    try {
      const response = await axios.put(`${baseURL}/user/updateSingleUser/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Profile updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/singleUser/${id}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: axiosError.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setBtnLoading(false); 
      authInfo.setLoading(false);
    }
  };

  return (
    <div className="my-8 bg-white h-full sm:h-screen flex items-center px-5">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-5 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto">
            <form onSubmit={updateFun} className="w-full flex justify-between items-center"
            >
              {/* update user */}
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">Update User</h3>
                </div>
                {/* Full Name Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Full Name</span>
                  </label>
                  <input type="text" placeholder="update your full name" className="input input-bordered w-full" name="name" 
                  key={profileData?.name} defaultValue={profileData?.name}/>
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Email</span>
                  </label><br></br>
                  <input type="email" placeholder="enter your valid email" className="input input-bordered w-full" name="email" key={profileData?.email} defaultValue={profileData?.email || ""}/>
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Password</span>
                  </label>
                  <input type="password" placeholder="Enter new strong password if you want to change" className="input input-bordered w-full" name="password" />
                </div>
                {/* show profile image */}
                <div>
                  <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Previous Image</span>
                  </label>
                  <img alt="User Profile" className="w-full h-40" src={profileData?.image === "default-image.png" ? '/default/default-image.png' : profileData?.image} />
                </div>
                </div>
                {/* Profile Image File Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Profile Image (Optional)</span>
                  </label>
                  <input type="file" accept="image/*" className="file-input input-bordered w-full" name="image" />
                </div>
                
                {/* Submit Button */}
                <div className="form-control mt-6 w-full flex flex-col sm:flex-row gap-2">
                  <button type="submit" disabled={btnLoading} className="btn bg-green-500 border-none font-bold text-white px-4 w-full sm:w-1/2">
                    {btnLoading ? "User Updated..." : "Update User"}
                  </button>
                  <button type="button" onClick={() => navigate(-1)} className="btn bg-red-500 border-none font-bold text-white px-4 w-full sm:w-1/2">Back</button>
                </div>

              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default UpdateSingleUser;