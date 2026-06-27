import { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";
import ErrorCom from "../../Components/ErrorCom/ErrorCom";


interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  limit: number;
  image: string;
  isApproved: boolean;
}

const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authInfo = useContext(AuthContext);

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // single product call api
  const { data: product, isLoading, isError } = useQuery<ProductType>({
    queryKey: ["singleProduct", id],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/product/getSingleProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data;
    },
    enabled: !!id && !!token,
  });

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  // error component
  if (isError) {
    return <ErrorCom></ErrorCom>
  };

  // if no product
  if (!product) return null;

  return (
    <div className="container mx-auto p-5 my-10 max-w-5xl">
      {/* card section */}
      <div className="card lg:card-side bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* product image */}
        <figure className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-5">
          <img
            src={product.image === "default-product.png" || !product.image ? "/default/default-product.png" : product.image}
            alt={product.name}
            className="rounded-xl max-h-[400px] object-contain w-full hover:scale-105 transition-transform duration-300"
          />
        </figure>

        {/* product details */}
        <div className="card-body lg:w-1/2 flex flex-col justify-between p-8">
          <div>
            {/* approved section */}
            <div className="mb-3">
              {product.isApproved ? (
                <span className="badge badge-success text-white font-bold p-3 text-xs capitalize shadow-sm">
                  Approved
                </span>
              ) : (
                <span className="badge badge-warning text-white font-bold p-3 text-xs capitalize shadow-sm">
                  Pending Approval
                </span>
              )}
            </div>

            {/* product name */}
            <h2 className="card-title text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-4 capitalize">
              {product.name}
            </h2>

            {/* product description */}
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base border-t border-gray-100 pt-4 mb-6">
              {product.description}
            </p>

            {/* price , limit , order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Product Price</p>
                <p className="text-lg font-black text-green-600">${product.price}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Stock Limit</p>
                <p className="text-lg font-bold text-blue-500">{product.limit} Pcs</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Product Orders</p>
                <p className="text-lg font-bold text-red-500">0 Pcs</p>
              </div>
            </div>
          </div>

          {/* back button */}
          <div className="card-actions justify-end mt-4 border-t border-gray-100 pt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="btn bg-red-500 hover:bg-red-600 border-none font-bold text-white px-5 flex items-center gap-2 shadow-md transition-all duration-200"
            > Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;