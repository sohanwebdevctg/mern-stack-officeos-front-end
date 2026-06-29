
interface OrderCartProps{
  cart: any[];
  handleUpdateQuantity: (id:string, action: "increase" | "decrease") => void;
}

const OrderCart = ({cart, handleUpdateQuantity}: OrderCartProps) => {

  console.log(cart);

  return (
    <div className="flex flex-col h-full justify-between w-full sm:w-[86%] md:w-full lg:w-full">
      {/* table start */}
      <div className="h-[350px] md:h-[400px] lg:h-[450px] overflow-y-scroll border border-gray-100 shadow-sm rounded-md">
        <table className="table w-full border-collapse">
          {/* table head start */}
          <thead className="bg-green-500 text-white sticky top-0">
            <tr>
              <th className="text-xs py-2 px-3 text-left">#</th>
              <th className="text-xs py-2 px-2 text-left">Image</th>
              <th className="text-xs py-2 px-2 text-left">Name</th>
              <th className="text-xs py-2 px-2 text-center">Quantity</th>
              <th className="text-xs py-2 px-2 text-right">Total</th>
              <th className="text-xs py-2 px-2 text-center">Action</th>
            </tr>
          </thead>
          {/* table head end */}
          {/* table body start */}
          {cart?.length > 0 ? (
            <tbody>
              {cart.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-slate-50 border-b border-gray-100">
                  <td className="text-xs py-2 px-3 font-medium text-gray-500">{index + 1}</td>
                  <td className="py-2 px-2">
                    <img src={item.image} alt={item.name} className="w-7 h-7 object-cover" />
                  </td>
                  <td className="py-2 px-2">
                    <p className="text-[11px] font-semibold text-gray-700 truncate max-w-[80px]">
                      {item.name}
                    </p>
                  </td>
                  <td className="py-2 px-2">
                    {/* button and quantity */}
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleUpdateQuantity(item._id, "decrease")} className="px-1.5 py-0.5 bg-red-500 text-gray-700 rounded text-xs font-bold">-</button>
                      <span className="text-xs font-bold px-2 text-center text-gray-800">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item._id, "increase")} className="px-1.5 py-0.5 bg-green-500 text-gray-700 rounded text-xs font-bold">+</button>
                    </div>
                  </td>
                  {/* quantity and price */}
                  <td className="py-2 px-2 text-right text-[11px] font-bold text-green-600">
                    ${(item.price * item.quantity)}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button className="text-[10px] btn btn-xs bg-red-500 border-none text-white rounded px-2 py-0.5">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs font-medium">
                  No items added yet.
                </td>
              </tr>
            </tbody>
          )}
          {/* table body end */}
        </table>
      </div>
      {/* table end */}
      {/* submit order start */}
      <div className="pt-4 border-t mt-auto">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-xs font-bold text-gray-600">Total Bill:</span>
          <span className="text-sm font-black text-green-600">
            ${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
          </span>
        </div>
        <button className="w-full py-2 bg-green-500 rounded-lg font-bold text-xs text-white shadow">
          Submit Order
        </button>
      </div>
      {/* submit order end */}
    </div>
  );
};


export default OrderCart;