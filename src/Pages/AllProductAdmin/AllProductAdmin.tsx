import { useContext } from "react";
import { Link } from "react-router"; 
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";
import ErrorCom from "../../Components/ErrorCom/ErrorCom";


interface CreatorInfo {
  _id: string;
  name: string;
  email: string;
}

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  limit: number;
  image: string;
  isApproved: boolean;
  createdBy: CreatorInfo;
}

const AllProductAdmin = () => {

  // get user auth and stack method
  const authInfo = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  // check user validation
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // get all product api
  const { data: adminProducts = [], isLoading, isError } = useQuery<ProductType[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/product/getAdminProduct`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data || [];
    },
    enabled: !!token,
  });

  // approved single product
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(
        `${baseURL}/product/approveProduct/${id}`,
        { isApproved: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: "Approved!",
        text: data?.message || "Product approved successfully.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: any) => {
      console.error("Approval error:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to approve product.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // approved handel button
  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  // delete button
  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${name}? (API needs to be integrated)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });
  };

  // approved product and total product
  const approvedCount = adminProducts?.filter((product) => product.isApproved === true).length || 0;
const totalProducts = adminProducts?.length || 0;

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  // error component
  if (isError) {
    return <ErrorCom></ErrorCom>
  };

  return (
    <div className="container mx-auto p-5 my-5 bg-white shadow-md rounded-xl">
      {/* header count section */}
      <h3 className="text-md sm:text-lg lg:text-2xl font-bold text-red-500 mb-5 border-b-red-500 border-b-2 pb-2">
        Admin Panel - Manage Products ({approvedCount}/{totalProducts})
      </h3>

      <div className="overflow-x-auto">
        {adminProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            No products available right now.
          </div>
        ) : (
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <th>#</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Creator</th>
                <th>Price</th>
                <th>Stock Limit</th>
                <th>Order</th>
                <th>Approval Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50 align-middle text-sm">
                  {/* serial number */}
                  <td>{index + 1}</td>

                  {/* product image */}
                  <td>
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-lg border border-gray-200">
                        <img 
                          src={product.image === "default-product.png" || !product.image ? "/default/default-product.png" : product.image} 
                          alt={product.name} 
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </td>

                  {/* product name */}
                  <td className="font-semibold text-gray-800 whitespace-nowrap">{product.name}</td>

                  {/* user name (Populated from backend) */}
                  <td className="text-gray-700 font-medium whitespace-nowrap">
                    {product.createdBy?.name || "Unknown"}
                  </td>

                  {/* price */}
                  <td className="font-bold text-green-600">${product.price}</td>

                  {/* limit */}
                  <td className="text-center font-semibold text-gray-600">{product.limit}</td>
                  <td className="text-center font-semibold text-gray-600">{"00"}</td>
                  {/* approved conditional button */}
                  <td>
                    {product.isApproved ? (
                      <span className="badge badge-success text-white font-bold p-3 capitalize shadow-sm">
                        Approved
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleApprove(product._id)}
                        disabled={approveMutation.isPending}
                        className="btn btn-xs sm:btn-sm bg-red-500 hover:bg-red-600 text-white font-bold border-none"
                      >
                        {approveMutation.isPending ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Approve Please"
                        )}
                      </button>
                    )}
                  </td>

                  {/* action button */}
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <Link to={`/singleProduct/${product?._id}`}>
                        <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-3">
                          View
                        </button>
                      </Link>

                      {/* Update Button */}
                      <Link to={`/updateSingleProduct/${product?._id}`}>
                        <button className="btn btn-sm bg-blue-500 border-none font-bold text-white px-3">
                          Update
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(product._id, product.name)} 
                        className="btn btn-sm bg-red-500 border-none font-bold text-white px-3"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllProductAdmin;