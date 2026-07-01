import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../Components/AuthProvider/AuthProvider';
import LoadingCom from '../../Components/LoadingCom/LoadingCom';
import ErrorCom from '../../Components/ErrorCom/ErrorCom';
import { Link } from 'react-router';

interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  limit: number;
}

interface IOrderItem {
  product: IProduct;
  quantity: number;
  price: number;
  _id: string;
}

interface IOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
  orderItems: IOrderItem[];
  totalBill: number;
  status: 'Pending' | 'Approved';
  createdAt: string;
  updatedAt: string;
}

const AllOrderManager = () => {
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>([]);

  // get auth context data
  const authInfo = useContext(AuthContext);
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // call manager order api
  const { data: ordersResponse, isLoading, isError } = useQuery({
    queryKey: ['managerOrders'],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/order/getAllOrderManager`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const orders = ordersResponse?.data || [];

  // view button model open
  const handleViewDetails = (orderItems: IOrderItem[]) => {
    setSelectedItems(orderItems);
    const modal = document.getElementById('my_modal_manager') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>;
  }

  // error component
  if (isError) {
    return <ErrorCom></ErrorCom>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-md">
      
      {/* header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-red-500">
        <h2 className="text-[11px] sm:text-lg font-bold text-red-500">All Order Manager Portal ({orders.length})</h2>
        <Link to="/allPaymentManager">
          <button className="px-2 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] sm:text-md lg:text-[13px] rounded transition-colors shadow-sm">
            Payment List
          </button>
        </Link>
        
      </div>

      {/* order table body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          
          {orders.length === 0 ? (
            <tbody className="w-full">
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 font-medium text-sm">
                  No order available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {orders.map((order: IOrder, index: number) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">{index + 1}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    {typeof order.user === 'object' ? order.user?.name : 'Unknown User'}
                  </td>
                  <td className="p-4 text-gray-500">
                    {typeof order.user === 'object' ? order.user?.email : 'N/A'}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold text-xs ${order.status === 'Pending' ? 'text-red-600' : 'text-green-600'}`}>{order.status}</span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    {/* modal button */}
                    <button onClick={() => handleViewDetails(order.orderItems)}className="px-3 py-1 bg-green-500 text-white font-bold text-xs rounded hover:bg-green-600 transition-colors"
                    >View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* product list model */}
      <dialog id="my_modal_manager" className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500">✕</button>
          </form>
          <h3 className="font-bold text-base text-red-500 mb-4 pb-2 border-b">Ordered Products List</h3>
          
          {/* product list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-bold uppercase tracking-wider">
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-medium">
                {selectedItems.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <img src={item.product?.image || 'default-product.png'} alt="" className="w-8 h-8 object-cover rounded mx-auto" />
                    </td>
                    <td className="p-2">{item.product?.name || 'Unknown Product'}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">${item.price}</td>
                    <td className="p-2 text-right font-bold text-green-600">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </dialog>

    </div>
  );
};

export default AllOrderManager;