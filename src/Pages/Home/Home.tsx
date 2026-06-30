import { useContext, useState } from "react";
import ProductCards from "../../Components/ProductCareds/ProductCards";
import OrderCart from "../../Components/OrderCart/OrderCart";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { clearCart, getCart, saveCart } from "../../utilities/localstorage";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router";

interface UserData{
    _id: string;
    name: string;
    image: string;
}

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  limit: number;
  image: string;
  isApproved: boolean;
  createdBy: UserData
}


const Home = () => {

  const authInfo = useContext(AuthContext);
  // navigation the user
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [cart, setCart] = useState<any[]>(() => getCart());

  // check validation
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  const { data: approvedProducts = [], isLoading, isError } = useQuery<ProductType[]>({
    queryKey: ["homepageApprovedProducts"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/product/getAllProduct`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data || [];
    },
    enabled: !!token,
  });

  // add cart function
  const handleAddToCart = (id: string) => {

  // check the previous cart data
  const isAlreadyExists = cart.some((item) => item._id === id);

  if (isAlreadyExists) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Already in Cart!",
      text: "This product is already added to your cart. You can increase the quantity from the cart table.",
      showConfirmButton: true,
      confirmButtonColor: "#22c55e",
    });
    return;
  }

  // find cart data
  const clickedProduct = approvedProducts.find((product) => product._id === id);

  // create cart object data
  if(clickedProduct) {
    const newCartItem = {
      _id: clickedProduct._id,
      name: clickedProduct.name,
      price: clickedProduct.price,
      image: clickedProduct.image,
      limit: clickedProduct.limit,
      quantity: 1,
    };

    // save the cart in state and local storage
    const updatedCart = [...cart, newCartItem];
    setCart(updatedCart);
    saveCart(updatedCart);
  }
};

  // handle update quantity
  const handleUpdateQuantity = (id: string, action: "increase" | "decrease") => {

    const originalProduct = approvedProducts.find((p) => p._id === id);
    const maxLimit = originalProduct ? originalProduct.limit : 0;

    // increment
    if (action === "increase") {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        // if limit is getter than quantity send error
        if (item.quantity >= maxLimit - 1) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Stock Limit Reached!",
            text: `Sorry, you cannot add more than ${maxLimit} items for this product.`,
            showConfirmButton: true,
            confirmButtonColor: "#22c55e",
          });
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    // save the data
    setCart(updatedCart);
    saveCart(updatedCart);
  }else if(action === "decrease"){
    // if limit is less than quantity send error
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        if (item.quantity <= 1) {
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Minimum Limit!",
            text: "Quantity cannot be less than 1. If you want to remove this product, click the Delete button.",
            showConfirmButton: true,
            confirmButtonColor: "#22c55e",
          });
          return item;
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    saveCart(updatedCart);

  }

  };

  // delete order product
  const handleDeleteCartItem = (id: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to remove this product from the cart?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#22c55e",
    cancelButtonColor: "#ef4444", 
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      // check the product id
      const updatedCart = cart.filter((item) => item._id !== id);

      setCart(updatedCart);
      saveCart(updatedCart);

      Swal.fire({
        title: "Deleted!",
        text: "Product has been removed from your cart.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
};

  // submit the order
  const handleOrderSubmit = async () => {
    // checking the cart data length
      if (cart.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart is Empty",
        text: "Please add some products to your cart before submitting.",
      });
      return;
    }

    // create order data
    const orderData = {
  orderItems: cart.map((item) => ({ 
    product: item._id,
    quantity: item.quantity,
    price: item.price,
  })),
  totalBill: cart.reduce((total, item) => total + item.price * item.quantity, 0),
};

    try {
    // create order api
    const response = await axios.post(`${baseURL}/order/createOrder`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // if success message show the clear session and state
    if (response.data.success || response.data.acknowledged) {
      
      clearCart();
      setCart([]);

      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully!",
        text: "Your order has been recorded and showcase stock is updated.",
        timer: 2500,
        showConfirmButton: false,
      });

      navigate("/userOrderTable");
    }
  } catch (error: any) {
    console.error("Order submit error:", error);
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: error.response?.data?.message || "Something went wrong while placing your order.",
    });
  }
  }

  return (
     <div>
      <div className="flex justify-between h-full sm:gap-2 md:gap-1 lg:gap-2 xl:gap-3">
      {/* cart-item start */}
<div className="w-full h-full sm:h-[430px] md:h-[430px] lg:h-[450px] xl:h-[520px] 2xl:h-[600px] md:w-[60%] lg:w-[65%] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-3 px-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-white">
  {isLoading ? (
    <div className="col-span-full flex justify-center items-center py-10">
      <span className="loading loading-spinner loading-md text-green-500"></span>
    </div>
  ) : isError ? (
    <div className="col-span-full text-center text-red-500 text-xs py-5 font-medium">
      Failed to load products.
    </div>
  ) : approvedProducts.length === 0 ? (
    <div className="col-span-full text-center text-gray-400 text-xs py-5 font-medium">
      No products available right now.
    </div>
  ) : (
    approvedProducts.map((item, index) => {
      // check the cart product is exists
      const cartItem = cart?.find((cartProd) => cartProd._id === item._id);

      // if the limit is in the account cart, it is minus, if not, it is whatever is there
      const displayLimit = cartItem ? item.limit - cartItem.quantity : item.limit;

      // modify object with new limits
      const modifiedItem = { ...item, limit: displayLimit };

      // now the component is returned
      return (<ProductCards key={item._id || index} item={modifiedItem} handleAddToCart={handleAddToCart}  />);
    })
  )}
</div>
{/* cart-item end */}

        <div className="md:w-[40%] lg:w-[35%]">
          <div className={`${toggle ? 'fixed top-14 left-0 sm:left-24 right-0 bottom-0': 'fixed top-14 left-[1000px] right-0 bottom-0'} md:sticky  h-full md:h-[430px] lg:h-[450px] xl:h-[520px] 2xl:h-[600px] w-full   py-5 md:py-0 px-5 bg-white z-30 transform duration-500 easy-in`}>
            <OrderCart cart={cart} handleUpdateQuantity={handleUpdateQuantity} handleDeleteCartItem={handleDeleteCartItem} handleOrderSubmit={handleOrderSubmit}></OrderCart>
          </div>
          <span className="fixed top-[50%] -right-2 z-40 md:hidden">
            {
              toggle ? <BiSolidRightArrow onClick={() => setToggle(!toggle)} className="text-3xl bg-white shadow-md shadow-slate-300 rounded-full p-1 text-green-400"></BiSolidRightArrow> : <BiSolidLeftArrow onClick={() => setToggle(!toggle)} className="text-3xl bg-white shadow-md shadow-slate-300 rounded-full p-1 text-green-400"></BiSolidLeftArrow>
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;