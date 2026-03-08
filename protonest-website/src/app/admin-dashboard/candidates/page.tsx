"use client";
import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import JSZip from 'jszip';
import {
    Award,
    Briefcase,
    Calendar,
    ChevronDown,
    ChevronUp,
    Download,
    Eye,
    EyeOff,
    Mail,
    MapPin,
    Search,
    Sparkles,
    Trash2,
    TrendingUp,
    Upload,
    User,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
    cv_viewed?: boolean;
}
interface JobGroup {
    job_id: string;
    job_title: string;
    total_candidates: number;
    candidates: Candidate[];
    isExpanded: boolean;
    isAnalyzing: boolean;
    hasRankings: boolean;
    rankings?: CandidateRanking[];
    selectedCandidates?: Set<string>;
}
interface CandidateRanking {
    rank_position: number;
    candidate_id: string;
    candidate_name: string;
    candidate_email: string;
    user_id: string;
    overall_score: number;
    original_score?: number;
    experience_match_score: number;
    skills_match_score: number;
    question_scores: Array<{
        question_index: number;
        score: number;
    }>;
    differentiation_factors?: {
        cv_quality: number;
        experience_depth: number;
        skill_relevance: number;
        career_trajectory: number;
    };
    evaluated_at: string;
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
interface NDADocument {
    id: string;
    download_url: string;
    file_name: string;
    file_size: number;
    version: number;
    uploaded_by: string;
    description?: string;
    is_active: boolean;
    uploaded_at: string;
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

const CandidateManagement = () => {
    const [jobGroups, setJobGroups] = useState<JobGroup[]>([]);
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
    const [ndaDocuments, setNdaDocuments] = useState<NDADocument[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadingNDA, setUploadingNDA] = useState(false);
    const [statusDropdown, setStatusDropdown] = useState<StatusDropdown | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [bulkDownloadDialog, setBulkDownloadDialog] = useState<JobGroup | null>(null);
    const [bulkStatusDialog, setBulkStatusDialog] = useState<JobGroup | null>(null);
    const [bulkInterviewDialog, setBulkInterviewDialog] = useState<JobGroup | null>(null);
    const [bulkNdaDialog, setBulkNdaDialog] = useState<JobGroup | null>(null);
    const [downloadingBulk, setDownloadingBulk] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [bulkSearchQuery, setBulkSearchQuery] = useState('');
    const [jobSearchQueries, setJobSearchQueries] = useState<{ [jobId: string]: string }>({});
    const [interviewSubject, setInterviewSubject] = useState('');
    const [interviewBody, setInterviewBody] = useState('');
    const [interviewCc, setInterviewCc] = useState('');
    const [interviewBcc, setInterviewBcc] = useState('');
    const [ndaSubject, setNdaSubject] = useState('');
    const [ndaBody, setNdaBody] = useState('');
    const [ndaCc, setNdaCc] = useState('');
    const [ndaBcc, setNdaBcc] = useState('');
    const [sendingNDA, setSendingNDA] = useState(false);
    const [sendingInterview, setSendingInterview] = useState(false);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    const breadcrumbItems = [
        { label: 'Admin Portal', href: '/admin-dashboard' },
        { label: 'Candidate Management' }
    ];

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    const statusOptions = [
        { value: 'applied', label: 'Applied', color: 'bg-[#86dcff]' },
        { value: 'admin_moved', label: 'Admin Moved', color: 'bg-[#ffd986]' },
        { value: 'shortlisted', label: 'Shortlisted', color: 'bg-[#e2ff86]' },
        { value: 'interviewed', label: 'Interviewed', color: 'bg-[#86dcff]' },
        { value: 'hired', label: 'Hired', color: 'bg-[#86ffae]' },
        { value: 'rejected', label: 'Rejected', color: 'bg-[#ff8686]' }
    ];

    const saveRankingsToLocalStorage = (jobId: string, rankings: CandidateRanking[]) => {
        try {
            const rankingsData = {
                rankings,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(`job_rankings_${jobId}`, JSON.stringify(rankingsData));
        } catch (error) {
            console.error('Error saving rankings to localStorage:', error);
        }
    };

    const loadRankingsFromLocalStorage = (jobId: string): CandidateRanking[] | null => {
        try {
            const stored = localStorage.getItem(`job_rankings_${jobId}`);
            if (stored) {
                const data = JSON.parse(stored);
                return data.rankings;
            }
        } catch (error) {
            console.error('Error loading rankings from localStorage:', error);
        }
        return null;
    };

    const sortCandidatesByRankings = (candidates: Candidate[], rankings: CandidateRanking[]): Candidate[] => {
        const rankedCandidates: Candidate[] = [];
        const unrankedCandidates: Candidate[] = [];

        candidates.forEach(candidate => {
            const ranking = rankings.find(r => r.user_id === candidate.user._id);
            if (ranking) {
                rankedCandidates.push(candidate);
            } else {
                unrankedCandidates.push(candidate);
            }
        });

        rankedCandidates.sort((a, b) => {
            const rankA = rankings.find(r => r.user_id === a.user._id);
            const rankB = rankings.find(r => r.user_id === b.user._id);
            return (rankA?.rank_position || 0) - (rankB?.rank_position || 0);
        });

        return [...rankedCandidates, ...unrankedCandidates];
    };

    const fetchNDADocuments = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch NDA documents');
            }

            const data = await response.json();
            if (data.documents && Array.isArray(data.documents)) {
                setNdaDocuments(data.documents);
                const activeDoc = data.documents.find((doc: NDADocument) => doc.is_active);
                if (activeDoc) {
                    setSelectedTemplate(activeDoc.id);
                }
            }
        } catch (error) {
            console.error('Error fetching NDA documents:', error);
        }
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

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
                    const candidates = Array.isArray(candidatesData) ? candidatesData : [];

                    const grouped = groupCandidatesByJob(candidates);

                    const groupedWithRankings = grouped.map(group => {
                        const storedRankings = loadRankingsFromLocalStorage(group.job_id);
                        if (storedRankings && storedRankings.length > 0) {
                            const sortedCandidates = sortCandidatesByRankings(group.candidates, storedRankings);
                            return {
                                ...group,
                                candidates: sortedCandidates,
                                hasRankings: true,
                                rankings: storedRankings,
                                selectedCandidates: new Set<string>()
                            };
                        }
                        return {
                            ...group,
                            selectedCandidates: new Set<string>()
                        };
                    });

