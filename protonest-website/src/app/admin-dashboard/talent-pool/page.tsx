"use client";

import {
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    Trash2,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Types based on your backend models and updated to match other pages
interface CVData {
    full_name: string;
    email: string;
    phone_number: string;
    country: string;
    city: string;
    work_function: string;
    nda_acknowledged: boolean;
    cv_file_url: string;
    skills: string[];
    expertise_areas: { [key: string]: string[] };
    suggested_jobs: Record<string, unknown>[];
    uploaded_at: string;
    updated_at: string;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    job_updates: boolean;
    newsletter: boolean;
    cv?: CVData;
    created_at: string;
    nda_status?: {
        status: 'not_sent' | 'sent' | 'submitted';
        sent_on?: string;
        submitted_on?: string;
        compliance_notes?: string;
        resend_count: number;
        created_at: string;
        updated_at: string;
    };
}

interface FreelancerData {
    id: string;
    name: string;
    email: string;
    title: string;
    skills: string[];
    lastUpdated: string;
    cvFileUrl?: string;
    userId: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    category: string;
    status: string;
    posted?: string;
    deadline?: string;
    experience?: string;
    description?: string;
}

const TalentPool = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerData | null>(null);
    const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showJobDropdown, setShowJobDropdown] = useState(false);
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const [sendNDA, setSendNDA] = useState(false);
    const [assigningJob, setAssigningJob] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin-signin');
        }
    }, [router]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }

            // Close dropdown when clicking outside
            if (showJobDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowJobDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen, showJobDropdown]);

    // Fetch freelancers data from API
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            return;
        }
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            // First, try to get users with CVs from a dedicated endpoint
            let response;
            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users-with-cvs`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch {
                // If the dedicated endpoint doesn't exist, fall back to getting all users and filtering
                console.log('Dedicated endpoint not available, using fallback method');
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform the data to match our frontend interface, filtering only users with CVs
            const usersWithCvs = (data.users || data.data || []).filter((user: User) => user.cv);

            const transformedData: FreelancerData[] = usersWithCvs.map((user: User) => {
                return {
                    id: user.id,
                    userId: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    title: user.cv?.work_function || 'Not specified',
                    skills: user.cv?.skills || [],
                    lastUpdated: user.cv?.updated_at ? new Date(user.cv.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'N/A',
                    cvFileUrl: user.cv?.cv_file_url
                };
            });

            setFreelancers(transformedData);
        } catch (err) {
            console.error('Error fetching freelancers:', err);
            setError('Failed to load freelancers data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableJobs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/available`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    setAvailableJobs(data.data || []);
                }
            }
        } catch (err) {
            console.error('Error fetching available jobs:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleViewCV = async (freelancer: FreelancerData) => {
        try {
            if (freelancer.cvFileUrl) {
                window.open(freelancer.cvFileUrl, '_blank');
            } else {
                alert('CV file not available');
            }
        } catch (err) {
            console.error('Error opening CV:', err);
            alert('Failed to open CV file');
        }
    };

    const handleDeleteFreelancer = async (freelancer: FreelancerData) => {
        if (!confirm(`Are you sure you want to delete ${freelancer.name}'s profile? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${freelancer.userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove from local state
            setFreelancers(prev => prev.filter(f => f.id !== freelancer.id));
            alert('Freelancer profile deleted successfully');
        } catch (err) {
            console.error('Error deleting freelancer:', err);
            alert('Failed to delete freelancer profile');
        }
    };

    const handleMoveToJob = (freelancer: FreelancerData) => {
        setSelectedFreelancer(freelancer);
        setShowAssignPopup(true);
        setJobSearchTerm(''); // Reset search term
        setSelectedJob(null); // Reset selected job
        fetchAvailableJobs();
    };

    const handleAssignToJob = async () => {
        if (!selectedFreelancer || !selectedJob) {
            alert('Please select a job to assign the candidate to');
            return;
        }

        try {
            setAssigningJob(true);
            const token = localStorage.getItem('adminToken');

            // Assign candidate to job
            const assignResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${selectedJob.id}/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_id: selectedFreelancer.userId,
                    notes: `Assigned from talent pool${sendNDA ? ' - NDA request sent' : ''}`
                })
            });

            if (!assignResponse.ok) {
                const errorData = await assignResponse.json();
                throw new Error(errorData.message || 'Failed to assign candidate to job');
            }

            // If sendNDA is checked, we would send NDA here
            // For now, we'll just show success message
            if (sendNDA) {
                // TODO: Implement NDA sending logic if needed
                console.log('NDA request would be sent here');
            }

            alert(`Successfully assigned ${selectedFreelancer.name} to ${selectedJob.title}`);

            // Close popup and reset state
            setShowAssignPopup(false);
            setSelectedFreelancer(null);
            setSelectedJob(null);
            setSendNDA(false);
            setJobSearchTerm('');

            // Refresh the freelancers list
            fetchFreelancers();
        } catch (err) {
            console.error('Error assigning candidate to job:', err);
            alert(`Failed to assign candidate: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setAssigningJob(false);
        }
    };

    const handleJobSelect = (job: Job) => {
        setSelectedJob(job);
        setJobSearchTerm(job.title);
        setShowJobDropdown(false);
    };

    const resetAssignPopup = () => {
        setShowAssignPopup(false);
        setSelectedFreelancer(null);
        setSelectedJob(null);
        setSendNDA(false);
        setJobSearchTerm('');
        setShowJobDropdown(false);
    };

    // Filter freelancers based on search term
    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesSearch =
            freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            freelancer.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Filter jobs for dropdown
    const filteredJobs = availableJobs.filter(job =>
        job.title.toLowerCase().includes(jobSearchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading talent pool...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-poppins min-h-screen bg-white relative">
            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowLogoutDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Assignment Popup */}
            {showAssignPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-[600px] bg-white rounded-[25px] shadow-xl p-6 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-[#6c6c6c] mb-2">
                                    Assign Candidate to a Job
                                </h2>
                                <p className="text-[#6c6c6c]/80 text-sm">
                                    Assign this candidate to an open role. Candidate remains in Talent Pool.
                                </p>
                            </div>
                            <button
                                onClick={resetAssignPopup}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                disabled={assigningJob}
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Freelancer Name Section */}
                        <div className="mb-6">
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Freelancer Name
                            </label>
                            <div className="w-full bg-gray-50 rounded-lg p-4 border">
                                <span className="text-[#6c6c6c] font-medium">
                                    {selectedFreelancer?.name || 'No freelancer selected'}
                                </span>
                                <div className="text-sm text-gray-500 mt-1">
                                    {selectedFreelancer?.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {selectedFreelancer?.title}
                                </div>
                            </div>
                        </div>

                        {/* Job Selection Section */}
                        <div className="mb-6" ref={dropdownRef}>
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Select Job
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={jobSearchTerm}
                                    onChange={(e) => {
                                        setJobSearchTerm(e.target.value);
                                        setShowJobDropdown(true);
                                        if (e.target.value === '') {
                                            setSelectedJob(null);
                                        }
                                    }}
                                    onFocus={() => setShowJobDropdown(true)}
                                    placeholder="Search and select a job..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                />
                                <button
                                    onClick={() => setShowJobDropdown(!showJobDropdown)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showJobDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Job Dropdown */}
                                {showJobDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-20 mt-1">
                                        {filteredJobs.length > 0 ? (
                                            filteredJobs.map((job) => (
                                                <button
                                                    key={job.id}
                                                    onClick={() => handleJobSelect(job)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-medium text-[#6c6c6c]">{job.title}</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {job.location} • {job.type} • {job.category}
                                                    </div>
                                                    {job.deadline && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Deadline: {job.deadline}
                                                        </div>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                {jobSearchTerm ? 'No jobs found matching your search' : 'No jobs available'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Selected Job Display */}
                            {selectedJob && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="font-medium text-blue-800">Selected: {selectedJob.title}</div>
                                    <div className="text-sm text-blue-600">
                                        {selectedJob.location} • {selectedJob.type} • {selectedJob.category}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NDA Checkbox */}
                        <div className="mb-8">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sendNDA}
                                    onChange={(e) => setSendNDA(e.target.checked)}
                                    className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA]"
                                />
                                <span className="text-[#6c6c6c] text-sm">
                                    Send NDA Request Email Now
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAssignToJob}
                                disabled={!selectedJob || assigningJob}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                            >
                                {assigningJob ? 'Assigning...' : 'Assign to Job'}
                            </button>
                            <button
                                onClick={resetAssignPopup}
                                disabled={assigningJob}
                                className="flex-1 px-6 py-3 border border-[#5530FA] text-[#5530FA] rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="w-[100px] lg:w-[130px] relative">
                                <Image
                                    src="/logo.png"
                                    alt="Protonest Logo"
                                    width={130}
                                    height={80}
                                    className="object-contain"
                                />
                            </Link>
                        </div>

                        {/* Header Actions - Only Settings Button */}
                        <div className="flex items-center">
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Mobile */}
                    <div
                        ref={sidebarRef}
                        className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="flex justify-between items-center p-4">
                            <Link href="/" className="w-[100px] relative">
                                <Image
                                    src="/logo.png"
                                    alt="Protonest Logo"
                                    width={100}
                                    height={60}
                                    className="object-contain"
                                />
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="overflow-y-auto h-full p-4">
                            <nav className="space-y-1">
                                {sidebarItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path
                                            ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="pt-8">
                                <button
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 lg:mr-auto">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <nav className="p-4 space-y-1">
                                {sidebarItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.path}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path
                                            ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 pt-8">
                                <button
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Talent Pool</span>
                            </nav>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                                <button
                                    onClick={fetchFreelancers}
                                    className="mt-2 text-red-600 text-sm underline hover:no-underline"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <div className="mb-6">
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                👥 Talent Pool – Freelancer CVs
                            </h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and manage CVs submitted by freelancers. Use filters to shortlist profiles for upcoming IoT projects.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Search by freelancer name or email"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Freelancer Name
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Preferred Role
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFreelancers.length > 0 ? (
                                        filteredFreelancers.map((freelancer) => (
                                            <tr key={freelancer.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {freelancer.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {freelancer.email}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {freelancer.title}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {freelancer.lastUpdated}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewCV(freelancer)}
                                                            className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins hover:opacity-90 transition-opacity"
                                                            title="View CV"
                                                        >
                                                            View CV
                                                        </button>

                                                        <button
                                                            onClick={() => handleMoveToJob(freelancer)}
                                                            className="px-3 py-1 rounded-[15px] border border-[#5530FA] text-[#5530FA] text-[10px] font-medium font-poppins hover:bg-[#5530FA] hover:text-white transition-colors"
                                                        >
                                                            Move to Job
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteFreelancer(freelancer)}
                                                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                                            title="Delete freelancer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                                {searchTerm ? 'No freelancers found matching your search.' : 'No freelancers found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TalentPool;