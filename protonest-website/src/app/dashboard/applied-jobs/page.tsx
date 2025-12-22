"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AppliedJob {
    _id: string;
    applied_at: string;
    job_id: {
        _id: string;
        title: string;
    };
    status: 'pending' | 'rejected' | 'shortlisted' | 'interviewed' | 'hired';
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
    jobDetails: JobDetails;
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

const AppliedJobCard = ({ job }: { job: EnrichedAppliedJob }) => {


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

    const roleSlug = categoryToSlugMap[job.jobDetails?.category || ''] || 'other-roles';

    return (
        <Link
            key={job.applied_at}
            href={`/jobs/${roleSlug}/${job.job_id._id}`}
            className="group relative w-full h-[350px] bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6 block cursor-pointer"
        >
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
                    <div className="h-5 text-xs font-medium font-['Poppins'] leading-[35px] text-gray-600">
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </div>
                    <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Status
                    </div>
                </div>
            </div>

            <div
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
            </div>

            <div
                className="absolute bottom-6 left-6 right-6 bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300"
            >
                View Details
            </div>
        </Link>
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
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'shortlisted', label: 'Shortlisted' },
        { key: 'rejected', label: 'Rejected' },
        { key: 'interviewed', label: 'Interviewed' },
        { key: 'hired', label: 'Hired' }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-[57px] flex items-center gap-2 whitespace-nowrap transition-all ${activeFilter === filter.key
                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

const AppliedJobs = () => {
    const router = useRouter();
    const [appliedJobs, setAppliedJobs] = useState<EnrichedAppliedJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<EnrichedAppliedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
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
        { label: 'Applied Jobs' }
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
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }
        fetchAppliedJobs();
        fetchUserProfile();
    }, []);

    const fetchAppliedJobs = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            let response;
            let applicationsData;

            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);

                applicationsData = await response.json();
            } catch {
                console.log('Primary endpoint failed, trying fallback...');

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
                    throw new Error('Failed to fetch applications from all endpoints');
                }
            }

            const jobs: AppliedJob[] = applicationsData.data || applicationsData.applications || applicationsData || [];

            if (jobs.length === 0) {
                setAppliedJobs([]);
                setFilteredJobs([]);
                setLoading(false);
                return;
            }

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
                    return {
                        ...job,
                        jobDetails: {
                            id: job.job_id._id,
                            title: job.job_id.title,
                            location: 'Not available',
                            type: 'Not available',
                            description: 'This job is no longer available',
                            experience: 'Not specified',
                            deadline: 'Not specified',
                            category: 'Other'
                        }
                    };
                })
            );

            setAppliedJobs(enrichedJobs as EnrichedAppliedJob[]);
            setFilteredJobs(enrichedJobs as EnrichedAppliedJob[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch applied jobs');
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
        setCurrentPage(1);
    }, [searchQuery, activeFilter, appliedJobs]);



    const JOBS_PER_PAGE = 8;
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);

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
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            <div className="sticky top-0 z-10 bg-white pb-1 pt-1">
                <div className="flex-shrink-0 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                                Here's a list of jobs you've applied to, with real-time status updates for each application.
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
                            className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                <div className="flex-shrink-0 mb-2">
                    <StatusFilter
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                </div>

                <div className="flex-shrink-0">
                    <p className="text-sm text-gray-600 font-poppins">
                        Showing {jobsToShow.length} of {filteredJobs.length} jobs
                    </p>
                </div>
            </div>

            <div className="pb-8">
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

                {jobsToShow.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {jobsToShow.map((job) => (
                                <AppliedJobCard key={job._id} job={job} />
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
                        <p className="text-gray-500">
                            No applied jobs found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AppliedJobs;