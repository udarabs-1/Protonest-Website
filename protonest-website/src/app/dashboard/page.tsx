"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ApplicationStatus = 'pending' | 'rejected' | 'shortlisted' | 'interviewed' | 'hired';

interface Application {
    _id: string;
    user_id: string;
    job_id: {
        _id: string;
        title: string;
        category?: string;
    };
    status: ApplicationStatus;
    applied_at: string;
    updated_at: string;
}

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
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
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

interface SuggestedJob {
    category: string;
    job_id: string;
    job_title: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface PublicJobResponse {
    id: string;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[] | null;
    requirements: string[] | null;
    overview: string;
    status: string;
    created_by: string;
    created_at: string;
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

const Dashboard = () => {
    const router = useRouter();
    const [savedJobsCount, setSavedJobsCount] = useState(0);
    const [appliedJobsCount, setAppliedJobsCount] = useState(0);
    const [applications, setApplications] = useState<Application[]>([]);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                setLoading(true);

                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData.user);
                } else if (userResponse.status === 401) {
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                    return;
                }

                const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (savedResponse.ok) {
                    const savedData = await savedResponse.json();
                    setSavedJobsCount(savedData.data.count || 0);
                }

                const appliedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (appliedResponse.ok) {
                    const appliedData = await appliedResponse.json();
                    setAppliedJobsCount(appliedData.data.count || 0);
                }

                const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
                    const enrichedApplications = await Promise.all(
                        (applicationsData.data || []).map(async (app: Application) => {
                            try {
                                const jobResponse = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${app.job_id._id}`
                                );
                                if (jobResponse.ok) {
                                    const jobData = await jobResponse.json();
                                    return {
                                        ...app,
                                        job_id: {
                                            ...app.job_id,
                                            category: jobData.data.category
                                        }
                                    };
                                }
                            } catch {
                            }
                            return app;
                        })
                    );
                    setApplications(enrichedApplications);
                }

                const suggestedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/suggested-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (suggestedResponse.ok) {
                    const suggestedData = await suggestedResponse.json();
                    const suggestedJobsList: SuggestedJob[] = suggestedData.data.suggested_jobs || [];

                    const jobDetailsPromises = suggestedJobsList.map(async (suggestedJob: SuggestedJob) => {
                        try {
                            const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${suggestedJob.job_id}`);
                            if (jobResponse.ok) {
                                const jobData = await jobResponse.json();
                                const publicJob: PublicJobResponse = jobData.data;

                                return {
                                    id: publicJob.id,
                                    title: publicJob.title,
                                    location: publicJob.location,
                                    type: publicJob.type,
                                    description: publicJob.description,
                                    requirements: publicJob.requirements || [],
                                    postedDate: publicJob.created_at,
                                    applicationDeadline: publicJob.deadline,
                                    experience: publicJob.experience,
                                    category: publicJob.category
                                };
                            }
                        } catch {
                        }
                        return null;
                    });

                    const jobDetails = await Promise.all(jobDetailsPromises);
                    setSuggestedJobs(jobDetails.filter(job => job !== null) as Job[]);
                }
            } catch {
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        fetchUserProfile();
    }, [router]);

    const statsCards = [
        {
            title: 'Saved Jobs',
            value: savedJobsCount.toString(),
            subtitle: "You haven't applied yet",
            type: 'stat',
            path: '/dashboard/saved-jobs'
        },
        {
            title: 'Applied Jobs',
            value: appliedJobsCount.toString(),
            subtitle: 'Track your applications',
            type: 'stat',
            path: '/dashboard/applied-jobs'
        }
    ];

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Dashboard Overview' }
    ];

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col justify-start items-start gap-2.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                Welcome back, {user?.first_name || 'User'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                    Your Applications at a Glance
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsCards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.path}
                            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/cards.svg"
                                    alt="Background pattern"
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-sm text-gray-600 mb-2">{card.title}</h3>
                                {card.type === 'action' ? (
                                    <>
                                        <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] mb-1">{card.value}</p>
                                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-3xl font-light text-gray-600 mb-1">{card.value}</p>
                                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-700">
                        Recent Applications
                    </h2>
                    <Link href="/dashboard/applied-jobs" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                        View all applied jobs
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left">
                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                            Job Title
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                            Status
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                            Applied On
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                            Action
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length > 0 ? (
                                    applications.map((app, index) => {
                                        const roleSlug = categoryToSlugMap[app.job_id?.category || ''] || 'other-roles';

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-left">
                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                        {app.job_id?.title || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-left">
                                                    <div className="text-[11px] font-medium font-poppins leading-none text-gray-600">
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-left">
                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                        {new Date(app.applied_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={`/jobs/${roleSlug}/${app.job_id._id}`}
                                                        className="w-[198px] h-8 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[15px] text-white text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                            No applications found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-700">
                        Suggested Jobs
                    </h2>
                    <Link href="/dashboard/suggested-jobs" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                        View all
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="relative">
                    <div className="w-full overflow-x-auto pb-4">
                        {suggestedJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {suggestedJobs.map((job) => {
                                    const roleSlug = categoryToSlugMap[job.category || ''] || 'other-roles';

                                    return (
                                        <Link
                                            key={job.id}
                                            href={`/jobs/${roleSlug}/${job.id}`}
                                            className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex justify-between">
                                                <div className="w-3/4">
                                                    <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                                                        {job.location} ‐ Posted {job.postedDate ? formatTimeAgo(job.postedDate) : 'Recently'}
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
                                                        {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'N/A'}
                                                    </p>
                                                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
                                                        {job.experience || 'Not specified'}
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

                                            <div className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                                                View Details
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg font-poppins">
                                    No suggested jobs available. Upload your CV to get personalized job recommendations.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;