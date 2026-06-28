
interface UserData{
  _id?: string;
  name: string;
  image: string;
}

interface ProductCardsProps {
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    limit: number;
    image: string;
    createdBy?: UserData
  };
}

const ProductCards = ({ item }: ProductCardsProps) => {
  return (
    <div className="bg-white shadow-lg p-2 flex flex-col gap-5 sm:justify-between rounded-md h-full sm:h-52">
      {/* image section */}
      <img src={item.image} alt={item.name} className="w-16 h-16 mx-auto object-cover" 
      />
      
      {/* product details */}
      <ul className="mt-1 space-y-1">
        <li className="text-[12px] sm:text-[12px] md:text-[11px] lg:text-[12px] xl:text-[12px] 2xl:text-[13px] font-bold flex justify-between items-center">
          <h4 className="truncate max-w-[70px]">{item.name}</h4>
          <p className="text-green-600">${item.price}</p>
        </li>
        
        <li>
          <h4 className="text-[10px] sm:text-[10px] md:text-[10px] lg:text-[11px] xl:text-[12px] 2xl:text-[12px] text-gray-400 font-bold">
            {/* description */}
            {item.description ? `${item.description.slice(0, 22)}...` : "No description"}
          </h4>
        </li>
        
        {/* stock and limit */}
        <li className="text-[11px] sm:text[11px] sm:text[11px] lg:text[11px] xl:text-[12px] text-gray-500">
          Stock: <span className="font-semibold text-gray-700">{item.limit}</span>
        </li>
        
        {/* add product */}
        <li className="pt-1">
          <button onClick={() => console.log("Clicked:", item._id)} className="text-xs bg-green-500 hover:bg-green-600 py-1 w-full font-bold text-white rounded-md transition-colors">Add</button>
        </li>
      </ul>
    </div>
  );
};

export default ProductCards;