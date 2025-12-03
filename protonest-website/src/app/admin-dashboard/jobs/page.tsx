"use client";

import { Icon } from '@iconify/react';
import {
    Bell,
    ChevronRight,
    Edit,
    Eye,
    Menu,
    Search,
    Send,
    Settings,
    SlidersHorizontal,
    Trash2,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Job {
    id: string;
    title: string;
    category: string;
    publication_status: 'draft' | 'published' | 'scheduled';
    assignment_status: 'open' | 'closed' | 'hired';
    location: string;
    type: 'full-time' | 'project-based' | 'hourly' | 'internship';
    experience: 'beginner' | 'intermediate' | 'experienced';
    description: string;
    responsibilities: string[];
    requirements: string[];
    required_skills: string[];
    deadline: string;
    schedule_at?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    posted: string;
    hired_candidate_id?: string;
    status: string;
}

interface ApiResponse {
    status: string;
    message: string;
    data: {
        jobs: Job[];
        total: number;
        summary: {
            by_publication_status: {
                draft: number;
                published: number;
                scheduled: number;
            };
            by_assignment_status: {
                open: number;
                closed: number;
                hired: number;
            };
        };
    };
    timestamp: string;
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

const JobPostings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [jobPostings, setJobPostings] = useState<Job[]>([]);
    const [filteredJobPostings, setFilteredJobPostings] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applicationCounts, setApplicationCounts] = useState<{ [key: string]: number }>({});
    const [loadingCounts, setLoadingCounts] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin-signin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const sidebarItems = [
        { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: 'solar:user-bold-duotone', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: 'solar:document-bold-duotone', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: 'mingcute:refresh-3-line', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: 'solar:pen-new-square-bold-duotone', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: 'solar:bell-bold-duotone', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: 'solar:document-add-bold-duotone', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: 'solar:magnifer-bold-duotone', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: 'solar:users-group-two-rounded-bold-duotone', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: 'solar:dialog-2-bold-duotone', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: 'solar:settings-bold-duotone', label: 'Settings', path: '/admin-dashboard/settings' },
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

    const fetchApplicationCounts = useCallback(async (jobs: Job[]) => {
        const token = localStorage.getItem('adminToken');
        if (!token || !jobs || jobs.length === 0) return;

        setLoadingCounts(true);
        const counts: { [key: string]: number } = {};

        await Promise.all(
            jobs.map(async (job) => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${job.id}/applicants/count`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        counts[job.id] = data.data?.total_candidates || 0;
                    } else {
                        counts[job.id] = 0;
                    }
                } catch (error) {
                    console.error(`Error fetching count for job ${job.id}:`, error);
                    counts[job.id] = 0;
                }
            })
        );

        setApplicationCounts(counts);
        setLoadingCounts(false);
    }, []);

    const fetchJobPostings = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin authentication required');
            }

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/all`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin-signin');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse = await response.json();
            console.log('API Response:', result);

            if (result.status === 'success') {
                const jobs = result.data?.jobs || [];
                console.log('Extracted jobs:', jobs);
                setJobPostings(jobs);

                if (jobs.length > 0) {
                    await fetchApplicationCounts(jobs);
                }
            } else {
                setError(result.message || 'Failed to fetch job postings');
            }
        } catch (err: unknown) {
            console.error('Error fetching job postings:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job postings';
            setError(errorMessage);
            setJobPostings([]);
        } finally {
            setLoading(false);
        }
    }, [fetchApplicationCounts, router]);

    const applyFilters = useCallback(() => {
        const jobsArray = Array.isArray(jobPostings) ? jobPostings : [];
        let filtered = [...jobsArray];

        if (activeFilter !== 'all') {
            filtered = filtered.filter(job => job.publication_status === activeFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.category.toLowerCase().includes(query)
            );
        }

        setFilteredJobPostings(filtered);
    }, [activeFilter, searchQuery, jobPostings]);

    useEffect(() => {
        fetchJobPostings();
    }, [fetchJobPostings]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleDelete = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin authentication required');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Job posting deleted successfully!');
            fetchJobPostings();
        } catch (err: unknown) {
            console.error('Error deleting job:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete job posting';
            alert('Failed to delete job posting: ' + errorMessage);
        }
    };

    const handleTriggerJobSuggestions = async () => {
        setShowTriggerDialog(false);
        setTriggerLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin authentication required');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/trigger-job-suggestions`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Trigger response:', result);

            setShowSuccessDialog(true);
        } catch (err: unknown) {
            console.error('Error triggering job suggestions:', err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to trigger job suggestions';
            setErrorMessage(errorMsg);
            setShowErrorDialog(true);
        } finally {
            setTriggerLoading(false);
        }
    };

    const getStatusIcon = (status: Job['publication_status']) => {
        switch (status) {
            case 'published':
                return '✅';
            case 'draft':
                return '⌛';
            case 'scheduled':
                return '📅';
            default:
                return '❓';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const statusFilters = [
        { label: 'All', value: 'all', icon: '📎' },
        { label: 'Published', value: 'published', icon: '✅' },
        { label: 'Draft', value: 'draft', icon: '⌛' },
        { label: 'Scheduled', value: 'scheduled', icon: '📅' }
    ];

    return (
        <div className="font-poppins min-h-screen bg-white relative">
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

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            {triggerLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5530FA] mx-auto"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Sending Job Suggestions...
                        </h3>
                        <p className="text-gray-600 text-sm">
                            This may take a few moments. Please wait while we process job suggestions for talent pool users.
                        </p>
                    </div>
                </div>
            )}

            {showTriggerDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowTriggerDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full">
                                <Bell className="w-6 h-6 text-[#5530FA]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Send Job Suggestions Now?
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            This will immediately send personalized job recommendations to all talent pool users with matching jobs created in the last 24 hours. Are you sure you want to proceed?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowTriggerDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTriggerJobSuggestions}
                                className="px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowSuccessDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Job Suggestions Triggered Successfully!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Job suggestion emails are being processed in the background. Talent pool users with matching jobs will receive personalized recommendations shortly.
                            </p>
                            <button
                                onClick={() => setShowSuccessDialog(false)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showErrorDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowErrorDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <X className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Failed to Send Job Suggestions
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {errorMessage || 'An error occurred while triggering job suggestions. Please try again later.'}
                            </p>
                            <button
                                onClick={() => setShowErrorDialog(false)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                            <div className="pt-8">
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
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Job Postings</span>
                            </nav>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                        <Icon
                                            icon="solar:document-bold-duotone"
                                            className="w-7 h-7"
                                        />
                                    </div>
                                    <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                        Job Postings
                                    </h1>
                                </div>
                                <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                    View, create, and manage all open freelance roles at Protonest. You can edit, publish or delete postings at any time.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setShowTriggerDialog(true)}
                                    disabled={triggerLoading}
                                    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Send job suggestions to talent pool users"
                                >
                                    <Bell className="w-5 h-5" />
                                    Send Job Suggestions
                                </button>

                                <Link
                                    href="/admin-dashboard/jobs/create"
                                    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow inline-block text-center"
                                >
                                    + Create New Job
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Search by job title or category"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {statusFilters.map((filter, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveFilter(filter.value)}
                                    className={`h-[34px] px-4 rounded-[57px] outline-1 outline-offset-[-1px] outline-[#5530FA] flex items-center transition-colors ${activeFilter === filter.value
                                        ? 'bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white'
                                        : 'text-[#676767] bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-xs md:text-[11px] font-medium flex items-center gap-1">
                                        {filter.icon} {filter.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                                <div className="text-gray-500">Loading job postings...</div>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-Neutral-200">
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Job Title
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Applications
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Published On
                                            </th>
                                            <th className="px-4 py-3 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredJobPostings.length > 0 ? (
                                            filteredJobPostings.map((job) => {
                                                const roleSlug = categoryToSlugMap[job.category] || 'other-roles';

                                                return (
                                                    <tr key={job.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-[11px] font-medium font-poppins text-[#676767]">
                                                            <div className="max-w-[200px] truncate" title={job.title}>
                                                                {job.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                            {job.category}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                            <span className="flex items-center gap-1 capitalize">
                                                                {getStatusIcon(job.publication_status)} {job.publication_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                            {loadingCounts ? (
                                                                <span className="text-gray-400">...</span>
                                                            ) : (
                                                                <span className="text-[#676767]">
                                                                    {applicationCounts[job.id] || 0}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                            {job.publication_status === 'published' ? formatDate(job.created_at) : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Link
                                                                    href={`/jobs/${roleSlug}/${job.id}`}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="View Job"
                                                                >
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </Link>
                                                                <Link
                                                                    href={`/admin-dashboard/jobs/edit/${job.id}`}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="Edit Job"
                                                                >
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(job.id)}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="Delete Job"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                                    {searchQuery
                                                        ? `No job postings found matching "${searchQuery}"`
                                                        : activeFilter !== 'all'
                                                            ? `No job postings found for "${activeFilter}" status`
                                                            : 'No job postings found. Create your first job posting!'
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default JobPostings;