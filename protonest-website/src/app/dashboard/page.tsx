"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected';

interface Application {
    _id: string;
    user_id: string;
    job_id: {
        _id: string;
        title: string;
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
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
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

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [savedJobsCount, setSavedJobsCount] = useState(0);
    const [appliedJobsCount, setAppliedJobsCount] = useState(0);
    const [applications, setApplications] = useState<Application[]>([]);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '💼', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData.user);
                }

                const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/count`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (savedResponse.ok) {
                    const savedData = await savedResponse.json();
                    setSavedJobsCount(savedData.data.count || 0);
                }

                const appliedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/count`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (appliedResponse.ok) {
                    const appliedData = await appliedResponse.json();
                    setAppliedJobsCount(appliedData.data.count || 0);
                }

                const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
                    setApplications(applicationsData.data || []);
                }

                const suggestedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/suggested-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
                                    applicationDeadline: publicJob.deadline
                                };
                            }
                        } catch (error) {
                            console.error('Error fetching job details:', error);
                        }
                        return null;
                    });

                    const jobDetails = await Promise.all(jobDetailsPromises);
                    setSuggestedJobs(jobDetails.filter(job => job !== null) as Job[]);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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

    const getStatusColor = (status: ApplicationStatus): string => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600';
            case 'shortlisted':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: ApplicationStatus): string => {
        switch (status) {
            case 'pending':
                return '🟡';
            case 'shortlisted':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '🟡';
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
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

                            <div className="flex items-center space-x-4">
                                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                </button>
                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                    <span className="text-[#5C4EC9]">Dashboard Overview</span>
                                </nav>
                            </div>

                            <div className="font-montserrat mb-8">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-2">
                                    Welcome back, {user?.first_name || 'User'}
                                </h1>
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
                                                    applications.map((app, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-left">
                                                                <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                    {app.job_id?.title || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left">
                                                                <div className={`text-[11px] font-medium font-poppins leading-none ${getStatusColor(app.status)}`}>
                                                                    {getStatusIcon(app.status)} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
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
                                                                    href={`/dashboard/applied-jobs/${app._id}`}
                                                                    className="w-[198px] h-8 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[15px] text-white text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
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
                                                {suggestedJobs.map((job) => (
                                                    <Link
                                                        key={job.id}
                                                        href={`/dashboard/suggested-jobs/${job.id}`}
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

                                                        <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                                                            View Details
                                                        </button>
                                                    </Link>
                                                ))}
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
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;