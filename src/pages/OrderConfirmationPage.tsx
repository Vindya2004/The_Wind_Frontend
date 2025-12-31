import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import type { RootState } from '../redux/store'; // ඔයාගේ store file එකේ path එක adjust කරන්න

// Checkout state interface එක define කරන්න
interface ShippingAddress {
  address: string;
  city: string;
  Country: string;
}

interface CheckoutItem {
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Checkout {
  _id: string;
  createdAt: string | Date; // backend එකෙන් string එනවා නම් string, Date object එනවා නම් Date
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
}

const OrderConfirmationPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state එකෙන් checkout data ගන්නවා + proper typing
  const checkout = useSelector((state: RootState) => state.checkout.checkout) as Checkout | null;

  // Clear cart when order is confirmed
  useEffect(() => {
    if (checkout?._id) {
      dispatch(clearCart());
      localStorage.removeItem('cart');
    } else {
      navigate('/my-orders'); // order එක නැත්නම් redirect
    }
  }, [checkout, dispatch, navigate]);

  // Estimated delivery calculate කරන function එක
  const calculateEstimateDelivery = (createdAt: string | Date): string => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // +10 days
    return orderDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // If no checkout data, show loading or nothing
  if (!checkout) {
    return null; // හෝ loading spinner එකක් දාන්න පුළුවන්
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      <div className="p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between mb-10">
          {/* Order ID and Date */}
          <div>
            <h2 className="text-xl font-semibold">
              Order ID: {checkout._id}
            </h2>
            <p className="text-gray-500">
              Order date: {new Date(checkout.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Estimated Delivery */}
          <div className="text-right">
            <p className="text-emerald-700 font-medium">
              Estimated Delivery:
            </p>
            <p className="text-lg font-semibold">
              {calculateEstimateDelivery(checkout.createdAt)}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          {checkout.checkoutItems.map((item) => (
            <div key={item.productId} className="flex items-center mb-6 py-4 border-b">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md mr-6"
              />
              <div className="flex-1">
                <h4 className="text-lg font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} | Size: {item.size}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment and Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Payment Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <p className="text-gray-600">PayPal</p>
          </div>

          {/* Delivery Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p className="text-gray-600">{checkout.shippingAddress.address}</p>
            <p className="text-gray-600">
              {checkout.shippingAddress.city}, {checkout.shippingAddress.Country}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;