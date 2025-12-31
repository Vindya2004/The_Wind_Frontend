import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import type { RootState, AppDispatch } from '../redux/store'; // path එක ඔයාගේ project එකට match කරන්න

/* ================= TYPES ================= */

interface ShippingAddress {
  city: string;
  country: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  createdAt: string | Date; // backend එකෙන් string (ISO) එනවා common
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  // totalPrice ඕනෙ නම් add කරන්න
}

/* ================= COMPONENT ================= */

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id string බව type කළා
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux slice එකේ structure එකට match වෙන්න select කරන්න
  // සාමාන්‍යයෙන් orderSlice එකේ orderDetails, loading, error තියෙනවා
  const { orderDetails, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-gray-600 text-lg">No order details found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      <div className="p-4 sm:p-6 rounded-lg border shadow-sm bg-white">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{orderDetails._id}
            </h3>
            <p className="text-gray-600">
              {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderDetails.isPaid
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {orderDetails.isPaid ? 'Paid' : 'Pending Payment'}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderDetails.isDelivered
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {orderDetails.isDelivered ? 'Delivered' : 'Pending Delivery'}
            </span>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p className="text-gray-600">Method: {orderDetails.paymentMethod}</p>
            <p className="text-gray-600">
              Status: {orderDetails.isPaid ? 'Paid' : 'Unpaid'}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
            <p className="text-gray-600">Method: {orderDetails.shippingMethod}</p>
            <p className="text-gray-600">
              Address: {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center">{item.quantity}</td>
                  <td className="py-4 px-4 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link to="/my-orders" className="text-blue-600 hover:underline text-lg">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;