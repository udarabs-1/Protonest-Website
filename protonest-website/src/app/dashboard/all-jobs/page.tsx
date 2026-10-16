"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import { SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    created_at: string;
    is_active?: boolean;
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

const FILTER_OPTIONS = {
    experience: ['beginner', 'intermediate', 'experienced'],
    location: ['Remote', 'On-site', 'Hybrid'],
    jobType: ['full-time', 'project-based', 'hourly', 'internship'],
    datePosted: ['Newest', 'Oldest']
} as const;

const categoryToSlugMap: { [key: string]: string } = {
    'Front-End': 'front-end',
    'Back-End': 'back-end',
    'Full-Stack': 'full-stack',
    'Electronics': 'electronics',
    'UI/UX Designing': 'ui-ux-designing',
    'Mechanical Engineering': 'mechanical',
    'Embedded Firmware': 'embedded-firmware',
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
            <article>
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
                        <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
                            {job.type === 'project-based' ? 'Project Based' :
                                job.type === 'full-time' ? 'Full Time' :
                                    job.type === 'hourly' ? 'Hourly' :
                                        job.type === 'internship' ? 'Internship' :
                                            job.type}
                        </p>
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

                <div className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300 cursor-pointer">
                    View Details
                </div>
            </article>
        </Link>
    );
};

const isUserTokenExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    const token = localStorage.getItem('jwtToken');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('tokenExpiration');
            return true;
        }

        return false;
    } catch {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
        return true;
    }
};

