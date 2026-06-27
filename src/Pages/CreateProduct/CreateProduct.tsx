import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";


const CreateProduct = () => {

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
  }


  return (
    <div className="my-8 bg-white h-full sm:h-screen flex items-center px-5">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-5 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto">
            <form onSubmit={createFun} className="w-full flex justify-between items-center"
            >
              {/* Create product */}
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">Create Product</h3>
                </div>
                {/* Title Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Name</span>
                  </label>
                  <input type="text" placeholder="create your product name" className="input input-bordered w-full" name="name" required
                  />
                </div>

                {/* Description Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Description</span>
                  </label><br></br>
                  <textarea className="textarea w-full" placeholder="create your product description" name="description" required></textarea>
                </div>
                {/* Price Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Price</span>
                  </label><br></br>
                  <input type="number" placeholder="create your product price" className="input input-bordered w-full" name="price" required
                  />
                </div>
                {/* Limit Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Limit</span>
                  </label><br></br>
                  <input type="number" placeholder="create your product limit" className="input input-bordered w-full" name="limit" required
                  />
                </div>
                {/* image */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Image </span>
                  </label>
                  <input type="file" accept="image/*" className="file-input input-bordered w-full" name="image" />
                </div>
                {/* Submit Button */}
                <div className="form-control mt-6 w-full flex flex-col sm:flex-row gap-2">
                  <button type="submit" disabled={btnLoading} className="btn bg-green-500 border-none font-bold text-white px-4 w-full sm:w-1/2">
                    {btnLoading ? "Product Created..." : "Create Product"}
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

export default CreateProduct;