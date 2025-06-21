
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BookPage from './pages/BookPage';
import SuccessPage from './pages/SuccessPage';

// Private Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/book" 
        element={
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/success" 
        element={
          <PrivateRoute>
            <SuccessPage />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
