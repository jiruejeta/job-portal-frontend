'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, X, Briefcase, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                      Dashboard
                    </Link>
                    <Link href="/admin/applications" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                      Applications
                    </Link>
                  </>
                ) : (
                  <Link href="/applicant/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                    My Dashboard
                  </Link>
                )}
                <span className="text-gray-600">Hi, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="px-4 py-2 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link href="/admin/dashboard" className="px-4 py-2 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <Link href="/admin/applications" className="px-4 py-2 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                        Applications
                      </Link>
                    </>
                  ) : (
                    <Link href="/applicant/dashboard" className="px-4 py-2 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                      My Dashboard
                    </Link>
                  )}
                  <div className="px-4 py-2 text-gray-600">
                    Signed in as: {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}