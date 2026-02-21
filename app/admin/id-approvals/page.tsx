'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  IdCard,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

type UserWithID = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  username: string;
  idNumber?: string;
  idPhoto?: string;
  idStatus: 'pending' | 'active' | 'rejected';
  idIssueDate?: string;
  idExpiryDate?: string;
  role: string;
  createdAt: string;
};

export default function IDApprovalsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithID[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserWithID | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Filter only applicants with ID photos
        const applicants = data.data.filter((u: UserWithID) => 
          u.role === 'applicant' && u.idPhoto
        );
        setUsers(applicants);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIDApproval = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://job-portal-dvmp.onrender.com/api/users/${userId}/id-${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user._id === userId 
            ? { 
                ...user, 
                idStatus: action === 'approve' ? 'active' : 'rejected',
                idNumber: action === 'approve' ? data.data.idNumber : user.idNumber,
                idIssueDate: action === 'approve' ? new Date().toISOString() : user.idIssueDate
              } 
            : user
        ));
        
        if (selectedUser?._id === userId) {
          setSelectedUser(null);
          setShowModal(false);
        }
      } else {
        alert(data.error || `Failed to ${action} ID`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process request');
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
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
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

  const generateIDNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ID-${year}-${random}`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.idNumber && user.idNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || user.idStatus === filterStatus;
    
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
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                ID Card Approvals
              </h1>
              <p className="text-gray-600 mt-1">
                Review and approve applicant ID photos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Submissions</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">
              {users.filter(u => u.idStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600">Active</p>
            <p className="text-2xl font-bold text-green-700">
              {users.filter(u => u.idStatus === 'active').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600">Rejected</p>
            <p className="text-2xl font-bold text-red-700">
              {users.filter(u => u.idStatus === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <IdCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ID submissions found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search' : 'Waiting for applicants to upload photos'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {user.idPhoto ? (
                          <img 
                            src={user.idPhoto} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(user.idStatus)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {user.phone || 'No phone'}
                    </div>
                    {user.idNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <IdCard className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-mono">{user.idNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                    
                    {user.idStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleIDApproval(user._id, 'approve')}
                          disabled={actionLoading === user._id}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1 disabled:bg-green-300"
                        >
                          {actionLoading === user._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleIDApproval(user._id, 'reject')}
                          disabled={actionLoading === user._id}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-1 disabled:bg-red-300"
                        >
                          {actionLoading === user._id ? (
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Review ID Card</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* ID Card Preview */}
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-48 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
                      {selectedUser.idPhoto ? (
                        <img 
                          src={selectedUser.idPhoto} 
                          alt="ID Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">3x4 Photo</p>
                  </div>

                  {/* ID Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">ID Card Preview</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID Number</p>
                        <p className="font-mono font-bold text-blue-600">
                          {selectedUser.idNumber || 'Not Generated'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Issue</p>
                        <p>{selectedUser.idIssueDate ? new Date(selectedUser.idIssueDate).toLocaleDateString() : 'Pending'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        {getStatusBadge(selectedUser.idStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedUser.idStatus === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleIDApproval(selectedUser._id, 'approve');
                    }}
                    disabled={actionLoading === selectedUser._id}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedUser._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Approve ID Card
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleIDApproval(selectedUser._id, 'reject');
                    }}
                    disabled={actionLoading === selectedUser._id}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedUser._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Reject ID Card
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