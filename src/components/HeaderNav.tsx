
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderNavProps {
  children?: React.ReactNode;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">DocBook</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
