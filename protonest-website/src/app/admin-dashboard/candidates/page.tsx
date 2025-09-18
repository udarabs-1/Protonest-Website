"use client";

import {
    Award,
    Bell,
    Briefcase,
    Calendar,
    ChevronRight,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    Trash2,
    TrendingUp,
    Upload,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Candidate {
    _id: string;
    user_id: {
        _id: string;
        name: string;
        email: string;
    };
    job_id: {
        _id: string;
        title: string;
    };
    status: string;
    applied_at: string;
    updated_at: string;
}

interface ExpertiseArea {
    [category: string]: string[];
}

interface JobMatch {
    job_id: string;
    job_title: string;
    category: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface CandidateDetails {
    expertise_areas: ExpertiseArea;
    job_match: JobMatch | null;
    skills_summary: {
        total_skills: number;
        skills_list: string[];
        categories_count: number;
        job_matches_count: number;
        highest_match: number;
        average_match: number;
    };
    cv_file_url: string | null;
}

const CandidateManagement = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; name: string } | null>(null);
    const [statusDialog, setStatusDialog] = useState<{ candidate: Candidate; type: 'proceed' | 'interview' } | null>(null);
    const [interviewDialog, setInterviewDialog] = useState<Candidate | null>(null);
    const [ndaDialog, setNdaDialog] = useState<Candidate | null>(null);
    const [detailsDialog, setDetailsDialog] = useState<Candidate | null>(null);
    const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [selectedNda, setSelectedNda] = useState<'template' | 'upload'>('template');
    const [selectedTemplate, setSelectedTemplate] = useState('NDA_Template_General.pdf');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // Editable email states
    const [interviewSubject, setInterviewSubject] = useState('');
    const [interviewBody, setInterviewBody] = useState('');
    const [ndaSubject, setNdaSubject] = useState('');
    const [ndaBody, setNdaBody] = useState('');

    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Fetch candidates data
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch candidates');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    const candidatesData = data.data?.applications || data.data || [];
                    setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
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

    // Fetch candidate details
    const fetchCandidateDetails = async (candidate: Candidate) => {
        setDetailsLoading(true);
        setCandidateDetails(null);

        try {
            const adminToken = localStorage.getItem('adminToken');
            const userId = candidate.user_id._id;

            // Fetch expertise areas
            const expertiseResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/expertise-areas/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );

            // Fetch job matches
            const jobMatchesResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/job-matches/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );

            // Fetch skills summary
            const skillsSummaryResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/skills-summary/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );

            // Fetch CV file info
            const cvInfoResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );

            const expertiseData = await expertiseResponse.json();
            const jobMatchesData = await jobMatchesResponse.json();
            const skillsSummaryData = await skillsSummaryResponse.json();
            const cvInfoData = await cvInfoResponse.json();

            // Find match for the applied job
            let jobMatch = null;
            if (jobMatchesData.success && jobMatchesData.data.job_matches) {
                jobMatch = jobMatchesData.data.job_matches.find(
                    (match: JobMatch) => match.job_id === candidate.job_id._id
                );
            }

            // Extract CV file URL from user data
            let cvFileUrl = null;
            if (cvInfoData.success && cvInfoData.user && cvInfoData.user.cv && cvInfoData.user.cv.cv_file_url) {
                cvFileUrl = cvInfoData.user.cv.cv_file_url;
            }

            setCandidateDetails({
                expertise_areas: expertiseData.success ? expertiseData.data.expertise_areas : {},
                job_match: jobMatch,
                skills_summary: skillsSummaryData.success ? skillsSummaryData.data : {
                    total_skills: 0,
                    skills_list: [],
                    categories_count: 0,
                    job_matches_count: 0,
                    highest_match: 0,
                    average_match: 0
                },
                cv_file_url: cvFileUrl
            });
        } catch (error) {
            console.error('Error fetching candidate details:', error);
            setCandidateDetails({
                expertise_areas: {},
                job_match: null,
                skills_summary: {
                    total_skills: 0,
                    skills_list: [],
                    categories_count: 0,
                    job_matches_count: 0,
                    highest_match: 0,
                    average_match: 0
                },
                cv_file_url: null
            });
        } finally {
            setDetailsLoading(false);
        }
    };

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

    const statusFilters = [
        { label: 'All', active: activeFilter === 'All' },
        { label: 'Applied', active: activeFilter === 'Applied' },
        { label: 'Rejected Application', active: activeFilter === 'Rejected Application' },
        { label: 'Shortlisted Application', active: activeFilter === 'Shortlisted Application' },
        { label: 'Rejected Interview', active: activeFilter === 'Rejected Interview' },
        { label: 'Interviewed', active: activeFilter === 'Interviewed' },
        { label: 'Shortlisted Interview', active: activeFilter === 'Shortlisted Interview' },
        { label: 'Hired', active: activeFilter === 'Hired' }
    ];

    // Filter candidates based on active filter
    const filteredCandidates = Array.isArray(candidates)
        ? (activeFilter === 'All'
            ? candidates
            : candidates.filter(candidate => {
                if (!candidate || !candidate.status) return false;
                const statusMap: { [key: string]: string } = {
                    'pending': 'Applied',
                    'rejected': 'Rejected Application',
                    'reviewed': 'Shortlisted Application',
                    'rejected-interview': 'Rejected Interview',
                    'interviewed': 'Interviewed',
                    'shortlisted': 'Shortlisted Interview',
                    'hired': 'Hired'
                };
                const mappedStatus = statusMap[candidate.status] || candidate.status;
                return mappedStatus === activeFilter;
            }))
        : [];

    // Function to get status color based on status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-[#86dcff]';
            case 'rejected': return 'bg-[#ff8686]';
            case 'reviewed': return 'bg-[#e2ff86]';
            case 'rejected-interview': return 'bg-[#ff8686]';
            case 'interviewed': return 'bg-[#86dcff]';
            case 'shortlisted': return 'bg-[#e2ff86]';
            case 'hired': return 'bg-[#86ffae]';
            default: return 'bg-[#86dcff]';
        }
    };

    // Function to get display status text
    const getDisplayStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Applied',
            'rejected': 'Rejected Application',
            'reviewed': 'Shortlisted Application',
            'rejected-interview': 'Rejected Interview',
            'interviewed': 'Interviewed',
            'shortlisted': 'Shortlisted Interview',
            'hired': 'Hired'
        };
        return statusMap[status] || status;
    };

    // Function to format date
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

    // Function to get action text based on status
    const getActionText = (status: string) => {
        switch (status) {
            case 'pending': return 'Proceed';
            case 'rejected': return null;
            case 'reviewed': return 'Call For Interview';
            case 'rejected-interview': return null;
            case 'interviewed': return 'Proceed';
            case 'shortlisted': return 'Send NDA';
            case 'hired': return 'View NDA Log';
            default: return null;
        }
    };

    // Function to open email client
    const openEmailClient = (to: string, subject: string, body: string) => {
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const emailUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
        window.open(emailUrl);
    };

    // Set default email content when dialog opens
    const setInterviewDialogContent = (candidate: Candidate) => {
        const defaultSubject = `Interview invitation for ${candidate.job_id?.title || 'the position'}`;
        const defaultBody = `Dear ${candidate.user_id?.name || 'Candidate'},\n\nWe are pleased to inform you that your application for the ${candidate.job_id?.title || 'position'} role at Protonest has been successful, and we would like to invite you for an interview.\n\nPlease confirm your availability for the scheduled interview time. We look forward to discussing your qualifications and learning more about your experience.\n\nBest regards,\nProtonest Team`;

        setInterviewSubject(defaultSubject);
        setInterviewBody(defaultBody);
        setInterviewDialog(candidate);
    };

    // Set default NDA email content
    const setNdaDialogContent = (candidate: Candidate) => {
        const defaultSubject = `Protonest NDA for ${candidate.job_id?.title || '[Role Name]'} – Action Required`;
        const defaultBody = `Hello ${candidate.user_id?.name?.split(' ')[0] || '[Candidate First Name]'},\n\nWe're excited to move forward with your application for the role of ${candidate.job_id?.title || '[Role Name]'} at Protonest.\n\nTo proceed, please review and sign the attached Non-Disclosure Agreement (NDA). Here's what to do.....`;

        setNdaSubject(defaultSubject);
        setNdaBody(defaultBody);
        setNdaDialog(candidate);
    };

    // Function to handle delete confirmation
    const handleDelete = async (candidate: Candidate) => {
        if (!deleteCandidate) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/${candidate._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete application');
            }

            setCandidates(prev => prev.filter(c => c._id !== candidate._id));
            setDeleteCandidate(null);
        } catch (err) {
            console.error('Error deleting application:', err);
            alert('Failed to delete application');
        }
    };

    // Function to handle status update
    const updateStatus = async (applicationId: string, newStatus: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setCandidates(prev => Array.isArray(prev)
                ? prev.map(candidate =>
                    candidate && candidate._id === applicationId
                        ? { ...candidate, status: newStatus, updated_at: new Date().toISOString() }
                        : candidate
                )
                : []
            );
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    // Function to handle action button clicks
    const handleActionClick = (candidate: Candidate) => {
        switch (candidate.status) {
            case 'pending':
            case 'interviewed':
                setStatusDialog({ candidate, type: 'proceed' });
                break;
            case 'reviewed':
                setInterviewDialogContent(candidate);
                break;
            case 'shortlisted':
                setNdaDialogContent(candidate);
                break;
            case 'hired':
                console.log('View NDA Log for', candidate._id);
                break;
            default:
                console.log('No action available for status:', candidate.status);
        }
    };

    // Handle status dialog actions
    const handleStatusAction = (action: 'shortlist' | 'reject') => {
        if (!statusDialog) return;

        const { candidate } = statusDialog;
        let newStatus: string;

        if (candidate.status === 'pending') {
            newStatus = action === 'shortlist' ? 'reviewed' : 'rejected';
        } else if (candidate.status === 'interviewed') {
            newStatus = action === 'shortlist' ? 'shortlisted' : 'rejected-interview';
        } else {
            return;
        }

        updateStatus(candidate._id, newStatus);
        setStatusDialog(null);
    };

    // Handle interview invitation
    const handleSendInterview = () => {
        if (!interviewDialog) return;

        // Open email client
        openEmailClient(
            interviewDialog.user_id?.email || '',
            interviewSubject,
            interviewBody
        );

        // Update status to interviewed
        updateStatus(interviewDialog._id, 'interviewed');

        // Close dialog
        setInterviewDialog(null);
        setInterviewSubject('');
        setInterviewBody('');
    };

    // Handle NDA sending
    const handleSendNda = () => {
        if (!ndaDialog) return;

        // Open email client
        openEmailClient(
            ndaDialog.user_id?.email || '',
            ndaSubject,
            ndaBody
        );

        // Update status to hired
        updateStatus(ndaDialog._id, 'hired');

        // Close dialog and reset
        setNdaDialog(null);
        setNdaSubject('');
        setNdaBody('');
        setUploadedFile(null);
        setSelectedNda('template');
        setSelectedTemplate('NDA_Template_General.pdf');
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
            setUploadedFile(file);
        } else {
            alert('Please select a PDF file under 5MB');
        }
    };

    // Handle CV Preview
    const handlePreviewCV = (cvFileUrl: string) => {
        if (cvFileUrl) {
            window.open(cvFileUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert('CV file not available');
        }
    };

    // Handle CV Download
    const handleDownloadCV = async (cvFileUrl: string, candidateName: string) => {
        if (!cvFileUrl) {
            alert('CV file not available');
            return;
        }

        try {
            // Try to download via fetch with no-cors mode first
            const response = await fetch(cvFileUrl, {
                mode: 'no-cors',
                method: 'GET'
            });

            // If fetch works, try to get the blob
            if (response.ok) {
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Extract file extension from URL or default to .pdf
                const fileExtension = cvFileUrl.split('.').pop()?.split('?')[0] || 'pdf';
                link.download = `${candidateName.replace(/\s+/g, '_')}_CV.${fileExtension}`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Fetch failed');
            }
        } catch (error) {
            console.log('Direct download failed, using alternative method:', error);

            // Alternative approach: Create a hidden link and trigger download
            try {
                const link = document.createElement('a');
                link.href = cvFileUrl;
                link.target = '_blank';

                // Extract file extension from URL or default to .pdf
                const fileExtension = cvFileUrl.split('.').pop()?.split('?')[0] || 'pdf';
                link.download = `${candidateName.replace(/\s+/g, '_')}_CV.${fileExtension}`;

                // Add to DOM temporarily
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (linkError) {
                console.error('All download methods failed:', linkError);
                alert('Unable to download CV directly. Opening in new tab...');
                window.open(cvFileUrl, '_blank', 'noopener,noreferrer');
            }
        }
    };

    // Function to handle details view
    const handleViewDetails = async (candidate: Candidate) => {
        setDetailsDialog(candidate);
        await fetchCandidateDetails(candidate);
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading candidates...</p>
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

                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>
                            <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                <span className="text-[#5C4EC9]">Candidate Management</span>
                            </nav>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                👥 Candidate Management
                            </h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and manage freelancers who have applied or been shortlisted for job roles.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] opacity-50"
                                    placeholder="Search by candidate name or role applied for"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map((filter, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveFilter(filter.label)}
                                        className={`h-[34px] px-4 rounded-[57px] outline-1 outline-offset-[-1px] outline-[#5530FA] flex items-center transition-colors ${filter.active
                                            ? 'bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white'
                                            : 'text-[#676767] bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-xs md:text-[11px] font-medium">
                                            {filter.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Freelancer Name
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Applied For
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Applied On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCandidates.length > 0 ? (
                                        filteredCandidates.map((candidate) => (
                                            <tr key={candidate._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {candidate.user_id?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767] underline">
                                                    <Link href={`/admin-dashboard/jobs/${candidate.job_id?._id}`}>
                                                        {candidate.job_id?.title || 'N/A'}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {candidate.user_id?.email || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`${getStatusColor(candidate.status)} px-2 py-1 rounded-[15px] text-[11px] font-medium font-poppins text-[#4e4e4e] inline-flex items-center gap-1`}>
                                                        {getDisplayStatus(candidate.status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                    {formatDate(candidate.applied_at)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getActionText(candidate.status) && (
                                                            <button
                                                                className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins hover:opacity-90 transition-opacity"
                                                                onClick={() => handleActionClick(candidate)}
                                                            >
                                                                {getActionText(candidate.status)}
                                                            </button>
                                                        )}

                                                        <button
                                                            className="px-3 py-1 rounded-[15px] border border-[#5530FA] text-[#5530FA] text-[10px] font-medium font-poppins hover:bg-[#5530FA] hover:text-white transition-colors"
                                                            onClick={() => handleViewDetails(candidate)}
                                                        >
                                                            Details
                                                        </button>

                                                        <button
                                                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                                            onClick={() => setDeleteCandidate({ id: candidate._id, name: candidate.user_id?.name || 'Unknown' })}
                                                            title="Delete application"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                                No candidates found for &quot;{activeFilter}&quot; status.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteCandidate(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Delete Application
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Are you sure you want to delete the application from{' '}
                                <span className="font-medium">{deleteCandidate.name}</span>?{' '}
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => setDeleteCandidate(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const candidate = candidates.find(c => c._id === deleteCandidate.id);
                                    if (candidate) handleDelete(candidate);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Selection Dialog */}
            {statusDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setStatusDialog(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full">
                        <div className="mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                Update Application Status
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                What would you like to do with {statusDialog.candidate.user_id?.name || 'this candidate'}&apos;s application?
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-xs sm:text-sm text-gray-700">
                                    <span className="font-medium">Role:</span> {statusDialog.candidate.job_id?.title || 'N/A'}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-700">
                                    <span className="font-medium">Email:</span> {statusDialog.candidate.user_id?.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => setStatusDialog(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-3 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusAction('reject')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors order-2"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleStatusAction('shortlist')}
                                className="px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-3"
                            >
                                Shortlist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Invitation Dialog */}
            {interviewDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setInterviewDialog(null)}></div>
                    <div className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[1137px] max-h-[95vh] overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[95vh]">
                            {/* Subject Section */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Subject</h3>
                                <input
                                    type="text"
                                    value={interviewSubject}
                                    onChange={(e) => setInterviewSubject(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                    placeholder="Enter email subject..."
                                />
                            </div>

                            {/* Email Body Section */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">Email Body</h3>
                                <p className="text-xs font-light font-poppins text-[#6c6c6c]/80 mb-4">
                                    {new Date().toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <textarea
                                    value={interviewBody}
                                    onChange={(e) => setInterviewBody(e.target.value)}
                                    rows={8}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                    placeholder="Enter email body..."
                                />
                                <p className="text-xs text-gray-500 mt-2 text-right">{interviewBody.length}/1000</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={handleSendInterview}
                                    className="w-full sm:w-[222px] h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center text-white text-sm sm:text-base font-semibold font-montserrat order-1"
                                >
                                    Send Invitation
                                </button>
                                <button
                                    onClick={() => {
                                        setInterviewDialog(null);
                                        setInterviewSubject('');
                                        setInterviewBody('');
                                    }}
                                    className="w-full sm:w-[206px] h-[51px] px-6 py-4 rounded-[57px] border border-[#5530fa] flex justify-center items-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NDA Dialog */}
            {ndaDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setNdaDialog(null)}></div>
                    <div className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[979px] max-h-[95vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 lg:p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-[22px] font-medium font-poppins text-[#6c6c6c] mb-2">
                                    Send NDA to Freelancer
                                </h2>
                                <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 leading-[15px]">
                                    You&apos;re about to send a Non-Disclosure Agreement to the selected candidate. You can use an existing template or upload a new file
                                </p>
                            </div>

                            {/* Candidate Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 text-center">
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1">
                                        {ndaDialog.user_id?.name || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Candidate</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1 break-all">
                                        {ndaDialog.user_id?.email || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Email</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1">
                                        {ndaDialog.job_id?.title || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Role</div>
                                </div>
                            </div>

                            {/* NDA File Section */}
                            <div className="mb-6">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">NDA File</h3>

                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="template"
                                                name="ndaType"
                                                checked={selectedNda === 'template'}
                                                onChange={() => setSelectedNda('template')}
                                                className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                            />
                                            <label htmlFor="template" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
                                                Select from previously uploaded NDAs:
                                            </label>
                                        </div>

                                        {selectedNda === 'template' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-7">
                                                <button
                                                    onClick={() => setSelectedTemplate('NDA_Template_General.pdf')}
                                                    className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[57px] text-xs sm:text-sm font-semibold transition-colors ${selectedTemplate === 'NDA_Template_General.pdf'
                                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                                        : 'border border-[#5530fa] text-[#4d4d4d]'
                                                        }`}
                                                >
                                                    NDA_Template_General.pdf
                                                </button>
                                                <button
                                                    onClick={() => setSelectedTemplate('NDA_High_Security_v2.pdf')}
                                                    className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[57px] text-xs sm:text-sm font-medium transition-colors ${selectedTemplate === 'NDA_High_Security_v2.pdf'
                                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                                        : 'border border-[#5530fa] text-[#4d4d4d]'
                                                        }`}
                                                >
                                                    NDA_High_Security_v2.pdf
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="upload"
                                                name="ndaType"
                                                checked={selectedNda === 'upload'}
                                                onChange={() => setSelectedNda('upload')}
                                                className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                            />
                                            <label htmlFor="upload" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
                                                Upload a New NDA Document:
                                            </label>
                                        </div>

                                        {selectedNda === 'upload' && (
                                            <div className="ml-7">
                                                <div className="border-2 border-dashed border-[#6c6c6c] rounded-[35px] p-6 sm:p-8 text-center">
                                                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-[#6c6c6c] mb-4" />
                                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c] leading-[18px] mb-4">
                                                        Upload the file by drag and drop here or<br />
                                                        click on the browse button<br />
                                                        <span className="block mt-2">Allowed file types: .pdf<br />Max size: 5MB</span>
                                                    </p>
                                                    {uploadedFile && (
                                                        <div className="mb-4 p-2 bg-green-100 rounded-lg">
                                                            <p className="text-xs sm:text-sm text-green-700">Selected: {uploadedFile.name}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat"
                                                    >
                                                        Browse
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Email Title */}
                            <div className="mb-4">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Title</h3>
                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <input
                                        type="text"
                                        value={ndaSubject}
                                        onChange={(e) => setNdaSubject(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                        placeholder="Enter email subject..."
                                    />
                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-2">{ndaSubject.length}/50</p>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Body</h3>
                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <textarea
                                        value={ndaBody}
                                        onChange={(e) => setNdaBody(e.target.value)}
                                        rows={8}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                        placeholder="Enter email body..."
                                    />
                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-4">{ndaBody.length}/500</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
                                <button
                                    onClick={handleSendNda}
                                    className="w-full sm:w-[209px] h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat order-1"
                                >
                                    Send NDA
                                </button>
                                <button
                                    onClick={() => {
                                        setNdaDialog(null);
                                        setNdaSubject('');
                                        setNdaBody('');
                                        setUploadedFile(null);
                                        setSelectedNda('template');
                                        setSelectedTemplate('NDA_Template_General.pdf');
                                    }}
                                    className="w-full sm:w-[209px] h-[51px] px-6 py-4 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Candidate Details Dialog */}
            {detailsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDetailsDialog(null)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
                        <div className="overflow-y-auto max-h-[95vh]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#5530FA] to-[#F51DA5] px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-[#5530FA]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">
                                                {detailsDialog.user_id?.name || 'Candidate Profile'}
                                            </h2>
                                            <p className="text-white/80 text-sm">
                                                Applied for {detailsDialog.job_id?.title || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDetailsDialog(null)}
                                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {detailsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5530FA]"></div>
                                        <span className="ml-3 text-gray-600">Loading candidate details...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Left Column - Basic Info */}
                                        <div className="space-y-6">
                                            {/* Contact Information */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <Mail className="w-5 h-5 mr-2 text-[#5530FA]" />
                                                    Contact Information
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-600 w-16">Email:</span>
                                                        <span className="text-gray-900">{detailsDialog.user_id?.email || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="text-gray-600">Location: Sri Lanka</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Application Details */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <Briefcase className="w-5 h-5 mr-2 text-[#5530FA]" />
                                                    Application Details
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-sm text-gray-600">Applied Role:</span>
                                                        <p className="font-medium text-gray-900">{detailsDialog.job_id?.title || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Status:</span>
                                                        <div className="mt-1">
                                                            <span className={`${getStatusColor(detailsDialog.status)} px-3 py-1 rounded-full text-sm font-medium text-gray-800`}>
                                                                {getDisplayStatus(detailsDialog.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="text-gray-600">Applied: {formatDate(detailsDialog.applied_at)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Match Score */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <TrendingUp className="w-5 h-5 mr-2 text-[#5530FA]" />
                                                    Job Match Score
                                                </h3>
                                                {candidateDetails?.job_match ? (
                                                    <div className="space-y-3">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-[#5530FA] mb-1">
                                                                {candidateDetails.job_match.match_percentage.toFixed(0)}%
                                                            </div>
                                                            <div className="text-sm text-gray-600">Match Score</div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Matched Skills:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {candidateDetails.job_match.matched_skills?.slice(0, 3).map((skill, index) => (
                                                                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                    {candidateDetails.job_match.matched_skills?.length > 3 && (
                                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                            +{candidateDetails.job_match.matched_skills.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {candidateDetails.job_match.missing_skills?.length > 0 && (
                                                                <div>
                                                                    <span className="text-sm text-gray-600">Missing Skills:</span>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {candidateDetails.job_match.missing_skills?.slice(0, 2).map((skill, index) => (
                                                                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                        {candidateDetails.job_match.missing_skills?.length > 2 && (
                                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                                +{candidateDetails.job_match.missing_skills.length - 2} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <div className="text-2xl font-bold text-gray-400 mb-1">N/A</div>
                                                        <div className="text-sm text-gray-500">No match data available</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Middle Column - Skills & Expertise */}
                                        <div className="space-y-6">
                                            {/* Skills Summary */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <Award className="w-5 h-5 mr-2 text-[#5530FA]" />
                                                    Skills Summary
                                                </h3>
                                                {candidateDetails?.skills_summary ? (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-[#5530FA]">
                                                                    {candidateDetails.skills_summary.total_skills}
                                                                </div>
                                                                <div className="text-xs text-gray-600">Total Skills</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-[#5530FA]">
                                                                    {candidateDetails.skills_summary.categories_count}
                                                                </div>
                                                                <div className="text-xs text-gray-600">Categories</div>
                                                            </div>
                                                        </div>
                                                        {candidateDetails.skills_summary.skills_list?.length > 0 && (
                                                            <div>
                                                                <span className="text-sm text-gray-600 mb-2 block">All Skills:</span>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {candidateDetails.skills_summary.skills_list.slice(0, 8).map((skill, index) => (
                                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                    {candidateDetails.skills_summary.skills_list.length > 8 && (
                                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                            +{candidateDetails.skills_summary.skills_list.length - 8} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <div className="text-sm text-gray-500">No skills data available</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Expertise Areas */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3">Expertise Areas</h3>
                                                {candidateDetails?.expertise_areas && Object.keys(candidateDetails.expertise_areas).length > 0 ? (
                                                    <div className="space-y-3">
                                                        {Object.entries(candidateDetails.expertise_areas).map(([category, skills]) => (
                                                            <div key={category} className="border-l-4 border-[#5530FA] pl-3">
                                                                <div className="font-medium text-gray-900 text-sm mb-1">{category}</div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {skills.map((skill, index) => (
                                                                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <div className="text-sm text-gray-500">No expertise areas available</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column - Actions & CV */}
                                        <div className="space-y-6">
                                            {/* Quick Actions */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                                                <div className="space-y-2">
                                                    {getActionText(detailsDialog.status) && (
                                                        <button
                                                            onClick={() => {
                                                                setDetailsDialog(null);
                                                                handleActionClick(detailsDialog);
                                                            }}
                                                            className="w-full px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                                                        >
                                                            {getActionText(detailsDialog.status)}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            const email = detailsDialog.user_id?.email;
                                                            if (email) {
                                                                window.open(`mailto:${email}`, '_blank');
                                                            }
                                                        }}
                                                        className="w-full px-4 py-2 border border-[#5530FA] text-[#5530FA] rounded-lg hover:bg-[#5530FA] hover:text-white transition-colors text-sm font-medium"
                                                    >
                                                        Send Email
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDetailsDialog(null);
                                                            setDeleteCandidate({
                                                                id: detailsDialog._id,
                                                                name: detailsDialog.user_id?.name || 'Unknown'
                                                            });
                                                        }}
                                                        className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                                    >
                                                        Delete Application
                                                    </button>
                                                </div>
                                            </div>

                                            {/* CV Section */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-3">CV & Documents</h3>
                                                <div className="space-y-3">
                                                    {candidateDetails?.cv_file_url ? (
                                                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mr-3">
                                                                    <span className="text-red-600 text-xs font-medium">PDF</span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">CV Document</div>
                                                                    <div className="text-xs text-gray-500">Uploaded CV</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handlePreviewCV(candidateDetails.cv_file_url!)}
                                                                    className="px-3 py-1 text-xs bg-[#5530FA] text-white rounded hover:opacity-90"
                                                                >
                                                                    Preview
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDownloadCV(candidateDetails.cv_file_url!, detailsDialog.user_id?.name || 'candidate')}
                                                                    className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                                                                >
                                                                    Download
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center p-6 bg-white rounded border border-dashed border-gray-300">
                                                            <div className="text-center">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                    <span className="text-gray-400 text-sm font-medium">CV</span>
                                                                </div>
                                                                <div className="text-sm font-medium text-gray-900 mb-1">CV not uploaded yet</div>
                                                                <div className="text-xs text-gray-500">The candidate hasn&apos;t uploaded their CV</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Performance Stats */}
                                            {candidateDetails?.skills_summary && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-3">Performance Overview</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">Job Matches Found</span>
                                                            <span className="font-medium">{candidateDetails.skills_summary.job_matches_count}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">Highest Match</span>
                                                            <span className="font-medium text-green-600">
                                                                {candidateDetails.skills_summary.highest_match.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">Average Match</span>
                                                            <span className="font-medium text-blue-600">
                                                                {candidateDetails.skills_summary.average_match.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t bg-gray-50 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Last updated: {formatDate(detailsDialog.updated_at)}
                                    </div>
                                    <button
                                        onClick={() => setDetailsDialog(null)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
            />
        </div>
    );
};

export default CandidateManagement;