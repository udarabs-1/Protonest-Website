'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Job = {
    id: string;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    what_you_will_get?: string[];
    nice_to_have?: string[];
    created_at: string;
};

interface ApiJobData {
    id: string;
    title: string;
    location: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    what_you_will_get?: string[];
    nice_to_have?: string[];
    created_at: string;
};

type User = {
    id: string;
    email: string;
    name: string;
};

type SuccessPopupProps = {
    type: 'apply' | 'save' | 'withdraw';
    onClose: () => void;
    onViewSavedJobs?: () => void;
};

type ConfirmDialogProps = {
    type: 'apply' | 'save' | 'unsave' | 'withdraw';
    jobTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
};

type ErrorDialogProps = {
    message: string;
    onClose: () => void;
    onUploadCV?: () => void;
};

const ConfirmDialog = ({ type, jobTitle, onConfirm, onCancel }: ConfirmDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    }, [onCancel]);

    const getDialogContent = () => {
        switch (type) {
            case 'apply':
                return {
                    title: 'Confirm Application',
                    message: `Are you sure you want to apply for "${jobTitle}"?`,
                    confirmText: 'Yes, Apply',
                    cancelText: 'Cancel'
                };
            case 'save':
                return {
                    title: 'Save Job',
                    message: `Do you want to save "${jobTitle}" to your saved jobs?`,
                    confirmText: 'Yes, Save',
                    cancelText: 'Cancel'
                };
            case 'unsave':
                return {
                    title: 'Remove Saved Job',
                    message: `Are you sure you want to remove "${jobTitle}" from your saved jobs?`,
                    confirmText: 'Yes, Remove',
                    cancelText: 'Cancel'
                };
            case 'withdraw':
                return {
                    title: 'Withdraw Application',
                    message: `Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`,
                    confirmText: 'Yes, Withdraw',
                    cancelText: 'Cancel'
                };
        }
    };

    const content = getDialogContent();

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon="solar:danger-circle-bold-duotone" className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    {content.title}
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {content.message}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-base font-medium font-poppins hover:bg-gray-50 transition-colors"
                    >
                        {content.cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] text-white text-base font-semibold font-montserrat transition-all"
                    >
                        {content.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ErrorDialog = ({ message, onClose, onUploadCV }: ErrorDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const isNoCVError = message.toLowerCase().includes('cv') || message.toLowerCase().includes('resume');

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon="solar:danger-circle-bold-duotone" className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    {isNoCVError ? 'CV Required' : 'Error'}
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {message}
                </p>
                <div className="flex flex-col gap-3">
                    {isNoCVError && onUploadCV ? (
                        <>
                            <button
                                onClick={onUploadCV}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                            >
                                Upload CV Now
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full px-6 py-3 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-base font-medium font-poppins hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoDialog = ({ message, onClose }: { message: string; onClose: () => void }) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon="solar:info-circle-bold-duotone" className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    Already Applied
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

const SuccessPopup = ({ type, onClose, onViewSavedJobs }: SuccessPopupProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleViewSavedJobs = useCallback(() => {
        if (onViewSavedJobs) {
            onViewSavedJobs();
        }
    }, [onViewSavedJobs]);

    const getContent = () => {
        switch (type) {
            case 'apply':
                return {
                    title: 'Applied Successfully!',
                    message: 'The CV that was uploaded to your account has been submitted. If you wish to add a new CV, you can do so through the "Resubmit CV" option in the Dashboard.',
                    showButton: true,
                    buttonText: 'OK',
                    buttonAction: onClose
                };
            case 'save':
                return {
                    title: 'Job Saved Successfully!',
                    message: null,
                    showButton: true,
                    buttonText: 'View Saved Jobs',
                    buttonAction: handleViewSavedJobs
                };
            case 'withdraw':
                return {
                    title: 'Application Withdrawn',
                    message: 'Your application has been withdrawn successfully.',
                    showButton: true,
                    buttonText: 'OK',
                    buttonAction: onClose
                };
        }
    };

    const content = getContent();

    return (
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
        >
            <style jsx global>{`
                .gradient-icon-success svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon-success svg path {
                    fill: url(#icon-gradient-success) !important;
                }
                
                .gradient-icon-success svg circle {
                    fill: url(#icon-gradient-success) !important;
                }
                
                .gradient-icon-success svg rect {
                    fill: url(#icon-gradient-success) !important;
                }
                
                .gradient-icon-success svg polygon {
                    fill: url(#icon-gradient-success) !important;
                }
            `}</style>

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient-success" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="w-full max-w-[359px] bg-white/90 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] backdrop-blur-[20px] p-8">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-[120px] h-[120px] gradient-icon-success flex items-center justify-center">
                        <Icon icon="solar:check-circle-bold-duotone" className="w-full h-full" />
                    </div>
                    <h2
                        id="success-title"
                        className="text-center text-[#6c6c6c] text-[25px] font-normal font-poppins leading-[30px]"
                    >
                        {content.title}
                    </h2>
                    {content.message && (
                        <p className="text-center text-[#6c6c6c] text-base font-normal font-poppins leading-[24px]">
                            {content.message}
                        </p>
                    )}
                    {content.showButton && (
                        <button
                            className="w-full max-w-[295px] h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] inline-flex justify-center items-center gap-1 cursor-pointer hover:from-[#f51da5] hover:to-[#5530fa] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all"
                            onClick={content.buttonAction}
                        >
                            <span className="text-center text-white text-base font-semibold font-montserrat">{content.buttonText}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const SimilarJobCard = ({ job, role }: { job: Job; role: string }) => (
    <Link
        href={`/jobs/${role}/${job.id}`}
        className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
    >
        <article>
            <div className="flex justify-between">
                <div className="w-3/4">
                    <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                        {job.title}
                    </h3>
                    <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                        {job.location} ‐ Posted {job.posted}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.type.replace('-', ' ')}</p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{job.deadline}</p>
                        {isDeadlinePassed(job.deadline) && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] font-semibold font-poppins rounded-full">
                                EXPIRED
                            </span>
                        )}
                    </div>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                </div>
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.experience}</p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                </div>
            </div>


            <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
                <div className="w-full h-full group-hover:hidden">
                    <Image
                        src="/upleft.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="hidden w-full h-full group-hover:block">
                    <Image
                        src="/upleft-hover.svg"
                        alt=""
                        width={50}
                        height={50}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                View Details
            </button>
        </article>
    </Link>
);

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

const isDeadlinePassed = (deadlineString: string): boolean => {
    if (!deadlineString) return false;

    try {
        const deadline = new Date(deadlineString);
        const now = new Date();

        // Set deadline to end of day (23:59:59)
        deadline.setHours(23, 59, 59, 999);

        return now > deadline;
    } catch {
        // If date parsing fails, allow application (fail-safe)
        return false;
    }
};


const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwtToken');
    }
    return null;
};

const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('userData');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { role, id } = params;

    const [job, setJob] = useState<Job | null>(null);
    const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isJobSaved, setIsJobSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [canWithdraw, setCanWithdraw] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState<'apply' | 'save' | 'withdraw' | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<'apply' | 'save' | 'unsave' | 'withdraw' | null>(null);
    const [showErrorDialog, setShowErrorDialog] = useState<string | null>(null);
    const [showInfoDialog, setShowInfoDialog] = useState<string | null>(null);
    const [hasCheckedPendingApplication, setHasCheckedPendingApplication] = useState(false);
    const [hasCheckedCVUpload, setHasCheckedCVUpload] = useState(false);

    useEffect(() => {
        const updateUser = () => {
            const currentUser = getUser();
            const token = getAuthToken();

            if (currentUser && token) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        };

        updateUser();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'userData' || e.key === 'jwtToken' || e.key === null) {
                updateUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const handleLogout = () => {
            updateUser();
        };

        window.addEventListener('userLoggedOut', handleLogout);

        const handleFocus = () => {
            updateUser();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLoggedOut', handleLogout);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const checkJobSavedStatus = useCallback(async () => {
        if (!user || !job) {
            setIsJobSaved(false);
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) {
                setIsJobSaved(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/check/${job.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsJobSaved(data.data?.saved || false);
            } else {
                setIsJobSaved(false);
            }
        } catch (error) {
            console.error('Error checking job saved status:', error);
            setIsJobSaved(false);
        }
    }, [user, job]);

    const checkApplicationStatus = useCallback(async () => {
        if (!user || !job) {
            setHasApplied(false);
            setCanWithdraw(false);
            return false;
        }

        try {
            const token = getAuthToken();
            if (!token) {
                setHasApplied(false);
                setCanWithdraw(false);
                return false;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/status/${job.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setHasApplied(data.data?.applied || false);
                setCanWithdraw(data.data?.can_withdraw || false);

                return data.data?.applied || false;
            } else {
                setHasApplied(false);
                setCanWithdraw(false);
                return false;
            }
        } catch (error) {
            console.error('Error checking application status:', error);
            setHasApplied(false);
            setCanWithdraw(false);
            return false;
        }
    }, [user, job]);

    useEffect(() => {
        if (user && job) {
            checkJobSavedStatus();
            checkApplicationStatus();
        } else {
            setIsJobSaved(false);
            setHasApplied(false);
            setCanWithdraw(false);
        }
    }, [user, job, checkJobSavedStatus, checkApplicationStatus]);

    useEffect(() => {
        const checkCVUpload = async () => {

            if (!user || !job || hasCheckedCVUpload) {
                return;
            }

            setHasCheckedCVUpload(true);

            const cvUploadedStr = sessionStorage.getItem('cvUploadedForJob');
            if (cvUploadedStr) {
                try {
                    const cvUploadData = JSON.parse(cvUploadedStr);

                    const isForThisJob = cvUploadData.jobId === job.id;
                    const isRecent = Date.now() - cvUploadData.timestamp < 5 * 60 * 1000;

                    if (isForThisJob && isRecent) {

                        sessionStorage.removeItem('cvUploadedForJob');

                        const alreadyApplied = await checkApplicationStatus();

                        if (!alreadyApplied) {

                            setTimeout(() => {
                                setShowConfirmDialog('apply');
                            }, 500);
                        }
                    } else {

                        sessionStorage.removeItem('cvUploadedForJob');
                    }
                } catch (error) {
                    console.error('Error processing CV upload data:', error);
                    sessionStorage.removeItem('cvUploadedForJob');
                }
            }
        };

        checkCVUpload();
    }, [user, job, hasCheckedCVUpload, checkApplicationStatus]);

    useEffect(() => {
        const processPendingApplication = async () => {

            if (!user || !job || hasCheckedPendingApplication) {
                return;
            }

            setHasCheckedPendingApplication(true);

            const pendingApplication = localStorage.getItem('pendingJobApplication');
            if (pendingApplication) {
                try {
                    const pending = JSON.parse(pendingApplication);
                    const isForThisJob = pending.jobId === job.id;
                    const isRecent = Date.now() - pending.timestamp < 10 * 60 * 1000;

                    if (isForThisJob && isRecent) {

                        const alreadyApplied = await checkApplicationStatus();

                        if (alreadyApplied) {

                            setShowInfoDialog(`You have already applied for "${job.title}". Your application is under review.`);
                            localStorage.removeItem('pendingJobApplication');
                        } else {

                            setTimeout(() => {
                                setShowConfirmDialog('apply');
                            }, 500);
                        }
                    } else {

                        localStorage.removeItem('pendingJobApplication');
                    }
                } catch (error) {
                    console.error('Error processing pending application:', error);
                    localStorage.removeItem('pendingJobApplication');
                }
            }
        };

        processPendingApplication();
    }, [user, job, hasCheckedPendingApplication, checkApplicationStatus]);

    const checkUserCV = useCallback(async (): Promise<boolean> => {
        if (!user) return false;

        try {
            const token = getAuthToken();
            if (!token) return false;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/info`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return !!(data.status === 'success' && data.data && data.data.file_url);
            }
            return false;
        } catch (error) {
            console.error('Error checking CV status:', error);
            return false;
        }
    }, [user]);

    const handleSaveJobClick = useCallback(() => {
        if (!user) {
            router.replace('/signin');
            return;
        }

        if (!job) return;

        setShowConfirmDialog(isJobSaved ? 'unsave' : 'save');
    }, [user, job, isJobSaved, router]);

    const confirmSaveJob = useCallback(async () => {
        if (!job) return;

        setSaveLoading(true);
        setShowConfirmDialog(null);

        try {
            const token = getAuthToken();
            const endpoint = isJobSaved
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/${job.id}`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs`;

            const method = isJobSaved ? 'DELETE' : 'POST';
            const body = isJobSaved ? undefined : JSON.stringify({ job_id: job.id });

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                ...(body && { body }),
            });

            if (response.ok) {
                setIsJobSaved(!isJobSaved);
                if (!isJobSaved) {
                    setShowSuccessPopup('save');
                }
            } else {
                const errorData = await response.json();
                setShowErrorDialog(errorData.message || 'Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            setShowErrorDialog('Failed to save job. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    }, [job, isJobSaved]);

    const handleApplyJobClick = useCallback(() => {
        if (!user) {
            if (job && role) {
                const currentUrl = `/jobs/${Array.isArray(role) ? role[0] : role}/${job.id}`;
                localStorage.setItem('pendingJobApplication', JSON.stringify({
                    jobId: job.id,
                    jobTitle: job.title,
                    jobUrl: currentUrl,
                    role: Array.isArray(role) ? role[0] : role,
                    timestamp: Date.now()
                }));
            }
            router.replace('/signin');
            return;
        }

        if (!job || hasApplied) return;

        setShowConfirmDialog('apply');
    }, [user, job, hasApplied, role, router]);

    const confirmApplyJob = useCallback(async () => {
        if (!job) return;

        setShowConfirmDialog(null);

        const hasCV = await checkUserCV();

        if (!hasCV) {
            setShowErrorDialog('You need to upload your CV before applying for jobs. Please upload your CV to continue.');
            return;
        }

        setApplyLoading(true);

        try {
            const token = getAuthToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ job_id: job.id }),
            });

            if (response.ok) {
                setHasApplied(true);
                setCanWithdraw(true);
                setShowSuccessPopup('apply');

                localStorage.removeItem('pendingJobApplication');
            } else {
                const errorData = await response.json();
                setShowErrorDialog(errorData.message || 'Failed to apply for job');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            setShowErrorDialog('Failed to apply for job. Please try again.');
        } finally {
            setApplyLoading(false);
        }
    }, [job, checkUserCV]);

    const handleWithdrawClick = useCallback(() => {
        if (!job) return;
        setShowConfirmDialog('withdraw');
    }, [job]);

    const confirmWithdrawApplication = useCallback(async () => {
        if (!job) return;

        setShowConfirmDialog(null);
        setWithdrawLoading(true);

        try {
            const token = getAuthToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/withdraw/${job.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setHasApplied(false);
                setCanWithdraw(false);
                setShowSuccessPopup('withdraw');
            } else {
                const errorData = await response.json();
                setShowErrorDialog(errorData.message || 'Failed to withdraw application');
            }
        } catch (error) {
            console.error('Error withdrawing application:', error);
            setShowErrorDialog('Failed to withdraw application. Please try again.');
        } finally {
            setWithdrawLoading(false);
        }
    }, [job]);

    const handleViewSavedJobs = useCallback(() => {
        setShowSuccessPopup(null);
        router.push('/dashboard/saved-jobs');
    }, [router]);

    const handleSignupClick = useCallback(() => {
        if (job && role) {
            const currentUrl = `/jobs/${Array.isArray(role) ? role[0] : role}/${job.id}`;
            localStorage.setItem('pendingJobApplication', JSON.stringify({
                jobId: job.id,
                jobTitle: job.title,
                jobUrl: currentUrl,
                role: Array.isArray(role) ? role[0] : role,
                timestamp: Date.now()
            }));
        }
        router.replace('/signup');
    }, [job, role, router]);

    const handleUploadCV = useCallback(() => {
        setShowErrorDialog(null);

        if (job && role) {
            const currentUrl = `/jobs/${Array.isArray(role) ? role[0] : role}/${job.id}`;
            localStorage.setItem('pendingJobApplication', JSON.stringify({
                jobId: job.id,
                jobTitle: job.title,
                jobUrl: currentUrl,
                role: Array.isArray(role) ? role[0] : role,
                timestamp: Date.now()
            }));
        }

        router.replace('/dashboard/resubmit-cv');
    }, [router, job, role]);

    const clearPendingApplication = useCallback(() => {
        localStorage.removeItem('pendingJobApplication');
    }, []);

    const closePopup = useCallback(() => {
        setShowSuccessPopup(null);
    }, []);

    const closeConfirmDialog = useCallback(() => {

        if (showConfirmDialog === 'apply') {
            clearPendingApplication();
        }

        setShowConfirmDialog(null);
    }, [showConfirmDialog, clearPendingApplication]);

    const closeErrorDialog = useCallback(() => {
        setShowErrorDialog(null);
    }, []);

    const closeInfoDialog = useCallback(() => {
        setShowInfoDialog(null);
    }, []);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const jobId = Array.isArray(id) ? id[0] : id;

                const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${jobId}`);

                if (!jobResponse.ok) {
                    if (jobResponse.status === 404) {
                        setError('This job is no longer available. It may have been removed or is currently inactive.');
                    } else {
                        setError(`Unable to load job details. Please try again later.`);
                    }
                    setLoading(false);
                    return;
                }

                const jobData = await jobResponse.json();

                if (jobData.status === 'success' && jobData.data) {
                    const jobDetails = jobData.data;

                    const transformedJob: Job = {
                        id: jobDetails.id,
                        title: jobDetails.title,
                        location: jobDetails.location,
                        posted: formatTimeAgo(jobDetails.created_at),
                        type: jobDetails.type,
                        deadline: formatDate(jobDetails.deadline),
                        experience: jobDetails.experience,
                        category: jobDetails.category,
                        description: jobDetails.description,
                        responsibilities: jobDetails.responsibilities || [],
                        requirements: jobDetails.requirements || [],
                        what_you_will_get: jobDetails.what_you_will_get || [],
                        nice_to_have: jobDetails.nice_to_have || [],
                        created_at: jobDetails.created_at
                    };

                    setJob(transformedJob);

                    const similarResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs?category=${encodeURIComponent(jobDetails.category)}&limit=3`);

                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();

                        if (similarData.status === 'success' && similarData.data) {
                            const similarJobsData = (similarData.data as Job[])
                                .filter((j: Job) => j.id !== jobDetails.id)
                                .map((j: Job) => ({
                                    id: j.id,
                                    title: j.title,
                                    location: j.location,
                                    posted: formatTimeAgo(j.created_at),
                                    type: j.type,
                                    deadline: formatDate(j.deadline),
                                    experience: j.experience,
                                    category: j.category,
                                    description: j.description,
                                    responsibilities: j.responsibilities || [],
                                    requirements: j.requirements || [],
                                    created_at: j.created_at
                                }));

                            setSimilarJobs(similarJobsData);
                        }
                    }
                } else {
                    setError('Unable to load job details. Please try again later.');
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError('Unable to load job details. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const jobDetailItems = useMemo(() => [
        { icon: 'solar:document-outline', value: job?.type.replace('-', ' '), label: 'Job Type' },
        { icon: 'solar:map-point-wave-outline', value: job?.location, label: 'Location' },
        { icon: 'solar:calendar-outline', value: job?.deadline, label: 'Application Deadline' },
        { icon: 'solar:graph-new-up-outline', value: job?.experience, label: 'Experience Level' }
    ], [job]);

    if (loading) {
        return (
            <div className="min-h-screen relative bg-white overflow-x-hidden">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading job details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen relative bg-white overflow-x-hidden">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Not Available</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        {error || 'This job posting is no longer available.'}
                    </p>
                    <Link
                        href="/careers"
                        className="inline-block bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white px-8 py-3 rounded-[57px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        Browse Available Jobs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-white overflow-x-hidden">
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

                .gradient-border {
                    border-image: linear-gradient(to bottom, #4520E0, #D01888) 1;
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

            <Navbar />

            <main className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 lg:py-12">

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-[#6c6c6c] text-[20px] sm:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat flex-1 pr-4">
                        {job.title}
                    </h1>


                    {user && (
                        <div className="flex gap-3 items-center">

                            {hasApplied ? (
                                <>

                                    <button
                                        disabled
                                        className="px-6 py-2 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white text-sm font-semibold font-montserrat whitespace-nowrap"
                                        title="Already applied to this job"
                                    >
                                        Applied ✓
                                    </button>


                                    {canWithdraw && (
                                        <button
                                            onClick={handleWithdrawClick}
                                            disabled={withdrawLoading}
                                            className="px-6 py-2 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-sm font-semibold font-montserrat hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all whitespace-nowrap"
                                            title="Withdraw your application"
                                        >
                                            {withdrawLoading ? 'Processing...' : 'Withdraw Application'}
                                        </button>
                                    )}


                                    <button
                                        onClick={handleSaveJobClick}
                                        disabled={saveLoading}
                                        className="text-3xl md:text-4xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded disabled:opacity-50"
                                        aria-label={isJobSaved ? 'Remove from saved jobs' : 'Save job'}
                                        title={isJobSaved ? 'Remove from saved jobs' : 'Save job'}
                                    >
                                        {saveLoading ? (
                                            <div className="w-8 h-8 gradient-icon animate-pulse">
                                                <Icon icon="solar:heart-outline" className="w-full h-full" />
                                            </div>
                                        ) : isJobSaved ? (
                                            <div className="w-8 h-8 gradient-icon cursor-pointer hover:scale-110 transition-transform">
                                                <Icon icon="solar:heart-bold" className="w-full h-full" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 text-gray-400 cursor-pointer hover:scale-110 transition-all">
                                                <Icon icon="solar:heart-outline" className="w-full h-full" />
                                            </div>
                                        )}
                                    </button>
                                </>
                            ) : (

                                <button
                                    onClick={handleSaveJobClick}
                                    disabled={saveLoading}
                                    className="text-3xl md:text-4xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded disabled:opacity-50"
                                    aria-label={isJobSaved ? 'Remove from saved jobs' : 'Save job'}
                                    title={isJobSaved ? 'Remove from saved jobs' : 'Save job'}
                                >
                                    {saveLoading ? (
                                        <div className="w-8 h-8 gradient-icon animate-pulse">
                                            <Icon icon="solar:heart-outline" className="w-full h-full" />
                                        </div>
                                    ) : isJobSaved ? (
                                        <div className="w-8 h-8 gradient-icon hover:scale-110 transition-transform">
                                            <Icon icon="solar:heart-bold" className="w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 text-gray-400 hover:text-transparent hover:scale-110 transition-all">
                                            <Icon icon="solar:heart-outline" className="w-full h-full" />
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>


                <div className="items-center gap-8 mb-6">
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-2">
                        <span>Category: </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)]">{job.category}</span>
                    </div>
                    <div className="text-[#6c6c6c] text-xs font-light font-poppins">
                        Posted {job.posted}
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {jobDetailItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 gradient-icon">
                                <Icon
                                    icon={item.icon}
                                    className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]"
                                />
                            </div>
                            <div>
                                <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins capitalize">
                                    {item.value}
                                </div>
                                <div className="text-[#6c6c6c] text-base font-normal font-poppins">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>


                <section className="mb-8">
                    <p className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                        {job.description}
                    </p>
                </section>


                {job.responsibilities && job.responsibilities.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Be Doing</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.responsibilities.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}


                {job.requirements && job.requirements.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What We&apos;re Looking For</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.requirements.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                {job.nice_to_have && job.nice_to_have.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">Nice to Have</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.nice_to_have.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                {job.what_you_will_get && job.what_you_will_get.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Get</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.what_you_will_get.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}


                <div className="mb-6">
                    {user ? (
                        <div className="flex flex-wrap gap-4">
                            {hasApplied ? (
                                <>
                                    <button
                                        disabled
                                        className="px-8 py-3 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white text-base font-semibold font-montserrat inline-block"
                                    >
                                        Applied ✓
                                    </button>
                                    {canWithdraw && (
                                        <button
                                            onClick={handleWithdrawClick}
                                            disabled={withdrawLoading}
                                            className="px-8 py-3 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-base font-semibold font-montserrat hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all"
                                        >
                                            {withdrawLoading ? 'Processing...' : 'Withdraw Application'}
                                        </button>
                                    )}
                                </>
                            ) : isDeadlinePassed(job?.deadline || '') ? (
                                <button
                                    disabled
                                    className="px-8 py-3 rounded-[57px] bg-gray-300 text-gray-600 text-base font-semibold font-montserrat cursor-not-allowed"
                                    title="Application deadline has passed"
                                >
                                    Deadline Passed
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyJobClick}
                                    disabled={applyLoading}
                                    className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] hover:cursor-pointer rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all"
                                >
                                    {applyLoading ? 'Applying...' : 'Apply'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-4">
                                {isDeadlinePassed(job?.deadline || '') ? (
                                    <button
                                        disabled
                                        className="px-8 py-3 rounded-[57px] bg-gray-300 text-gray-600 text-base font-semibold font-montserrat cursor-not-allowed"
                                        title="Application deadline has passed"
                                    >
                                        Deadline Passed
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyJobClick}
                                        disabled={applyLoading}
                                        className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] hover:cursor-pointer rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all"
                                    >
                                        {applyLoading ? 'Applying...' : 'Sign in & Apply'}
                                    </button>
                                )}
                            </div>

                            {!isDeadlinePassed(job?.deadline || '') && (
                                <div className="mt-6">
                                    <p className="text-[#6c6c6c] text-base font-normal font-poppins">
                                        If you do not already have an account,{' '}
                                        <button
                                            onClick={handleSignupClick}
                                            className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded-sm"
                                        >
                                            Sign up to apply
                                        </button>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>


                {similarJobs.length > 0 && (
                    <section className="pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#6c6c6c] text-2xl font-medium font-montserrat">Explore similar jobs on Protonest</h2>
                            <Link
                                href={`/jobs/${role}`}
                                className="text-[#6c6c6c] text-base font-poppins flex items-center hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:to-[rgba(85,48,250,1)] hover:from-[rgba(245,29,165,1)] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded-sm"
                            >
                                View more
                                <span className="ml-2 text-xl">&gt;</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {similarJobs.map(similarJob => (
                                <SimilarJobCard
                                    key={similarJob.id}
                                    job={similarJob}
                                    role={Array.isArray(role) ? role[0] : role || ''}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>


            {showConfirmDialog && job && (
                <ConfirmDialog
                    type={showConfirmDialog}
                    jobTitle={job.title}
                    onConfirm={
                        showConfirmDialog === 'apply'
                            ? confirmApplyJob
                            : showConfirmDialog === 'withdraw'
                                ? confirmWithdrawApplication
                                : confirmSaveJob
                    }
                    onCancel={closeConfirmDialog}
                />
            )}


            {showErrorDialog && (
                <ErrorDialog
                    message={showErrorDialog}
                    onClose={closeErrorDialog}
                    onUploadCV={showErrorDialog.toLowerCase().includes('cv') ? handleUploadCV : undefined}
                />
            )}


            {showInfoDialog && (
                <InfoDialog
                    message={showInfoDialog}
                    onClose={closeInfoDialog}
                />
            )}


            {showSuccessPopup && (
                <SuccessPopup
                    type={showSuccessPopup}
                    onClose={closePopup}
                    onViewSavedJobs={handleViewSavedJobs}
                />
            )}

            <Footer />
        </div>
    );
}