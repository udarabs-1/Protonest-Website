"use client";

import {
    ChevronRight,
    LogOut,
    Menu,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected' | 'hired';

interface Application {
    _id: string;
    user_id: {
        _id: string;
        name: string;
        email: string;
    };
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
    category: string;
    publication_status: 'draft' | 'published' | 'scheduled';
    assignment_status: 'open' | 'closed' | 'hired';
    location: string;
    type: string;
    experience: string;
    deadline: string;
    created_at: string;
    status: string;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    cv?: {
        uploaded_at: string;
        work_function: string;
    };
    job_updates: boolean;
    newsletter: boolean;
    created_at: string;
}

interface DashboardStats {
    totalApplicants: number;
    activeRoles: number;
    avgTimeToHire: number;
    cvsInTalentPool: number;
    totalSubscribers: number;
}

interface RecentSubmission {
    name: string;
    stage: string;
    expertise: string;
    date: string;
    _id: string;
}

interface NDAStatusItem {
    name: string;
    role: string;
    status: string;
    date: string;
    _id: string;
    job_id: string;
    category?: string;
}

interface Candidate {
    id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    job: {
        _id: string;
        title: string;
        category?: string;
    };
    status: string;
    nda_status?: {
        status: 'not_sent' | 'sent' | 'submitted';
        sent_on?: string;
        submitted_on?: string;
        compliance_notes?: string;
        resend_count: number;
        created_at: string;
        updated_at: string;
    };
    added_at: string;
    updated_at: string;
    added_by: string;
}

// Add category to slug mapping
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

const AdminDashboard = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalApplicants: 0,
        activeRoles: 0,
        avgTimeToHire: 0,
        cvsInTalentPool: 0,
        totalSubscribers: 0
    });
    const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
    const [ndaStatus, setNdaStatus] = useState<NDAStatusItem[]>([]);
    const [jobAlerts, setJobAlerts] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Authentication check and data fetching in the same useEffect
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            router.push('/admin-signin');
            return;
        }

        const getDisplayStatus = (status: string) => {
            const statusMap: { [key: string]: string } = {
                'pending': 'Applied',
                'applied': 'Applied',
                'rejected': 'Rejected',
                'reviewed': 'Shortlisted',
                'rejected-interview': 'Rejected',
                'interviewed': 'Interviewed',
                'shortlisted': 'NDA Sent',
                'hired': 'Project Started'
            };
            return statusMap[status] || status;
        };

        const getNDAStatusDisplay = (candidate: Candidate) => {
            if (!candidate.nda_status) {
                if (candidate.status === 'shortlisted' || candidate.status === 'hired') {
                    return '❌ Not Sent';
                }
                return '❌ Not Required';
            }

            switch (candidate.nda_status.status) {
                case 'sent':
                    return '⏳ Pending';
                case 'submitted':
                    return '✅ Signed';
                default:
                    return '❌ Not Sent';
            }
        };

        const getNDADate = (candidate: Candidate) => {
            if (candidate.nda_status?.submitted_on) {
                return formatDate(candidate.nda_status.submitted_on);
            }
            if (candidate.nda_status?.sent_on) {
                return formatDate(candidate.nda_status.sent_on);
            }
            return '-';
        };

        const formatRelativeDate = (dateString: string) => {
            try {
                const date = new Date(dateString);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) return '1 day ago';
                if (diffDays < 7) return `${diffDays} days ago`;
                if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
                return formatDate(dateString);
            } catch {
                return 'Recently';
            }
        };

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    throw new Error('No authentication token found');
                }

                // Fetch applications using the correct endpoint
                const applicationsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/all`,
                    {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    }
                );

                // Fetch jobs using the correct endpoint
                const jobsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs`,
                    {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    }
                );

                // Fetch users using the correct endpoint
                const usersRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users`,
                    {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    }
                );

                // Fetch NDA logs using the correct endpoint
                const ndaRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/nda/all`,
                    {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    }
                );

                // Process applications data
                let applications: Application[] = [];
                if (applicationsRes.ok) {
                    const applicationsData = await applicationsRes.json();
                    console.log('Applications API Response:', applicationsData); // Debug log

                    // Handle the specific response structure from your backend
                    if (applicationsData.status === 'success' && applicationsData.data?.applications) {
                        applications = Array.isArray(applicationsData.data.applications)
                            ? applicationsData.data.applications
                            : [];
                    } else if (Array.isArray(applicationsData.data)) {
                        applications = applicationsData.data;
                    } else if (Array.isArray(applicationsData)) {
                        applications = applicationsData;
                    } else {
                        console.log('Unexpected applications response structure:', applicationsData);
                        applications = [];
                    }

                    console.log('Parsed applications:', applications.length); // Debug log
                }

                // Process jobs data
                let jobs: Job[] = [];
                if (jobsRes.ok) {
                    const jobsData = await jobsRes.json();
                    if (jobsData.status === 'success' && Array.isArray(jobsData.data)) {
                        jobs = jobsData.data;
                    } else if (Array.isArray(jobsData)) {
                        jobs = jobsData;
                    } else {
                        console.log('Unexpected jobs response structure:', jobsData);
                        jobs = [];
                    }
                }

                // Process users data
                let users: User[] = [];
                if (usersRes.ok) {
                    const usersData = await usersRes.json();
                    if (Array.isArray(usersData.users)) {
                        users = usersData.users;
                    } else if (Array.isArray(usersData.data)) {
                        users = usersData.data;
                    } else if (Array.isArray(usersData)) {
                        users = usersData;
                    } else {
                        console.log('Unexpected users response structure:', usersData);
                        users = [];
                    }
                }

                // Process NDA data
                let candidates: Candidate[] = [];
                if (ndaRes.ok) {
                    const ndaData = await ndaRes.json();
                    if (ndaData.status === 'success') {
                        if (Array.isArray(ndaData.data?.nda_logs)) {
                            candidates = ndaData.data.nda_logs;
                        } else if (Array.isArray(ndaData.data)) {
                            candidates = ndaData.data;
                        }
                    }
                    if (!Array.isArray(candidates)) {
                        console.log('Unexpected NDA response structure:', ndaData);
                        candidates = [];
                    }
                }

                // Calculate stats
                // Get current month's applications
                const now = new Date();
                const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const totalApplicants = applications.filter(app => {
                    const appliedDate = new Date(app.applied_at);
                    return appliedDate >= currentMonthStart;
                }).length;

                // Count active/open jobs
                const activeRoles = jobs.filter(job =>
                    job.publication_status === 'published' &&
                    (job.assignment_status === 'open' || job.status === 'open')
                ).length;

                const cvsInTalentPool = users.filter(user => user.cv).length;

                // Calculate total subscribers (job_updates OR newsletter)
                const totalSubscribers = users.filter(user => user.job_updates || user.newsletter).length;

                // Calculate average time to hire
                const hiredApplications = applications.filter(app => app.status === 'hired');
                let avgTimeToHire = 11;
                if (hiredApplications.length > 0) {
                    const totalTime = hiredApplications.reduce((sum, app) => {
                        const appliedDate = new Date(app.applied_at);
                        const hiredDate = new Date(app.updated_at);
                        const timeDiff = Math.abs(hiredDate.getTime() - appliedDate.getTime());
                        return sum + Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    }, 0);
                    avgTimeToHire = Math.round(totalTime / hiredApplications.length);
                }

                setStats({
                    totalApplicants,
                    activeRoles,
                    avgTimeToHire,
                    cvsInTalentPool,
                    totalSubscribers
                });

                // Get recent submissions
                const sortedApplications = [...applications]
                    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
                    .slice(0, 5);

                const recentData: RecentSubmission[] = sortedApplications.map(app => ({
                    name: app.user_id?.name || 'Unknown',
                    stage: getDisplayStatus(app.status),
                    expertise: app.job_id?.category || 'General',
                    date: formatRelativeDate(app.applied_at),
                    _id: app._id
                }));

                setRecentSubmissions(recentData);

                // Get NDA status data
                const ndaCandidates = candidates
                    .filter(candidate =>
                        candidate.nda_status ||
                        candidate.status === 'shortlisted' ||
                        candidate.status === 'hired'
                    )
                    .slice(0, 3);

                const ndaData: NDAStatusItem[] = ndaCandidates.map(candidate => ({
                    name: candidate.user?.name || 'Unknown',
                    role: candidate.job?.title || 'Unknown Role',
                    status: getNDAStatusDisplay(candidate),
                    date: getNDADate(candidate),
                    _id: candidate.id,
                    job_id: candidate.job?._id || '',
                    category: candidate.job?.category
                }));

                setNdaStatus(ndaData);

                // Get job alert subscriptions
                const subscribers = users.filter(user => user.job_updates).slice(0, 3);
                setJobAlerts(subscribers);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

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

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const reloadDashboard = () => {
        window.location.reload();
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const statsCards = [
        {
            title: 'Total Applicants',
            value: stats.totalApplicants.toString(),
            subtitle: 'this month',
            path: '/admin-dashboard/candidates'
        },
        {
            title: 'Active Roles Posted',
            value: stats.activeRoles.toString(),
            subtitle: 'open roles',
            path: '/admin-dashboard/jobs'
        },
        {
            title: 'CVs in Talent Pool',
            value: stats.cvsInTalentPool.toString(),
            subtitle: 'profiles',
            path: '/admin-dashboard/talent-pool'
        },
        {
            title: 'Total Subscribers',
            value: stats.totalSubscribers.toString(),
            subtitle: 'active',
            path: '/admin-dashboard/subscriptions'
        }
    ];

    const quickActions = [
        { icon: '🔍', label: 'Review New Candidates', path: '/admin-dashboard/candidates' },
        { icon: '📝', label: 'Post a New Job', path: '/admin-dashboard/jobs/create' },
        { icon: '📨', label: 'Manage Subscriptions', path: '/admin-dashboard/subscriptions' },
        { icon: '👥', label: 'View Talent Pool', path: '/admin-dashboard/talent-pool' }
    ];

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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

                            {/* Header Actions - Only Settings Button */}
                            <div className="flex items-center">
                                <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
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
                                    <button
                                        onClick={() => setShowLogoutDialog(true)}
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5 mr-4" />
                                        <span className="font-normal">Logout</span>
                                    </button>
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

                                <div className="p-4 pt-8">
                                    <button
                                        onClick={() => setShowLogoutDialog(true)}
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5 mr-4" />
                                        <span className="font-normal">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
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
                                    <span className="text-[#5C4EC9]">Dashboard</span>
                                </nav>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                    <button
                                        onClick={reloadDashboard}
                                        className="mt-2 text-red-600 text-sm underline hover:no-underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            <div className="font-montserrat mb-8">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-2">
                                    Welcome
                                </h1>
                            </div>

                            <div className="mb-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                                                <p className="text-3xl font-light text-gray-600 mb-1">{card.value}</p>
                                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-[#6c6c6c] text-lg lg:text-base xl:text-lg font-medium font-poppins leading-[23px] tracking-wide">
                                        Recent Applications
                                    </h2>
                                    <Link
                                        href="/admin-dashboard/candidates"
                                        className="flex items-center text-sm text-gray-600 hover:text-purple-600"
                                    >
                                        View all
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] lg:min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 bg-Neutral-200 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Name
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 bg-Neutral-200 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Stage
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 bg-Neutral-200 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Expertise
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 bg-Neutral-200 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Applied
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentSubmissions.length > 0 ? recentSubmissions.map((submission, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 bg-Surface-Default text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {submission.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 bg-Surface-Default text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {submission.stage}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 bg-Surface-Default text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {submission.expertise}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 bg-Surface-Default text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {submission.date}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            No recent applications
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-700 mb-4">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            href={action.path}
                                            className="bg-white rounded-lg shadow-md p-2 flex flex-col justify-center items-center text-center hover:shadow-lg transition-shadow h-36"
                                        >
                                            <div className="mb-4 flex items-center justify-center">
                                                <span className="w-12 h-12 text-4xl flex items-center justify-center">
                                                    {action.icon}
                                                </span>
                                            </div>
                                            <h3 className="text-[15px] text-gray-600">{action.label}</h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        NDA & Compliance Status
                                    </h2>
                                    <Link href="/admin-dashboard/nda" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        View full NDA log
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] lg:min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Name
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Role Applied
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            NDA Status
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Date
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Actions
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ndaStatus.length > 0 ? ndaStatus.map((nda, index) => {
                                                    const roleSlug = categoryToSlugMap[nda.category || ''] || 'other-roles';

                                                    return (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-left">
                                                                <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                    {nda.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left">
                                                                <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                    {nda.role}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left">
                                                                <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                    {nda.status}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left">
                                                                <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                    {nda.date}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left">
                                                                <Link
                                                                    href={`/jobs/${roleSlug}/${nda.job_id}`}
                                                                    className="px-[9px] py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[15px] text-white text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center"
                                                                >
                                                                    {nda.status === '✅ Signed' ? 'View Job' :
                                                                        nda.status === '❌ Not Sent' ? 'View Job' :
                                                                            nda.status === '❌ Not Required' ? 'View Job' : 'View Job'}
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                }) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            No NDA records found
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
                                        Job Alert Subscriptions
                                    </h2>
                                    <Link href="/admin-dashboard/subscriptions" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        Manage all subscriptions
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] lg:min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Name
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Email
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Newsletter
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Job Updates
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Subscribed On
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Status
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobAlerts.length > 0 ? jobAlerts.map((alert, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {`${alert.first_name} ${alert.last_name}`}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.newsletter ? '✅ Yes' : '❌ No'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.job_updates ? '✅ Yes' : '❌ No'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {formatDate(alert.created_at)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className={`px-[9px] py-2 rounded-[15px] text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center ${alert.job_updates || alert.newsletter
                                                                ? 'bg-[#bcff9b] text-[#6c6c6c]'
                                                                : 'bg-[#ff8686] text-white'
                                                                }`}>
                                                                {alert.job_updates || alert.newsletter ? 'Active' : 'Inactive'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            No active subscriptions found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;