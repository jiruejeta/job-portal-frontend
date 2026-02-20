'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Briefcase,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  FileText
} from 'lucide-react';

type Application = {
  _id: string;
  applicantName: string;
  email: string;
  phone: string;
  gpa: number;
  exitExam: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  jobId: {
    _id: string;
    title: string;
    department: string;
  };
};

export default function AdminApplicationsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    } else {
      fetchApplications();
    }
  }, [isAuthenticated, isAdmin, router]);

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
        setApplications(data.data);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(applicationId);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You are not logged in. Please login again.');
        router.push('/login');
        return;
      }

      console.log('Attempting to', newStatus, 'application:', applicationId);
      
      // Determine the correct endpoint based on status
const endpoint = newStatus === 'approved' ? 'approve' : 'reject';
const response = await fetch(`https://job-portal-dvmp.onrender.com/api/applications/${applicationId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Update local state
        setApplications(applications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        
        alert(`Application ${newStatus} successfully!`);
        
        // If modal is open, close it
        if (selectedApp?._id === applicationId) {
          setSelectedApp(null);
          setShowModal(false);
        }
      } else {
        alert(data.error || `Failed to ${newStatus} application (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to update application status. Check console for details (F12)');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.exitExam && app.exitExam.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Manage Applications
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and process job applications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 font-medium">
                Total: {applications.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, job title, or exit exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No applications have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Header with status */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.applicantName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {app.jobId?.title || 'Unknown Job'}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {app.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                    GPA: {app.gpa}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    Exit: {app.exitExam || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(app._id, 'approved')}
                        disabled={actionLoading === app._id}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1 disabled:bg-green-300 disabled:cursor-not-allowed"
                      >
                        {actionLoading === app._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'rejected')}
                        disabled={actionLoading === app._id}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1 disabled:bg-red-300 disabled:cursor-not-allowed"
                      >
                        {actionLoading === app._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(selectedApp.status)}
              </div>

              {/* Applicant Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Name:</span> {selectedApp.applicantName}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedApp.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {selectedApp.phone}</p>
                </div>
              </div>

              {/* Academic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Academic Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">GPA:</span> {selectedApp.gpa}</p>
                  <p><span className="text-gray-600">Exit Exam:</span> {selectedApp.exitExam}</p>
                </div>
              </div>

              {/* Job Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Job Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Position:</span> {selectedApp.jobId?.title}</p>
                  <p><span className="text-gray-600">Department:</span> {selectedApp.jobId?.department}</p>
                  <p><span className="text-gray-600">Applied:</span> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedApp._id, 'approved');
                    }}
                    disabled={actionLoading === selectedApp._id}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-green-300"
                  >
                    {actionLoading === selectedApp._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Approve Application
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedApp._id, 'rejected');
                    }}
                    disabled={actionLoading === selectedApp._id}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-red-300"
                  >
                    {actionLoading === selectedApp._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Reject Application
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}