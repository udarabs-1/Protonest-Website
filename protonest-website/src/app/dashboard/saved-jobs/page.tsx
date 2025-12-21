"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import { MoreVertical, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    postedDate?: string;
    applicationDeadline?: string;
    experience?: string;
    category?: string;
    overview?: string;
    matchPercentage?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    is_active?: boolean;
}

interface SavedJob {
    _id: string;
    user_id: string;
    job_id: string;
    created_at: string;
    job_details: Job;
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

const JobCard = ({ job, onRemove }: { job: SavedJob, onRemove: (jobId: string) => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const roleSlug = categoryToSlugMap[job.job_details.category || ''] || 'other-roles';

    return (
        <div className="group relative w-full h-[350px] bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">

            <div className="absolute left-3 top-6 z-10" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>


                {isMenuOpen && (
                    <div className="absolute left-2 mt-2 w-50 h-10 bg-white rounded-xl hover:bg-gray-100 shadow-lg z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove(job.job_id);
                                setIsMenuOpen(false);
                            }}
                            className="w-full h-full px-4 text-sm text-[#6C6C6C] text-left flex items-center"
                        >
                            Remove from saved
                        </button>
                    </div>
                )}
            </div>


            <div className="w-full h-[43px] mt-8">
                <div className="w-full h-full text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] group-hover:font-medium text-base font-normal font-['Poppins'] leading-[35px] line-clamp-1 transition-none">
                    {job.job_details.title}
                </div>
            </div>


            <div className="w-full h-[35px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                {job.job_details.type} - Saved {formatTimeAgo(job.created_at)}
            </div>


            <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px] capitalize">
                        {job.job_details.experience || 'Not specified'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Experience Level
                    </div>
                </div>


                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {job.job_details.location}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Location
                    </div>
                </div>


                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {job.job_details.applicationDeadline ? formatDate(job.job_details.applicationDeadline) : 'Not specified'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Application Deadline
                    </div>
                </div>


                <div className="flex flex-col">
                    <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {job.job_details.matchPercentage ? `${job.job_details.matchPercentage}% Match` : 'N/A'}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Match Score
                    </div>
                </div>
            </div>


            <Link
                href={`/jobs/${roleSlug}/${job.job_id}`}
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
                href={`/jobs/${roleSlug}/${job.job_id}`}
                className="absolute bottom-6 left-6 right-6 bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300"
            >
                View Details
            </Link>
        </div>
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

const SavedJobs = () => {
    const router = useRouter();
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
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

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Saved Jobs', href: '/dashboard/saved-jobs', active: true }
    ];

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
            // Silently handle errors to prevent console messages during logout
        }
    };



    useEffect(() => {
        const fetchSavedJobs = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const allSavedJobs = data.data || [];
                    const activeSavedJobs = allSavedJobs.filter((job: SavedJob) => job.job_details.is_active !== false);
                    setSavedJobs(activeSavedJobs);
                    setFilteredJobs(activeSavedJobs);
                } else if (response.status === 401) {
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                }
            } catch {
                // Silently handle errors to prevent console messages during logout
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
        fetchUserProfile();
    }, []);

    useEffect(() => {
        let filtered = savedJobs;

        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.job_details.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_details.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_details.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_details.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_details.matchedSkills?.some(skill =>
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        if (activeFilters.length > 0) {
            filtered = filtered.filter(job => {
                return activeFilters.some(filter => {
                    if (filter === 'Remote') {
                        return job.job_details.location.toLowerCase().includes('remote');
                    }
                    if (filter === 'Beginner' || filter === 'Entry') {
                        return job.job_details.experience?.toLowerCase().includes('entry') ||
                            job.job_details.experience?.toLowerCase().includes('beginner') ||
                            job.job_details.experience?.toLowerCase().includes('junior');
                    }
                    if (filter === 'Intermediate') {
                        return job.job_details.experience?.toLowerCase().includes('intermediate') ||
                            job.job_details.experience?.toLowerCase().includes('mid');
                    }
                    if (filter === 'Senior') {
                        return job.job_details.experience?.toLowerCase().includes('senior') ||
                            job.job_details.experience?.toLowerCase().includes('lead');
                    }
                    return false;
                });
            });
        }

        setFilteredJobs(filtered);
    }, [searchQuery, activeFilters, savedJobs]);



    const removeSavedJob = async (jobId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            if (response.ok) {

                setSavedJobs(prev => prev.filter(job => job.job_id !== jobId));
                setFilteredJobs(prev => prev.filter(job => job.job_id !== jobId));
            } else {
                console.error('Failed to remove saved job');
            }
        } catch {
            console.error('Error removing saved job');
        }
    };

    const removeFilter = (filterToRemove: string) => {
        setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));
    };

    const JOBS_PER_PAGE = 8;
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilters]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            <div className="sticky top-0 z-10 bg-white pb-1 pt-1">
                <div className="flex-shrink-0 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col justify-start items-start gap-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:diskette-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                    Saved Jobs
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                These are the jobs you've bookmarked to apply later. Be sure to check their deadlines and match potential.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 mb-4">
                    <div className="relative w-full bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search for the job"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {activeFilters.length > 0 && (
                    <div className="flex-shrink-0 mb-2">
                        <div className="flex flex-wrap gap-3">
                            {activeFilters.map((filter, index) => (
                                <button
                                    key={index}
                                    onClick={() => removeFilter(filter)}
                                    className="px-4 py-2 rounded-full gradient-button text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-none"
                                >
                                    {filter}
                                    <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-shrink-0">
                    <p className="text-sm text-gray-600 font-poppins">
                        Showing {jobsToShow.length} of {filteredJobs.length} jobs
                    </p>
                </div>
            </div>

            <div className="pb-8">
                {jobsToShow.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {jobsToShow.map((job) => (
                                <JobCard key={job._id} job={job} onRemove={removeSavedJob} />
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
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-600 text-lg font-poppins mb-4">
                            {searchQuery ?
                                `No saved jobs found matching "${searchQuery}"` :
                                'No saved jobs yet'
                            }
                        </div>
                        <p className="text-gray-500 text-sm">
                            {!searchQuery && savedJobs.length === 0 &&
                                'Save jobs to view them here later.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SavedJobs;