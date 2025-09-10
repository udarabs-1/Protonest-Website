'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types
type Job = {
    id: string;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    created_at: string;
};

type JobResponse = {
    id: string;
    title: string;
    location: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    created_at: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    overview: string;
};

type FilterType = 'experience' | 'location' | 'datePosted' | 'jobType';
type Filters = {
    experience: string[];
    location: string[];
    datePosted: string[];
    jobType: string[];
};

// Map role slugs to category names
const roleToCategoryMap: { [key: string]: string } = {
    'front-end': 'Front-End',
    'back-end': 'Back-End',
    'electronics': 'Electronics',
    'ui-ux-designing': 'UI/UX Designing',
    'mechanical': 'Mechanical Engineering',
    'embedded-firmware': 'Embedded Systems',
    'quality-assurance': 'Quality Assurance',
    'other-roles': 'Other'
};

// Map role slugs to display names
const roleTitles: { [key: string]: string } = {
    'front-end': 'Front-End',
    'back-end': 'Back-End',
    'electronics': 'Electronics',
    'ui-ux-designing': 'UI/UX',
    'mechanical': 'Mechanical',
    'embedded-firmware': 'Embedded Firmware',
    'quality-assurance': 'Quality Assurance',
    'other-roles': 'Other Roles'
};

// Helper function to format time difference as "X days ago"
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
};

