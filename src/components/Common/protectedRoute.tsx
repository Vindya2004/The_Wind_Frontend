import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';

// User interface (ඔයාගේ auth state එකේ user object එකේ structure එකට match කරන්න)
interface User {
  role?: string; // admin, user, etc. | optional නම් ? දාන්න
  // අනිත් fields ඕනෙ නම් මෙතන add කරන්න (e.g., _id, name, email)
}

// Props interface
interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string; // required role (e.g., "admin") – optional කළා මොකද general auth check එකටත් use කරන්න පුළුවන්
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };

  // User logged in නැත්නම් හෝ required role එක match නැත්නම් → login එකට redirect
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  // Authorized නම් children render කරන්න
  return <>{children}</>;
};

export default ProtectedRoute;