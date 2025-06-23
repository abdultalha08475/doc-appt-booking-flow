
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeaderNav from './HeaderNav';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  FileText,
  Clock
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Clock },
    { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderNav>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <span>Logout</span>
        </Button>
      </HeaderNav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Clinic Management
            </p>
          </div>
          
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
