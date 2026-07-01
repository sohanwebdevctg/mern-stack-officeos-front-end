import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
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

const UserOrderTable = () => {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>([]);

  // get auth context data
  const authInfo = useContext(AuthContext);
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // get order api
  const { data: ordersResponse, isLoading, isError } = useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/order/getSingleOrder`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const orders = ordersResponse?.data || [];

  // delete order api
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axios.delete(`${baseURL}/order/deleteOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // user order data auto reface
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your order has been cancelled and deleted.',
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
  });

  // view button model open
  const handleViewDetails = (orderItems: IOrderItem[]) => {
    setSelectedItems(orderItems);
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  // delete button confirmation
  const handleDeleteClick = (orderId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrderMutation.mutate(orderId);
      }
    });
  };

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  // error component
  if (isError) {
    return <ErrorCom></ErrorCom>
  };

  return (
    <div className="w-full bg-white p-6 rounded-md">
      
      {/* order table header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-red-500">
        <h2 className="text-xl font-bold text-red-500">Order List ({orders.length})</h2>
        <Link to="/singleUserPayment">
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded transition-colors shadow-sm">
          Payment List
        </button>
        </Link>
        
      </div>

      {/* loading and error handle */}
      {isLoading && (
        <LoadingCom></LoadingCom>
      )}

      {isError && (
        <div className="text-center text-red-500 py-5 font-semibold text-xs">
          Failed to load orders. Please try again later.
        </div>
      )}

      {/* order table body */}
      {!isLoading && !isError && (
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
            {
              orders.length === 0 ? <tbody className="w-full"><tr><td colSpan={6} className="text-center py-8 text-gray-500 font-medium text-sm">No order available</td></tr></tbody>  : <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {orders.map((order: IOrder, index: number) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">{index + 1}</td>
                  <td className="p-4 font-semibold text-gray-900">{order.user?.name || order?.name || 'Unknown User'}</td>
                  <td className="p-4 text-gray-500">{order.user?.email || order.email || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    
                    {/* view order list */}
                    <button onClick={() => handleViewDetails(order.orderItems)}className="px-3 py-1 bg-green-500 text-white font-bold text-xs rounded hover:bg-green-600 transition-colors">View</button>

                    {/* delete order */}
                    <button onClick={() => handleDeleteClick(order._id)}
                      className="px-3 py-1 bg-red-500 text-white font-bold text-xs rounded hover:bg-red-600 transition-colors"
                      disabled={deleteOrderMutation.isPending}>
                      {deleteOrderMutation.isPending ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            }
            
          </table>
        </div>
      )}

      {/* product list model */}
      <dialog id="my_modal_3" className="modal">
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
                      {/* product data show */}
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

export default UserOrderTable;