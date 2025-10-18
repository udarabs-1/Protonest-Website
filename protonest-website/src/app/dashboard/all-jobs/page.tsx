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

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    created_at: string;
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

type FilterType = 'experience' | 'location' | 'datePosted' | 'jobType' | 'category';
type Filters = {
    experience: string[];
    location: string[];
    datePosted: string[];
    jobType: string[];
    category: string[];
};

const FilterCheckbox = ({
    isSelected,
    onClick,
    label
}: {
    isSelected: boolean;
    onClick: () => void;
    label: string;
}) => (
    <div className="flex items-center mb-2">
        <button
            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 ${isSelected ? 'outline-2 outline-offset-[-2px] outline-[#5530fa]' : 'border-[#6c6c6c]'
                }`}
            onClick={onClick}
            aria-checked={isSelected}
            role="checkbox"
        >
            {isSelected && (
                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
            )}
        </button>
        <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{label}</span>
    </div>
);

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

const JobCard = ({ job }: { job: Job }) => {
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

    const roleSlug = categoryToSlugMap[job.category] || 'other-roles';

    return (
        <Link
            href={`/jobs/${roleSlug}/${job.id}`}
            className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between">
                <div className="w-3/4">
                    <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                        {job.title}
                    </h3>
                    <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                        {job.location} ‐ Posted {formatTimeAgo(job.created_at)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.type.replace('-', ' ')}</p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                </div>
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c]">
                        {formatDate(job.deadline)}
                    </p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                </div>
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
                        {job.experience}
                    </p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                </div>
            </div>

            <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
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
            </div>

            <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                View Details
            </button>
        </Link>
    );
};

const AllJobsPage = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
    const [filters, setFilters] = useState<Filters>({
        experience: [],
        location: [],
        datePosted: [],
        jobType: [],
        category: []
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

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs`);

                if (response.ok) {
                    const data = await response.json();
                    const jobsData = data.data || [];
                    setJobs(jobsData);
                    setFilteredJobs(jobsData);
                }
            } catch {
                console.error('Error fetching jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
        fetchUserProfile();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (filters.experience.length > 0) {
            filtered = filtered.filter(job => filters.experience.includes(job.experience));
        }
        if (filters.location.length > 0) {
            filtered = filtered.filter(job => filters.location.includes(job.location));
        }
        if (filters.jobType.length > 0) {
            filtered = filtered.filter(job => filters.jobType.includes(job.type));
        }
        if (filters.category.length > 0) {
            filtered = filtered.filter(job => filters.category.includes(job.category));
        }
        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.datePosted.length > 0) {
            filtered.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return filters.datePosted.includes('Newest') ? dateB - dateA : dateA - dateB;
            });
        }

        setFilteredJobs(filtered);
    }, [filters, searchQuery, jobs]);

    const handleFilterToggle = (filterType: FilterType, value: string) => {
        setFilters(prev => {
            const currentFilters = [...prev[filterType]];
            const index = currentFilters.indexOf(value);

            if (index > -1) {
                currentFilters.splice(index, 1);
            } else {
                currentFilters.push(value);
            }

            return {
                ...prev,
                [filterType]: currentFilters
            };
        });
    };

    const clearAllFilters = () => {
        setFilters({
            experience: [],
            location: [],
            datePosted: [],
            jobType: [],
            category: []
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setShowProfileDropdown(false);
        setShowLogoutDialog(false);
        router.push('/find-jobs');
    };

    const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
    const uniqueJobTypes = Array.from(new Set(jobs.map(job => job.type)));
    const uniqueCategories = Array.from(new Set(jobs.map(job => job.category)));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                                    <span className="text-[#5C4EC9]">All Jobs</span>
                                </nav>
                            </div>

                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex flex-col justify-start items-start gap-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                                <Icon
                                                    icon="solar:folder-with-files-bold-duotone"
                                                    className="w-7 h-7"
                                                />
                                            </div>
                                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                                All Jobs
                                            </h1>
                                        </div>
                                        <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                            Browse all available job opportunities at Protonest
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                <aside className="w-full lg:w-1/4 hidden lg:block">
                                    <div className="bg-white rounded-xl p-6 shadow-lg">
                                        <h3 className="text-xl font-medium font-poppins text-[#6c6c6c] mb-6">Filter Jobs by</h3>

                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa] transition-colors"
                                        >
                                            Clear All Filters
                                        </button>

                                        <div className="mb-8">
                                            <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Experience Level →</h4>
                                            {['junior', 'intermediate', 'senior', 'expert'].map(level => (
                                                <FilterCheckbox
                                                    key={level}
                                                    isSelected={filters.experience.includes(level)}
                                                    onClick={() => handleFilterToggle('experience', level)}
                                                    label={level}
                                                />
                                            ))}
                                        </div>

                                        {uniqueCategories.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Category →</h4>
                                                {uniqueCategories.map(category => (
                                                    <FilterCheckbox
                                                        key={category}
                                                        isSelected={filters.category.includes(category)}
                                                        onClick={() => handleFilterToggle('category', category)}
                                                        label={category}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {uniqueLocations.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Location →</h4>
                                                {uniqueLocations.map(location => (
                                                    <FilterCheckbox
                                                        key={location}
                                                        isSelected={filters.location.includes(location)}
                                                        onClick={() => handleFilterToggle('location', location)}
                                                        label={location}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Date Posted →</h4>
                                            {['Newest', 'Oldest'].map(date => (
                                                <FilterCheckbox
                                                    key={date}
                                                    isSelected={filters.datePosted.includes(date)}
                                                    onClick={() => handleFilterToggle('datePosted', date)}
                                                    label={date}
                                                />
                                            ))}
                                        </div>

                                        {uniqueJobTypes.length > 0 && (
                                            <div>
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Job Type →</h4>
                                                {uniqueJobTypes.map(type => (
                                                    <FilterCheckbox
                                                        key={type}
                                                        isSelected={filters.jobType.includes(type)}
                                                        onClick={() => handleFilterToggle('jobType', type)}
                                                        label={type.replace('-', ' ')}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </aside>

                                <div className="w-full lg:w-3/4">
                                    <div className="relative mb-6 flex items-center gap-3">
                                        <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                            <input
                                                type="text"
                                                placeholder="Search for jobs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                            />
                                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="lg:hidden mb-6">
                                        <button
                                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                                            className="w-full bg-white rounded-[20px] shadow-sm py-3 px-4 text-gray-600 flex items-center justify-between"
                                        >
                                            <span>Filters</span>
                                            <Image
                                                src="/down-arrow.svg"
                                                width={24}
                                                height={24}
                                                alt=""
                                                className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {showMobileFilters && (
                                            <div className="mt-4 bg-white rounded-[20px] shadow-lg p-6">
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa]"
                                                >
                                                    Clear All
                                                </button>

                                                <div className="mb-8">
                                                    <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Experience Level →</h4>
                                                    {['junior', 'intermediate', 'senior', 'expert'].map(level => (
                                                        <FilterCheckbox
                                                            key={level}
                                                            isSelected={filters.experience.includes(level)}
                                                            onClick={() => handleFilterToggle('experience', level)}
                                                            label={level}
                                                        />
                                                    ))}
                                                </div>

                                                {uniqueCategories.length > 0 && (
                                                    <div className="mb-8">
                                                        <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Category →</h4>
                                                        {uniqueCategories.map(category => (
                                                            <FilterCheckbox
                                                                key={category}
                                                                isSelected={filters.category.includes(category)}
                                                                onClick={() => handleFilterToggle('category', category)}
                                                                label={category}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                {uniqueLocations.length > 0 && (
                                                    <div className="mb-8">
                                                        <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Location →</h4>
                                                        {uniqueLocations.map(location => (
                                                            <FilterCheckbox
                                                                key={location}
                                                                isSelected={filters.location.includes(location)}
                                                                onClick={() => handleFilterToggle('location', location)}
                                                                label={location}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mb-8">
                                                    <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Date Posted →</h4>
                                                    {['Newest', 'Oldest'].map(date => (
                                                        <FilterCheckbox
                                                            key={date}
                                                            isSelected={filters.datePosted.includes(date)}
                                                            onClick={() => handleFilterToggle('datePosted', date)}
                                                            label={date}
                                                        />
                                                    ))}
                                                </div>

                                                {uniqueJobTypes.length > 0 && (
                                                    <div>
                                                        <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Job Type →</h4>
                                                        {uniqueJobTypes.map(type => (
                                                            <FilterCheckbox
                                                                key={type}
                                                                isSelected={filters.jobType.includes(type)}
                                                                onClick={() => handleFilterToggle('jobType', type)}
                                                                label={type.replace('-', ' ')}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {filteredJobs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredJobs.map(job => (
                                                <JobCard key={job.id} job={job} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600 text-lg font-poppins">
                                                {searchQuery || Object.values(filters).some(arr => arr.length > 0)
                                                    ? 'No jobs match your filters. Try adjusting your search criteria.'
                                                    : 'No jobs available at the moment.'}
                                            </p>
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

export default AllJobsPage;