// Helper function to format date as "MMM D, YYYY"
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function RolePage() {
    const params = useParams();
    const { role } = params;

    const [filters, setFilters] = useState<Filters>({
        experience: [],
        location: [],
        datePosted: [],
        jobType: []
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [visibleJobsCount, setVisibleJobsCount] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if screen is mobile/small
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Get role key and category
    const roleKey = Array.isArray(role) ? role[0] : role;
    const category = roleKey ? roleToCategoryMap[roleKey] : null;

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            if (!category) return;

            setLoading(true);
            setError(null);

            try {
                // Build API URL with category filter
                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs?category=${encodeURIComponent(category)}`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch jobs: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success' && data.data) {
                    // Transform API response to match our Job type
                    const transformedJobs: Job[] = data.data.map((job: JobResponse) => ({
                        id: job.id,
                        title: job.title,
                        location: job.location,
                        posted: formatTimeAgo(job.created_at),
                        type: job.type,
                        deadline: formatDate(job.deadline),
                        experience: job.experience,
                        category: job.category,
                        created_at: job.created_at
                    }));

                    setJobs(transformedJobs);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err instanceof Error ? err.message : 'Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [category]);

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
            jobType: []
        });
    };

    // Filter jobs based on selected filters and search query
    const filteredJobs = jobs.filter(job => {
        // Filter by experience
        if (filters.experience.length > 0 && !filters.experience.includes(job.experience)) {
            return false;
        }

        // Filter by location
        if (filters.location.length > 0 && !filters.location.includes(job.location)) {
            return false;
        }

        // Filter by job type
        if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Sort by date posted if needed
    if (filters.datePosted.length > 0) {
        filteredJobs.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();

            if (filters.datePosted.includes('Newest')) {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });
    }

    // Reset visible jobs count when filters or search change
    useEffect(() => {
        setVisibleJobsCount(3);
    }, [filters, searchQuery]);

    // Get display title
    const displayTitle = roleKey ? roleTitles[roleKey] || roleKey : 'Jobs';

    // Determine which jobs to display
    const jobsToShow = isMobile
        ? filteredJobs.slice(0, visibleJobsCount)
        : filteredJobs;

    // Check if there are more jobs to load
    const hasMoreJobs = isMobile && visibleJobsCount < filteredJobs.length;

    // Load more jobs function
    const loadMoreJobs = () => {
        setVisibleJobsCount(prev => prev + 3);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading jobs...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen  relative bg-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="h-[400px] lg:h-[500px] xl:h-[439px] relative">
                {/* Background Image - Mobile */}
                <div className="absolute inset-0 block sm:hidden">
                    <Image
                        src="/jobs-1-mobile.svg"
                        alt={`${displayTitle} background mobile`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Background Image - Desktop */}
                <div className="absolute inset-0 hidden sm:block">
                    <Image
                        src="/jobs-1.svg"
                        alt={`${displayTitle} background`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10" />

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10" />

                {/* Hero Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-0">
                    <div className="text-center max-w-4xl xl:max-w-[1120px]">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                            <span className="text-[#6c6c6c]">{displayTitle} Jobs</span>
                            <br />
                        </h1>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-poppins leading-6 sm:leading-[30px] max-w-2xl xl:max-w-[1120px] mx-auto">
                            Browse jobs posted on Protonest and apply for the role that fits you.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 lg:py-12">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4 hidden lg:block">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-medium font-poppins text-[#6c6c6c] mb-6">Filter Jobs by</h2>

                            <button
                                onClick={clearAllFilters}
                                className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa] transition-colors"
                            >
                                Clear All Filters
                            </button>

                            {/* Experience Level Filter */}
                            <div className="mb-8">
                                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Experience Level →</h3>
                                {['junior', 'intermediate', 'senior', 'expert'].map(level => (
                                    <div key={level} className="flex items-center mb-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.experience.includes(level)
                                                ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                : 'border-[#6c6c6c]'
                                                }`}
                                            onClick={() => handleFilterToggle('experience', level)}
                                        >
                                            {filters.experience.includes(level) && (
                                                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{level}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Location Filter */}
                            <div className="mb-8">
                                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Location →</h3>
                                {Array.from(new Set(jobs.map(job => job.location))).map(location => (
                                    <div key={location} className="flex items-center mb-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.location.includes(location)
                                                ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                : 'border-[#6c6c6c]'
                                                }`}
                                            onClick={() => handleFilterToggle('location', location)}
                                        >
                                            {filters.location.includes(location) && (
                                                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-poppins text-[#6c6c6c]">{location}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Date Posted Filter */}
                            <div className="mb-8">
                                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Date Posted →</h3>
                                {['Newest', 'Oldest'].map(date => (
                                    <div key={date} className="flex items-center mb-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.datePosted.includes(date)
                                                ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                : 'border-[#6c6c6c]'
                                                }`}
                                            onClick={() => handleFilterToggle('datePosted', date)}
                                        >
                                            {filters.datePosted.includes(date) && (
                                                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-poppins text-[#6c6c6c]">{date}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Job Type Filter */}
                            <div>
                                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Job Type →</h3>
                                {Array.from(new Set(jobs.map(job => job.type))).map(type => (
                                    <div key={type} className="flex items-center mb-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.jobType.includes(type)
                                                ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                : 'border-[#6c6c6c]'
                                                }`}
                                            onClick={() => handleFilterToggle('jobType', type)}
                                        >
                                            {filters.jobType.includes(type) && (
                                                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{type.replace('-', ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full lg:w-3/4">
                        <div className="w-full text-[#6c6c6c] text-xl font-medium font-poppins leading-[38px] mb-6">
                            Explore Variety of Jobs
                        </div>
                        {/* Search Bar */}
                        <div className="relative w-full mb-8 lg:mb-12">
                            <div className="w-full h-10 lg:h-12 opacity-50 bg-white rounded-[20px] shadow-[5px_5px_20px_rgba(0,0,0,0.1)] overflow-hidden flex items-center px-4">
                                <input
                                    type="text"
                                    placeholder="Search for the job role you are looking for"
                                    className="w-full bg-transparent border-none outline-none text-sm text-[#6c6c6c] font-poppins"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                                    <Image
                                        src="/search.svg"
                                        alt="Search"
                                        width={24}
                                        height={24}
                                        className="w-full h-full text-[#6c6c6c]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filter Section */}
                        <div className="lg:hidden mb-6">
                            <div className="text-[#6c6c6c] text-xl font-medium font-poppins leading-[38px] mb-4">
                                Filter Your Fit
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative h-12 w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden">
                                    <input
                                        type="text"
                                        className="w-full h-full pl-4 pr-10 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins focus:outline-none"
                                        readOnly
                                        placeholder="Filter options"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Image
                                            src="/down-arrow.svg"
                                            width={24}
                                            height={24}
                                            alt="Filter"
                                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                                            className={`cursor-pointer transform ${showMobileFilters ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Filter Popup */}
                            {showMobileFilters && (
                                <div className="w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] p-6 mb-6 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="text-[#6c6c6c] text-xl font-medium font-poppins">
                                            Filter
                                        </div>
                                        <button
                                            className="text-[#6c6c6c] text-sm font-normal font-poppins"
                                            onClick={() => setShowMobileFilters(false)}
                                        >
                                            <Image
                                                src="/close.svg"
                                                width={24}
                                                height={24}
                                                alt="Close"
                                            />
                                        </button>
                                    </div>

                                    {/* Experience Level Filter */}
                                    <div className="mb-8">
                                        <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Experience Level →</h3>
                                        {['junior', 'intermediate', 'senior', 'expert'].map(level => (
                                            <div key={level} className="flex items-center mb-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.experience.includes(level)
                                                        ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                        : 'border-[#6c6c6c]'
                                                        }`}
                                                    onClick={() => handleFilterToggle('experience', level)}
                                                >
                                                    {filters.experience.includes(level) && (
                                                        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{level}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Location Filter */}
                                    <div className="mb-8">
                                        <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Location →</h3>
                                        {Array.from(new Set(jobs.map(job => job.location))).map(location => (
                                            <div key={location} className="flex items-center mb-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.location.includes(location)
                                                        ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                        : 'border-[#6c6c6c]'
                                                        }`}
                                                    onClick={() => handleFilterToggle('location', location)}
                                                >
                                                    {filters.location.includes(location) && (
                                                        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="text-[13px] font-poppins text-[#6c6c6c]">{location}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Date Posted Filter */}
                                    <div className="mb-8">
                                        <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Date Posted →</h3>
                                        {['Newest', 'Oldest'].map(date => (
                                            <div key={date} className="flex items-center mb-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.datePosted.includes(date)
                                                        ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                        : 'border-[#6c6c6c]'
                                                        }`}
                                                    onClick={() => handleFilterToggle('datePosted', date)}
                                                >
                                                    {filters.datePosted.includes(date) && (
                                                        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="text-[13px] font-poppins text-[#6c6c6c]">{date}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Job Type Filter */}
                                    <div className="mb-8">
                                        <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Job Type →</h3>
                                        {Array.from(new Set(jobs.map(job => job.type))).map(type => (
                                            <div key={type} className="flex items-center mb-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer ${filters.jobType.includes(type)
                                                        ? ' outline-2 outline-offset-[-2px] outline-[#5530fa]'
                                                        : 'border-[#6c6c6c]'
                                                        }`}
                                                    onClick={() => handleFilterToggle('jobType', type)}
                                                >
                                                    {filters.jobType.includes(type) && (
                                                        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{type.replace('-', ' ')}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button
                                            className="text-[#6c6c6c] text-sm font-normal font-poppins"
                                            onClick={clearAllFilters}
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            className="h-[40px] px-6 font-semibold text-sm font-montserrat text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px]"
                                            onClick={() => setShowMobileFilters(false)}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Job Listings */}
                        {jobsToShow.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {jobsToShow.map(job => (
                                        <Link
                                            key={job.id}
                                            href={`/jobs/${roleKey}/${job.id}`}
                                            className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
                                        >


                                            <div className="flex justify-between">
                                                <div className="w-3/4">
                                                    <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                                                        {job.location} ‐ Posted {job.posted}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div>
                                                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.type.replace('-', ' ')}</p>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{job.deadline}</p>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.experience}</p>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                                                </div>
                                            </div>

                                            {/* Arrow Image Swap on Hover */}
                                            <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
                                                {/* Default Arrow */}
                                                <div className="w-full h-full group-hover:hidden">
                                                    <Image
                                                        src="/upleft.svg"
                                                        alt="Arrow"
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Hover Arrow */}
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
                                    ))}
                                </div>

                                {/* Load More Button for Mobile */}
                                {hasMoreJobs && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={loadMoreJobs}
                                            className="w-full md:w-auto bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 px-8 text-white text-sm font-semibold font-montserrat text-center hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300"
                                        >
                                            Load More Jobs
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg font-poppins">
                                    {searchQuery || Object.values(filters).some(arr => arr.length > 0)
                                        ? 'No jobs match your filters. Try adjusting your search criteria.'
                                        : 'Currently no open positions for this role. Check back later!'}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}