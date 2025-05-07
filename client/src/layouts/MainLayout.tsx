import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Cart from '../components/Cart';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const [aboutHighlight, setAboutHighlight] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Toggle dark mode class on <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate total items for badge
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll and highlight About Us
  const handleAboutUsClick = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setAboutHighlight(true);
      setTimeout(() => setAboutHighlight(false), 1000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-800">
      <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-300 dark:hover:text-primary-400"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Delicado
              </Link>
              <button
                type="button"
                onClick={handleAboutUsClick}
                className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-300 dark:hover:text-primary-400 px-2 py-1 rounded"
              >
                About Us
              </button>
            </div>
            <div className="flex items-center gap-6">
              {/* Dark mode button */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  // Moon icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                ) : (
                  // Sun icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" />
                  </svg>
                )}
              </button>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className={`hover:text-primary-600 transition-colors ${
                    location.pathname === '/' ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`hover:text-primary-600 transition-colors ${
                    location.pathname.startsWith('/products') ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/design-library"
                  className={`hover:text-primary-600 transition-colors ${
                    location.pathname.startsWith('/design-library') ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Design Library
                </Link>
              </div>

              {/* Authentication Links */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1 px-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium">{user?.first_name}</span>
                    {/* User Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-gray-800 border dark:border-gray-700">
                      <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {user?.is_admin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/login"
                    className={`hover:text-primary-600 transition-colors ${
                      location.pathname === '/login' ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`hover:text-primary-600 transition-colors ${
                      location.pathname === '/register' ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Cart button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors relative dark:text-gray-300 dark:hover:text-primary-400"
                aria-label={isCartOpen ? 'Close Cart' : 'Open Cart'}
              >
                {/* Cart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Cart Badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8"> {/* Changed to 12 columns for more flexibility */}
          {/* Main Content */}
          <div className={`transition-all duration-300 ${isCartOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
            {children}
          </div>
          {/* Cart Sidebar */}
          {isCartOpen && (
            <div className="lg:col-span-4 xl:col-span-3">
              {/* Added a subtle animation */}
              <div className="animate-slide-in">
                 <Cart />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div
              ref={aboutUsRef}
              className={`transition-colors duration-500 ${aboutHighlight ? 'bg-yellow-200/40 dark:bg-yellow-400/10' : ''} rounded-lg p-2 -m-2`}
            >
              <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
              <p className="text-sm">Quality home textiles for your comfort and style.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <p className="text-sm">Email: eduardochiana25@gmail.com</p>
              <p className="text-sm">Phone: +40787454344</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://www.facebook.com/maria.ochiana.33" target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors">Facebook</a>
                <a href="https://www.instagram.com/eddiie_29/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
           <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
             © {new Date().getFullYear()} Delicado. All rights reserved.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;