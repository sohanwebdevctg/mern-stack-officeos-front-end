import React, { useState, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../Components/AuthProvider/AuthProvider';
import LoadingCom from '../../Components/LoadingCom/LoadingCom';
import ErrorCom from '../../Components/ErrorCom/ErrorCom';
import Swal from 'sweetalert2';
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

const AllOrderAdmin = () => {
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');

  // get auth context data
  const authInfo = useContext(AuthContext);
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // call all order admin pai
  const { data: ordersResponse, isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/order/getAllOrderAdmin`, {
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
  const handleViewDetails = (orderId: string, orderItems: IOrderItem[]) => {
    setActiveOrderId(orderId);
    setSelectedItems(orderItems);
    const modal = document.getElementById('my_modal_admin') as HTMLDialogElement;
    if (modal) modal.showModal();
  };


  // approved api call
  const queryClient = useQueryClient();
  const approveOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axios.put(`${baseURL}/order/approvedOrder/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      
      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'Order has been approved successfully.',
        timer: 1500,
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

  // approve handle function
  const handleApproveClick = (orderId: string) => {
    approveOrderMutation.mutate(orderId);
  };

  //  quantity update
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ orderId, productId, action }: { orderId: string, productId: string, action: 'increment' | 'decrement' }) => {
      const response = await axios.put(`${baseURL}/order/${orderId}/updateProductQuantity`, { productId, action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      const updatedOrder = data.data;
      setSelectedItems(updatedOrder.orderItems);
    },
  });

  //  product remove from order
  const removeProductMutation = useMutation({
    mutationFn: async ({ orderId, productId }: { orderId: string, productId: string }) => {
      const response = await axios.delete(`${baseURL}/order/${orderId}/removeProduct/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      const updatedOrder = data.data;
      setSelectedItems(updatedOrder?.orderItems || []);
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Removed!', 
        text: 'Product removed and limit restored.', 
        timer: 1000, 
        showConfirmButton: false 
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to remove product',
      });
    }
  });

  // delete order
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axios.delete(`${baseURL}/order/deleteOrderAdmin/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Order has been completely removed.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete order',
      });
    }
  });

  // delete handle button
  const handleDeleteOrderClick = (orderId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this order!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrderMutation.mutate(orderId);
      }
    });
  };

  // call api create payment
  const createPaymentMutation = useMutation({
  mutationFn: async ({ orderId, paymentNumber }: { orderId: string; paymentNumber: string }) => {
    const response = await axios.post(
      `${baseURL}/payment/createPayment`,
      { orderId, paymentNumber },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });

    const payModal = document.getElementById('pay_modal_admin') as HTMLDialogElement;
    if (payModal) payModal.close();

    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Order settled and stock adjusted.',
      timer: 2000,
      showConfirmButton: false,
    });
  },
  onError: (error: any) => {
    setPaymentError(error.response?.data?.message || 'Something went wrong during payment!');
  },
});

  // payment function
const handlePaymentSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // account number validation
  if (!accountNumber || accountNumber.length !== 12) {
    setPaymentError('Account number must be exactly 12 digits!');
    return;
  }

  // password validation
  if (!accountPassword || accountPassword.length !== 4) {
    setPaymentError('Password must be exactly 4 digits!');
    return;
  }

  setPaymentError('');
  
  createPaymentMutation.mutate({
    orderId: activeOrderId,
    paymentNumber: accountNumber,
  });
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
      
      {/* order table header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-red-500">
        <h2 className="text-[11px] sm:text-lg font-bold text-red-500">All Order Admin Portal ({orders.length})</h2>
        <Link to="/allPaymentAdmin">
          <button className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] sm:text-md lg:text-[13px] rounded transition-colors shadow-sm">
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
                  
                  {/* status button */}
                  <td className="p-4">
                        {order.orderItems?.length === 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-600 border-red-200 animate-pulse">
                            Please Delete Order
                          </span>
                        ) : order.status === 'Pending' ? (
                          <button 
                            onClick={() => handleApproveClick(order._id)}
                            disabled={approveOrderMutation.isPending}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded transition-colors shadow-sm disabled:bg-amber-300"
                          >
                            {approveOrderMutation.isPending ? "..." : "Approve Please"}
                          </button>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {order.status}
                          </span>
                        )}
                      </td>
                  
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  
                  {/* action button */}
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => handleViewDetails(order._id, order.orderItems)}
                      className="px-3 py-1 bg-green-500 text-white font-bold text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      View
                    </button>

                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDeleteOrderClick(order._id)}
                      disabled={deleteOrderMutation.isPending}
                      className="px-3 py-1 bg-red-500 text-white font-bold text-xs rounded hover:bg-red-600 transition-colors disabled:bg-red-300"
                    >
                      {deleteOrderMutation.isPending ? "..." : "Delete"}
                    </button>
                    {/* payment button */}
                    {order.status === 'Approved' && order.orderItems?.length > 0 && (<button onClick={() => {setActiveOrderId(order._id);setAccountNumber('');setAccountPassword('');setPaymentError('');
                  const payModal = document.getElementById('pay_modal_admin') as HTMLDialogElement;
                if (payModal) payModal.showModal();
              }}
              className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700 transition-colors"
            >Pay</button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* product list modal */}
      <dialog id="my_modal_admin" className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500">✕</button>
          </form>
          <h3 className="font-bold text-base text-red-500 mb-4 pb-2 border-b">Ordered Products List</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-bold uppercase tracking-wider">
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-medium">
                {selectedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 font-bold text-sm uppercase">
                      No product available
                    </td>
                  </tr>
                ) : (
                  selectedItems.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-2 text-center">
                        <img src={item.product?.image || 'default-product.png'} alt="" className="w-8 h-8 object-cover rounded mx-auto" />
                      </td>
                      <td className="p-2">{item.product?.name || 'Unknown Product'}</td>
                      {/* quantity increment and decrement button */}
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          {/* decrement button */}
                          <button onClick={() => {
                            const pId = item.product?._id || item.product;
                            updateQuantityMutation.mutate({ orderId: activeOrderId, productId: pId, action: 'decrement' });
                          }}
                          className="w-5 h-5 bg-red-500 rounded flex items-center justify-center font-bold text-white text-sm"
                        >
                          -
                        </button>
                          <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                          {/* increment button */}
                          <button onClick={() => {
                              const pId = item.product?._id || item.product;
                              updateQuantityMutation.mutate({ orderId: activeOrderId, productId: pId, action: 'increment' });
                            }}
                            className="w-5 h-5 bg-green-500 rounded flex items-center justify-center font-bold text-white text-sm"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      
                      <td className="p-2 text-right">${item.price}</td>
                      <td className="p-2 text-right font-bold text-green-600">
                        ${item.price * item.quantity}
                      </td>
                      
                      {/* remove button */}
                      <td className="p-2 text-center">
                        <button 
                          onClick={() => {
                            const pId = item.product?._id || item.product;
                            removeProductMutation.mutate({ orderId: activeOrderId, productId: pId });
                          }}
                          disabled={removeProductMutation.isPending}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded transition-colors text-xs font-bold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>

      {/* payment confirmation modal */}
      <dialog id="pay_modal_admin" className="modal">
        <div className="modal-box max-w-md bg-white p-6 rounded-lg shadow-xl relative">
          {/* close button */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500">✕</button>
          </form>
          
          <h3 className="font-bold text-lg text-green-600 mb-4 text-center border-b pb-2 uppercase tracking-wider">
            Order Payment Settlement
          </h3>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* input account number */}
            <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Bank Account Number</label>
            <input 
              type="text" 
              value={accountNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setAccountNumber(onlyNums);
              }}
              placeholder="Enter account number (Numbers only)"
              className="w-full px-3 py-2 border rounded text-sm bg-gray-50 focus:outline-none focus:border-green-500 font-semibold"
            />
          </div>

            {/* enter pin number */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Account Password / PIN</label>
              <input 
                type="password" 
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 border rounded text-sm bg-gray-50 focus:outline-none focus:border-green-500 font-bold tracking-widest"
              />
            </div>

            {/* show error message */}
            {paymentError && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-1 rounded border border-red-100">
                {paymentError}
              </p>
            )}

            {/* submit button */}
            <button  type="submit" disabled={createPaymentMutation.isPending} className="w-full py-2.5 bg-green-600 text-white font-bold rounded">{createPaymentMutation.isPending ? "Processing..." : "Submit Pay"}</button>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default AllOrderAdmin;