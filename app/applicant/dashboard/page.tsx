'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  Camera,
  IdCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

type ApplicantData = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  idPhoto?: string;
  idStatus?: string;
  idIssueDate?: string;
};

export default function ApplicantDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [applicant, setApplicant] = useState<ApplicantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchApplicantData();
  }, []);

  const fetchApplicantData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get user profile
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setApplicant(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 2MB' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const token = localStorage.getItem('token');
        const response = await fetch('https://job-portal-dvmp.onrender.com/api/users/photo', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photo: base64Image }),
        });

        const data = await response.json();

        if (response.ok) {
          setApplicant(prev => prev ? { ...prev, idPhoto: base64Image } : null);
          setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
        } else {
          setMessage({ type: 'error', text: data.error || 'Upload failed' });
        }
        setUploading(false);
      };
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
          <p className="mt-2 text-blue-100">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* ID Card Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <IdCard className="h-5 w-5 text-blue-600" />
            Your ID Card
          </h2>

          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo Section */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden flex items-center justify-center">
                  {applicant?.idPhoto ? (
                    <img 
                      src={applicant.idPhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Camera className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload 3x4 Photo'}
                </button>
              </div>

              {/* ID Details */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold">{applicant?.name || user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Number</p>
                    <p className="font-mono font-bold text-blue-600">
                      {applicant?.idNumber || 'Not Generated'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm">{applicant?.email || user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm">{applicant?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="flex items-center gap-1">
                      {applicant?.idStatus === 'active' ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Pending Approval
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="text-sm">
                      {applicant?.idIssueDate 
                        ? new Date(applicant.idIssueDate).toLocaleDateString()
                        : 'Not issued'}
                    </p>
                  </div>
                </div>

                {/* Download Button (only if ID is active) */}
                {applicant?.idStatus === 'active' && (
                  <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    Download ID Card
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Full Name</label>
              <p className="p-2 bg-gray-50 rounded">{applicant?.name || user?.name}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <p className="p-2 bg-gray-50 rounded">{applicant?.email || user?.email}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <p className="p-2 bg-gray-50 rounded">{applicant?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Username</label>
              <p className="p-2 bg-gray-50 rounded">{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>
              <strong>Note:</strong> Your ID card will be generated after admin approval. 
              Upload your 3x4 photo and wait for admin to verify and activate your ID.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}