const AllJobsPage = () => {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleJobsCount, setVisibleJobsCount] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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

    const dropdownRef = useRef<HTMLDivElement>(null);

    const checkIsMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        checkIsMobile();

        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkIsMobile, 150);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [checkIsMobile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
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
            } else if (response.status === 401) {
                localStorage.removeItem('jwtToken');
                router.push('/signin');
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const jobsData = data.data || [];
                const activeJobs = jobsData.filter((job: Job) => job.is_active !== false);
                setJobs(activeJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);

                let errorMessage = 'Failed to load jobs';
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    errorMessage = 'Network error: Unable to connect to the server';
                } else if (error instanceof Error) {
                    if (error.message.includes('404')) {
                        errorMessage = 'Jobs endpoint not found (404)';
                    } else if (error.message.includes('500')) {
                        errorMessage = 'Server error (500)';
                    } else {
                        errorMessage = error.message;
                    }
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
        fetchUserProfile();
    }, []);

    const clearAllFilters = useCallback(() => {
        setFilters({
            experience: [],
            location: [],
            datePosted: [],
            jobType: [],
            category: []
        });
        setOpenDropdown(null);
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const loadMoreJobs = useCallback(() => {
        setVisibleJobsCount(prev => prev + 3);
    }, []);

    const filteredJobs = useMemo(() => {
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

        return filtered;
    }, [jobs, filters, searchQuery]);

    useEffect(() => {
        setVisibleJobsCount(3);
        setCurrentPage(1);
    }, [filters, searchQuery]);

    const JOBS_PER_PAGE = 8;
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);
    const hasMoreJobs = false;

    const uniqueCategories = useMemo(() => {
        return Array.from(new Set(jobs.map(job => job.category)));
    }, [jobs]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading jobs...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'All Jobs' }
    ];

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            <div className="bg-white pb-1 pt-1">
                <div className="flex-shrink-0 mb-6">
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

                <div className="flex-shrink-0 mb-4">
                    <div className="flex gap-3">
                        <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search for the job"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                            />
                            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden px-4 py-3 bg-white border border-gray-300 rounded-[20px] shadow-sm hover:border-gray-400 transition-colors flex items-center gap-2"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-poppins text-gray-600">Filters</span>
                        </button>
                    </div>
                </div>

                {showMobileFilters && (
                    <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
                        <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 font-poppins">Filters</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {uniqueCategories.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Category</h4>
                                        <div className="space-y-2">
                                            {uniqueCategories.map(category => (
                                                <label key={category} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.category.includes(category)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, category: [...prev.category, category] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category) }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 font-poppins">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Experience Level</h4>
                                    <div className="space-y-2">
                                        {FILTER_OPTIONS.experience.map(level => (
                                            <label key={level} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.experience.includes(level)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters(prev => ({ ...prev, experience: [...prev.experience, level] }));
                                                        } else {
                                                            setFilters(prev => ({ ...prev, experience: prev.experience.filter(l => l !== level) }));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-poppins capitalize">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Location</h4>
                                    <div className="space-y-2">
                                        {FILTER_OPTIONS.location.map(location => (
                                            <label key={location} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.location.includes(location)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters(prev => ({ ...prev, location: [...prev.location, location] }));
                                                        } else {
                                                            setFilters(prev => ({ ...prev, location: prev.location.filter(l => l !== location) }));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-poppins">{location}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Job Type</h4>
                                    <div className="space-y-2">
                                        {FILTER_OPTIONS.jobType.map(type => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.jobType.includes(type)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters(prev => ({ ...prev, jobType: [...prev.jobType, type] }));
                                                        } else {
                                                            setFilters(prev => ({ ...prev, jobType: prev.jobType.filter(t => t !== type) }));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-poppins">
                                                    {type === 'project-based' ? 'Project Based' :
                                                        type === 'full-time' ? 'Full Time' :
                                                            type === 'hourly' ? 'Hourly' :
                                                                type === 'internship' ? 'Internship' :
                                                                    type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Date Posted</h4>
                                    <div className="space-y-2">
                                        {FILTER_OPTIONS.datePosted.map(date => (
                                            <label key={date} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.datePosted.includes(date)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters(prev => ({ ...prev, datePosted: [...prev.datePosted, date] }));
                                                        } else {
                                                            setFilters(prev => ({ ...prev, datePosted: prev.datePosted.filter(d => d !== date) }));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-poppins">{date}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3">
                                <button
                                    onClick={() => {
                                        clearAllFilters();
                                        setShowMobileFilters(false);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-[57px] text-gray-700 font-medium font-poppins hover:bg-gray-50 transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[57px] text-white font-medium font-poppins hover:opacity-90 transition-opacity"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-shrink-0 hidden md:block mb-2" ref={dropdownRef}>
                    <div className="flex items-center gap-3 flex-wrap">
                        {uniqueCategories.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-poppins text-gray-600 bg-white hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                                >
                                    <span>
                                        {filters.category.length > 0
                                            ? `Category (${filters.category.length})`
                                            : 'Category'}
                                    </span>
                                    <svg className={`w-4 h-4 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openDropdown === 'category' && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full max-h-[250px] overflow-y-auto">
                                        {uniqueCategories.map(category => (
                                            <label key={category} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.category.includes(category)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters(prev => ({ ...prev, category: [...prev.category, category] }));
                                                        } else {
                                                            setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category) }));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 font-poppins">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-poppins text-gray-600 bg-white hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[160px] justify-between"
                            >
                                <span>
                                    {filters.experience.length > 0
                                        ? `Experience (${filters.experience.length})`
                                        : 'Experience Level'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'experience' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openDropdown === 'experience' && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
                                    {FILTER_OPTIONS.experience.map(level => (
                                        <label key={level} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.experience.includes(level)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFilters(prev => ({ ...prev, experience: [...prev.experience, level] }));
                                                    } else {
                                                        setFilters(prev => ({ ...prev, experience: prev.experience.filter(l => l !== level) }));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 font-poppins capitalize">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-poppins text-gray-600 bg-white hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                            >
                                <span>
                                    {filters.location.length > 0
                                        ? `Location (${filters.location.length})`
                                        : 'Location'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openDropdown === 'location' && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
                                    {FILTER_OPTIONS.location.map(location => (
                                        <label key={location} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.location.includes(location)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFilters(prev => ({ ...prev, location: [...prev.location, location] }));
                                                    } else {
                                                        setFilters(prev => ({ ...prev, location: prev.location.filter(l => l !== location) }));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 font-poppins">{location}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'jobType' ? null : 'jobType')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-poppins text-gray-600 bg-white hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                            >
                                <span>
                                    {filters.jobType.length > 0
                                        ? `Job Type (${filters.jobType.length})`
                                        : 'Job Type'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'jobType' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openDropdown === 'jobType' && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
                                    {FILTER_OPTIONS.jobType.map(type => (
                                        <label key={type} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.jobType.includes(type)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFilters(prev => ({ ...prev, jobType: [...prev.jobType, type] }));
                                                    } else {
                                                        setFilters(prev => ({ ...prev, jobType: prev.jobType.filter(t => t !== type) }));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 font-poppins">
                                                {type === 'project-based' ? 'Project Based' :
                                                    type === 'full-time' ? 'Full Time' :
                                                        type === 'hourly' ? 'Hourly' :
                                                            type === 'internship' ? 'Internship' :
                                                                type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'datePosted' ? null : 'datePosted')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-poppins text-gray-600 bg-white hover:border-gray-400 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                            >
                                <span>
                                    {filters.datePosted.length > 0
                                        ? `Date (${filters.datePosted.length})`
                                        : 'Date Posted'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'datePosted' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openDropdown === 'datePosted' && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
                                    {FILTER_OPTIONS.datePosted.map(date => (
                                        <label key={date} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.datePosted.includes(date)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFilters(prev => ({ ...prev, datePosted: [...prev.datePosted, date] }));
                                                    } else {
                                                        setFilters(prev => ({ ...prev, datePosted: prev.datePosted.filter(d => d !== date) }));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#5530fa] border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 font-poppins">{date}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(filters.experience.length > 0 || filters.category.length > 0 || filters.location.length > 0 || filters.jobType.length > 0 || filters.datePosted.length > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="ml-auto px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[57px] hover:opacity-90 transition-opacity font-poppins"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <p className="text-sm text-gray-600 font-poppins py-2">
                        Showing {jobsToShow.length} of {filteredJobs.length} jobs
                    </p>
                </div>
            </div>
            <div className="pb-8">


                {jobsToShow.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {jobsToShow.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pb-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium font-poppins text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-gray-700 font-poppins">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium font-poppins text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg font-poppins">
                            No jobs found matching your criteria. Try adjusting your filters.
                        </p>
                    </div>
                )}
            </div>


        </DashboardLayout>
    );
}

export default AllJobsPage;