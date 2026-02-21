'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  DollarSign
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

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://job-portal-dvmp.onrender.com/api/jobs');
      const data = await response.json();
      
      if (response.ok) {
        const activeJobs = data.data.filter((job: any) => job.isActive);
        setJobs(activeJobs.slice(0, 6));
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

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Building, value: '500+', label: 'Companies' },
    { icon: Briefcase, value: '1K+', label: 'Jobs Posted' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Verified',
      description: 'All jobs are verified by our team to ensure authenticity',
    },
    {
      icon: Clock,
      title: 'Fast Application',
      description: 'Apply to multiple jobs with just a few clicks',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support to help you find the right job',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access to training and career development resources',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      initials: 'SJ',
      color: 'from-blue-500 to-blue-600',
      quote: 'Found my dream job within 2 weeks! The platform is incredibly easy to use.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      initials: 'MC',
      color: 'from-green-500 to-green-600',
      quote: 'Best job portal I have ever used. The application process is seamless.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      initials: 'ER',
      color: 'from-purple-500 to-purple-600',
      quote: 'Great platform for both employers and job seekers. Highly recommended!',
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Account',
      description: 'Sign up in minutes and complete your profile',
    },
    {
      step: '02',
      title: 'Browse Jobs',
      description: 'Search through thousands of verified job listings',
    },
    {
      step: '03',
      title: 'Apply Instantly',
      description: 'Submit your application with just one click',
    },
    {
      step: '04',
      title: 'Get Hired',
      description: 'Connect with employers and start your new career',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Your Dream Job
                <span className="block text-blue-300 mt-2">With Us Today</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl lg:mx-0 mx-auto">
                Connect with top employers and take your career to the next level. 
                Thousands of opportunities await you.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl lg:mx-0 mx-auto mb-8">
                <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title, department, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl sm:rounded-l-xl sm:rounded-r-none focus:outline-none"
                    />
                  </div>
                  <Link
                    href={`/jobs?search=${searchTerm}`}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-center"
                  >
                    Search Jobs
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Verified Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">No Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Quick Apply</span>
                </div>
              </div>
            </div>

            {/* Right Image - Decorative Elements */}
            <div className="hidden lg:block relative h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                    <Briefcase className="h-12 w-12 text-white mb-3" />
                    <p className="text-white font-semibold">1000+ Jobs</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform">
                    <Users className="h-12 w-12 text-white mb-3" />
                    <p className="text-white font-semibold">500+ Companies</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                    <TrendingUp className="h-12 w-12 text-white mb-3" />
                    <p className="text-white font-semibold">98% Success</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform">
                    <Shield className="h-12 w-12 text-white mb-3" />
                    <p className="text-white font-semibold">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1440 48">
            <path d="M0 48h1440V0C984 32 492 48 0 48z" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the latest opportunities from top companies
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const deadlinePassed = isDeadlinePassed(job.deadline);
                
                return (
                  <div key={job._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                    {/* Deadline */}
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Apply Button - Changed from View Details to Apply Now */}
                    <Link
                      href={`/jobs/${job._id}/apply`}
                      className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                        deadlinePassed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {deadlinePassed ? 'Applications Closed' : 'Apply Now'}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Browse All Jobs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best platform for your career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section with Gradient Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied job seekers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-xl`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who found their dream jobs through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold"
            >
              Browse Jobs
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">JobPortal</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting talent with opportunity since 2024
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Jobs</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/resources" className="text-gray-400 hover:text-white">Resources</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-5 w-5" />
                  support@jobportal.com
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-5 w-5" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                  123 Business Ave, Suite 100
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}