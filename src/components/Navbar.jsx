"use client"

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, User, LayoutDashboard, Home, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin;
  

  const handleLogout = () => {
    // Add your logout logic here
    toast.error('Logging out...');
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Test Task
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {isAdmin && (
                <Link
                  to="/admindashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 w-full"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;