                    setJobGroups(groupedWithRankings);
                }
                else {
                    throw new Error(data.message || 'Failed to fetch candidates');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An error occurred while fetching candidates');
                }
                console.error('Error fetching candidates:', err);
                setJobGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
        fetchNDADocuments();
    }, []);

    const groupCandidatesByJob = (candidates: Candidate[]): JobGroup[] => {
        const jobMap = new Map<string, JobGroup>();

        candidates.forEach(candidate => {
            const jobId = candidate.job?._id;
            const jobTitle = candidate.job?.title;

            if (!jobId || !jobTitle) {
                return;
            }

            if (!jobMap.has(jobId)) {
                jobMap.set(jobId, {
                    job_id: jobId,
                    job_title: jobTitle,
                    total_candidates: 0,
                    candidates: [],
                    isExpanded: false,
                    isAnalyzing: false,
                    hasRankings: false,
                    rankings: [],
                    selectedCandidates: new Set<string>()
                });
            }

            const group = jobMap.get(jobId)!;
            group.candidates.push(candidate);
            group.total_candidates = group.candidates.length;
        });

        return Array.from(jobMap.values()).sort((a, b) => b.total_candidates - a.total_candidates);
    };

    const toggleJobExpansion = (jobId: string) => {
        setJobGroups(prev => prev.map(group =>
            group.job_id === jobId
                ? { ...group, isExpanded: !group.isExpanded }
                : group
        ));
    };

    const handleBulkDownload = async (jobGroup: JobGroup) => {
        if (!jobGroup.selectedCandidates || jobGroup.selectedCandidates.size === 0) {
            setErrorDialog({ title: 'Selection Error', message: 'Please select at least one candidate to download CVs' });
            return;
        }

        try {
            setDownloadingBulk(true);
            const adminToken = localStorage.getItem('adminToken');
            const selectedCandidateIds = Array.from(jobGroup.selectedCandidates);

            const zip = new JSZip();
            let successCount = 0;

            for (const candidateId of selectedCandidateIds) {
                const candidate = jobGroup.candidates.find(c => c.id === candidateId);
                if (!candidate) continue;
                const userId = candidate.user._id;

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/download/${userId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${adminToken}`
                            }
                        }
                    );

                    if (response.ok) {
                        const blob = await response.blob();
                        const cleanName = candidate.user.name.replace(/\s+/g, '_');
                        const fileName = `${cleanName}_CV.pdf`;

                        zip.file(fileName, blob);
                        successCount++;
                    }
                } catch (error) {
                    console.error(`Error downloading CV for ${candidate.user.name}: `, error);
                }
            }

            if (successCount > 0) {

                const zipBlob = await zip.generateAsync({ type: 'blob' });

                const url = window.URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;

                const jobTitle = jobGroup.job_title.replace(/\s+/g, '_');
                const date = new Date().toISOString().split('T')[0];
                a.download = `${jobTitle}_CVs_${date}.zip`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setSuccessDialog({ title: 'Download Complete', message: `Successfully downloaded ${successCount} CV(s) in a zip file` });
            } else {
                setErrorDialog({ title: 'Download Failed', message: 'Failed to download any CVs. Please try again.' });
            }

            setBulkDownloadDialog(null);

            setJobGroups(prev => prev.map(group =>
                group.job_id === jobGroup.job_id
                    ? { ...group, selectedCandidates: new Set<string>() }
                    : group
            ));
        } catch (error) {
            console.error('Error creating zip file:', error);
            setErrorDialog({ title: 'Download Error', message: 'Failed to create zip file. Please try again.' });
        } finally {
            setDownloadingBulk(false);
        }
    };

    const handleAnalyzeJob = async (jobId: string) => {
        try {

            setJobGroups(prev => prev.map(group =>
                group.job_id === jobId
                    ? { ...group, isAnalyzing: true }
                    : group
            ));

            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}/rank-candidates`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to analyze candidates');
            }

            const data = await response.json();

            if (data.status === 'success' && data.data?.rankings) {

                saveRankingsToLocalStorage(jobId, data.data.rankings);

                setJobGroups(prev => prev.map(group => {
                    if (group.job_id === jobId) {

                        const sortedCandidates = sortCandidatesByRankings(group.candidates, data.data.rankings);

                        return {
                            ...group,
                            isAnalyzing: false,
                            hasRankings: true,
                            rankings: data.data.rankings,
                            candidates: sortedCandidates,
                            isExpanded: true
                        };
                    }
                    return group;
                }));

                setSuccessDialog({ title: 'Analysis Complete', message: `Successfully analyzed ${data.data.evaluated_candidates} candidates! Rankings saved.` });
            }
        } catch (error) {
            console.error('Error analyzing job:', error);
            setErrorDialog({ title: 'Analysis Failed', message: 'Failed to analyze candidates. Please try again.' });

            setJobGroups(prev => prev.map(group =>
                group.job_id === jobId
                    ? { ...group, isAnalyzing: false }
                    : group
            ));
        }
    };

    const handleClearCache = (jobId: string, jobTitle: string) => {
        setConfirmDialog({
            title: 'Clear Cache',
            message: `Clear all AI rankings for "${jobTitle}"?\n\nThis will remove all cached rankings and you'll need to re-analyze candidates.`,
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const adminToken = localStorage.getItem('adminToken');
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}/clear-rankings-cache`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${adminToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to clear cache');
                    }

                    const data = await response.json();

                    if (data.status === 'success') {

                        localStorage.removeItem(`job_rankings_${jobId}`);

                        setJobGroups(prev => prev.map(group => {
                            if (group.job_id === jobId) {
                                return {
                                    ...group,
                                    hasRankings: false,
                                    rankings: [],
                                    candidates: group.candidates
                                };
                            }
                            return group;
                        }));

                        setSuccessDialog({ title: 'Cache Cleared', message: `Successfully cleared ${data.data?.deleted_count || 0} cached ranking(s) for "${jobTitle}"` });
                    }
                } catch (error) {
                    console.error('Error clearing cache:', error);
                    setErrorDialog({ title: 'Error', message: 'Failed to clear cache. Please try again.' });
                }
            }
        });
    };

    const getCandidateRanking = (jobGroup: JobGroup, candidate: Candidate): CandidateRanking | null => {
        if (!jobGroup.hasRankings || !jobGroup.rankings) return null;
        return jobGroup.rankings.find(r => r.user_id === candidate.user._id) || null;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setStatusDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [statusDropdown]);

    const fetchCandidateDetails = async (candidate: Candidate) => {
        setDetailsLoading(true);
        setCandidateDetails(null);

        try {
            const adminToken = localStorage.getItem('adminToken');
            const userId = candidate.user._id;

            const [expertiseResponse, jobMatchesResponse, skillsSummaryResponse, cvInfoResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/expertise-areas/${userId}`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/job-matches/${userId}`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/admin/skills-summary/${userId}`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                })
            ]);

            const expertiseData = await expertiseResponse.json();
            const jobMatchesData = await jobMatchesResponse.json();
            const skillsSummaryData = await skillsSummaryResponse.json();
            const cvInfoData = await cvInfoResponse.json();

            let jobMatch = null;
            if (jobMatchesData.success && jobMatchesData.data.job_matches) {
                jobMatch = jobMatchesData.data.job_matches.find(
                    (match: JobMatch) => match.job_id === candidate.job._id
                );
            }

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

    const handleDownloadCVFromDialog = async (userId: string, userName: string) => {
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
                const a = document.createElement('a');
                a.href = url;
                a.download = `${userName.replace(/\s+/g, '_')}_CV.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                setErrorDialog({ title: 'Download Failed', message: 'Failed to download CV' });
            }
        } catch (error) {
            console.error('Error downloading CV:', error);
            setErrorDialog({ title: 'Download Error', message: 'Failed to download CV' });
        }
    };

    const handlePreviewCVFromDialog = async (userId: string) => {
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
                setErrorDialog({ title: 'Preview Failed', message: 'Failed to preview CV' });
            }
        } catch (error) {
            console.error('Error previewing CV:', error);
            setErrorDialog({ title: 'Preview Error', message: 'Failed to preview CV' });
        }
    };

    const filteredJobGroups = jobGroups
        .map(group => {
            const matchesJobTitle = group.job_title.toLowerCase().includes(searchQuery.toLowerCase());
            const filteredCandidates = group.candidates.filter(candidate =>
                candidate.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                candidate.user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchesJobTitle) {
                return group;
            } else if (filteredCandidates.length > 0) {
                return { ...group, candidates: filteredCandidates };
            }
            return null;
        })
        .filter((group): group is JobGroup => group !== null);

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
    const handleBulkStatusChange = async (newStatus: string) => {
        if (!bulkStatusDialog || !bulkStatusDialog.selectedCandidates) return;
        setUpdatingStatus('bulk');
        const selectedIds = Array.from(bulkStatusDialog.selectedCandidates);
        let successCount = 0;

        for (const candidateId of selectedIds) {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    successCount++;
                    setJobGroups(prev => prev.map(group => ({
                        ...group,
                        candidates: group.candidates.map(candidate =>
                            candidate.id === candidateId
                                ? { ...candidate, status: newStatus, updated_at: new Date().toISOString() }
                                : candidate
                        )
                    })));
                }
            } catch (error) {
                console.error(`Failed to update status for ${candidateId}`, error);
            }
        }

        if (successCount > 0) {
            setSuccessDialog({
                title: 'Success',
                message: `Successfully updated status for ${successCount} candidates.`
            });
        }

        setBulkStatusDialog(null);
        setUpdatingStatus(null);
    };

    const handleBulkSendInterview = async () => {
        if (!bulkInterviewDialog || !bulkInterviewDialog.selectedCandidates) return;
        setSendingInterview(true);
        const selectedIds = Array.from(bulkInterviewDialog.selectedCandidates);
        let successCount = 0;

        for (const candidateId of selectedIds) {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const emailData = {
                    subject: interviewSubject,
                    cc: interviewCc,
                    bcc: interviewBcc,
                    body: interviewBody.replace(/<br>/g, '\n')
                };

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/interview/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });

                if (response.ok) {
                    successCount++;
                }
            } catch (error) {
                console.error(`Failed to send interview to ${candidateId}`, error);
            }
        }

        if (successCount > 0) {
            setSuccessDialog({
                title: 'Success',
                message: `Successfully sent interview invitations to ${successCount} candidates.`
            });
            setInterviewSubject('');
            setInterviewBody('');
            setInterviewCc('');
            setInterviewBcc('');
        }

        setBulkInterviewDialog(null);
        setSendingInterview(false);
    };

    const handleBulkSendNda = async () => {
        if (!bulkNdaDialog || !bulkNdaDialog.selectedCandidates) return;
        if (!ndaSubject.trim()) {
            setErrorDialog({ title: 'Validation Error', message: 'Email subject is required' });
            return;
        }
        if (selectedNda === 'template' && !selectedTemplate) {
            setErrorDialog({ title: 'Validation Error', message: 'Please select an NDA template' });
            return;
        }
        if (selectedNda === 'upload' && !uploadedFile) {
            setErrorDialog({ title: 'Validation Error', message: 'Please upload an NDA document' });
            return;
        }

        setSendingNDA(true);
        const selectedIds = Array.from(bulkNdaDialog.selectedCandidates);
        let successCount = 0;

        try {
            const adminToken = localStorage.getItem('adminToken');

            for (const candidateId of selectedIds) {
                const requestBody: any = {
                    subject: ndaSubject,
                    body: ndaBody.replace(/<br>/g, '\n'),
                    cc: ndaCc,
                    bcc: ndaBcc,
                    nda_type: selectedNda
                };

                if (selectedNda === 'template' && selectedTemplate) {
                    requestBody.nda_document_id = selectedTemplate;
                } else if (selectedNda === 'upload') {
                    // Upload logic
                    const formData = new FormData();
                    formData.append('file', uploadedFile as File);
                    const uploadResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda-documents/admin/upload`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${adminToken}`
                            },
                            body: formData
                        }
                    );
                    if (uploadResponse.ok) {
                        const data = await uploadResponse.json();
                        if (data.success && data.data?.document_url) {
                            requestBody.nda_document_url = data.data.document_url;
                        }
                    }
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/nda/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    successCount++;
                    setJobGroups(prev => prev.map(group => ({
                        ...group,
                        candidates: group.candidates.map(candidate =>
                            candidate.id === candidateId
                                ? {
                                    ...candidate,
                                    nda_status: {
                                        status: 'sent',
                                        sent_on: new Date().toISOString(),
                                        compliance_notes: ndaBody || '',
                                        resend_count: candidate.nda_status?.resend_count || 0,
                                        created_at: candidate.nda_status?.created_at || new Date().toISOString(),
                                        updated_at: new Date().toISOString()
                                    }
                                }
                                : candidate
                        )
                    })));
                }
            }

            if (successCount > 0) {
                setSuccessDialog({
                    title: 'Success',
                    message: `Successfully sent NDA to ${successCount} candidates.`
                });
                setNdaSubject('');
                setNdaBody('');
                setNdaCc('');
                setNdaBcc('');
                setUploadedFile(null);
                setSelectedTemplate('');
            }
        } catch (error) {
            console.error('Failed to send NDAs', error);
        } finally {
            setSendingNDA(false);
            setBulkNdaDialog(null);
        }
    };

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

            setJobGroups(prev => prev.map(group => ({
                ...group,
                candidates: group.candidates.map(candidate =>
                    candidate.id === candidateId
                        ? { ...candidate, status: newStatus, updated_at: new Date().toISOString() }
                        : candidate
                )
            })));

        } catch (err) {
            console.error('Error updating status:', err);
            setErrorDialog({ title: 'Update Failed', message: 'Failed to update status' });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getActionText = (candidate: Candidate) => {
        switch (candidate.status) {
            case 'applied': return 'Proceed';
            case 'admin_moved': return 'Proceed';
            case 'shortlisted': return 'Call For Interview';
            case 'interviewed':
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



    const generateFullEmailPreview = (userName: string, subject: string, body: string, isCareerEmail: boolean = true) => {
        const firstName = userName.split(' ')[0] || 'User';
        const team = isCareerEmail ? 'Recruitment Team' : 'Protonest Team';
        const replyTo = isCareerEmail ? '\n\nReply to: careers@protonest.co' : '';

        return `Dear ${firstName},\n\n${body.replace(/<br>/g, '\n')}\n\nHave a great day!\n\nBest regards,\n${team},\nProtonest\n\nThis is an automated message from Protonest. If you have any questions, feel free to contact us.${replyTo}`;
    };

    const setInterviewDialogContent = (candidate: Candidate) => {
        const defaultSubject = `Interview invitation for ${candidate.job?.title || 'the position'}`;
        const defaultBody = `We would like to invite you to an interview for the ${candidate.job?.title || 'position'} role.<br><br>Please confirm your availability by booking a meeting using the link below.<br><br>We look forward to discussing your qualifications and learning more about your experience.`;

        setInterviewSubject(defaultSubject);
        setInterviewBody(defaultBody);
        setInterviewDialog(candidate);
    };

    const setNdaDialogContent = (candidate: Candidate) => {
        const defaultSubject = `NDA for your review`;
        const defaultBody = `We're excited to move forward with your application for the role of ${candidate.job?.title || '[Role Name]'} at Protonest.<br><br>To proceed, please review and sign the attached Non-Disclosure Agreement (NDA). Here's what to do:<br><br>1. Download and carefully read the attached NDA document<br>2. Sign the document electronically or print, sign, and scan<br>3. Upload the signed NDA to your candidate portal or reply to this email with the signed document attached<br><br>Please complete this within 3 business days. If you have any questions about the NDA, feel free to reach out.`;

        setNdaSubject(defaultSubject);
        setNdaBody(defaultBody);
        setNdaDialog(candidate);
    };

    const handleSendNda = async () => {
        if (!ndaDialog) return;

        let ndaDocumentUrl: string | null = null;
        let ndaDocumentId: string | undefined = undefined;

        if (selectedNda === 'upload') {
            if (!uploadedFile) {
                setErrorDialog({ title: 'Validation Error', message: 'Please select a file to upload' });
                return;
            }

            ndaDocumentUrl = await uploadNDADocument(uploadedFile);
            if (!ndaDocumentUrl) {
                return;
            }
        } else {
            if (!selectedTemplate) {
                setErrorDialog({ title: 'Validation Error', message: 'Please select an NDA template' });
                return;
            }
            ndaDocumentId = selectedTemplate;
        }

        const ccEmails = ndaCc
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        const bccEmails = ndaBcc
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        setSendingNDA(true);
        try {
            const requestBody: {
                nda_document_id?: string;
                nda_document_url?: string;
                compliance_notes?: string;
                subject: string;
                message: string;
                cc?: string[];
                bcc?: string[];
            } = {
                subject: ndaSubject,
                message: ndaBody,
                compliance_notes: ndaBody || '',
                cc: ccEmails,
                bcc: bccEmails
            };

            if (selectedNda === 'template' && ndaDocumentId) {
                requestBody.nda_document_id = ndaDocumentId;
            } else if (selectedNda === 'upload' && ndaDocumentUrl) {
                requestBody.nda_document_url = ndaDocumentUrl;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${ndaDialog.id}/nda/send`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send NDA');
            }

            await response.json();

            setJobGroups(prev => prev.map(group => ({
                ...group,
                candidates: group.candidates.map(candidate =>
                    candidate.id === ndaDialog.id
                        ? {
                            ...candidate,
                            nda_status: {
                                status: 'sent',
                                sent_on: new Date().toISOString(),
                                compliance_notes: ndaBody || '',
                                resend_count: candidate.nda_status?.resend_count || 0,
                                created_at: candidate.nda_status?.created_at || new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            }
                        }
                        : candidate
                )
            })));

            setSuccessDialog({
                title: 'NDA Sent Successfully',
                message: `NDA has been sent to ${ndaDialog.user?.name} (${ndaDialog.user?.email}) with the PDF attachment.`
            });

            setNdaDialog(null);
            setNdaSubject('');
            setNdaBody('');
            setNdaCc('');
            setNdaBcc('');
            setUploadedFile(null);
            setSelectedNda('template');
            setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
        } catch (error) {
            console.error('Error sending NDA:', error);
            setErrorDialog({ title: 'Send Failed', message: error instanceof Error ? error.message : 'Failed to send NDA' });
        } finally {
            setSendingNDA(false);
        }
    };

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

            setJobGroups(prev => prev.map(group => ({
                ...group,
                candidates: group.candidates.filter(c => c.id !== candidate.id),
                total_candidates: group.candidates.filter(c => c.id !== candidate.id).length
            })).filter(group => group.total_candidates > 0));

            setDeleteCandidate(null);
        } catch (err) {
            console.error('Error deleting candidate:', err);
            setErrorDialog({ title: 'Delete Failed', message: 'Failed to delete candidate' });
        }
    };

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

            setJobGroups(prev => prev.map(group => ({
                ...group,
                candidates: group.candidates.map(candidate =>
                    candidate.id === candidateId
                        ? { ...candidate, status: newStatus, updated_at: new Date().toISOString() }
                        : candidate
                )
            })));
        } catch (err) {
            console.error('Error updating status:', err);
            setErrorDialog({ title: 'Update Failed', message: 'Failed to update status' });
        }
    };





    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
            setUploadedFile(file);
        } else {
            setErrorDialog({ title: 'Invalid File', message: 'Please select a PDF file under 10MB' });
        }
    };

    const uploadNDADocument = async (file: File): Promise<string | null> => {
        try {
            setUploadingNDA(true);
            const adminToken = localStorage.getItem('adminToken');

            const formData = new FormData();
            formData.append('document', file);
            formData.append('description', `NDA for ${ndaDialog?.user?.name || 'candidate'}`);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/upload`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload NDA document');
            }

            const data = await response.json();

            if (data.success && data.data?.document_url) {
                await fetchNDADocuments();
                return data.data.document_url;
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Error uploading NDA document:', error);
            setErrorDialog({ title: 'Upload Failed', message: error instanceof Error ? error.message : 'Failed to upload NDA document' });
            return null;
        } finally {
            setUploadingNDA(false);
        }
    };

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
                    setNdaDialogContent(candidate);
                } else {
                    window.location.href = '/admin-dashboard/nda';
                }
                break;
            case 'hired':
                window.location.href = '/admin-dashboard/nda';
                break;
            default:
                console.log('No action available for status:', candidate.status);
        }
    };

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

    const handleToggleCVViewed = async (candidateId: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${candidateId}/cv-viewed`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ cv_viewed: !currentStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update CV viewed status');
            }

            setJobGroups(prev => prev.map(group => ({
                ...group,
                candidates: group.candidates.map(c =>
                    c.id === candidateId
                        ? { ...c, cv_viewed: !currentStatus }
                        : c
                )
            })));

        } catch (error) {
            console.error('Error toggling CV viewed status:', error);
        }
    };

    const handleSendInterview = async () => {
        if (!interviewDialog) return;

        const ccEmails = interviewCc
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        const bccEmails = interviewBcc
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        setSendingInterview(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${interviewDialog.id}/interview/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    subject: interviewSubject,
                    message: interviewBody,
                    cc: ccEmails,
                    bcc: bccEmails
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send interview invitation');
            }

            setSuccessDialog({
                title: 'Interview Invitation Sent',
                message: `Interview invitation has been sent to ${interviewDialog.user?.name} (${interviewDialog.user?.email}).`
            });

            setInterviewDialog(null);
            setInterviewSubject('');
            setInterviewBody('');
            setInterviewCc('');
            setInterviewBcc('');
        } catch (error) {
            console.error('Error sending interview invitation:', error);
            setErrorDialog({ title: 'Send Failed', message: 'Failed to send interview invitation' });
        } finally {
            setSendingInterview(false);
        }
    };

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
        <AdminLayout breadcrumbItems={breadcrumbItems}>
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

                <div className="bg-white pb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                            <Icon
                                icon="solar:user-bold-duotone"
                                className="w-7 h-7"
                            />
                        </div>
                        <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                            Candidate Management
                        </h1>
                    </div>
                    <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat mb-6">
                        View and manage candidates grouped by job roles. Use AI ranking to analyze and sort candidates.
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                placeholder="Search by job title or candidate name/email"
                            />
                            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>


                <div className="space-y-4">
                    {filteredJobGroups.length > 0 ? (
                        filteredJobGroups.map((jobGroup) => (
                            <div
                                key={jobGroup.job_id}
                            >
                                <div
                                    className="bg-gradient-to-r from-[#5530FA]/10 to-white px-4 sm:px-6 py-4 border-2 rounded-[10px] border-gray-100 cursor-pointer"
                                    onClick={() => toggleJobExpansion(jobGroup.job_id)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 hover:opacity-70 transition-opacity flex-shrink-0">
                                                {jobGroup.isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-[#5530FA]" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[#5530FA]" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/jobs/${encodeURIComponent(jobGroup.job_title.toLowerCase().replace(/\s+/g, '-'))}/${jobGroup.job_id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-base sm:text-lg font-medium text-[#4e4e4e] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#5530FA] to-[#F51DA5] inline-block break-words"
                                                >
                                                    {jobGroup.job_title}
                                                </Link>
                                                <div className="flex items-center gap-3 sm:gap-4 mt-1 flex-wrap">
                                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span>{jobGroup.total_candidates} {jobGroup.total_candidates === 1 ? 'Candidate' : 'Candidates'}</span>
                                                    </div>
                                                    {jobGroup.hasRankings && (
                                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-600">
                                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>AI Ranked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => setBulkDownloadDialog(jobGroup)}
                                                disabled={jobGroup.total_candidates === 0}
                                                title="Download CVs"
                                                className={`p-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer ${jobGroup.total_candidates === 0
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 shadow-sm'
                                                    }`}
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="hidden sm:inline">Download CVs</span>
                                            </button>

                                            {jobGroup.hasRankings && (
                                                <button
                                                    onClick={() => handleClearCache(jobGroup.job_id, jobGroup.job_title)}
                                                    title="Clear Rankings"
                                                    className="p-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer shadow-sm"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Clear</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleAnalyzeJob(jobGroup.job_id)}
                                                disabled={jobGroup.isAnalyzing || jobGroup.total_candidates === 0}
                                                title={jobGroup.hasRankings ? 'Re-analyze' : 'Analyze'}
                                                className={`p-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer ${jobGroup.isAnalyzing
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white hover:from-[#F51DA5] hover:to-[#5530FA]'
                                                    }`}
                                            >
                                                {jobGroup.isAnalyzing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span className="hidden sm:inline">Analyzing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        <span className="hidden sm:inline">{jobGroup.hasRankings ? 'Re-analyze' : 'Analyze'}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                {jobGroup.isExpanded && (
                                    <div>
                                        <div className="px-6 py-3 bg-gray-50 border-b">
                                            <div className="relative max-w-md">
                                                <input
                                                    type="text"
                                                    value={jobSearchQueries[jobGroup.job_id] || ''}
                                                    onChange={(e) => setJobSearchQueries(prev => ({
                                                        ...prev,
                                                        [jobGroup.job_id]: e.target.value
                                                    }))}
                                                    className="block w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg outline-none"
                                                    placeholder="Search candidates by name or email..."
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        {jobGroup.selectedCandidates && jobGroup.selectedCandidates.size > 0 && (
                                            <div className="px-6 py-2 bg-indigo-50 border-b flex items-center gap-4 text-sm flex-wrap">
                                                <span className="font-semibold text-indigo-700">{jobGroup.selectedCandidates.size} candidates selected</span>
                                                <button onClick={(e) => { e.stopPropagation(); setBulkStatusDialog(jobGroup); }} className="text-indigo-600 hover:text-indigo-800 font-medium py-1 px-3 bg-white rounded border border-indigo-200 shadow-sm transition-colors cursor-pointer">Update Status</button>
                                                <button onClick={(e) => { e.stopPropagation(); setBulkInterviewDialog(jobGroup); }} className="text-indigo-600 hover:text-indigo-800 font-medium py-1 px-3 bg-white rounded border border-indigo-200 shadow-sm transition-colors cursor-pointer">Send Interview</button>
                                                <button onClick={(e) => { e.stopPropagation(); setBulkNdaDialog(jobGroup); }} className="text-indigo-600 hover:text-indigo-800 font-medium py-1 px-3 bg-white rounded border border-indigo-200 shadow-sm transition-colors cursor-pointer">Send NDA</button>
                                            </div>
                                        )}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-3 py-3 bg-Neutral-200 w-8">
                                                            <input
                                                                type="checkbox"
                                                                title="Select all"
                                                                className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA] cursor-pointer"
                                                                checked={jobGroup.candidates.length > 0 && (jobGroup.selectedCandidates?.size || 0) === jobGroup.candidates.length}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setJobGroups(prev => prev.map(g => {
                                                                        if (g.job_id === jobGroup.job_id) {
                                                                            return {
                                                                                ...g,
                                                                                selectedCandidates: isChecked ? new Set(g.candidates.map(c => c.id)) : new Set()
                                                                            };
                                                                        }
                                                                        return g;
                                                                    }));
                                                                }}
                                                            />
                                                        </th>
                                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider w-16">
                                                            #
                                                        </th>
                                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                            Candidate Name
                                                        </th>
                                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        {jobGroup.hasRankings && (
                                                            <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                                AI Score
                                                            </th>
                                                        )}
                                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                            NDA Status
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
                                                    {jobGroup.candidates
                                                        .filter(candidate => {
                                                            const jobSearch = jobSearchQueries[jobGroup.job_id] || '';
                                                            if (!jobSearch) return true;
                                                            return (
                                                                candidate.user?.name?.toLowerCase().includes(jobSearch.toLowerCase()) ||
                                                                candidate.user?.email?.toLowerCase().includes(jobSearch.toLowerCase())
                                                            );
                                                        })
                                                        .map((candidate, index) => {
                                                            const ranking = getCandidateRanking(jobGroup, candidate);
                                                            const ndaStatusDisplay = getNDAStatusDisplay(candidate);

                                                            return (
                                                                <tr key={candidate.id} className={`transition-colors ${candidate.cv_viewed ? 'bg-purple-100 hover:bg-purple-100' : 'hover:bg-gray-50'}`}>
                                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                                        <input
                                                                            type="checkbox"
                                                                            title="Select candidate"
                                                                            className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA] cursor-pointer"
                                                                            checked={jobGroup.selectedCandidates?.has(candidate.id) || false}
                                                                            onChange={(e) => {
                                                                                e.stopPropagation();
                                                                                setJobGroups(prev => prev.map(g => {
                                                                                    if (g.job_id === jobGroup.job_id) {
                                                                                        const newSelected = new Set(g.selectedCandidates);
                                                                                        if (newSelected.has(candidate.id)) {
                                                                                            newSelected.delete(candidate.id);
                                                                                        } else {
                                                                                            newSelected.add(candidate.id);
                                                                                        }
                                                                                        return { ...g, selectedCandidates: newSelected };
                                                                                    }
                                                                                    return g;
                                                                                }));
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold font-poppins text-[#5530FA]">
                                                                        {index + 1}
                                                                    </td>

                                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                                        {candidate.user?.name || 'N/A'}
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                                        {candidate.user?.email || 'N/A'}
                                                                    </td>

                                                                    {jobGroup.hasRankings && (
                                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                                            {ranking ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex flex-col">
                                                                                        <div className="text-sm font-semibold text-[#5530FA]">
                                                                                            {ranking.overall_score.toFixed(2)}%
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-xs text-gray-400">N/A</span>
                                                                            )}
                                                                        </td>
                                                                    )}

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

                                                                            <button
                                                                                className={`p-2 rounded-full transition-colors mr-1 ${candidate.cv_viewed ? 'text-[#5530FA] bg-purple-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                                                                onClick={(e) => handleToggleCVViewed(candidate.id, !!candidate.cv_viewed, e)}
                                                                                title={candidate.cv_viewed ? "Mark as not viewed" : "Mark as viewed"}
                                                                            >
                                                                                {candidate.cv_viewed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    {jobGroup.candidates.filter(candidate => {
                                                        const jobSearch = jobSearchQueries[jobGroup.job_id] || '';
                                                        if (!jobSearch) return true;
                                                        return (
                                                            candidate.user?.name?.toLowerCase().includes(jobSearch.toLowerCase()) ||
                                                            candidate.user?.email?.toLowerCase().includes(jobSearch.toLowerCase())
                                                        );
                                                    }).length === 0 && (
                                                            <tr>
                                                                <td colSpan={jobGroup.hasRankings ? 8 : 7} className="px-4 py-8 text-center text-gray-500 text-sm">
                                                                    No candidates match your search
                                                                </td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                            <p className="text-[#676767] text-sm font-poppins">
                                {searchQuery ? `No jobs found matching "${searchQuery}"` : 'No candidates found.'}
                            </p>
                        </div>
                    )}
                </div>

                {
                    bulkDownloadDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => {
                                setBulkDownloadDialog(null);
                                setBulkSearchQuery('');
                            }}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Bulk Download CVs - {bulkDownloadDialog.job_title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Select candidates whose CVs you want to download
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={bulkSearchQuery}
                                            onChange={(e) => setBulkSearchQuery(e.target.value)}
                                            className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                                            placeholder="Search candidates by name or email..."
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const jobId = bulkDownloadDialog.job_id;
                                            const filteredCandidates = bulkDownloadDialog.candidates.filter(c =>
                                                c.user.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
                                                c.user.email.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                                            );
                                            const filteredIds = new Set(filteredCandidates.map(c => c.id));
                                            const currentSelected = bulkDownloadDialog.selectedCandidates || new Set<string>();
                                            const allFilteredSelected = filteredCandidates.every(c => currentSelected.has(c.id));

                                            setJobGroups(prev => prev.map(group => {
                                                if (group.job_id === jobId) {
                                                    const newSelected = new Set(group.selectedCandidates);
                                                    if (allFilteredSelected) {
                                                        filteredIds.forEach(id => newSelected.delete(id));
                                                    } else {
                                                        filteredIds.forEach(id => newSelected.add(id));
                                                    }
                                                    return { ...group, selectedCandidates: newSelected };
                                                }
                                                return group;
                                            }));

                                            setBulkDownloadDialog(prev => {
                                                if (!prev) return null;
                                                const newSelected = new Set(prev.selectedCandidates);
                                                if (allFilteredSelected) {
                                                    filteredIds.forEach(id => newSelected.delete(id));
                                                } else {
                                                    filteredIds.forEach(id => newSelected.add(id));
                                                }
                                                return { ...prev, selectedCandidates: newSelected };
                                            });
                                        }}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {(() => {
                                            const filteredCandidates = bulkDownloadDialog.candidates.filter(c =>
                                                c.user.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
                                                c.user.email.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                                            );
                                            const currentSelected = bulkDownloadDialog.selectedCandidates || new Set<string>();
                                            const allFilteredSelected = filteredCandidates.length > 0 && filteredCandidates.every(c => currentSelected.has(c.id));
                                            return allFilteredSelected ? 'Deselect All' : 'Select All';
                                        })()}
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {bulkDownloadDialog.selectedCandidates?.size || 0} of {bulkDownloadDialog.candidates.length} selected
                                        {bulkSearchQuery && (
                                            <span className="text-gray-400 ml-1">
                                                ({bulkDownloadDialog.candidates.filter(c =>
                                                    c.user.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
                                                    c.user.email.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                                                ).length} shown)
                                            </span>
                                        )}
                                    </span>
                                </div>

                                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                                    {bulkDownloadDialog.candidates
                                        .filter(candidate =>
                                            candidate.user.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
                                            candidate.user.email.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                                        )
                                        .map((candidate) => {
                                            const isSelected = bulkDownloadDialog.selectedCandidates?.has(candidate.id) || false;

                                            return (
                                                <label
                                                    key={candidate.id}
                                                    className="p-3 hover:bg-gray-50 flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            const jobId = bulkDownloadDialog.job_id;
                                                            const candidateId = candidate.id;

                                                            setJobGroups(prev => prev.map(group => {
                                                                if (group.job_id === jobId) {
                                                                    const newSelected = new Set(group.selectedCandidates);
                                                                    if (newSelected.has(candidateId)) {
                                                                        newSelected.delete(candidateId);
                                                                    } else {
                                                                        newSelected.add(candidateId);
                                                                    }
                                                                    return { ...group, selectedCandidates: newSelected };
                                                                }
                                                                return group;
                                                            }));

                                                            setBulkDownloadDialog(prev => {
                                                                if (!prev) return null;
                                                                const newSelected = new Set(prev.selectedCandidates);
                                                                if (newSelected.has(candidateId)) {
                                                                    newSelected.delete(candidateId);
                                                                } else {
                                                                    newSelected.add(candidateId);
                                                                }
                                                                return { ...prev, selectedCandidates: newSelected };
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-[#5530FA] border-gray-300 rounded focus:ring-[#5530FA] cursor-pointer"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {candidate.user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {candidate.user.email}
                                                        </div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs ${getStatusColor(candidate.status)}`}>
                                                        {getDisplayStatus(candidate.status)}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    {bulkDownloadDialog.candidates.filter(c =>
                                        c.user.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
                                        c.user.email.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                                    ).length === 0 && (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                No candidates match your search
                                            </div>
                                        )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBulkDownloadDialog(null);
                                            setBulkSearchQuery('');
                                        }}
                                        disabled={downloadingBulk}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleBulkDownload(bulkDownloadDialog)}
                                        disabled={downloadingBulk || !bulkDownloadDialog.selectedCandidates?.size}
                                        className="px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {downloadingBulk ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Downloading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                <span>Download Selected ({bulkDownloadDialog.selectedCandidates?.size || 0})</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    bulkStatusDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => setBulkStatusDialog(null)}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Update Status - {bulkStatusDialog.job_title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Select the new status for {bulkStatusDialog.selectedCandidates?.size || 0} candidates.
                                    </p>
                                    <div className="space-y-2">
                                        {statusOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setConfirmDialog({
                                                        title: 'Confirm Bulk Status Update',
                                                        message: `Are you sure you want to update the status of ${bulkStatusDialog.selectedCandidates?.size || 0} candidates to "${option.label}"?`,
                                                        onConfirm: () => {
                                                            setConfirmDialog(null);
                                                            handleBulkStatusChange(option.value);
                                                            setBulkStatusDialog(null);
                                                        }
                                                    });
                                                }}
                                                disabled={updatingStatus === 'bulk'}
                                                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 transition-colors flex items-center disabled:opacity-50"
                                            >
                                                <span className={`inline-block w-3 h-3 rounded-full mr-3 ${option.color}`}></span>
                                                <span className="font-medium text-gray-700">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setBulkStatusDialog(null)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={updatingStatus === 'bulk'}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    bulkInterviewDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                            onClick={() => {
                                setBulkInterviewDialog(null);
                                setInterviewSubject('');
                                setInterviewBody('');
                                setInterviewCc('');
                                setInterviewBcc('');
                            }}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[1137px] max-h-[95vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[95vh]">
                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6 relative">
                                        <button
                                            onClick={() => {
                                                setBulkInterviewDialog(null);
                                                setInterviewSubject('');
                                                setInterviewBody('');
                                                setInterviewCc('');
                                                setInterviewBcc('');
                                            }}
                                            className="absolute top-4 right-4 text-[#686868] hover:text-gray-900 transition-colors p-2"
                                        >
                                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                        <h2 className="text-lg sm:text-[22px] font-medium font-poppins text-[#6c6c6c] mb-2">
                                            Bulk Interview Invitation
                                        </h2>
                                        <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 leading-[15px] mb-4">
                                            Send to {bulkInterviewDialog.selectedCandidates?.size || 0} selected candidates
                                        </p>
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Subject</h3>
                                        <input
                                            type="text"
                                            value={interviewSubject}
                                            onChange={(e) => setInterviewSubject(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                            placeholder="Enter email subject..."
                                        />
                                    </div>

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">CC (Carbon Copy)</h3>
                                        <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - separate multiple emails with commas</p>
                                        <input
                                            type="text"
                                            value={interviewCc}
                                            onChange={(e) => setInterviewCc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                            placeholder="email1@example.com, email2@example.com"
                                        />
                                    </div>

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">BCC (Blind Carbon Copy)</h3>
                                        <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - recipients won't see each other</p>
                                        <input
                                            type="text"
                                            value={interviewBcc}
                                            onChange={(e) => setInterviewBcc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                            placeholder="email1@example.com, email2@example.com"
                                        />
                                    </div>

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6 sm:mb-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">Edit Email Body</h3>
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
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[450px] overflow-y-auto">
                                                    <textarea
                                                        value={interviewBody.replace(/<br>/g, '\n')}
                                                        onChange={(e) => setInterviewBody(e.target.value.replace(/\n/g, '<br>'))}
                                                        className="w-full h-full p-0 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                                        placeholder="Enter email body (press Enter for new lines)..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">Email Preview</h3>
                                                <p className="text-xs font-light font-poppins text-[#6c6c6c]/80 mb-4">Live preview</p>
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[450px] overflow-y-auto">
                                                    <div className="space-y-4">
                                                        <p className="text-sm font-normal font-poppins text-[#6c6c6c] mb-4">
                                                            Dear Candidates,
                                                        </p>
                                                        <div
                                                            className="text-sm font-normal font-poppins text-[#6c6c6c] leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: interviewBody.replace(/<br>/g, '<br/>') }}
                                                        />
                                                        <p className="text-sm font-normal font-poppins text-[#6c6c6c]">
                                                            Have a great day!
                                                        </p>
                                                        <p className="text-sm font-normal font-poppins text-[#545454]">
                                                            Best regards,<br />
                                                            Recruitment Team,<br />
                                                            Protonest
                                                        </p>
                                                        <div className="bg-[#f5f5f5] p-[14px_20px] text-center mt-4 rounded">
                                                            <p className="text-[#737373] text-[13px] leading-[1.5] m-0">
                                                                This is an automated message from Protonest. If you have any questions, feel free to contact us.<br />
                                                                <span className="text-xs">Reply to: <a href="mailto:careers@protonest.co" className="text-[#5530fa]">careers@protonest.co</a></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                        <button
                                            onClick={handleBulkSendInterview}
                                            disabled={sendingInterview}
                                            className="w-full sm:w-[222px] h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] cursor-pointer rounded-[57px] flex justify-center items-center gap-2 text-white text-sm sm:text-base font-semibold font-montserrat order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sendingInterview ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : 'Send Invitations'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setBulkInterviewDialog(null);
                                                setInterviewSubject('');
                                                setInterviewBody('');
                                                setInterviewCc('');
                                                setInterviewBcc('');
                                            }}
                                            className="w-full sm:w-[206px] h-[51px] px-6 py-4 rounded-[57px] gradient-border cursor-pointer flex justify-center items-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2 sm:order-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {

                    bulkNdaDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                            onClick={() => {
                                setBulkNdaDialog(null);
                                setNdaSubject('');
                                setNdaBody('');
                                setNdaCc('');
                                setNdaBcc('');
                                setUploadedFile(null);
                                setSelectedTemplate('');
                            }}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[979px] max-h-[95vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => {
                                        setBulkNdaDialog(null);
                                        setNdaSubject('');
                                        setNdaBody('');
                                        setNdaCc('');
                                        setNdaBcc('');
                                        setUploadedFile(null);
                                        setSelectedTemplate('');
                                    }}
                                    className="absolute top-4 right-4 text-[#686868] hover:text-gray-900 transition-colors p-2 z-10"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <div className="p-4 sm:p-6 lg:p-8 mt-2">
                                    <div className="mb-6">
                                        <h2 className="text-lg sm:text-[22px] font-medium font-poppins text-[#6c6c6c] mb-2">
                                            Bulk Send NDA
                                        </h2>
                                        <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 leading-[15px]">
                                            You're about to send a Non-Disclosure Agreement to {bulkNdaDialog.selectedCandidates?.size || 0} selected candidates. You can use an existing template or upload a new file.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">NDA File</h3>

                                        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        id="bulk-template"
                                                        name="bulkNdaType"
                                                        checked={selectedNda === 'template'}
                                                        onChange={() => setSelectedNda('template')}
                                                        className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                                    />
                                                    <label htmlFor="bulk-template" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
                                                        Select from previously uploaded NDAs:
                                                    </label>
                                                </div>

                                                {selectedNda === 'template' && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-7">
                                                        {ndaDocuments.length > 0 ? (
                                                            ndaDocuments.map((doc) => (
                                                                <button
                                                                    key={doc.id}
                                                                    onClick={() => setSelectedTemplate(doc.id)}
                                                                    className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[57px] text-xs sm:text-sm font-semibold transition-colors ${selectedTemplate === doc.id
                                                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                                                        : 'border border-[#5530fa] text-[#4d4d4d]'
                                                                        }`}
                                                                >
                                                                    {doc.file_name}
                                                                    {doc.is_active && (
                                                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                                            Active
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500 col-span-2">No NDA templates available. Please upload one.</p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        id="bulk-upload"
                                                        name="bulkNdaType"
                                                        checked={selectedNda === 'upload'}
                                                        onChange={() => setSelectedNda('upload')}
                                                        className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                                    />
                                                    <label htmlFor="bulk-upload" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
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
                                                                <span className="block mt-2">Allowed file types: .pdf, .doc, .docx<br />Max size: 10MB</span>
                                                            </p>
                                                            {uploadedFile && (
                                                                <div className="mb-4 p-2 bg-green-100 rounded-lg">
                                                                    <p className="text-xs sm:text-sm text-green-700">Selected: {uploadedFile.name}</p>
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => fileInputRef.current?.click()}
                                                                disabled={uploadingNDA}
                                                                className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {uploadingNDA ? 'Uploading...' : 'Browse'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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
                                            <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-2">{ndaSubject.length}/100</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">CC (Carbon Copy)</h3>
                                        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                            <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - separate multiple emails with commas</p>
                                            <input
                                                type="text"
                                                value={ndaCc}
                                                onChange={(e) => setNdaCc(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                                placeholder="email1@example.com, email2@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">BCC (Blind Carbon Copy)</h3>
                                        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                            <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - recipients won't see each other</p>
                                            <input
                                                type="text"
                                                value={ndaBcc}
                                                onChange={(e) => setNdaBcc(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                                placeholder="email1@example.com, email2@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6 sm:mb-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Edit Email Body</h3>
                                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                                                        <textarea
                                                            value={ndaBody.replace(/<br>/g, '\n')}
                                                            onChange={(e) => setNdaBody(e.target.value.replace(/\n/g, '<br>'))}
                                                            className="w-full h-full p-0 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                                            placeholder="Enter email body (press Enter for new lines)..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Preview</h3>
                                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                                    <div className="bg-white p-6 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                                                        <div className="space-y-4">
                                                            <p className="text-[14.67px] font-normal font-poppins text-black leading-[1.5] mb-4">
                                                                Dear Candidates,
                                                            </p>
                                                            <div
                                                                className="text-[14.67px] font-normal font-poppins text-black leading-[1.5]"
                                                                dangerouslySetInnerHTML={{ __html: ndaBody.replace(/<br>/g, '<br/>') }}
                                                            />
                                                            <table cellPadding="0" cellSpacing="0" border={0} className="my-5">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <a
                                                                                href="#"
                                                                                className="inline-block px-[30px] py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white no-underline rounded font-bold text-sm"
                                                                                style={{ display: 'inline-block', padding: '12px 30px', background: 'linear-gradient(135deg, #5530fa, #f51da5)', color: '#ffffff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}
                                                                            >
                                                                                View NDA
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <p className="text-[14.67px] font-normal font-poppins text-black leading-[1.5] my-4">
                                                                Have a great day!
                                                            </p>
                                                            <p className="text-[14.67px] font-normal font-poppins text-[#545454] leading-[1.5] my-4 mb-0">
                                                                Best regards,<br />
                                                                Recruitment Team,<br />
                                                                Protonest
                                                            </p>
                                                            <div className="bg-[#f5f5f5] p-[14px_20px] text-center mt-4 rounded">
                                                                <p className="text-[#737373] text-[13px] leading-[1.5] m-0">
                                                                    This is an automated message from Protonest. If you have any questions, feel free to contact us.<br />
                                                                    <span className="text-xs">Reply to: <a href="mailto:careers@protonest.co" className="text-[#5530fa]">careers@protonest.co</a></span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
                                        <button
                                            onClick={handleBulkSendNda}
                                            disabled={sendingNDA || uploadingNDA || (selectedNda === 'template' && !selectedTemplate) || (selectedNda === 'upload' && !uploadedFile)}
                                            className="w-full sm:w-[209px] h-[51px] px-6 bg-gradient-to-l from-[#5530fa] to-[#f51da5] cursor-pointer rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {sendingNDA ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : uploadingNDA ? 'Processing...' : 'Send NDAs'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setBulkNdaDialog(null);
                                                setNdaSubject('');
                                                setNdaBody('');
                                                setNdaCc('');
                                                setNdaBcc('');
                                                setUploadedFile(null);
                                                setSelectedNda('template');
                                                setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
                                            }}
                                            disabled={uploadingNDA}
                                            className="w-full sm:w-[209px] h-[51px] px-6 rounded-[57px] cursor-pointer gradient-border text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {

                    deleteCandidate && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => setDeleteCandidate(null)}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4"
                                onClick={(e) => e.stopPropagation()}
                            >
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
                                            for (const group of jobGroups) {
                                                const candidate = group.candidates.find(c => c.id === deleteCandidate.id);
                                                if (candidate) {
                                                    handleDelete(candidate);
                                                    break;
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    statusDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => setStatusDialog(null)}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
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
                    )
                }


                {
                    interviewDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                            onClick={() => setInterviewDialog(null)}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[1137px] max-h-[95vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[95vh]">
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

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">CC (Carbon Copy)</h3>
                                        <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - separate multiple emails with commas</p>
                                        <input
                                            type="text"
                                            value={interviewCc}
                                            onChange={(e) => setInterviewCc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                            placeholder="email1@example.com, email2@example.com"
                                        />
                                    </div>

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">BCC (Blind Carbon Copy)</h3>
                                        <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - recipients won't see each other</p>
                                        <input
                                            type="text"
                                            value={interviewBcc}
                                            onChange={(e) => setInterviewBcc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                            placeholder="email1@example.com, email2@example.com"
                                        />
                                    </div>

                                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 mb-6 sm:mb-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">Edit Email Body</h3>
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
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[450px] overflow-y-auto">
                                                    <textarea
                                                        value={interviewBody.replace(/<br>/g, '\n')}
                                                        onChange={(e) => setInterviewBody(e.target.value.replace(/\n/g, '<br>'))}
                                                        className="w-full h-full p-0 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                                        placeholder="Enter email body (press Enter for new lines)..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-2">Email Preview</h3>
                                                <p className="text-xs font-light font-poppins text-[#6c6c6c]/80 mb-4">Live preview</p>
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[450px] overflow-y-auto">
                                                    <div className="space-y-4">
                                                        <p className="text-sm font-normal font-poppins text-[#6c6c6c] mb-4">
                                                            Dear {interviewDialog.user?.name?.split(' ')[0] || 'User'},
                                                        </p>
                                                        <div
                                                            className="text-sm font-normal font-poppins text-[#6c6c6c] leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: interviewBody.replace(/<br>/g, '<br/>') }}
                                                        />
                                                        <p className="text-sm font-normal font-poppins text-[#6c6c6c]">
                                                            Have a great day!
                                                        </p>
                                                        <p className="text-sm font-normal font-poppins text-[#545454]">
                                                            Best regards,<br />
                                                            Recruitment Team,<br />
                                                            Protonest
                                                        </p>
                                                        <div className="bg-[#f5f5f5] p-[14px_20px] text-center mt-4 rounded">
                                                            <p className="text-[#737373] text-[13px] leading-[1.5] m-0">
                                                                This is an automated message from Protonest. If you have any questions, feel free to contact us.<br />
                                                                <span className="text-xs">Reply to: <a href="mailto:careers@protonest.co" className="text-[#5530fa]">careers@protonest.co</a></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                        <button
                                            onClick={handleSendInterview}
                                            disabled={sendingInterview}
                                            className="w-full sm:w-[222px] h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] cursor-pointer rounded-[57px] flex justify-center items-center gap-2 text-white text-sm sm:text-base font-semibold font-montserrat order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sendingInterview ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : 'Send Invitation'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setInterviewDialog(null);
                                                setInterviewSubject('');
                                                setInterviewBody('');
                                                setInterviewCc('');
                                                setInterviewBcc('');
                                            }}
                                            className="w-full sm:w-[206px] h-[51px] px-6 py-4 rounded-[57px] gradient-border cursor-pointer flex justify-center items-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2 sm:order-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    ndaDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                            onClick={() => setNdaDialog(null)}
                        >
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                            <div
                                className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[979px] max-h-[95vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg sm:text-[22px] font-medium font-poppins text-[#6c6c6c] mb-2">
                                            Send NDA to Freelancer
                                        </h2>
                                        <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 leading-[15px]">
                                            You&apos;re about to send a Non-Disclosure Agreement to the selected candidate. You can use an existing template or upload a new file
                                        </p>
                                    </div>

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
                                                        {ndaDocuments.length > 0 ? (
                                                            ndaDocuments.map((doc) => (
                                                                <button
                                                                    key={doc.id}
                                                                    onClick={() => setSelectedTemplate(doc.id)}
                                                                    className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[57px] text-xs sm:text-sm font-semibold transition-colors ${selectedTemplate === doc.id
                                                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                                                        : 'border border-[#5530fa] text-[#4d4d4d]'
                                                                        }`}
                                                                >
                                                                    {doc.file_name}
                                                                    {doc.is_active && (
                                                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                                            Active
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500 col-span-2">No NDA templates available. Please upload one.</p>
                                                        )}
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
                                                                <span className="block mt-2">Allowed file types: .pdf<br />Max size: 10MB</span>
                                                            </p>
                                                            {uploadedFile && (
                                                                <div className="mb-4 p-2 bg-green-100 rounded-lg">
                                                                    <p className="text-xs sm:text-sm text-green-700">Selected: {uploadedFile.name}</p>
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => fileInputRef.current?.click()}
                                                                disabled={uploadingNDA}
                                                                className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {uploadingNDA ? 'Uploading...' : 'Browse'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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
                                            <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-2">{ndaSubject.length}/100</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">CC (Carbon Copy)</h3>
                                        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                            <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - separate multiple emails with commas</p>
                                            <input
                                                type="text"
                                                value={ndaCc}
                                                onChange={(e) => setNdaCc(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                                placeholder="email1@example.com, email2@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">BCC (Blind Carbon Copy)</h3>
                                        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                            <p className="text-xs font-light font-poppins text-[#6c6c6c]/60 mb-3">Optional - recipients won't see each other</p>
                                            <input
                                                type="text"
                                                value={ndaBcc}
                                                onChange={(e) => setNdaBcc(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                                placeholder="email1@example.com, email2@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6 sm:mb-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Edit Email Body</h3>
                                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                                                        <textarea
                                                            value={ndaBody.replace(/<br>/g, '\n')}
                                                            onChange={(e) => setNdaBody(e.target.value.replace(/\n/g, '<br>'))}
                                                            className="w-full h-full p-0 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                                            placeholder="Enter email body (press Enter for new lines)..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Preview</h3>
                                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                                    <div className="bg-white p-6 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                                                        <div className="space-y-4">
                                                            <p className="text-[14.67px] font-normal font-poppins text-black leading-[1.5] mb-4">
                                                                Dear {ndaDialog.user?.name?.split(' ')[0] || 'User'},
                                                            </p>
                                                            <div
                                                                className="text-[14.67px] font-normal font-poppins text-black leading-[1.5]"
                                                                dangerouslySetInnerHTML={{ __html: ndaBody.replace(/<br>/g, '<br/>') }}
                                                            />
                                                            <table cellPadding="0" cellSpacing="0" border={0} className="my-5">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <a
                                                                                href="#"
                                                                                className="inline-block px-[30px] py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white no-underline rounded font-bold text-sm"
                                                                                style={{ display: 'inline-block', padding: '12px 30px', background: 'linear-gradient(135deg, #5530fa, #f51da5)', color: '#ffffff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}
                                                                            >
                                                                                View NDA
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <p className="text-[14.67px] font-normal font-poppins text-black leading-[1.5] my-4">
                                                                Have a great day!
                                                            </p>
                                                            <p className="text-[14.67px] font-normal font-poppins text-[#545454] leading-[1.5] my-4 mb-0">
                                                                Best regards,<br />
                                                                Recruitment Team,<br />
                                                                Protonest
                                                            </p>
                                                            <div className="bg-[#f5f5f5] p-[14px_20px] text-center mt-4 rounded">
                                                                <p className="text-[#737373] text-[13px] leading-[1.5] m-0">
                                                                    This is an automated message from Protonest. If you have any questions, feel free to contact us.<br />
                                                                    <span className="text-xs">Reply to: <a href="mailto:careers@protonest.co" className="text-[#5530fa]">careers@protonest.co</a></span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
                                        <button
                                            onClick={handleSendNda}
                                            disabled={sendingNDA || uploadingNDA || (selectedNda === 'template' && !selectedTemplate) || (selectedNda === 'upload' && !uploadedFile)}
                                            className="w-full sm:w-[209px] h-[51px] px-6 bg-gradient-to-l from-[#5530fa] to-[#f51da5] cursor-pointer rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {sendingNDA ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : uploadingNDA ? 'Processing...' : 'Send NDA'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNdaDialog(null);
                                                setNdaSubject('');
                                                setNdaBody('');
                                                setNdaCc('');
                                                setNdaBcc('');
                                                setUploadedFile(null);
                                                setSelectedNda('template');
                                                setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
                                            }}
                                            disabled={uploadingNDA}
                                            className="w-full sm:w-[209px] h-[51px] px-6 rounded-[57px] cursor-pointer gradient-border text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    detailsDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50" onClick={() => setDetailsDialog(null)}></div>
                            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
                                <div className="overflow-y-auto max-h-[95vh]">
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

                                    <div className="p-6">
                                        {detailsLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5530FA]"></div>
                                                <span className="ml-3 text-gray-600">Loading candidate details...</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="space-y-6">
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

                                                <div className="space-y-6">
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

                                                <div className="space-y-6">
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
                                                                            onClick={() => handlePreviewCVFromDialog(detailsDialog.user._id)}
                                                                            className="px-3 py-1 text-xs bg-[#5530FA] text-white rounded hover:opacity-90"
                                                                        >
                                                                            Preview
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDownloadCVFromDialog(detailsDialog.user._id, detailsDialog.user.name)}
                                                                            className="px-3 py-1 text-xs border border-[#5530FA] text-[#5530FA] rounded hover:bg-[#5530FA] hover:text-white transition-colors"
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
                    )
                }

                {
                    successDialog && (
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                                <div className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="bg-white rounded-full p-3">
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white text-center">
                                        {successDialog.title}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 text-center mb-6">
                                        {successDialog.message}
                                    </p>
                                    <button
                                        onClick={() => setSuccessDialog(null)}
                                        className="w-full px-6 py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    errorDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-2xl bg-opacity-50"
                            onClick={() => setErrorDialog(null)}
                        >
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
                    )
                }

                {
                    confirmDialog && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-2xl bg-opacity-50"
                            onClick={() => setConfirmDialog(null)}
                        >
                            <div
                                className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{confirmDialog.title}</h3>
                                <p className="text-gray-600 mb-6 whitespace-pre-wrap">{confirmDialog.message}</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setConfirmDialog(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="hidden"
                />
            </div>
        </AdminLayout >
    );
};

export default CandidateManagement;