"use client";

import { Icon } from '@iconify/react';
import {
    ChevronRight,
    Menu,
    Search,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Updated interface to match CandidateManagement structure
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
    notes?: string;
    interview_date?: string;
    interview_notes?: string;
    rejection_reason?: string;
}

interface JobMatch {
    job_id: string;
    job_title: string;
    category: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface PipelineStage {
    stage: string;
    date: string;
    status: 'completed' | 'active' | 'pending';
    icon: string;
}

const ApplicationPipeline = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [jobMatches, setJobMatches] = useState<{ [userId: string]: JobMatch | null }>({});
    const [searchInput, setSearchInput] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Authentication check
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

    // Updated to use the same API endpoint as CandidateManagement
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                // Use the same endpoint as CandidateManagement page
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/nda/all`, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch candidates');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    const candidatesData = data.data?.nda_logs || data.data || [];
                    const candidatesList = Array.isArray(candidatesData) ? candidatesData : [];
                    setCandidates(candidatesList);

                    // Fetch job matches for each candidate using the same structure
                    const matchPromises = candidatesList.map(async (candidate: Candidate) => {
                        try {
                            const matchResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/job-matches/${candidate.user._id}`,
                                {
                                    headers: {
                                        'Authorization': `Bearer ${adminToken}`
                                    }
                                }
                            );

                            if (matchResponse.ok) {
                                const matchData = await matchResponse.json();
                                if (matchData.success && matchData.data.job_matches) {
                                    const jobMatch = matchData.data.job_matches.find(
                                        (match: JobMatch) => match.job_id === candidate.job._id
                                    );
                                    return { userId: candidate.user._id, match: jobMatch || null };
                                }
                            }
                            return { userId: candidate.user._id, match: null };
                        } catch (error) {
                            console.error(`Error fetching match for candidate ${candidate.user._id}:`, error);
                            return { userId: candidate.user._id, match: null };
                        }
                    });

                    const matchResults = await Promise.all(matchPromises);
                    const matchesMap = matchResults.reduce((acc, result) => {
                        acc[result.userId] = result.match;
                        return acc;
                    }, {} as { [userId: string]: JobMatch | null });

                    setJobMatches(matchesMap);
                } else {
                    throw new Error(data.message || 'Failed to fetch candidates');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An error occurred while fetching candidates');
                }
                console.error('Error fetching candidates:', err);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    // Close sidebar when clicking outside
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

    // Handle adding a filter
    const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const trimmedInput = searchInput.trim();
            if (!activeFilters.includes(trimmedInput)) {
                setActiveFilters([...activeFilters, trimmedInput]);
            }
            setSearchInput('');
        }
    };

    // Handle removing a filter
    const handleRemoveFilter = (filterToRemove: string) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

    // Updated to match CandidateManagement status mapping
    const getDisplayStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'applied': 'Applied',
            'admin_moved': 'Admin Moved',
            'shortlisted': 'Shortlisted',
            'interviewed': 'Interviewed',
            'hired': 'Hired',
            'rejected': 'Rejected'
        };
        return statusMap[status] || status;
    };

    // Updated NDA status to match CandidateManagement
    const getNDAStatus = (candidate: Candidate) => {
        if (!candidate.nda_status) {
            return { text: 'Not Sent', color: 'text-red-600', icon: '❌' };
        }

        switch (candidate.nda_status.status) {
            case 'sent':
                return { text: 'Sent', color: 'text-orange-600', icon: '🟠' };
            case 'submitted':
                return { text: 'Submitted', color: 'text-green-600', icon: '✅' };
            default:
                return { text: 'Not Sent', color: 'text-red-600', icon: '❌' };
        }
    };

    // Updated pipeline stages based on the new status structure
    const generatePipelineStages = (candidate: Candidate): PipelineStage[] => {
        const stages: PipelineStage[] = [];
        const appliedDate = new Date(candidate.added_at);
        const updatedDate = new Date(candidate.updated_at);

        // Always starts with CV Submitted
        stages.push({
            stage: 'CV Submitted',
            date: appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'completed',
            icon: '📄'
        });

        // Add stages based on status progression
        switch (candidate.status) {
            case 'applied':
                stages.push({
                    stage: 'Application Under Review',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '👀'
                });
                break;

            case 'admin_moved':
                stages.push({
                    stage: 'Application Reviewed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '👀'
                });
                break;

            case 'shortlisted':
                stages.push({
                    stage: 'Application Reviewed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '👀'
                });
                stages.push({
                    stage: 'Shortlisted',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '⭐'
                });
                break;

            case 'interviewed':
                stages.push({
                    stage: 'Application Reviewed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '👀'
                });
                stages.push({
                    stage: 'Shortlisted',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '⭐'
                });
                stages.push({
                    stage: 'Interview Completed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '💬'
                });

                // Add NDA stage for interviewed candidates
                if (candidate.nda_status) {
                    const ndaDate = candidate.nda_status.sent_on
                        ? new Date(candidate.nda_status.sent_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    stages.push({
                        stage: candidate.nda_status.status === 'submitted' ? 'NDA Completed' : 'NDA Sent',
                        date: ndaDate,
                        status: candidate.nda_status.status === 'submitted' ? 'completed' : 'active',
                        icon: candidate.nda_status.status === 'submitted' ? '✅' : '📝'
                    });
                } else {
                    stages.push({
                        stage: 'NDA Required',
                        date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        status: 'pending',
                        icon: '⚠️'
                    });
                }
                break;

            case 'hired':
                stages.push({
                    stage: 'Application Reviewed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '👀'
                });
                stages.push({
                    stage: 'Shortlisted',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '⭐'
                });
                stages.push({
                    stage: 'Interview Completed',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'completed',
                    icon: '💬'
                });

                // Add NDA stage for hired candidates
                if (candidate.nda_status) {
                    const ndaDate = candidate.nda_status.sent_on
                        ? new Date(candidate.nda_status.sent_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    stages.push({
                        stage: 'NDA Completed',
                        date: ndaDate,
                        status: 'completed',
                        icon: '✅'
                    });
                }

                stages.push({
                    stage: 'Project Started',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '🚀'
                });
                break;

            case 'rejected':
                stages.push({
                    stage: 'Application Rejected',
                    date: updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    icon: '❌'
                });
                break;
        }

        return stages;
    };

    // Updated filter to match the new data structure with null safety
    const filteredCandidates = candidates.filter(candidate => {
        if (!candidate) return false;

        // If no filters, show all candidates
        if (activeFilters.length === 0) return true;

        // Check if candidate matches ANY of the active filters
        return activeFilters.some(filter => {
            const lowerFilter = filter.toLowerCase();

            // Search in candidate name (with null check)
            if (candidate.user?.name && candidate.user.name.toLowerCase().includes(lowerFilter)) return true;

            // Search in job title (with null check)
            if (candidate.job?.title && candidate.job.title.toLowerCase().includes(lowerFilter)) return true;

            // Search in email (with null check)
            if (candidate.user?.email && candidate.user.email.toLowerCase().includes(lowerFilter)) return true;

            // Search in status
            const statusMap: { [key: string]: string } = {
                'applied': 'Applied',
                'admin_moved': 'Admin Moved',
                'shortlisted': 'Shortlisted',
                'interviewed': 'Interviewed',
                'hired': 'Hired',
                'rejected': 'Rejected'
            };
            const mappedStatus = statusMap[candidate.status]?.toLowerCase() || candidate.status?.toLowerCase();
            if (mappedStatus && mappedStatus.includes(lowerFilter)) return true;

            return false;
        });
    });

    const toggleCandidateExpansion = (candidateId: string) => {
        setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
    };

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application pipeline...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-[#5530FA] text-white rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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

            {/* SVG Gradient Definition - Darker colors */}
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

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Header */}
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
                                <span className="text-[#5C4EC9]">Application Pipeline</span>
                            </nav>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="mingcute:refresh-3-line"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                    Application Pipeline
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                                Track each candidate&apos;s journey through the application process. View their current stage and pipeline progress.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={handleAddFilter}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Type and press Enter to add filter (name, role, email, status...)"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFilters.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Current Filters:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activeFilters.map((filter, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full text-sm font-medium"
                                        >
                                            <span>{filter}</span>
                                            <button
                                                onClick={() => handleRemoveFilter(filter)}
                                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                                aria-label={`Remove filter: ${filter}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Application Pipeline Table */}
                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                            {/* Table Header */}
                            <div className="px-4 py-3 bg-gray-50 grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                <div className="col-span-12 md:col-span-2">Candidate Name</div>
                                <div className="col-span-12 md:col-span-2 hidden md:block">Role Applied For</div>
                                <div className="col-span-12 md:col-span-2 hidden md:block">Current Stage</div>
                                <div className="col-span-12 md:col-span-2 hidden md:block">NDA Status</div>
                                <div className="col-span-12 md:col-span-2 hidden md:block">Match Score</div>
                                <div className="col-span-12 md:col-span-2 hidden md:block">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {filteredCandidates.length > 0 ? (
                                    filteredCandidates.map((candidate) => {
                                        const jobMatch = jobMatches[candidate.user._id];
                                        const matchScore = jobMatch ? `${jobMatch.match_percentage.toFixed(0)}%` : 'N/A';
                                        const pipelineStages = generatePipelineStages(candidate);
                                        const ndaStatus = getNDAStatus(candidate);

                                        return (
                                            <div key={candidate.id} className="bg-white">
                                                {/* Main Row */}
                                                <div className="px-4 py-3 grid grid-cols-12 gap-4 hover:bg-gray-50 transition-colors">
                                                    {/* Mobile Layout */}
                                                    <div className="col-span-12 md:hidden">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-[11px] font-medium font-poppins text-[#676767] mb-1">
                                                                    {candidate.user?.name || 'N/A'}
                                                                </h3>
                                                                <p className="text-[10px] text-gray-500 mb-1">{candidate.job?.title || 'N/A'}</p>
                                                                <p className="text-[10px] text-gray-500">
                                                                    {getDisplayStatus(candidate.status)} • {matchScore}
                                                                </p>
                                                                <p className={`text-[10px] ${ndaStatus.color} flex items-center gap-1`}>
                                                                    <span>{ndaStatus.icon}</span>
                                                                    {ndaStatus.text}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => toggleCandidateExpansion(candidate.id)}
                                                                    className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins"
                                                                >
                                                                    {expandedCandidate === candidate.id ? 'Hide' : 'View'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Desktop Layout */}
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {candidate.user?.name || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {candidate.job?.title || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {getDisplayStatus(candidate.status)}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <span className={`text-[11px] font-medium font-poppins ${ndaStatus.color} flex items-center gap-1`}>
                                                            <span>{ndaStatus.icon}</span>
                                                            {ndaStatus.text}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {matchScore}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex md:items-center">
                                                        <button
                                                            onClick={() => toggleCandidateExpansion(candidate.id)}
                                                            className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins"
                                                        >
                                                            {expandedCandidate === candidate.id ? 'Hide' : 'View'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Timeline */}
                                                {expandedCandidate === candidate.id && (
                                                    <div className="px-4 py-6 bg-gray-50 border-t border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Application Pipeline Progress</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                            {pipelineStages.map((step, index) => (
                                                                <div key={index} className="text-center">
                                                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                                        step.status === 'active' ? 'bg-blue-100 text-blue-600' :
                                                                            'bg-gray-100 text-gray-400'
                                                                        }`}>
                                                                        <span className="text-sm">{step.icon}</span>
                                                                    </div>
                                                                    <div className="text-[11px] font-medium font-poppins text-[#676767] mb-1">
                                                                        {step.stage}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500">
                                                                        {step.date}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* NDA Status Details */}
                                                        {candidate.nda_status && (
                                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                                <h5 className="text-sm font-medium text-gray-900 mb-3">NDA Progress Details</h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <span className="text-xs text-gray-600">Status:</span>
                                                                        <div className={`text-sm font-medium ${ndaStatus.color} flex items-center gap-1`}>
                                                                            <span>{ndaStatus.icon}</span>
                                                                            {ndaStatus.text}
                                                                        </div>
                                                                    </div>
                                                                    {candidate.nda_status.sent_on && (
                                                                        <div>
                                                                            <span className="text-xs text-gray-600">Sent On:</span>
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {formatDate(candidate.nda_status.sent_on)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {candidate.nda_status.submitted_on && (
                                                                        <div>
                                                                            <span className="text-xs text-gray-600">Submitted On:</span>
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {formatDate(candidate.nda_status.submitted_on)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {candidate.nda_status.compliance_notes && (
                                                                    <div className="mt-3">
                                                                        <span className="text-xs text-gray-600">Compliance Notes:</span>
                                                                        <div className="text-sm text-gray-900 bg-gray-100 p-2 rounded mt-1">
                                                                            {candidate.nda_status.compliance_notes}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="mt-3">
                                                                    <span className="text-xs text-gray-600">Resend Count:</span>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {candidate.nda_status.resend_count || 0}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Match Details */}
                                                        {jobMatch && (
                                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                                <h5 className="text-sm font-medium text-gray-900 mb-3">Job Match Details</h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <span className="text-xs text-gray-600">Match Score:</span>
                                                                        <div className="text-lg font-bold text-[#5530FA]">{matchScore}</div>
                                                                    </div>
                                                                    {jobMatch.matched_skills && jobMatch.matched_skills.length > 0 && (
                                                                        <div>
                                                                            <span className="text-xs text-gray-600">Matched Skills:</span>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {jobMatch.matched_skills.slice(0, 4).map((skill, skillIndex) => (
                                                                                    <span key={skillIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                                                        {skill}
                                                                                    </span>
                                                                                ))}
                                                                                {jobMatch.matched_skills.length > 4 && (
                                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                                        +{jobMatch.matched_skills.length - 4} more
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {jobMatch.missing_skills && jobMatch.missing_skills.length > 0 && (
                                                                        <div className="col-span-1 md:col-span-2">
                                                                            <span className="text-xs text-gray-600">Missing Skills:</span>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {jobMatch.missing_skills.slice(0, 6).map((skill, skillIndex) => (
                                                                                    <span key={skillIndex} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                                                        {skill}
                                                                                    </span>
                                                                                ))}
                                                                                {jobMatch.missing_skills.length > 6 && (
                                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                                        +{jobMatch.missing_skills.length - 6} more
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Additional Candidate Info */}
                                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                                            <h5 className="text-sm font-medium text-gray-900 mb-3">Candidate Information</h5>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <span className="text-xs text-gray-600">Email:</span>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {candidate.user?.email || 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-600">Applied On:</span>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {formatDate(candidate.added_at)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-600">Last Updated:</span>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {formatDate(candidate.updated_at)}
                                                                    </div>
                                                                </div>
                                                                {candidate.notes && (
                                                                    <div className="col-span-1 md:col-span-2">
                                                                        <span className="text-xs text-gray-600">Notes:</span>
                                                                        <div className="text-sm text-gray-900 bg-gray-100 p-2 rounded mt-1">
                                                                            {candidate.notes}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                        {activeFilters.length > 0
                                            ? `No candidates found matching filters: ${activeFilters.join(', ')}`
                                            : 'No candidates in the pipeline yet.'
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPipeline;