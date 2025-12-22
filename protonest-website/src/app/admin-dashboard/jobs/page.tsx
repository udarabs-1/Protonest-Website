"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    Bell,
    Edit,
    Eye,
    Send,
    Trash2,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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
    is_active: boolean;
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

const isAdminTokenExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return true;

    try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            return true;
        }

        return false;
    } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        return true;
    }
};

const JobPostings = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [jobPostings, setJobPostings] = useState<Job[]>([]);
    const [filteredJobPostings, setFilteredJobPostings] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applicationCounts, setApplicationCounts] = useState<{ [key: string]: number }>({});
    const [loadingCounts, setLoadingCounts] = useState(false);
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);


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
            if (activeFilter === 'active') {
                filtered = filtered.filter(job => job.is_active === true);
            } else if (activeFilter === 'inactive') {
                filtered = filtered.filter(job => job.is_active === false);
            } else {
                filtered = filtered.filter(job => job.publication_status === activeFilter);
            }
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
        setConfirmDialog({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this job posting?',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const adminToken = localStorage.getItem('adminToken');
                    if (!adminToken) {
                        throw new Error('Admin authentication required');
                    }
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${adminToken}`
                            }
                        }
                    );

                    if (response.ok) {
                        setJobPostings((prev: Job[]) => prev.filter(job => job.id !== jobId));
                        setSuccessMessage({
                            title: 'Job Deleted Successfully!',
                            description: 'The job posting has been permanently removed from the system.'
                        });
                        setShowSuccessDialog(true);
                    } else {
                        const errorData = await response.json();
                        const errorMessage = errorData.message || 'Failed to delete job posting';
                        setErrorMessage('Failed to delete job posting: ' + errorMessage);
                        setShowErrorDialog(true);
                    }
                } catch (err) {
                    console.error('Error deleting job:', err);
                    setErrorMessage('Failed to delete job posting: Network error');
                    setShowErrorDialog(true);
                }
            }
        });
    };

    const handleToggleActive = async (jobId: string, currentStatus: boolean) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                throw new Error('Admin authentication required');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_active: !currentStatus }),
                }
            );

            if (response.ok) {
                setJobPostings((prev: Job[]) =>
                    prev.map(job =>
                        job.id === jobId ? { ...job, is_active: !currentStatus } : job
                    )
                );
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update job status';
                setErrorMessage('Failed to update job status: ' + errorMessage);
                setShowErrorDialog(true);
            }
        } catch (err) {
            console.error('Error toggling job status:', err);
            setErrorMessage('Failed to update job status: Network error');
            setShowErrorDialog(true);
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
            console.log('Job suggestions triggered:', result);

            setSuccessMessage({
                title: 'Job Suggestions Triggered Successfully!',
                description: 'Job suggestion emails are being processed in the background. Talent pool users with matching jobs will receive personalized recommendations shortly.'
            });
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
                return '';
            case 'draft':
                return '';
            case 'scheduled':
                return '';
            default:
                return '';
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
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' }
    ];

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Job Postings' }
            ]}
        >
            <div className="font-poppins relative">
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
                                    {successMessage.title || 'Success!'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {successMessage.description || 'Operation completed successfully.'}
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
                                    Failed to Update Job Status
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
                <main>
                    <div className="sticky top-0 z-40 bg-white pb-4">
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

                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                    placeholder="Search by job title or category"
                                />
                                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveFilter(filter.value)}
                                    className={`h-[34px] px-4 rounded-[57px] flex items-center transition-colors ${activeFilter === filter.value
                                        ? 'bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="text-xs md:text-[11px] font-medium">
                                        {filter.label}
                                    </span>
                                </button>
                            ))}
                        </div>
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
                                            Active Status
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
                                                        <button
                                                            onClick={() => handleToggleActive(job.id, job.is_active)}
                                                            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${job.is_active
                                                                ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]'
                                                                : 'bg-gray-300'
                                                                }`}
                                                            title={job.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.is_active ? 'translate-x-6' : 'translate-x-1'
                                                                    }`}
                                                            />
                                                        </button>
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
                                            <td colSpan={7} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
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

            {confirmDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setConfirmDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{confirmDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDialog(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDialog.onConfirm}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default JobPostings;
