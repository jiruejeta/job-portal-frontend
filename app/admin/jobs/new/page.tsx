'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Calendar, FileText, Building, Save } from 'lucide-react';

type JobFormData = {
  title: string;
  department: string;
  description: string;
  requirements: string;
  deadline: string;
};

export default function NewJobPage() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
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
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Make API call to your live backend
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      console.log('Job created successfully:', data);
      
      // Redirect to jobs list after success
      router.push('/admin/jobs');
      
    } catch (error: any) {
      console.error('Failed to create job:', error);
      setError(error.message || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Post New Job
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new job listing for applicants
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Job Title */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold">Job Title *</span>
              </div>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior Software Developer"
            />
          </div>

          {/* Department */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">Department *</span>
              </div>
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Engineering, Marketing, Sales, etc."
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                <span className="text-lg font-semibold">Job Description *</span>
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the role, responsibilities, and what the candidate will do..."
            />
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold">Requirements *</span>
              </div>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="List the qualifications, skills, and experience needed..."
            />
          </div>

          {/* Deadline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <span className="text-lg font-semibold">Application Deadline *</span>
              </div>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Post Job</span>
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}