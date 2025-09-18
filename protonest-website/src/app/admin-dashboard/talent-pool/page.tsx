"use client";

import {
    Bell,
    ChevronRight,
    Download,
    Edit,
    Eye,
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
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Types based on your backend models
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
}

interface FreelancerData {
    id: string;
    name: string;
    email: string;
    title: string;
    skills: string[];
    ndaStatus: 'signed' | 'pending' | 'not_sent';
    submittedOn: string;
    cvFileUrl?: string;
    userId: string;
}

const TalentPool = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/pipeline' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    // Fetch freelancers data from API
    useEffect(() => {
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken'); // Adjust based on your auth implementation

            if (!token) {
                throw new Error('No authentication token found');
            }

            // Since there's no direct endpoint to get all users with CVs, 
            // you'll need to create one in your backend or use the existing user endpoints
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users-with-cvs`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform the data to match our frontend interface
            const transformedData: FreelancerData[] = data.users?.map((user: User) => ({
                id: user.id,
                userId: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                title: user.cv?.work_function || 'Not specified',
                skills: user.cv?.skills || [],
                ndaStatus: user.cv?.nda_acknowledged ? 'signed' : 'pending',
                submittedOn: user.cv?.uploaded_at ? new Date(user.cv.uploaded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : 'N/A',
                cvFileUrl: user.cv?.cv_file_url,
            })) || [];

            setFreelancers(transformedData);
        } catch (err) {
            console.error('Error fetching freelancers:', err);
            setError('Failed to load freelancers data');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
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

    const handleDownloadCV = async (freelancer: FreelancerData) => {
        try {
            if (freelancer.cvFileUrl) {
                const link = document.createElement('a');
                link.href = freelancer.cvFileUrl;
                link.download = `${freelancer.name.replace(/\s+/g, '_')}_CV.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('CV file not available for download');
            }
        } catch (err) {
            console.error('Error downloading CV:', err);
            alert('Failed to download CV file');
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

            // You'll need to create this endpoint in your backend
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

    // Filter freelancers based on active filter and search term
    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'signed' && freelancer.ndaStatus === 'signed') ||
            (activeFilter === 'pending' && freelancer.ndaStatus === 'pending');

        const matchesSearch =
            freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            freelancer.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getNdaStatusBadge = (status: string) => {
        if (status === 'signed') {
            return (
                <span className="inline-flex items-center justify-center px-2 py-1 bg-[#86ffae] rounded-[15px] border border-gray-300">
                    <span className="text-[#4e4e4e] text-[11px] font-medium font-poppins">Signed</span>
                </span>
            );
        } else if (status === 'pending') {
            return (
                <span className="inline-flex items-center justify-center px-2 py-1 bg-[#e2ff86] rounded-[15px] border border-gray-300">
                    <span className="text-[#4e4e4e] text-[11px] font-medium font-poppins">Pending</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-200 rounded-[15px] border border-gray-300">
                <span className="text-[#4e4e4e] text-[11px] font-medium font-poppins">Not Sent</span>
            </span>
        );
    };

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
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Header */}
            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo - Smaller on mobile */}
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

                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>

                            <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                <Image
                                    src="/profile-1.svg"
                                    alt="User Avatar"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
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
                        {/* Mobile Sidebar Header */}
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

                        {/* Sidebar Content */}
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

                            {/* Logout Button */}
                            <div className="pt-8">
                                <Link
                                    href="/logout"
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </Link>
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

                            {/* Logout Button */}
                            <div className="p-4 pt-8">
                                <Link
                                    href="/logout"
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                        {/* Breadcrumb with Hamburger Menu for mobile */}
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

                        {/* Error Display */}
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

                        {/* Page Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                            <div className="flex-1 max-w-[603px]">
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-2 font-montserrat">
                                    📂 Talent Pool – Freelancer CVs ({filteredFreelancers.length})
                                </h1>
                                <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                    View and manage CVs submitted by freelancers. Use filters to shortlist profiles for upcoming IoT projects.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => alert('Manual CV upload feature coming soon!')}
                                    className="w-full lg:w-auto px-6 py-4 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow"
                                >
                                    + Add Manual CV
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] border border-gray-200"
                                    placeholder="Search by freelancer name, skills, or email"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => alert('Advanced filters coming soon!')}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Filter Buttons */}
                        <div className="inline-flex justify-start items-center gap-2 mb-6">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'all'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'border border-[#5530fa] text-[#676767] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-center text-xs font-semibold font-montserrat">
                                    📎 All ({freelancers.length})
                                </span>
                            </button>

                            <button
                                onClick={() => handleFilterChange('signed')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'signed'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'border border-[#5530fa] text-[#676767] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-center text-[11px] font-medium font-poppins">
                                    ✅ NDA Signed ({freelancers.filter(f => f.ndaStatus === 'signed').length})
                                </span>
                            </button>

                            <button
                                onClick={() => handleFilterChange('pending')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'pending'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'border border-[#5530fa] text-[#676767] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-center text-[11px] font-medium font-poppins">
                                    ⌛ NDA Pending ({freelancers.filter(f => f.ndaStatus === 'pending').length})
                                </span>
                            </button>
                        </div>

                        {/* Freelancers Table */}
                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                            {/* Table Header */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    <div className="col-span-12 md:col-span-2">Freelancer Name</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Title / Role</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Skills</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">NDA Status</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Submitted On</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {filteredFreelancers.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                        {searchTerm ? 'No freelancers found matching your search.' : 'No freelancers found.'}
                                    </div>
                                ) : (
                                    filteredFreelancers.map((freelancer) => (
                                        <div key={freelancer.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                            {/* Mobile Layout */}
                                            <div className="md:hidden">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="text-[11px] font-medium font-poppins text-[#676767] mb-1">
                                                            {freelancer.name}
                                                        </h3>
                                                        <p className="text-[10px] text-gray-500 mb-1">
                                                            {freelancer.email}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mb-1">
                                                            {freelancer.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mb-1">
                                                            Skills: {freelancer.skills.slice(0, 3).join(', ')}
                                                            {freelancer.skills.length > 3 && ` +${freelancer.skills.length - 3} more`}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                                                            <span>{freelancer.submittedOn}</span>
                                                        </div>
                                                        <div className="mb-2">
                                                            {getNdaStatusBadge(freelancer.ndaStatus)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleViewCV(freelancer)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="View CV"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadCV(freelancer)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Download CV"
                                                        >
                                                            <Download className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Edit functionality coming soon!')}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFreelancer(freelancer)}
                                                            className="p-1 hover:bg-red-100 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-2">
                                                    <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                        {freelancer.name}
                                                    </span>
                                                    <div className="text-[10px] text-gray-500 mt-1">
                                                        {freelancer.email}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                        {freelancer.title}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                        {freelancer.skills.slice(0, 2).join(', ')}
                                                        {freelancer.skills.length > 2 && ` +${freelancer.skills.length - 2}`}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    {getNdaStatusBadge(freelancer.ndaStatus)}
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                        {freelancer.submittedOn}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewCV(freelancer)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="View CV"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadCV(freelancer)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Download CV"
                                                        >
                                                            <Download className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Edit functionality coming soon!')}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFreelancer(freelancer)}
                                                            className="p-1 hover:bg-red-100 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Pagination (if needed) */}
                        {filteredFreelancers.length > 0 && (
                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Showing {filteredFreelancers.length} of {freelancers.length} freelancers
                                </p>
                                {/* Add pagination here if you implement it */}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TalentPool;