import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import type { RootState, AppDispatch } from "../redux/store";

/* ================= TYPES ================= */

interface OrderItem {
  name: string;
  image: string;
}

interface ShippingAddress {
  city: string;
  country: string;
}

interface Order {
  _id: string;
  createdAt: string | Date; // backend එකෙන් "createdAt" එනවා (MongoDB standard)
  shippingAddress?: ShippingAddress;
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid: boolean;
}

/* ================= COMPONENT ================= */

const MyOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-app p-8 text-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You have no orders yet.</p>
        </div>
      ) : (
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Shipping Address</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-4 px-4">
                    {order.orderItems.length > 0 ? (
                      <img
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg" />
                    )}
                  </td>

                  <td className="py-4 px-4 font-medium text-gray-900">
                    #{order._id}
                  </td>

                  <td className="py-4 px-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <br />
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-sm">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  <td className="py-4 px-4 text-center">
                    {order.orderItems.length}
                  </td>

                  <td className="py-4 px-4 font-medium">
                    ${order.totalPrice.toFixed(2)}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
