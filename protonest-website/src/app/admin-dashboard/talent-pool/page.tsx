"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    Briefcase,
    ChevronDown,
    Clock,
    FileText,
    History,
    Search,
    Trash2,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface FreelancerData {
    id: string;
    name: string;
    email: string;
    title: string;
    skills: string[];
    lastUpdated: string;
    cvFileUrl?: string;
    userId: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    category: string;
    status: string;
    posted?: string;
    deadline?: string;
    experience?: string;
    description?: string;
}

interface JobSnapshot {
    title: string;
    location: string;
    type: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    required_skills: string[];
    deadline: string;
    posted_at: string;
}

interface ApplicationHistory {
    id: string;
    job_id: string;
    job_details: JobSnapshot;
    status: string;
    status_display: string;
    applied_at: string;
    updated_at: string;
    job_deleted: boolean;
}

interface ApplicationHistoryResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    applications: ApplicationHistory[];
    summary: {
        total_applications: number;
        deleted_jobs_count: number;
        active_jobs_count: number;
        status_breakdown: Record<string, number>;
    };
}

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

const TalentPool = () => {
    const router = useRouter();
    const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerData | null>(null);
    const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showJobDropdown, setShowJobDropdown] = useState(false);
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const [sendNDA, setSendNDA] = useState(false);
    const [assigningJob, setAssigningJob] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [applicationHistory, setApplicationHistory] = useState<ApplicationHistoryResponse | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [showBulkMoveDialog, setShowBulkMoveDialog] = useState(false);
    const [bulkMoving, setBulkMoving] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [roleFilters, setRoleFilters] = useState<string[]>([]);
    const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showJobDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowJobDropdown(false);
            }

            if (showRoleSuggestions && searchInputRef.current && !searchInputRef.current.parentElement?.contains(event.target as Node)) {
                setShowRoleSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showJobDropdown, showRoleSuggestions]);

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            return;
        }
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/talent-pool/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch talent pool');
            }

            const talentPoolData = data.data || [];

            interface TalentPoolMember {
                _id?: string;
                id?: string;
                user_id?: string;
                updated_at?: string;
                user?: {
                    _id?: string;
                    id?: string;
                    first_name?: string;
                    last_name?: string;
                    email?: string;
                };
                cv_data?: {
                    work_function?: string;
                    skills?: string[];
                    cv_file_url?: string;
                };
            }

            const transformedData: FreelancerData[] = talentPoolData.map((member: TalentPoolMember) => {
                const user = member.user || {};
                const cvData = member.cv_data || {};

                return {
                    id: member._id || member.id || '',
                    userId: member.user_id || user._id || user.id || '',
                    name: user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email || 'Unknown',
                    email: user.email || 'N/A',
                    title: cvData.work_function || 'Not specified',
                    skills: cvData.skills || [],
                    lastUpdated: member.updated_at
                        ? new Date(member.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'N/A',
                    cvFileUrl: cvData.cv_file_url
                };
            });

            setFreelancers(transformedData);
        } catch (err) {
            console.error('Error fetching talent pool:', err);
            setError('Failed to load talent pool data');
        } finally {
            setLoading(false);
        }
    };

    const handlePreviewCV = async (userId: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setErrorDialog({ title: 'Authentication Error', message: 'Authentication required' });
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/download/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const newWindow = window.open(url, '_blank');

                if (newWindow) {
                    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                } else {
                    window.URL.revokeObjectURL(url);
                    setErrorDialog({ title: 'Popup Blocked', message: 'Please allow pop-ups to preview CV' });
                }
            } else {
                setErrorDialog({ title: 'Error', message: 'Failed to preview CV' });
            }
        } catch (error) {
            console.error('Error previewing CV:', error);
            setErrorDialog({ title: 'Error', message: 'Failed to preview CV' });
        }
    };

    const fetchAvailableJobs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/available`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    setAvailableJobs(data.data || []);
                }
            }
        } catch (err) {
            console.error('Error fetching available jobs:', err);
        }
    };

    const fetchApplicationHistory = async (userId: string) => {
        try {
            setLoadingHistory(true);
            setHistoryError(null);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const url = historyStatusFilter
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/user/${userId}/history?status=${historyStatusFilter}`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/admin/user/${userId}/history`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success' && data.data) {
                setApplicationHistory(data.data);
            } else {
                throw new Error(data.message || 'Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching application history:', err);
            setHistoryError(err instanceof Error ? err.message : 'Failed to load application history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleViewHistory = (freelancer: FreelancerData) => {
        setSelectedFreelancer(freelancer);
        setShowHistoryModal(true);
        setHistoryStatusFilter('');
        fetchApplicationHistory(freelancer.userId);
    };

    const handleHistoryFilterChange = (status: string) => {
        setHistoryStatusFilter(status);
        if (selectedFreelancer) {
            fetchApplicationHistory(selectedFreelancer.userId);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
            'shortlisted': 'bg-purple-100 text-purple-800 border-purple-200',
            'interviewed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'offered': 'bg-green-100 text-green-800 border-green-200',
            'rejected': 'bg-red-100 text-red-800 border-red-200',
            'rejected-interview': 'bg-red-100 text-red-800 border-red-200',
            'hired': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleViewCV = async (freelancer: FreelancerData) => {
        await handlePreviewCV(freelancer.userId);
    };

    const handleDeleteFreelancer = async (freelancer: FreelancerData) => {
        setConfirmDialog({
            title: 'Confirm Removal',
            message: `Are you sure you want to remove ${freelancer.name} from the talent pool? This action cannot be undone.`,
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('adminToken');

                    if (!token) {
                        throw new Error('No authentication token found');
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/talent-pool/admin/${freelancer.userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    setFreelancers(prev => prev.filter(f => f.userId !== freelancer.userId));
                    setSelectedUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(freelancer.userId);
                        return newSet;
                    });
                    setSuccessDialog({ title: 'Success', message: 'User removed from talent pool successfully' });
                } catch (err) {
                    console.error('Error removing from talent pool:', err);
                    setErrorDialog({
                        title: 'Error',
                        message: `Failed to remove from talent pool: ${err instanceof Error ? err.message : 'Unknown error'}`
                    });
                }
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedUsers.size === 0) {
            setErrorDialog({ title: 'Selection Error', message: 'Please select at least one user to delete' });
            return;
        }

        setConfirmDialog({
            title: 'Confirm Bulk Removal',
            message: `Are you sure you want to remove ${selectedUsers.size} user(s) from the talent pool? This action cannot be undone.`,
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    setBulkDeleting(true);
                    const token = localStorage.getItem('adminToken');

                    if (!token) {
                        throw new Error('No authentication token found');
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/talent-pool/admin/bulk`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_ids: Array.from(selectedUsers)
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    setFreelancers(prev => prev.filter(f => !selectedUsers.has(f.userId)));
                    setSelectedUsers(new Set());
                    setSuccessDialog({ title: 'Success', message: `Successfully removed ${result.deleted_count} user(s) from talent pool` });
                } catch (err) {
                    console.error('Error bulk deleting from talent pool:', err);
                    setErrorDialog({
                        title: 'Error',
                        message: `Failed to bulk delete: ${err instanceof Error ? err.message : 'Unknown error'}`
                    });
                } finally {
                    setBulkDeleting(false);
                }
            }
        });
    };

    const handleBulkMoveToJob = async () => {
        if (selectedUsers.size === 0) {
            setErrorDialog({ title: 'Selection Error', message: 'Please select at least one user to move' });
            return;
        }

        if (!selectedJob) {
            setErrorDialog({ title: 'Selection Error', message: 'Please select a job to move users to' });
            return;
        }

        try {
            setBulkMoving(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/talent-pool/admin/bulk-move-to-job`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_ids: Array.from(selectedUsers),
                    job_id: selectedJob.id,
                    notes: 'Bulk moved from talent pool'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            let message = `Successfully moved ${result.successful_moves?.length || 0} user(s) to ${selectedJob.title}`;
            if (result.already_candidates?.length > 0) {
                message += `\n${result.already_candidates.length} user(s) were already candidates for this job.`;
            }

            setSelectedUsers(new Set());
            setShowBulkMoveDialog(false);
            setSelectedJob(null);
            setJobSearchTerm('');
            setSuccessDialog({ title: 'Success', message });
        } catch (err) {
            console.error('Error bulk moving to job:', err);
            setErrorDialog({
                title: 'Error',
                message: `Failed to bulk move: ${err instanceof Error ? err.message : 'Unknown error'}`
            });
        } finally {
            setBulkMoving(false);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredFreelancers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredFreelancers.map(f => f.userId)));
        }
    };

    const getUniqueRoles = () => {
        const roles = new Set<string>();
        freelancers.forEach(f => {
            if (f.title && f.title !== 'Not specified') {
                const individualRoles = f.title.split(/[,\/&]/).map(r => r.trim()).filter(r => r);
                individualRoles.forEach(role => roles.add(role));
            }
        });
        return Array.from(roles).sort();
    };

    const getCandidateCountForRole = (role: string) => {
        return freelancers.filter(f =>
            f.title && f.title.toLowerCase().includes(role.toLowerCase())
        ).length;
    };


    const handleMoveToJob = (freelancer: FreelancerData) => {
        setSelectedFreelancer(freelancer);
        setShowAssignPopup(true);
        setJobSearchTerm('');
        setSelectedJob(null);
        fetchAvailableJobs();
    };

    const handleAssignToJob = async () => {
        if (!selectedFreelancer || !selectedJob) {
            setErrorDialog({ title: 'Selection Error', message: 'Please select a job to assign the candidate to' });
            return;
        }

        try {
            setAssigningJob(true);
            const token = localStorage.getItem('adminToken');

            const assignResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/talent-pool/admin/${selectedFreelancer.userId}/move-to-job`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: selectedJob.id,
                    notes: `Assigned from talent pool${sendNDA ? ' - NDA request sent' : ''}`
                })
            });

            if (!assignResponse.ok) {
                const errorData = await assignResponse.json();
                throw new Error(errorData.message || 'Failed to assign candidate to job');
            }

            if (sendNDA) {
                console.log('NDA request would be sent here');
            }

            setSuccessDialog({ title: 'Success', message: `Successfully assigned ${selectedFreelancer.name} to ${selectedJob.title}` });

            setShowAssignPopup(false);
            setSelectedFreelancer(null);
            setSelectedJob(null);
            setSendNDA(false);
            setJobSearchTerm('');

            fetchFreelancers();
        } catch (err) {
            console.error('Error assigning candidate to job:', err);
            setErrorDialog({
                title: 'Error',
                message: `Failed to assign candidate: ${err instanceof Error ? err.message : 'Unknown error'}`
            });
        } finally {
            setAssigningJob(false);
        }
    };

    const handleJobSelect = (job: Job) => {
        setSelectedJob(job);
        setJobSearchTerm(job.title);
        setShowJobDropdown(false);
    };

    const resetAssignPopup = () => {
        setShowAssignPopup(false);
        setSelectedFreelancer(null);
        setSelectedJob(null);
        setSendNDA(false);
        setJobSearchTerm('');
        setShowJobDropdown(false);
    };

    const resetHistoryModal = () => {
        setShowHistoryModal(false);
        setSelectedFreelancer(null);
        setApplicationHistory(null);
        setHistoryStatusFilter('');
        setHistoryError(null);
    };

    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesSearch = !searchTerm ||
            freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            freelancer.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilters.length === 0 || roleFilters.some(role =>
            freelancer.title.toLowerCase().includes(role.toLowerCase())
        );

        return matchesSearch && matchesRole;
    });

    const filteredJobs = availableJobs.filter(job =>
        job.title.toLowerCase().includes(jobSearchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading talent pool...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminLayout
                breadcrumbItems={[
                    { label: 'Admin Portal', href: '/admin-dashboard' },
                    { label: 'Talent Pool' }
                ]}
            >
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



                {successDialog && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        onClick={() => setSuccessDialog(null)}
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                        <div
                            className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-green-600 mb-4">{successDialog.title}</h3>
                            <p className="text-gray-600 mb-6">{successDialog.message}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSuccessDialog(null)}
                                    className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {errorDialog && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        onClick={() => setErrorDialog(null)}
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                        <div
                            className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-red-600 mb-4">{errorDialog.title}</h3>
                            <p className="text-gray-600 mb-6">{errorDialog.message}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setErrorDialog(null)}
                                    className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {confirmDialog && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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





                {
                    error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                            <button
                                onClick={fetchFreelancers}
                                className="mt-2 text-red-600 text-sm underline hover:no-underline"
                            >
                                Try again
                            </button>
                        </div>
                    )
                }

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                            <Icon
                                icon="solar:users-group-two-rounded-bold-duotone"
                                className="w-7 h-7"
                            />
                        </div>
                        <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                            Talent Pool – Freelancer CVs
                        </h1>
                    </div>
                    <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                        View and manage CVs submitted by freelancers. Use filters to shortlist profiles for upcoming IoT projects.
                    </p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                handleSearch(e);
                                setShowRoleSuggestions(true);
                            }}
                            onFocus={() => setShowRoleSuggestions(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const matchingRole = getUniqueRoles().find(
                                        role => role.toLowerCase() === searchTerm.toLowerCase()
                                    );
                                    if (matchingRole && !roleFilters.includes(matchingRole)) {
                                        setRoleFilters([...roleFilters, matchingRole]);
                                        setSearchTerm('');
                                        setShowRoleSuggestions(false);
                                    }
                                }
                                if (e.key === 'Escape') {
                                    setShowRoleSuggestions(false);
                                }
                            }}
                            className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                            placeholder="Search by name, email, or preferred role..."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>

                        {showRoleSuggestions && searchTerm && getUniqueRoles().filter(role =>
                            role.toLowerCase().includes(searchTerm.toLowerCase()) && !roleFilters.includes(role)
                        ).length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                    {getUniqueRoles()
                                        .filter(role => role.toLowerCase().includes(searchTerm.toLowerCase()) && !roleFilters.includes(role))
                                        .map(role => (
                                            <button
                                                key={role}
                                                onClick={() => {
                                                    setRoleFilters([...roleFilters, role]);
                                                    setSearchTerm('');
                                                    setShowRoleSuggestions(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 text-gray-700 flex items-center justify-between"
                                            >
                                                <span>{role}</span>
                                                <span className="text-xs text-gray-400">
                                                    {getCandidateCountForRole(role)}
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            )}
                    </div>

                    {roleFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {roleFilters.map(role => (
                                <div key={role} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                                    <span>{role}</span>
                                    <button
                                        onClick={() => setRoleFilters(roleFilters.filter(r => r !== role))}
                                        className="hover:bg-purple-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {roleFilters.length > 1 && (
                                <button
                                    onClick={() => setRoleFilters([])}
                                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {
                    selectedUsers.size > 0 && (
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span className="text-sm text-purple-700 font-medium">
                                {selectedUsers.size} user(s) selected
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setShowBulkMoveDialog(true);
                                        fetchAvailableJobs();
                                    }}
                                    disabled={bulkMoving}
                                    className="px-3 py-1.5 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>Move to Job</span>
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={bulkDeleting}
                                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {bulkDeleting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>Delete Selected</span>
                                </button>
                                <button
                                    onClick={() => setSelectedUsers(new Set())}
                                    className="px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    )
                }

                <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider w-12">
                                    <input
                                        type="checkbox"
                                        checked={filteredFreelancers.length > 0 && selectedUsers.size === filteredFreelancers.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA] cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-2 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Freelancer Name
                                </th>
                                <th className="px-4 py-2 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-2 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Preferred Role
                                </th>
                                <th className="px-4 py-2 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-4 py-2 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFreelancers.length > 0 ? (
                                filteredFreelancers.map((freelancer) => (
                                    <tr key={freelancer.id} className={`hover:bg-gray-50 ${selectedUsers.has(freelancer.userId) ? 'bg-purple-50' : ''}`}>
                                        <td className="px-4 py-2 whitespace-nowrap text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.has(freelancer.userId)}
                                                onChange={() => toggleUserSelection(freelancer.userId)}
                                                className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                            {freelancer.name}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                            {freelancer.email}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                            {freelancer.title}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                            {freelancer.lastUpdated}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewCV(freelancer)}
                                                    className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins hover:opacity-90 transition-opacity"
                                                    title="View CV"
                                                >
                                                    View CV
                                                </button>

                                                <button
                                                    onClick={() => handleViewHistory(freelancer)}
                                                    className="px-3 py-1 rounded-[15px] bg-blue-500 text-white text-[10px] font-medium font-poppins hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                    title="View Application History"
                                                >
                                                    <History className="w-3 h-3" />
                                                    History
                                                </button>

                                                <button
                                                    onClick={() => handleMoveToJob(freelancer)}
                                                    className="px-3 py-1 rounded-[15px] border border-[#5530FA] text-[#5530FA] text-[10px] font-medium font-poppins hover:bg-[#5530FA] hover:text-white transition-colors"
                                                >
                                                    Move to Job
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteFreelancer(freelancer)}
                                                    className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Delete freelancer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-[#676767] text-sm font-poppins">
                                        {searchTerm || roleFilters.length > 0 ? 'No freelancers found matching your filters.' : 'No freelancers found in talent pool.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>

            {successDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    onClick={() => setSuccessDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-green-600 mb-4">{successDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{successDialog.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSuccessDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    onClick={() => setErrorDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-red-600 mb-4">{errorDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{errorDialog.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setErrorDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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

            {showHistoryModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-3xl bg-opacity-50 p-4 overflow-y-auto">
                    <div className="w-full max-w-6xl bg-white rounded-[25px] shadow-xl my-8">
                        <div className="sticky top-0 bg-white rounded-t-[25px] border-b border-gray-200 p-6 z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <History className="w-6 h-6 text-[#5530FA]" />
                                        <h2 className="text-2xl font-semibold text-[#6c6c6c]">
                                            Application History
                                        </h2>
                                    </div>
                                    {applicationHistory && (
                                        <div className="space-y-1">
                                            <p className="text-[#6c6c6c] font-medium">
                                                {applicationHistory.user.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {applicationHistory.user.email}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={resetHistoryModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {applicationHistory && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {applicationHistory.summary.total_applications}
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium mt-1">
                                            Total Applications
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                        <div className="text-2xl font-bold text-green-600">
                                            {applicationHistory.summary.active_jobs_count}
                                        </div>
                                        <div className="text-xs text-green-600 font-medium mt-1">
                                            Active Jobs
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                                        <div className="text-2xl font-bold text-red-600">
                                            {applicationHistory.summary.deleted_jobs_count}
                                        </div>
                                        <div className="text-xs text-red-600 font-medium mt-1">
                                            Deleted Jobs
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {applicationHistory.summary.status_breakdown.hired || 0}
                                        </div>
                                        <div className="text-xs text-purple-600 font-medium mt-1">
                                            Hired
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={historyStatusFilter}
                                    onChange={(e) => handleHistoryFilterChange(e.target.value)}
                                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="interviewed">Interviewed</option>
                                    <option value="offered">Offered</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="rejected-interview">Rejected (Interview)</option>
                                    <option value="hired">Hired</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {loadingHistory ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading application history...</p>
                                    </div>
                                </div>
                            ) : historyError ? (
                                <div className="text-center py-12">
                                    <div className="text-red-500 mb-4">
                                        <X className="w-12 h-12 mx-auto" />
                                    </div>
                                    <p className="text-gray-600 mb-4">{historyError}</p>
                                    <button
                                        onClick={() => selectedFreelancer && fetchApplicationHistory(selectedFreelancer.userId)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : applicationHistory && applicationHistory.applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applicationHistory.applications.map((app) => (
                                        <div
                                            key={app.id}
                                            className={`border rounded-lg p-5 hover:shadow-md transition-shadow ${app.job_deleted ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <Briefcase className="w-5 h-5 text-[#5530FA] mt-1 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-[#6c6c6c] flex items-center gap-2 flex-wrap">
                                                                {app.job_details.title}
                                                                {app.job_deleted && (
                                                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded border border-red-200">
                                                                        Job Deleted
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                                                                <span>{app.job_details.location}</span>
                                                                <span>•</span>
                                                                <span className="capitalize">{app.job_details.type.replace('-', ' ')}</span>
                                                                <span>•</span>
                                                                <span>{app.job_details.category}</span>
                                                                <span>•</span>
                                                                <span className="capitalize">{app.job_details.experience}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(app.status)}`}>
                                                        {app.status_display}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>Posted {app.job_details.posted_at}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <p className="text-gray-600 line-clamp-2">
                                                        {app.job_details.description}
                                                    </p>
                                                </div>

                                                {app.job_details.required_skills && app.job_details.required_skills.length > 0 && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">Required Skills: </span>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {app.job_details.required_skills.map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs border border-blue-200"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {app.job_details.deadline && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FileText className="w-4 h-4" />
                                                        <span className="font-medium">Deadline:</span>
                                                        <span>{app.job_details.deadline}</span>
                                                    </div>
                                                )}

                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                                        <div>
                                                            <span className="font-medium">Applied:</span>{' '}
                                                            {new Date(app.applied_at).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Last Updated:</span>{' '}
                                                            {new Date(app.updated_at).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg mb-2">No Application History</p>
                                    <p className="text-gray-500 text-sm">
                                        This candidate hasn&apos;t applied to any jobs yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white rounded-b-[25px] border-t border-gray-200 p-6">
                            <button
                                onClick={resetHistoryModal}
                                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignPopup && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-2xl bg-opacity-50 p-4"
                    onClick={() => setShowAssignPopup(false)}
                >
                    <div
                        className="w-full max-w-[600px] bg-white rounded-[25px] shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-[#6c6c6c] mb-2">
                                    Assign Candidate to a Job
                                </h2>
                                <p className="text-[#6c6c6c]/80 text-sm">
                                    Assign this candidate to an open role. Candidate remains in Talent Pool.
                                </p>
                            </div>
                            <button
                                onClick={resetAssignPopup}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                disabled={assigningJob}
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Freelancer Name
                            </label>
                            <div className="w-full bg-gray-50 rounded-lg p-4 border">
                                <span className="text-[#6c6c6c] font-medium">
                                    {selectedFreelancer?.name || 'No freelancer selected'}
                                </span>
                                <div className="text-sm text-gray-500 mt-1">
                                    {selectedFreelancer?.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {selectedFreelancer?.title}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6" ref={dropdownRef}>
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Select Job
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={jobSearchTerm}
                                    onChange={(e) => {
                                        setJobSearchTerm(e.target.value);
                                        setShowJobDropdown(true);
                                        if (e.target.value === '') {
                                            setSelectedJob(null);
                                        }
                                    }}
                                    onFocus={() => setShowJobDropdown(true)}
                                    placeholder="Search and select a job..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                />
                                <button
                                    onClick={() => setShowJobDropdown(!showJobDropdown)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showJobDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showJobDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-20 mt-1">
                                        {filteredJobs.length > 0 ? (
                                            filteredJobs.map((job) => (
                                                <button
                                                    key={job.id}
                                                    onClick={() => handleJobSelect(job)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-medium text-[#6c6c6c]">{job.title}</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {job.location} • {job.type} • {job.category}
                                                    </div>
                                                    {job.deadline && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Deadline: {job.deadline}
                                                        </div>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                {jobSearchTerm ? 'No jobs found matching your search' : 'No jobs available'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedJob && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="font-medium text-blue-800">Selected: {selectedJob.title}</div>
                                    <div className="text-sm text-blue-600">
                                        {selectedJob.location} • {selectedJob.type} • {selectedJob.category}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAssignToJob}
                                disabled={!selectedJob || assigningJob}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                            >
                                {assigningJob ? 'Assigning...' : 'Assign to Job'}
                            </button>
                            <button
                                onClick={resetAssignPopup}
                                disabled={assigningJob}
                                className="flex-1 px-6 py-3 border border-[#5530FA] text-[#5530FA] rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBulkMoveDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-2xl bg-opacity-50 p-4"
                    onClick={() => setShowBulkMoveDialog(false)}
                >
                    <div
                        className="w-full max-w-[600px] bg-white rounded-[25px] shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-[#6c6c6c] mb-2">
                                    Bulk Move to Job
                                </h2>
                                <p className="text-[#6c6c6c]/80 text-sm">
                                    Move {selectedUsers.size} selected user(s) to a job as candidates.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowBulkMoveDialog(false);
                                    setSelectedJob(null);
                                    setJobSearchTerm('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                disabled={bulkMoving}
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Selected Users ({selectedUsers.size})
                            </label>
                            <div className="w-full bg-gray-50 rounded-lg p-4 border max-h-32 overflow-y-auto">
                                {freelancers.filter(f => selectedUsers.has(f.userId)).map(f => (
                                    <div key={f.userId} className="text-sm text-gray-600 py-1">
                                        {f.name} ({f.title})
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[#6c6c6c] text-base font-medium mb-3">
                                Select Job
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={jobSearchTerm}
                                    onChange={(e) => {
                                        setJobSearchTerm(e.target.value);
                                        setShowJobDropdown(true);
                                        if (e.target.value === '') {
                                            setSelectedJob(null);
                                        }
                                    }}
                                    onFocus={() => setShowJobDropdown(true)}
                                    placeholder="Search and select a job..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                />
                                <button
                                    onClick={() => setShowJobDropdown(!showJobDropdown)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showJobDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showJobDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-20 mt-1">
                                        {filteredJobs.length > 0 ? (
                                            filteredJobs.map((job) => (
                                                <button
                                                    key={job.id}
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setJobSearchTerm(job.title);
                                                        setShowJobDropdown(false);
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-medium text-[#6c6c6c]">{job.title}</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {job.location} • {job.type} • {job.category}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                {jobSearchTerm ? 'No jobs found matching your search' : 'No jobs available'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedJob && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="font-medium text-blue-800">Selected: {selectedJob.title}</div>
                                    <div className="text-sm text-blue-600">
                                        {selectedJob.location} • {selectedJob.type} • {selectedJob.category}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleBulkMoveToJob}
                                disabled={!selectedJob || bulkMoving}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                            >
                                {bulkMoving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Moving...</span>
                                    </>
                                ) : (
                                    `Move ${selectedUsers.size} User(s) to Job`
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowBulkMoveDialog(false);
                                    setSelectedJob(null);
                                    setJobSearchTerm('');
                                }}
                                disabled={bulkMoving}
                                className="flex-1 px-6 py-3 border border-[#5530FA] text-[#5530FA] rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TalentPool;