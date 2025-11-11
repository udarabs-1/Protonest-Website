"use client";

import Footer from '@/app/components/footer';
import { Icon } from '@iconify/react';
import {
    ChevronRight,
    LogOut,
    Menu,
    Search,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface AppliedJob {
    _id: string;
    applied_at: string;
    job_id: {
        _id: string;
        title: string;
    };
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
    updated_at: string;
    user_id: {
        _id: string;
        email: string;
        name: string;
    };
}

interface JobDetails {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    experience: string;
    deadline: string;
    category: string;
}

interface EnrichedAppliedJob extends AppliedJob {
    jobDetails?: JobDetails;
}

interface ProfileData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    location: string;
    bio: string;
    profileImage: string;
    jobUpdates: boolean;
    newsletter: boolean;
    isGoogleUser?: boolean;
}

const categoryToSlugMap: { [key: string]: string } = {
    'Front-End': 'front-end',
    'Back-End': 'back-end',
    'Electronics': 'electronics',
    'UI/UX Designing': 'ui-ux-designing',
    'Mechanical Engineering': 'mechanical',
    'Embedded Systems': 'embedded-firmware',
    'Quality Assurance': 'quality-assurance',
    'Other': 'other-roles'
};

// Applied Jobs Card Component
const AppliedJobCard = ({ job }: { job: EnrichedAppliedJob }) => {
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'pending':
                return { emoji: '🟡', text: 'Pending', color: 'text-yellow-600' };
            case 'reviewed':
                return { emoji: '👀', text: 'Reviewed', color: 'text-blue-600' };
            case 'shortlisted':
                return { emoji: '✅', text: 'Shortlisted', color: 'text-green-600' };
            case 'rejected':
                return { emoji: '❌', text: 'Rejected', color: 'text-red-600' };
            case 'hired':
                return { emoji: '🎉', text: 'Hired', color: 'text-purple-600' };
            default:
                return { emoji: '🟡', text: 'Pending', color: 'text-yellow-600' };
        }
    };

    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const statusDisplay = getStatusDisplay(job.status);

    // Get the role slug from the job category
    const roleSlug = categoryToSlugMap[job.jobDetails?.category || ''] || 'other-roles';

    return (
        <div className="group relative w-full h-[350px] bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
            <div className="w-full h-[43px] mt-8">
                <div className="w-full h-full text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] group-hover:font-medium text-base font-normal font-['Poppins'] leading-[35px] line-clamp-1 transition-none">
                    {job.job_id.title}
                </div>
            </div>

            <div className="w-full h-[35px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                {job.jobDetails?.type || 'Job'} - Applied {formatTimeAgo(job.applied_at)}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px] capitalize">
                        {job.jobDetails?.experience || 'Not specified'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Experience Level
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {job.jobDetails?.location || 'Remote'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Location
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {job.jobDetails?.deadline ? formatDate(job.jobDetails.deadline) : 'Not specified'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Application Deadline
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className={`h-5 text-xs font-medium font-['Poppins'] leading-[35px] ${statusDisplay.color}`}>
                        {statusDisplay.emoji} {statusDisplay.text}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Status
                    </div>
                </div>
            </div>

            <Link
                href={`/jobs/${roleSlug}/${job.job_id._id}`}
                className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300"
            >
                <div className="w-full h-full group-hover:hidden">
                    <Image
                        src="/upleft.svg"
                        alt="Arrow"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="hidden w-full h-full group-hover:block">
                    <Image
                        src="/upleft-hover.svg"
                        alt="Hover Arrow"
                        width={50}
                        height={50}
                        className="w-full h-full object-contain"
                    />
                </div>
            </Link>

            <Link
                href={`/jobs/${roleSlug}/${job.job_id._id}`}
                className="absolute bottom-6 left-6 right-6 bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300"
            >
                View Details
            </Link>
        </div>
    );
};

const StatusFilter = ({
    activeFilter,
    onFilterChange
}: {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}) => {
    const filters = [
        { key: 'all', label: '📎 All', emoji: '📎' },
        { key: 'pending', label: '🟡 Pending', emoji: '🟡' },
        { key: 'reviewed', label: '👀 Reviewed', emoji: '👀' },
        { key: 'shortlisted', label: '✅ Shortlisted', emoji: '✅' },
        { key: 'rejected', label: '❌ Rejected', emoji: '❌' },
        { key: 'hired', label: '🎉 Hired', emoji: '🎉' }
    ];

    return (
        <div className="flex gap-2 mb-6 overflow-x-auto">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-[57px] outline-1 outline-offset-[-1px] outline-[#5530fa] flex items-center gap-2 whitespace-nowrap transition-all ${activeFilter === filter.key
                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                        : 'text-[#6c6c6c] hover:bg-gray-50'
                        }`}
                >
                    <span className="text-xs font-medium font-['Montserrat']">
                        {filter.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

const AppliedJobs = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<EnrichedAppliedJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<EnrichedAppliedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        location: '',
        bio: '',
        profileImage: '/profile-1.svg',
        jobUpdates: true,
        newsletter: false,
        isGoogleUser: false,
    });
    const sidebarRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: 'solar:folder-with-files-bold-duotone', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: 'solar:minimalistic-magnifer-bold-duotone', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: 'solar:diskette-bold-duotone', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: 'solar:target-bold-duotone', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: 'solar:cloud-upload-bold-duotone', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: 'solar:bell-bold-duotone', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: 'solar:user-bold-duotone', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/signin');
        }
    }, [router]);

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    const userData = data.user;
                    setProfileData({
                        id: userData.id,
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        email: userData.email || '',
                        jobTitle: userData.job_title || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        profileImage: userData.profile_image || '/profile-1.svg',
                        jobUpdates: userData.job_updates || false,
                        newsletter: userData.newsletter || false,
                        isGoogleUser: userData.is_oauth_user || false,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
            if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen, showProfileDropdown]);

    // Fetch applied jobs data from API
    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }
        fetchAppliedJobs();
        fetchUserProfile();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            // Try multiple possible endpoints
            let response;
            let applicationsData;

            // First try the applications endpoint
            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                applicationsData = await response.json();
            } catch {
                console.log('Primary endpoint failed, trying fallback...');
                // Try alternative endpoint structure
                try {
                    response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/applications`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    applicationsData = await response.json();
                } catch {
                    throw new Error('Failed to fetch applications from all endpoints');
                }
            }

            // Handle different response structures
            const jobs: AppliedJob[] = applicationsData.data || applicationsData.applications || applicationsData || [];

            if (jobs.length === 0) {
                setAppliedJobs([]);
                setFilteredJobs([]);
                setLoading(false);
                return;
            }

            // Enrich jobs with job details
            const enrichedJobs = await Promise.all(
                jobs.map(async (job) => {
                    try {
                        const jobResponse = await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${job.job_id._id}`
                        );
                        if (jobResponse.ok) {
                            const jobData = await jobResponse.json();
                            return {
                                ...job,
                                jobDetails: jobData.data
                            };
                        }
                    } catch (error) {
                        console.error('Error fetching job details:', error);
                    }
                    return job;
                })
            );

            setAppliedJobs(enrichedJobs);
            setFilteredJobs(enrichedJobs);
        } catch (err) {
            console.error('Error fetching applied jobs:', err);
            setError('Failed to load applied jobs data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = appliedJobs;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(job => job.status === activeFilter);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.job_id.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobDetails?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobDetails?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobDetails?.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    }, [searchQuery, activeFilter, appliedJobs]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setShowProfileDropdown(false);
        setShowLogoutDialog(false);
        router.push('/careers');
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading applied jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <style jsx global>{`
                .gradient-icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon svg path {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg circle {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg rect {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg polygon {
                    fill: url(#icon-gradient) !important;
                }
            `}</style>

            {/* SVG Gradient Definition */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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

            <div className="font-poppins min-h-screen bg-white relative">
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

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

                            <div className="flex items-center relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-offset-2"
                                >
                                    <Image
                                        src={profileData.profileImage}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {showProfileDropdown && (
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-medium">Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                setShowLogoutDialog(true);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-8">
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
                                            <div className={`w-5 h-5 mr-4 flex items-center justify-center ${pathname !== item.path ? 'gradient-icon' : ''}`}>
                                                <Icon
                                                    icon={item.icon}
                                                    className={`w-5 h-5 ${pathname === item.path ? 'text-white' : ''}`}
                                                />
                                            </div>
                                            <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="p-4 pt-8">
                                    <button
                                        onClick={() => setShowLogoutDialog(true)}
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                            <Icon
                                                icon="solar:login-3-bold-duotone"
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <span className="font-normal">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>

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
                                            <div className={`w-5 h-5 mr-4 flex items-center justify-center ${pathname !== item.path ? 'gradient-icon' : ''}`}>
                                                <Icon
                                                    icon={item.icon}
                                                    className={`w-5 h-5 ${pathname === item.path ? 'text-white' : ''}`}
                                                />
                                            </div>
                                            <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="p-4 pt-8">
                                    <button
                                        onClick={() => setShowLogoutDialog(true)}
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                            <Icon
                                                icon="solar:login-3-bold-duotone"
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <span className="font-normal">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                            <div className="flex items-center mb-6">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                                <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Applied Jobs</span>
                                </nav>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                    <button
                                        onClick={fetchAppliedJobs}
                                        className="mt-2 text-red-600 text-sm underline hover:no-underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="flex flex-col justify-start items-start gap-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                                <Icon
                                                    icon="solar:target-bold-duotone"
                                                    className="w-7 h-7"
                                                />
                                            </div>
                                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                                Applied Jobs
                                            </h1>
                                        </div>
                                        <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                            Here&apos;s a list of jobs you&apos;ve applied to, with real-time status updates for each application.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative mb-6 flex items-center gap-3">
                                    <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search for applied jobs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                        />
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <StatusFilter
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => (
                                            <AppliedJobCard key={job._id} job={job} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-400 text-lg mb-2">📭</div>
                                            <p className="text-gray-500">
                                                {searchQuery || activeFilter !== 'all'
                                                    ? 'No applied jobs found matching your criteria.'
                                                    : 'You haven\'t applied to any jobs yet.'
                                                }
                                            </p>
                                            {!searchQuery && activeFilter === 'all' && appliedJobs.length === 0 && (
                                                <Link
                                                    href="/dashboard/suggested-jobs"
                                                    className="text-purple-600 hover:text-purple-700 mt-2 inline-block"
                                                >
                                                    Browse suggested jobs →
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AppliedJobs;