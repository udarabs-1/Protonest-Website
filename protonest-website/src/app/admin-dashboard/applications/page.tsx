"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    job_match?: JobMatch;
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

const ApplicationPipeline = () => {
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [jobMatches, setJobMatches] = useState<{ [userId: string]: JobMatch | null }>({});
    const [searchInput, setSearchInput] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/applications/all`,
                    {
                        headers: {
                            'Authorization': `Bearer ${adminToken}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    const applicationsData = data.data?.applications || [];
                    setCandidates(applicationsData);

                    const matchesMap: { [userId: string]: JobMatch | null } = {};
                    applicationsData.forEach((app: Candidate) => {
                        if (app.user?._id && app.job_match) {
                            matchesMap[app.user._id] = {
                                job_id: app.job_match.job_id || app.job._id,
                                job_title: app.job_match.job_title || app.job.title,
                                category: app.job_match.category || '',
                                match_percentage: app.job_match.match_percentage || 0,
                                matched_skills: app.job_match.matched_skills || [],
                                missing_skills: app.job_match.missing_skills || []
                            };
                        } else if (app.user?._id) {
                            matchesMap[app.user._id] = null;
                        }
                    });
                    setJobMatches(matchesMap);
                } else {
                    throw new Error(data.message || 'Failed to fetch applications');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An error occurred while fetching applications');
                }
                console.error('Error fetching applications:', err);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);



    const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const trimmedInput = searchInput.trim();
            if (!activeFilters.includes(trimmedInput)) {
                setActiveFilters([...activeFilters, trimmedInput]);
            }
            setSearchInput('');
        }
    };

    const handleRemoveFilter = (filterToRemove: string) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

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

    const generatePipelineStages = (candidate: Candidate): PipelineStage[] => {
        const stages: PipelineStage[] = [];
        const appliedDate = new Date(candidate.added_at);
        const updatedDate = new Date(candidate.updated_at);

        stages.push({
            stage: 'CV Submitted',
            date: appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'completed',
            icon: '📄'
        });

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

    const filteredCandidates = candidates.filter(candidate => {
        if (!candidate) return false;

        if (!candidate.job?.title) return false;

        if (activeFilters.length === 0) return true;

        return activeFilters.some(filter => {
            const lowerFilter = filter.toLowerCase();

            if (candidate.user?.name && candidate.user.name.toLowerCase().includes(lowerFilter)) return true;

            if (candidate.job?.title && candidate.job.title.toLowerCase().includes(lowerFilter)) return true;

            if (candidate.user?.email && candidate.user.email.toLowerCase().includes(lowerFilter)) return true;

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
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Application Pipeline' }
            ]}
        >
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="sticky top-0 z-40 bg-white pb-2 pt-1">
                <div className="mb-4">
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

                <div className="flex items-center gap-3 mb-2">
                    <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleAddFilter}
                            className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                            placeholder="Type and press Enter to add filter"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {activeFilters.length > 0 && (
                    <div className="">
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
            </div>

            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                    <div className="col-span-12 md:col-span-2">Candidate Name</div>
                    <div className="col-span-12 md:col-span-2 hidden md:block">Role Applied For</div>
                    <div className="col-span-12 md:col-span-2 hidden md:block">Current Stage</div>
                    <div className="col-span-12 md:col-span-2 hidden md:block">NDA Status</div>
                    <div className="col-span-12 md:col-span-2 hidden md:block">Match Score</div>
                    <div className="col-span-12 md:col-span-2 hidden md:block">Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => {
                            const jobMatch = jobMatches[candidate.user._id];
                            const matchScore = jobMatch ? `${jobMatch.match_percentage.toFixed(0)}%` : 'N/A';
                            const pipelineStages = generatePipelineStages(candidate);
                            const ndaStatus = getNDAStatus(candidate);

                            return (
                                <div key={candidate.id} className="bg-white">
                                    <div className="px-4 py-3 grid grid-cols-12 gap-4 hover:bg-gray-50 transition-colors">
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
        </AdminLayout>
    );
};

export default ApplicationPipeline;