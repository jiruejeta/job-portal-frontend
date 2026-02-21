'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Building, 
  Calendar, 
  Search, 
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  Filter
} from 'lucide-react';

type Job = {
  _id: string;
  title: string;
  department: string;
  description: string;
  salary: string;
  location: string;
  jobType: string;
  deadline: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/jobs');
      const data = await response.json();
      
      if (response.ok) {
        const activeJobs = data.data.filter((job: any) => job.isActive);
        setJobs(activeJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch(type) {
      case 'Full-time': return 'bg-green-100 text-green-800';
      case 'Part-time': return 'bg-blue-100 text-blue-800';
      case 'Contract': return 'bg-purple-100 text-purple-800';
      case 'Remote': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || job.jobType === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Jobs</h1>
          <p className="text-xl text-gray-600">Find your next opportunity with detailed information</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Found <span className="font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'}
        </p>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Briefcase className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for new opportunities'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link key={job._id} href={`/jobs/${job._id}`}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer h-full transform hover:-translate-y-1">
                  {/* Header with Job Type Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                      {job.jobType || 'Full-time'}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h3>
                  
                  {/* Department */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.department}</span>
                  </div>

                  {/* Location & Salary */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium text-green-600">{job.salary || 'Salary not specified'}</span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Footer with Deadline and View Details */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}