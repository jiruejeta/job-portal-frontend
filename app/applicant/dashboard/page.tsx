'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  GraduationCap, 
  FileText,
  LogOut,
  Save,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Camera,
  QrCode,
  Building,
  MapPin,
  DollarSign,
  Download,
  IdCard
} from 'lucide-react';
import * as QRCode from 'qrcode.react';

type ApplicantProfile = {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  faydaId: string;
  address: string;
  department: string;
  createdAt?: string;
  documents: Array<{
    url: string;
    type: string;
    uploadedAt: string;
  }>;
};

type Application = {
  _id: string;
  jobId: {
    title: string;
    department: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  gpa: number;
  exitExam: string;
};

type Employee = {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  photo: string;
  jobTitle: string;
  department: string;
  salary: string;
  location: string;
  jobType: string;
  startDate: string;
  status: string;
  qrCode: string;
};

export default function ApplicantDashboard() {
  const { user, isAuthenticated, isApplicant, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  
  const [formData, setFormData] = useState({
    faydaId: '',
    phone: '',
    address: '',
    department: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isApplicant) {
      router.push('/');
    } else {
      fetchProfile();
      fetchApplications();
      fetchEmployeeProfile();
    }
  }, [isAuthenticated, isApplicant, router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.data);
        setFormData({
          faydaId: data.data.faydaId || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          department: data.data.department || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchEmployeeProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/employee/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmployee(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch employee profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const token = localStorage.getItem('token');
        const response = await fetch('https://job-portal-dvmp.onrender.com/api/employee/photo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photo: base64Image }),
        });

        const data = await response.json();

        if (response.ok) {
          setEmployee(prev => prev ? { ...prev, photo: data.data.photo, qrCode: data.data.qrCode } : null);
          setSuccess('Photo uploaded successfully!');
        } else {
          setError(data.error || 'Failed to upload photo');
        }
        setUploading(false);
      };
    } catch (error) {
      setError('Failed to upload photo');
      setUploading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('employee-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${employee?.employeeId}-qrcode.png`;
      link.href = url;
      link.click();
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome, {user?.name}!
              </h1>
              <p className="text-blue-100">
                Your applicant dashboard – manage your profile and track applications
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <p className="text-sm text-blue-200">Username</p>
              <p className="text-xl font-semibold">@{user?.username}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <p className="text-sm text-blue-200">Member Since</p>
              <p className="text-xl font-semibold">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <p className="text-sm text-blue-200">Applications</p>
              <p className="text-xl font-semibold">{applications.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <p className="text-sm text-blue-200">Employee ID</p>
              <p className="text-xl font-semibold">
                {employee ? employee.employeeId : 'Not Assigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Employee ID Card Section - Only show if employee exists */}
        {employee && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <IdCard className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Employee ID Card</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* ID Card Front */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-2xl font-bold mb-1">{employee.fullName}</div>
                    <div className="text-blue-200">{employee.jobTitle}</div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-blue-200">Employee ID</div>
                    <div className="font-mono text-sm">{employee.employeeId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Department</div>
                    <div>{employee.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Location</div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {employee.location || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Start Date</div>
                    <div>{new Date(employee.startDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Photo Placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {employee.photo ? (
                      <img 
                        src={employee.photo} 
                        alt={employee.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-white/60" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Status</div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${employee.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      <span className="capitalize">{employee.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
                <div className="text-sm font-medium text-gray-700 mb-3">Scan QR Code</div>
                <div className="bg-white p-4 rounded-xl shadow-inner mb-3">
                  {employee.qrCode ? (
                    <img src={employee.qrCode} alt="QR Code" className="w-32 h-32" />
                  ) : (
                    <QrCode className="w-32 h-32 text-gray-300" />
                  )}
                </div>
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  Download QR Code
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Upload 3x4 Photo</h3>
              <div className="flex items-center gap-4">
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      <span>Choose Photo</span>
                    </>
                  )}
                </button>
                {employee.photo && (
                  <span className="text-sm text-green-600">✓ Photo uploaded</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload a clear 3x4 photo (JPG, PNG - max 5MB)
              </p>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-300"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile?.name || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Fayda ID
                </span>
              </label>
              <input
                type="text"
                name="faydaId"
                value={formData.faydaId}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your Fayda ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                placeholder="Your department"
              />
            </div>
          </div>

          {/* Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">Your Login Credentials</h3>
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Password:</span> •••••••• (Keep it safe!)
            </p>
          </div>
        </div>

        {/* My Applications Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">You haven't applied to any jobs yet</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {app.jobId?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{app.jobId?.department}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          GPA: {app.gpa}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {app.exitExam}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      <span className="text-sm text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}