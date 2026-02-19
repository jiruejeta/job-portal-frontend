'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Briefcase, Users, FileText, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';

type Stats = {
  totalJobs: number;
  totalApplications: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch jobs
      const jobsRes = await fetch('https://job-portal-dvmp.onrender.com/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const jobsData = await jobsRes.json();
      
      // Fetch applications
      const appsRes = await fetch('https://job-portal-dvmp.onrender.com/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const appsData = await appsRes.json();

      if (jobsRes.ok && appsRes.ok) {
        const applications = appsData.data || [];
        const pending = applications.filter((a: any) => a.status === 'pending').length;
        const approved = applications.filter((a: any) => a.status === 'approved').length;
        const rejected = applications.filter((a: any) => a.status === 'rejected').length;

        setStats({
          totalJobs: jobsData.data?.length || 0,
          totalApplications: applications.length,
          pendingReviews: pending,
          approved: approved,
          rejected: rejected,
        });

        // Get 5 most recent applications
        setRecentApplications(applications.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Jobs', 
      value: stats.totalJobs, 
      icon: Briefcase, 
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/jobs'
    },
    { 
      label: 'Total Applications', 
      value: stats.totalApplications, 
      icon: Users, 
      color: 'bg-green-100 text-green-600',
      href: '/admin/applications'
    },
    { 
      label: 'Pending Reviews', 
      value: stats.pendingReviews, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600',
      href: '/admin/applications?status=pending'
    },
    { 
      label: 'Approved', 
      value: stats.approved, 
      icon: CheckCircle, 
      color: 'bg-emerald-100 text-emerald-600',
      href: '/admin/applications?status=approved'
    },
    { 
      label: 'Rejected', 
      value: stats.rejected, 
      icon: XCircle, 
      color: 'bg-red-100 text-red-600',
      href: '/admin/applications?status=rejected'
    },
  ];

  const quickActions = [
    {
      title: 'Post New Job',
      description: 'Create a new job listing',
      href: '/admin/jobs/new',
      icon: Briefcase,
      color: 'bg-blue-600',
    },
    {
      title: 'Review Applications',
      description: 'Check pending applications',
      href: '/admin/applications',
      icon: FileText,
      color: 'bg-yellow-600',
    },
    {
      title: 'Manage Jobs',
      description: 'Edit or delete existing jobs',
      href: '/admin/jobs',
      icon: Users,
      color: 'bg-green-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>;
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="font-medium">{user?.name || 'Admin'}</span>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link href={stat.href} key={index}>
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group border border-gray-100">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No recent applications</p>
              <p className="text-sm mt-1">Applications will appear here when submitted</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app: any) => (
                <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{app.applicantName}</p>
                    <p className="text-sm text-gray-600">{app.jobId?.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(app.status)}
                    <span className="text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-4">
                <Link 
                  href="/admin/applications" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Applications →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}