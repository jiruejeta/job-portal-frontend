'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Briefcase,
  Building,
  Search,
  Filter,
  Eye,
  XCircle
} from 'lucide-react';

type Job = {
  _id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  deadline: string;
  isActive: boolean;
  createdAt: string;
};

export default function ManageJobsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    deadline: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    } else {
      fetchJobs();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.data);
      } else {
        setError(data.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://job-portal-dvmp.onrender.com/api/jobs/${jobToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobToDelete._id));
        setShowDeleteModal(false);
        setJobToDelete(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete job');
      }
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements,
      deadline: job.deadline.split('T')[0],
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://job-portal-dvmp.onrender.com/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        setJobs(jobs.map(job => 
          job._id === editingJob._id ? { ...job, ...editForm } : job
        ));
        setShowEditModal(false);
        setEditingJob(null);
      } else {
        alert(data.error || 'Failed to update job');
      }
    } catch (error) {
      alert('Failed to update job');
    }
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://job-portal-dvmp.onrender.com/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !job.isActive }),
      });

      if (response.ok) {
        setJobs(jobs.map(j => 
          j._id === job._id ? { ...j, isActive: !j.isActive } : j
        ));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update job status');
      }
    } catch (error) {
      alert('Failed to update job status');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
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
                  Manage Jobs
                </h1>
                <p className="text-gray-600 mt-1">
                  Edit, delete, and manage all job postings
                </p>
              </div>
            </div>
            <Link
              href="/admin/jobs/new"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Post New Job</span>
            </Link>
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

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Get started by posting your first job'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => {
              const deadlinePassed = isDeadlinePassed(job.deadline);
              
              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                >
                  {/* Status Bar */}
                  <div className={`h-2 w-full ${
                    !job.isActive ? 'bg-gray-400' :
                    deadlinePassed ? 'bg-red-500' :
                    'bg-green-500'
                  }`} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        job.isActive ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Briefcase className={`h-6 w-6 ${
                          job.isActive ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Edit job"
                        >
                          <Edit className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            setJobToDelete(job);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Job Info */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {job.title}
                    </h2>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">{job.department}</span>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      {deadlinePassed && job.isActive && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Deadline Passed
                        </span>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          job.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {job.isActive ? 'Close Job' : 'Reopen Job'}
                      </button>
                      <Link
                        href={`/admin/jobs/${job._id}`}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{jobToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJobToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Job</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements *
                </label>
                <textarea
                  value={editForm.requirements}
                  onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}