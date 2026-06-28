import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query"; // ক্যাশ ইনভ্যালিডেট করার জন্য

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  limit: number;
  image: string;
  isApproved: boolean;
}

const UpdateSingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authInfo = useContext(AuthContext);
  const queryClient = useQueryClient(); // কুয়েরি ক্লায়েন্ট ইনিশিয়েট করা
  
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo; 
  const token = validUser?.token;

  // single product call api
  useEffect(() => {
    const getFreshUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/getSingleProduct/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductData(response.data?.data || response.data?.user || response.data);
      } catch (error) {
        console.error("Failed to fetch product data", error);
      }
    };

    if (id) {
      getFreshUserData();
    }
  }, [id, baseURL, token]);


  const updateFun = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!authInfo) return;

    const form = event.target as HTMLFormElement;

    // collect the form input data
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const limit = (form.elements.namedItem("limit") as HTMLInputElement).value;

    // image file input element
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    setBtnLoading(true);

    // Whether the file was actually selected by the user and the first file (`[0]`) was taken as an object
    const imageFile = imageInput.files && imageInput.files.length > 0 ? imageInput.files[0] : null;

    // send multiple form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("limit", limit);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // update api
    try {
      const response = await axios.put(`${baseURL}/product/updateSingleProduct/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Product updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        queryClient.invalidateQueries({ queryKey: ["singleProduct", id] });
        navigate(`/singleProduct/${id}`);
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
    }
  };

  return (
    <div className="my-8 bg-white h-full sm:h-screen flex items-center px-5 lg:my-24">
        <div className="container mx-auto">
          <div className="p-3 bg-base-100 w-full shadow-2xl mt-5 sm:w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto rounded-xl">
            <form onSubmit={updateFun} className="w-full flex justify-between items-center">
              <div className="flex-1 p-5">
                <div className="form-control sm:text-center">
                  <h3 className="text-xl sm:text-2xl text-red-500 font-bold mb-4">Update Product</h3>
                </div>
                
                {/* Name Input */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Name</span>
                  </label>
                  <input type="text" placeholder="create your product name" className="input input-bordered w-full" name="name" key={productData?.name} defaultValue={productData?.name} />
                </div>
                
                {/* Description Input */}
                <div className="form-control mt-2">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Description</span>
                  </label>
                  <textarea className="textarea textarea-bordered w-full h-24" placeholder="create your product description" name="description" key={productData?.description} defaultValue={productData?.description}></textarea>
                </div>
                
                {/* Price Input */}
                <div className="form-control mt-2">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Price</span>
                  </label>
                  <input type="number" placeholder="create your product price" className="input input-bordered w-full" name="price" key={productData?.price} defaultValue={productData?.price} />
                </div>
                
                {/* Limit Input */}
                <div className="form-control mt-2">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Limit</span>
                  </label>
                  <input type="number" placeholder="create your product limit" className="input input-bordered w-full" name="limit" key={productData?.limit} defaultValue={productData?.limit} />
                </div>
                
                {/* Previous Image */}
                <div className="form-control mt-3">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Previous Image</span>
                  </label>
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
                    <img alt="Product" className="h-full object-contain" src={productData?.image === "default-image.png" || !productData?.image ? '/default/default-image.png' : productData?.image} />
                  </div>
                </div>
                
                {/* New Image Input */}
                <div className="form-control mt-2">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Product Image (Optional)</span>
                  </label>
                  <input type="file" accept="image/*" className="file-input file-input-bordered w-full" name="image" />
                </div>
                
                {/* Submit Button */}
                <div className="form-control mt-6 w-full flex flex-col sm:flex-row gap-2">
                  <button type="submit" disabled={btnLoading} className="btn bg-green-500 hover:bg-green-600 border-none font-bold text-white px-4 w-full sm:w-1/2">
                    {btnLoading ? <span className="loading loading-spinner loading-xs"></span> : "Update Product"}
                  </button>
                  <button type="button" onClick={() => navigate(-1)} className="btn bg-red-500 hover:bg-red-600 border-none font-bold text-white px-4 w-full sm:w-1/2">Back</button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default UpdateSingleProduct;