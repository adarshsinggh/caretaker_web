import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Calendar, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile navbar (bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-luxury border-t border-gray-100 md:hidden z-10">
        <div className="flex justify-around items-center h-16 px-4 max-w-6xl mx-auto">
          <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary-600' : 'text-gray-500'}`}>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          
          <Link to="/bookings" className={`flex flex-col items-center ${isActive('/bookings') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Calendar size={24} />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center text-gray-500 hover:text-red-600"
          >
            <LogOut size={24} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop navbar (top) */}
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-10">
        <div className="flex justify-between items-center h-16 px-6 max-w-6xl mx-auto">
          <div className="flex items-center">
            <Heart size={28} className="text-primary-600 mr-2" />
            <span className="text-xl font-semibold text-primary-600">Parent Helper</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className={`flex items-center gap-2 ${isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            <Link to="/profile" className={`flex items-center gap-2 ${isActive('/profile') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            
            <Link to="/bookings" className={`flex items-center gap-2 ${isActive('/bookings') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
              <Calendar size={20} />
              <span>Bookings</span>
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Add padding to content for mobile navbar */}
      <div className="pb-16 md:pb-0 md:pt-16"></div>
    </>
  );
};

export default Navbar;