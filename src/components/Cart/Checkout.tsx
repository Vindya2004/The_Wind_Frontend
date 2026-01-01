import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {type AppDispatch,type RootState } from '../../redux/store'; // Adjust path if needed
import { createCheckout } from '../../redux/slices/checkoutSlice';
import PayPalButton from './PayPalButton';
import axios from 'axios';

interface ShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { cart, loading: cartLoading, error: cartError } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const {  loading: checkoutLoading, error: checkoutError } = useSelector(
    (state: RootState) => state.checkout
  );

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Redirect to home if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cart?.products || cart.products.length === 0) return;

    // Map cart items to required CheckoutItem format
    const checkoutItems = cart.products.map((item) => ({
      productId: item.productId,
      name: item.name || 'Unknown Product',
      image: item.image || '',
      price: item.price || 0,
      quantity: item.quantity,
    }));

    const payload = {
      checkoutItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod: 'paypal',
      itemsPrice: cart.totalPrice || 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: cart.totalPrice || 0,
    };

    const result = await dispatch(createCheckout(payload));

    if (createCheckout.fulfilled.match(result)) {
      setCheckoutId(result.payload._id);
    } else {
      alert(checkoutError || 'Failed to create checkout. Please try again.');
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    if (!checkoutId) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: 'paid',
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (err) {
      console.error('Payment update failed:', err);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleFinalizeCheckout = async (id: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      if (response.status === 200) {
        navigate('/order-confirmation');
      }
    } catch (err) {
      console.error('Finalize checkout failed:', err);
      alert('Order finalization failed.');
    }
  };

  // Loading & Error States
  if (cartLoading) return <p className="text-center py-10">Loading cart...</p>;
  if (cartError) return <p className="text-center text-red-600 py-10">Error: {cartError}</p>;
  if (!cart || cart.products.length === 0) return <p className="text-center py-10">Your cart is empty</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left: Checkout Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          {/* Contact Details */}
          <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full p-3 border rounded-lg bg-gray-100"
              disabled
            />
          </div>

          {/* Delivery Address */}
          <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, country: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* Submit / Payment */}
          <div className="mt-8">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full bg-black text-white py-4 rounded-lg font-medium disabled:opacity-70"
              >
                {checkoutLoading ? 'Processing...' : 'Continue to Payment'}
              </button>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={cart.totalPrice || 0}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert('Payment failed. Please try again.')}
                />
              </div>
            )}
          </div>

          {checkoutError && (
            <p className="text-red-600 mt-4 text-center">{checkoutError}</p>
          )}
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

        <div className="space-y-4 border-t pt-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex justify-between items-start py-4 border-b">
              <div className="flex gap-4">
                <img
                  src={product.image || 'https://via.placeholder.com/80'}
                  alt={product.name || 'Product'}
                  className="w-20 h-24 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{product.name || 'Unnamed Product'}</h4>
                  {product.size && <p className="text-gray-600 text-sm">Size: {product.size}</p>}
                  {product.color && <p className="text-gray-600 text-sm">Color: {product.color}</p>}
                  <p className="text-gray-600 text-sm">Qty: {product.quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                ${product.price }
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>${(cart.totalPrice || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
            <span>Total</span>
            <span>${(cart.totalPrice || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;