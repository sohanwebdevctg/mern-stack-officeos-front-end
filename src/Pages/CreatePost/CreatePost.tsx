import { useNavigate } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useContext, useState } from "react";
import type { AxiosError } from "axios";
import axios from "axios";
import Swal from "sweetalert2";


const CreatePost = () => {

  const navigate = useNavigate();
    const authInfo = useContext(AuthContext);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
  
    if (!authInfo) return null;
    const { baseURL, validUser } = authInfo; 
    const token = validUser?.token;

    const createFun = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    
      event.preventDefault();
    // checking authInfo
    if (!authInfo) return;

    const form = event.target as HTMLFormElement;

    // collect the form input data
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    // image file input element
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    setBtnLoading(true);
    
    // Whether the file was actually selected by the user and the first file (`[0]`) was taken as an object
    const imageFile = imageInput.files ? imageInput.files[0] : null;

    // send multiple form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // create api
    try {
      const response = await axios.post(`${baseURL}/post/createPost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Post Created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/allPost`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: "error",
        title: "Created Failed!",
        text: axiosError.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setBtnLoading(false);
    }
    }

  return (
    <div className="my-8 bg-white h-full sm:h-screen flex items-center px-5">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-5 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto">
            <form onSubmit={createFun} className="w-full flex justify-between items-center"
            >
              {/* Create Post */}
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">Create Post</h3>
                </div>
                {/* Title Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Post Title</span>
                  </label>
                  <input type="text" placeholder="create your post title" className="input input-bordered w-full" name="title" required
                  />
                </div>

                {/* Description Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Post Description</span>
                  </label><br></br>
                  <textarea className="textarea w-full" placeholder="create your post description" name="description" required></textarea>
                </div>
                {/* image */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Post Image </span>
                  </label>
                  <input type="file" accept="image/*" className="file-input input-bordered w-full" name="image" />
                </div>
                {/* Submit Button */}
                <div className="form-control mt-6 w-full flex flex-col sm:flex-row gap-2">
                  <button type="submit" disabled={btnLoading} className="btn bg-green-500 border-none font-bold text-white px-4 w-full sm:w-1/2">
                    {btnLoading ? "Post Created..." : "Create Post"}
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

export default CreatePost;