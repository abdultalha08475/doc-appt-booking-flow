
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookPage from './pages/BookPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SuccessPage from './pages/SuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      <Route path="/book" element={
        <ProtectedRoute>
          <BookPage />
        </ProtectedRoute>
      } />
      
      <Route path="/appointments" element={
        <ProtectedRoute>
          <AppointmentsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/success" element={
        <ProtectedRoute>
          <SuccessPage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        {/* Add more admin routes here as needed */}
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
