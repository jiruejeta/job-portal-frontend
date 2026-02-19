'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, FileText, Briefcase, LogOut, Edit, Save } from 'lucide-react';

export default function ApplicantDashboard() {
  const { user, isAuthenticated, isApplicant, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    faydaId: '',
    phone: user?.phone || '',
    address: '',
    department: user?.department || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isApplicant) {
      router.push('/');
    }
  }, [isAuthenticated, isApplicant, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you'll connect to your API
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="font-medium">{user?.name}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors w-full sm:w-auto"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fayda ID
              </label>
              <input
                type="text"
                name="faydaId"
                value={profile.faydaId}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your Fayda ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Your department"
              />
            </div>
          </div>
        </div>

        {/* My Applications Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
          </div>

          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No applications submitted yet</p>
            <Link 
              href="/" 
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}