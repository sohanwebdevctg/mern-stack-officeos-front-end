import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../Components/AuthProvider/AuthProvider';
import LoadingCom from '../../Components/LoadingCom/LoadingCom';
import ErrorCom from '../../Components/ErrorCom/ErrorCom';
import { useNavigate } from 'react-router';

interface IPaymentItem {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  paymentNumber: string;
  totalPrice: number;
  orderItems: {
    product: {
      name: string;
    };
    quantity: number;
  }[];
  createdAt: string;
}

const SingleUserPayment = () => {
  const navigate = useNavigate();
  const authInfo = useContext(AuthContext);
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  const userId = (validUser as any)?.id || (validUser as any)?.user?.id || (validUser as any)?.user?._id;

  // call api all payment single user
  const { data: paymentResponse, isLoading, isError } = useQuery({
    queryKey: ['userPaymentHistory'],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/payment/getSingleUserPayment/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const payments = paymentResponse?.data || [];

  if (isLoading) {
    return <LoadingCom></LoadingCom>;
  };
  
  if (isError){
    return <ErrorCom></ErrorCom>;
  };

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-sm">
      {/* header part */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-500">
        <h2 className="text-[11px] sm:text-lg font-bold text-green-600">User Payment History <span className="px-2 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full">
          Total: {payments.length}
        </span></h2>
        <button onClick={() => navigate(-1)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] sm:text-md lg:text-[13px] rounded transition-colors shadow-sm">
          Back
        </button>
      </div>

      {/* payment table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-4"># Serial</th>
              <th className="p-4">User Details</th>
              <th className="p-4">Bank Account</th>
              <th className="p-4">Product & Qty</th>
              <th className="p-4 text-right">Total Price</th>
              <th className="p-4 text-center">Date</th>
            </tr>
          </thead>
          {/* table body */}
          {payments.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 font-bold text-sm uppercase tracking-wide">
                  No Payment History Available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {payments.map((payment: IPaymentItem, index: number) => {
                const maskedAccount = payment.paymentNumber 
                  ? `${payment.paymentNumber.slice(0, 4)}••••••••` 
                  : 'N/A';

                return (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    {/* serial */}
                    <td className="p-4 text-gray-400">{index + 1}</td>
                    
                    {/* name and email */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        
                        <span className="font-semibold text-gray-900">
                          {payment.user?.name || (validUser as any)?.name || (validUser as any)?.user?.name || 'Customer'}
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                          {payment.user?.email || (validUser as any)?.email || (validUser as any)?.user?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    {/* account number */}
                    <td className="p-4 font-mono text-gray-600 font-semibold">{maskedAccount}</td>
                    
                    {/* product name and quantity */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {payment.orderItems?.map((item: any, idx: number) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span className="font-medium">{item.product?.name || 'Product Deleted'}</span>
                            <span className="text-gray-400 font-bold">(x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    
                    {/* total price */}
                    <td className="p-4 text-right font-bold text-green-600">${payment.totalPrice}</td>
                    
                    <td className="p-4 text-center text-xs text-gray-500">
                    <div className="flex flex-col">
                      {/* date */}
                      <span className="font-semibold text-gray-700">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      {/* time */}
                      <span className="text-gray-400 text-[11px] mt-0.5">
                        {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default SingleUserPayment;