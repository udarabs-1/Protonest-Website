"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
                href={`/dashboard/applied-jobs/${job.job_id._id}`}
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
                href={`/dashboard/applied-jobs/${job.job_id._id}`}
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<EnrichedAppliedJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<EnrichedAppliedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
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
        const fetchAppliedJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const jobs: AppliedJob[] = data.data || [];

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
                } else {
                    console.error('Failed to fetch applied jobs');
                }
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

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
                                <Link href="/dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>

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
                                    <span className="text-[#5C4EC9]">Applied Jobs</span>
                                </nav>
                            </div>

                            <div className="mb-8">
                                <div className="flex flex-col mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[25px]">🎯</span>
                                        <h2 className="text-2xl font-medium text-gray-700">Applied Jobs</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Here&apos;s a list of jobs you&apos;ve applied to, with real-time status updates for each application.
                                    </p>
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