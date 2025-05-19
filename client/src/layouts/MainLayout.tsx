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
      <header className="bg-white/80 backdrop-blur-md text-gray-800 shadow-lg sticky top-0 z-50 dark:bg-gray-900/80 dark:text-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Brand and About Us */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-3xl font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-500 transition-colors duration-300 ease-in-out transform hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Delicado
              </Link>
              <button
                type="button"
                onClick={handleAboutUsClick}
                className="nav-link flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                About Us
              </button>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full shadow-inner">
              {[
                { to: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
                { to: "/products", label: "Products", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004.006 18H16a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> },
                { to: "/design-library", label: "Design Library", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" /></svg> }
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                    location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to))
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-100 hover:bg-pink-100 dark:hover:bg-pink-700/50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Dark Mode, Auth, Cart */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm0-4c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM4.929 7.687c-.26-.26-.682-.26-.943 0s-.26.682 0 .943l.707.707c.26.26.682.26.943 0s.26-.682 0-.943l-.707-.707zm13.434-1.651c-.26-.26-.682-.26-.943 0s-.26.682 0 .943l.707.707c.26.26.682.26.943 0s.26-.682 0-.943l-.707-.707zM12 17c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 4c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM6.343 17.071c.26.26.682.26.943 0s.26-.682 0-.943l-.707-.707c-.26-.26-.682-.26-.943 0s-.26.682 0 .943l.707.707zm11.314-1.651c.26.26.682.26.943 0s.26-.682 0-.943l-.707-.707c-.26-.26-.682-.26-.943 0s-.26.682 0 .943l.707.707zM7 12c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm10 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zM12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"/>
                  </svg>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="profile-btn"
                  >
                    <span className="font-medium">{user?.first_name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 0 0118 0z" />
                    </svg>
                  </button>

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
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                      location.pathname === '/login' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-700/50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors relative dark:text-gray-300 dark:hover:text-pink-400 focus:outline-none p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={isCartOpen ? 'Close Cart' : 'Open Cart'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="md:hidden">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
                >
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isUserMenuOpen && (
            <div className="md:hidden absolute top-16 inset-x-0 p-2 transition transform origin-top-right">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                <div className="pt-5 pb-6 px-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="nav-brand text-2xl" onClick={() => setIsUserMenuOpen(false)}>Delicado</Link>
                    <button
                      type="button"
                      className="-mr-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-8">
                      {[
                        { to: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
                        { to: "/products", label: "Products", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004.006 18H16a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> },
                        { to: "/design-library", label: "Design Library", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" /></svg> }
                      ].map(item => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition ease-in-out duration-150"
                        >
                          {item.icon && React.cloneElement(item.icon, { className: "flex-shrink-0 h-6 w-6 text-pink-600 dark:text-pink-400"})}
                          <span className="ml-3 text-base font-medium text-gray-900 dark:text-gray-100">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5 space-y-6">
                  {isAuthenticated ? (
                    <>
                       <Link to="/profile" className="block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setIsUserMenuOpen(false)}>My Profile</Link>
                       <Link to="/orders" className="block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setIsUserMenuOpen(false)}>My Orders</Link>
                       {user?.is_admin && <Link to="/admin" className="block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setIsUserMenuOpen(false)}>Admin Dashboard</Link>}
                       <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="block w-full text-left text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700"
                      >
                        Register
                      </Link>
                      <p className="mt-6 text-center text-base font-medium text-gray-500 dark:text-gray-400">
                        Existing customer?{' '}
                        <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300">
                          Login
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex py-8">  
        {/* Centered content wrapper */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 transition-all duration-300">
          {children}
        </div>
        {/* Cart Sidebar at right edge */}
        {isCartOpen && (
          <div className="w-100 flex-shrink-0 px-6 animate-slide-in">
            <Cart />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div
              ref={aboutUsRef}
              className={`transition-colors duration-500 ${aboutHighlight ? 'bg-yellow-200/40 dark:bg-yellow-400/10' : ''} rounded-lg p-3 -m-3`}
            >
              <h3 className="text-xl font-semibold text-white mb-4">About Delicado</h3>
              <p className="text-sm text-gray-400 dark:text-gray-300">
                Quality home textiles for your comfort and style. Discover unique designs and personalize your space.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
              <p className="text-sm text-gray-400 dark:text-gray-300">
                <a href="mailto:eduardochiana25@gmail.com" className="hover:text-pink-400 transition-colors">
                  Email: eduardochiana25@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-300">
                <a href="tel:+40787454344" className="hover:text-pink-400 transition-colors">
                  Phone: +40787454344
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="https://www.facebook.com/maria.ochiana.33"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-pink-400 transition-colors transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/eddiie_29/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-pink-400 transition-colors transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
           <div className="mt-10 pt-10 border-t border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
             © {new Date().getFullYear()} Delicado. All rights reserved. Designed with care.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;