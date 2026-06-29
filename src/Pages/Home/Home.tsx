import { useContext, useState } from "react";
import ProductCards from "../../Components/ProductCareds/ProductCards";
import OrderCart from "../../Components/OrderCart/OrderCart";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCart, saveCart } from "../../utilities/localstorage";

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
    alert('This product already exists in the cart!');
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
      return (<ProductCards key={item._id || index} item={modifiedItem} handleAddToCart={handleAddToCart} />);
    })
  )}
</div>
{/* cart-item end */}

        <div className="md:w-[40%] lg:w-[35%]">
          <div className={`${toggle ? 'fixed top-14 left-0 sm:left-24 right-0 bottom-0': 'fixed top-14 left-[1000px] right-0 bottom-0'} md:sticky  h-full md:h-[430px] lg:h-[450px] xl:h-[520px] 2xl:h-[600px] w-full   py-5 md:py-0 px-5 bg-white z-30 transform duration-500 easy-in`}>
            <OrderCart cart={cart}></OrderCart>
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