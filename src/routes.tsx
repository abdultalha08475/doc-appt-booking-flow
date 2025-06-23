
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import BookPage from './pages/BookPage';
import SuccessPage from './pages/SuccessPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';

// Private Route Component for Patients
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isPatient, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isPatient()) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      {/* Patient Routes */}
      <Route 
        path="/book" 
        element={
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/appointments" 
        element={
          <PrivateRoute>
            <AppointmentsPage />
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
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/appointments" 
        element={
          <AdminRoute>
            <div>Admin Appointments Page (Coming Soon)</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/patients" 
        element={
          <AdminRoute>
            <div>Admin Patients Page (Coming Soon)</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/doctors" 
        element={
          <AdminRoute>
            <div>Admin Doctors Page (Coming Soon)</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <AdminRoute>
            <div>Admin Reports Page (Coming Soon)</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminRoute>
            <div>Admin Settings Page (Coming Soon)</div>
          </AdminRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
