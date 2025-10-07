"use client";

import {
    Award,
    Bell,
    Briefcase,
    Calendar,
    ChevronDown,
    ChevronRight,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Search,
    Settings,
    Trash2,
    TrendingUp,
    Upload,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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

interface StatusDropdown {
    candidateId: string;
    isOpen: boolean;
}

const CandidateManagement = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
    const [statusDropdown, setStatusDropdown] = useState<StatusDropdown | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    // New states for role-based filtering with autocomplete
    const [searchInput, setSearchInput] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteRoles, setAutocompleteRoles] = useState<string[]>([]);

    // Editable email states
    const [interviewSubject, setInterviewSubject] = useState('');
    const [interviewBody, setInterviewBody] = useState('');
    const [ndaSubject, setNdaSubject] = useState('');
    const [ndaBody, setNdaBody] = useState('');

    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const autocompleteRef = useRef<HTMLDivElement>(null);
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

    // Status options for the dropdown
    const statusOptions = [
        { value: 'applied', label: 'Applied', color: 'bg-[#86dcff]' },
        { value: 'admin_moved', label: 'Admin Moved', color: 'bg-[#ffd986]' },
        { value: 'shortlisted', label: 'Shortlisted', color: 'bg-[#e2ff86]' },
        { value: 'interviewed', label: 'Interviewed', color: 'bg-[#86dcff]' },
        { value: 'hired', label: 'Hired', color: 'bg-[#86ffae]' },
        { value: 'rejected', label: 'Rejected', color: 'bg-[#ff8686]' }
    ];

    // Fetch candidates data from job candidates endpoint
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                // Fetch all job candidates with NDA status
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

    // Close sidebar, dropdown, and autocomplete when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }

            if (statusDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setStatusDropdown(null);
            }

            if (showAutocomplete && autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
                setShowAutocomplete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen, statusDropdown, showAutocomplete]);

    // Get unique roles from candidates for autocomplete
    const getUniqueRoles = useCallback((): string[] => {
        const roles = candidates
            .filter(candidate => candidate?.job?.title)
            .map(candidate => candidate.job.title);
        return Array.from(new Set(roles)).sort();
    }, [candidates]);

    // Update autocomplete suggestions based on search input
    useEffect(() => {
        if (searchInput.trim()) {
            const uniqueRoles = getUniqueRoles();
            const filtered = uniqueRoles.filter(role =>
                role.toLowerCase().includes(searchInput.toLowerCase()) &&
                !activeFilters.includes(role)
            );
            setAutocompleteRoles(filtered);
            setShowAutocomplete(filtered.length > 0);
        } else {
            setAutocompleteRoles([]);
            setShowAutocomplete(false);
        }
    }, [searchInput, candidates, activeFilters, getUniqueRoles]);

    // Fetch candidate details
    const fetchCandidateDetails = async (candidate: Candidate) => {
        setDetailsLoading(true);
        setCandidateDetails(null);

        try {
            const adminToken = localStorage.getItem('adminToken');
            const userId = candidate.user._id;

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
                    (match: JobMatch) => match.job_id === candidate.job._id
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

    // Handle search input change
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    // Handle selecting a role from autocomplete
    const handleSelectRole = (role: string) => {
        if (!activeFilters.includes(role)) {
            setActiveFilters([...activeFilters, role]);
        }
        setSearchInput('');
        setShowAutocomplete(false);
    };

    // Handle adding a filter by pressing Enter
    const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const trimmedInput = searchInput.trim();
            // Check if the input matches any existing role
            const uniqueRoles = getUniqueRoles();
            const matchingRole = uniqueRoles.find(role =>
                role.toLowerCase() === trimmedInput.toLowerCase()
            );

            if (matchingRole && !activeFilters.includes(matchingRole)) {
                setActiveFilters([...activeFilters, matchingRole]);
                setSearchInput('');
                setShowAutocomplete(false);
            } else if (!matchingRole) {
                // If no exact match, still allow custom filter
                if (!activeFilters.includes(trimmedInput)) {
                    setActiveFilters([...activeFilters, trimmedInput]);
                }
                setSearchInput('');
                setShowAutocomplete(false);
            }
        }
    };

    // Handle removing a filter
    const handleRemoveFilter = (filterToRemove: string) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

    // Filter candidates based on active role filters
    const filteredCandidates = Array.isArray(candidates)
        ? candidates.filter(candidate => {
            if (!candidate) return false;

            // If no filters, show all candidates
            if (activeFilters.length === 0) return true;

            // Check if candidate's role matches ANY of the active filters
            return activeFilters.some(filter => {
                const lowerFilter = filter.toLowerCase();
                const jobTitle = candidate.job?.title?.toLowerCase() || '';
                return jobTitle.includes(lowerFilter);
            });
        })
        : [];

    // Function to get status color based on status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'applied': return 'bg-[#86dcff]';
            case 'admin_moved': return 'bg-[#ffd986]';
            case 'shortlisted': return 'bg-[#e2ff86]';
            case 'interviewed': return 'bg-[#86dcff]';
            case 'hired': return 'bg-[#86ffae]';
            case 'rejected': return 'bg-[#ff8686]';
            default: return 'bg-[#86dcff]';
        }
    };

    // Function to get NDA status display
    const getNDAStatusDisplay = (candidate: Candidate) => {
        if (!candidate.nda_status) {
            return { icon: '❌', text: 'Not Sent', color: 'text-red-600' };
        }

        switch (candidate.nda_status.status) {
            case 'sent':
                return { icon: '🟠', text: 'Sent', color: 'text-orange-600' };
            case 'submitted':
                return { icon: '✅', text: 'Submitted', color: 'text-green-600' };
            default:
                return { icon: '❌', text: 'Not Sent', color: 'text-red-600' };
        }
    };

    // Function to get display status text
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

    // Function to handle status change
    const handleStatusChange = async (candidateId: string, newStatus: string) => {
        try {
            setUpdatingStatus(candidateId);
            setStatusDropdown(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setCandidates(prev => Array.isArray(prev)
                ? prev.map(candidate =>
                    candidate && candidate.id === candidateId
                        ? { ...candidate, status: newStatus, updated_at: new Date().toISOString() }
                        : candidate
                )
                : []
            );

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Function to get action text based on status and NDA status
    const getActionText = (candidate: Candidate) => {
        switch (candidate.status) {
            case 'applied': return 'Proceed';
            case 'admin_moved': return 'Proceed';
            case 'shortlisted': return 'Call For Interview';
            case 'interviewed':
                // Check NDA status for interviewed candidates
                if (!candidate.nda_status || candidate.nda_status.status === 'not_sent') {
                    return 'Send NDA';
                } else if (candidate.nda_status.status === 'sent') {
                    return 'Resend NDA';
                } else {
                    return 'View NDA Log';
                }
            case 'hired': return 'View NDA Log';
            case 'rejected': return null;
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
        const defaultSubject = `Interview invitation for ${candidate.job?.title || 'the position'}`;
        const defaultBody = `Dear ${candidate.user?.name || 'Candidate'},\n\nWe are pleased to inform you that your application for the ${candidate.job?.title || 'position'} role at Protonest has been successful, and we would like to invite you for an interview.\n\nPlease confirm your availability for the scheduled interview time. We look forward to discussing your qualifications and learning more about your experience.\n\nBest regards,\nProtonest Team`;

        setInterviewSubject(defaultSubject);
        setInterviewBody(defaultBody);
        setInterviewDialog(candidate);
    };

    // Set default NDA email content
    const setNdaDialogContent = (candidate: Candidate) => {
        const defaultSubject = `Protonest NDA for ${candidate.job?.title || '[Role Name]'} – Action Required`;
        const defaultBody = `Hello ${candidate.user?.name?.split(' ')[0] || '[Candidate First Name]'},\n\nWe're excited to move forward with your application for the role of ${candidate.job?.title || '[Role Name]'} at Protonest.\n\nTo proceed, please review and sign the attached Non-Disclosure Agreement (NDA). Here's what to do.....`;

        setNdaSubject(defaultSubject);
        setNdaBody(defaultBody);
        setNdaDialog(candidate);
    };

    // Function to handle delete confirmation
    const handleDelete = async (candidate: Candidate) => {
        if (!deleteCandidate) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidate.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete candidate');
            }

            setCandidates(prev => prev.filter(c => c.id !== candidate.id));
            setDeleteCandidate(null);
        } catch (err) {
            console.error('Error deleting candidate:', err);
            alert('Failed to delete candidate');
        }
    };

    // Function to update status
    const updateStatus = async (candidateId: string, newStatus: string, notes?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    notes: notes
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setCandidates(prev => Array.isArray(prev)
                ? prev.map(candidate =>
                    candidate && candidate.id === candidateId
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

    // Function to send NDA
    const sendNDA = async (candidateId: string, notes?: string) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/nda/send`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ compliance_notes: notes || '' })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to send NDA');
            }

            // Update local state
            setCandidates(prev => prev.map(candidate =>
                candidate.id === candidateId
                    ? {
                        ...candidate,
                        nda_status: {
                            status: 'sent',
                            sent_on: new Date().toISOString(),
                            compliance_notes: notes || '',
                            resend_count: candidate.nda_status?.resend_count || 0,
                            created_at: candidate.nda_status?.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    }
                    : candidate
            ));

            alert('NDA sent successfully!');
        } catch (error) {
            console.error('Error sending NDA:', error);
            alert('Failed to send NDA');
        }
    };

    // Function to resend NDA
    const resendNDA = async (candidateId: string, notes?: string) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/nda/resend`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ compliance_notes: notes || '' })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to resend NDA');
            }

            // Update local state
            setCandidates(prev => prev.map(candidate =>
                candidate.id === candidateId && candidate.nda_status
                    ? {
                        ...candidate,
                        nda_status: {
                            ...candidate.nda_status,
                            sent_on: new Date().toISOString(),
                            compliance_notes: notes || candidate.nda_status.compliance_notes || '',
                            resend_count: (candidate.nda_status.resend_count || 0) + 1,
                            updated_at: new Date().toISOString()
                        }
                    }
                    : candidate
            ));

            alert('NDA resent successfully!');
        } catch (error) {
            console.error('Error resending NDA:', error);
            alert('Failed to resend NDA');
        }
    };

    // Function to handle action button clicks
    const handleActionClick = (candidate: Candidate) => {
        const actionText = getActionText(candidate);

        switch (candidate.status) {
            case 'applied':
            case 'admin_moved':
                setStatusDialog({ candidate, type: 'proceed' });
                break;
            case 'shortlisted':
                setInterviewDialogContent(candidate);
                break;
            case 'interviewed':
                if (actionText === 'Send NDA') {
                    setNdaDialogContent(candidate);
                } else if (actionText === 'Resend NDA') {
                    if (confirm(`Resend NDA to ${candidate.user?.name}?`)) {
                        resendNDA(candidate.id);
                    }
                } else {
                    // View NDA Log - redirect to NDA page
                    window.location.href = '/admin-dashboard/nda';
                }
                break;
            case 'hired':
                // View NDA Log - redirect to NDA page
                window.location.href = '/admin-dashboard/nda';
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

        if (candidate.status === 'applied' || candidate.status === 'admin_moved') {
            newStatus = action === 'shortlist' ? 'shortlisted' : 'rejected';
        } else {
            return;
        }

        updateStatus(candidate.id, newStatus);
        setStatusDialog(null);
    };

    // Handle interview invitation
    const handleSendInterview = () => {
        if (!interviewDialog) return;

        // Open email client
        openEmailClient(
            interviewDialog.user?.email || '',
            interviewSubject,
            interviewBody
        );

        // Update status to interviewed
        updateStatus(interviewDialog.id, 'interviewed');

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
            ndaDialog.user?.email || '',
            ndaSubject,
            ndaBody
        );

        // Send NDA via API
        sendNDA(ndaDialog.id, ndaBody);

        // Update status to hired
        updateStatus(ndaDialog.id, 'hired');

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

                        {/* Search Bar with Autocomplete */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1" ref={autocompleteRef}>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={handleSearchInputChange}
                                    onKeyDown={handleAddFilter}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Search by role and press Enter to add filter..."
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>

                                {/* Autocomplete Dropdown */}
                                {showAutocomplete && autocompleteRoles.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {autocompleteRoles.map((role, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectRole(role)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <Briefcase className="w-4 h-4 mr-2 text-[#5530FA]" />
                                                    {role}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFilters.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Filtering by Role:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activeFilters.map((filter, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full text-sm font-medium"
                                        >
                                            <Briefcase className="w-4 h-4" />
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

                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto overflow-y-visible min-h-[400px]">
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
                                            NDA Status
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Added On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCandidates.length > 0 ? (
                                        filteredCandidates.map((candidate) => {
                                            const ndaStatusDisplay = getNDAStatusDisplay(candidate);

                                            return (
                                                <tr key={candidate.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {candidate.user?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767] underline">
                                                        <Link href={`/admin-dashboard/jobs/${candidate.job?._id}`}>
                                                            {candidate.job?.title || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {candidate.user?.email || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap relative">
                                                        <div ref={statusDropdown?.candidateId === candidate.id ? dropdownRef : null}>
                                                            <button
                                                                onClick={() => {
                                                                    if (statusDropdown?.candidateId === candidate.id) {
                                                                        setStatusDropdown(null);
                                                                    } else {
                                                                        setStatusDropdown({ candidateId: candidate.id, isOpen: true });
                                                                    }
                                                                }}
                                                                disabled={updatingStatus === candidate.id}
                                                                className={`${getStatusColor(candidate.status)} px-2 py-1 rounded-[15px] text-[11px] font-medium font-poppins text-[#4e4e4e] inline-flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                                                            >
                                                                {updatingStatus === candidate.id ? (
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></div>
                                                                ) : (
                                                                    <>
                                                                        {getDisplayStatus(candidate.status)}
                                                                        <ChevronDown className="w-3 h-3" />
                                                                    </>
                                                                )}
                                                            </button>

                                                            {/* Status Dropdown */}
                                                            {statusDropdown?.candidateId === candidate.id && statusDropdown.isOpen && (
                                                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px] flex flex-col">
                                                                    {statusOptions.map((option) => (
                                                                        <button
                                                                            key={option.value}
                                                                            onClick={() => handleStatusChange(candidate.id, option.value)}
                                                                            className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors block ${option.value === statusOptions[0].value ? 'rounded-t-lg' : ''
                                                                                } ${option.value === statusOptions[statusOptions.length - 1].value ? 'rounded-b-lg' : ''
                                                                                } ${candidate.status === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                                                                }`}
                                                                        >
                                                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${option.color}`}></span>
                                                                            {option.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins ${ndaStatusDisplay.color}`}>
                                                        {ndaStatusDisplay.icon} {ndaStatusDisplay.text}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {formatDate(candidate.added_at)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {getActionText(candidate) && (
                                                                <button
                                                                    className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins hover:opacity-90 transition-opacity"
                                                                    onClick={() => handleActionClick(candidate)}
                                                                >
                                                                    {getActionText(candidate)}
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
                                                                onClick={() => setDeleteCandidate({ id: candidate.id, name: candidate.user?.name || 'Unknown' })}
                                                                title="Delete candidate"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                                {activeFilters.length > 0
                                                    ? `No candidates found for role(s): ${activeFilters.join(', ')}`
                                                    : 'No candidates found.'
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>

            {/* All remaining dialogs remain the same as in your original code */}
            {/* Delete Confirmation Dialog, Status Selection Dialog, Interview Invitation Dialog, NDA Dialog, Details Dialog */}
            {/* I'll include them for completeness */}

            {/* Delete Confirmation Dialog */}
            {deleteCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteCandidate(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Delete Candidate
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Are you sure you want to delete the candidate{' '}
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
                                    const candidate = candidates.find(c => c.id === deleteCandidate.id);
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
                                Update Candidate Status
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                What would you like to do with {statusDialog.candidate.user?.name || 'this candidate'}?
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-xs sm:text-sm text-gray-700">
                                    <span className="font-medium">Role:</span> {statusDialog.candidate.job?.title || 'N/A'}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-700">
                                    <span className="font-medium">Email:</span> {statusDialog.candidate.user?.email || 'N/A'}
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
                                        {ndaDialog.user?.name || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Candidate</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1 break-all">
                                        {ndaDialog.user?.email || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Email</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1">
                                        {ndaDialog.job?.title || 'N/A'}
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
                                                {detailsDialog.user?.name || 'Candidate Profile'}
                                            </h2>
                                            <p className="text-white/80 text-sm">
                                                Applied for {detailsDialog.job?.title || 'N/A'}
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
                                                        <span className="text-gray-900">{detailsDialog.user?.email || 'N/A'}</span>
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
                                                        <p className="font-medium text-gray-900">{detailsDialog.job?.title || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Status:</span>
                                                        <div className="mt-1">
                                                            <span className={`${getStatusColor(detailsDialog.status)} px-3 py-1 rounded-full text-sm font-medium text-gray-800`}>
                                                                {getDisplayStatus(detailsDialog.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">NDA Status:</span>
                                                        <div className="mt-1">
                                                            {(() => {
                                                                const ndaStatus = getNDAStatusDisplay(detailsDialog);
                                                                return (
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${ndaStatus.color}`}>
                                                                        {ndaStatus.icon} {ndaStatus.text}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="text-gray-600">Added: {formatDate(detailsDialog.added_at)}</span>
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
                                                    {getActionText(detailsDialog) && (
                                                        <button
                                                            onClick={() => {
                                                                setDetailsDialog(null);
                                                                handleActionClick(detailsDialog);
                                                            }}
                                                            className="w-full px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                                                        >
                                                            {getActionText(detailsDialog)}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            const email = detailsDialog.user?.email;
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
                                                                id: detailsDialog.id,
                                                                name: detailsDialog.user?.name || 'Unknown'
                                                            });
                                                        }}
                                                        className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                                    >
                                                        Delete Candidate
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
                                                                    onClick={() => handleDownloadCV(candidateDetails.cv_file_url!, detailsDialog.user?.name || 'candidate')}
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