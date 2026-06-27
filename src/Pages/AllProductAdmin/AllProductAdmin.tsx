import { useContext, useState } from "react";
import { Link } from "react-router"; 
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";

interface Product{
  _id: string,
  name: string,
  description: string,
  price: number,
  limit: number,
  image: string,
  isApproved: false,
  user: { name: string }
}


const dummyProducts = [
  {
    _id: "1",
    name: "Office Table",
    description: "This is a high quality wooden office table.",
    price: 120,
    limit: 15,
    image: "https://i.ibb.co/nqZSJ9X/26543c79b1bc.png",
    isApproved: false,
    user: { name: "Sohan Ali" }
  },
  {
    _id: "2",
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with premium leather.",
    price: 250,
    limit: 8,
    image: "default-product.png",
    isApproved: true, 
    user: { name: "Admin 1" }
  }
];

const AllProductAdmin = () => {

  const authInfo = useContext(AuthContext);
  
  // check user validation
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  const [products, setProducts] = useState(dummyProducts);

  // এপিআই কানেক্ট করার পর এই ফাংশনগুলো রিয়েল কাজ করবে
  const handleApprove = (id: string) => {
    console.log("Product Approved:", id);
  };

  const handleDelete = (id: string, name: string) => {
    console.log("Product Deleted:", id, name);
  };

  return (
    <div className="container mx-auto p-5 my-5 bg-white shadow-md rounded-xl">
      {/* header count section */}
      <h3 className="text-md sm:text-lg lg:text-2xl font-bold text-red-500 mb-5 border-b-red-500 border-b-2 pb-2">
        Admin Panel - Manage Products ({products.length})
      </h3>

      <div className="overflow-x-auto">
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
            {products.map((product, index) => (
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

                {/* user name */}
                <td className="text-gray-700 font-medium whitespace-nowrap">{product.user?.name || "Unknown"}</td>

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
                      className="btn btn-xs sm:btn-sm bg-red-500 hover:bg-red-600 text-white font-bold border-none"
                    >
                      Approve Please
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
                    <Link to={`/updateProduct/${product?._id}`}>
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
      </div>
    </div>
  );
};

export default AllProductAdmin;