import React, { useEffect } from 'react';
import MyOrdersPage from './MyOrdersPage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice'; 
import type { AppDispatch, RootState } from '../redux/store'; 
const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Correctly type the selector
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());       
    dispatch(clearCart());    
    navigate("/login");
  };

  
  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section - User Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Right Section - Orders Table */}
          <div className="w-full md:w-2/3 lg:w-3/4 bg-white shadow-md rounded-lg p-6">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;