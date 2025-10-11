"use client";

import Footer from '@/app/components/footer';
import {
    ChevronRight,
    LogOut,
    Menu,
    RefreshCw,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SuggestedJob {
    category: string;
    job_id: string;
    job_title: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface PublicJobResponse {
    id: string;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[] | null;
    requirements: string[] | null;
    overview: string;
    status: string;
    created_by: string;
    created_at: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    postedDate?: string;
    applicationDeadline?: string;
    experience?: string;
    category?: string;
    overview?: string;
    matchPercentage?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
}

interface CVInfoResponse {
    status: string;
    message?: string;
    data: {
        file_url: string;
        original_name: string;
        uploaded_at: string;
        file_size: string;
        file_type: string;
    };
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

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
        <div className="w-full h-full rounded-full"></div>
        <div
            className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-r-blue-500 animate-spin bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
            style={{
                background: 'conic-gradient(from 0deg, #F51DA5, #5530FA, #F51DA5)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)'
            }}
        />
    </div>
);

// Modal Wrapper Component
const ModalWrapper = ({
    children,
    onBackdropClick,
    className = "w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[833px] h-[250px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[365px]"
}: {
    children: React.ReactNode;
    onBackdropClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}) => (
    <div
        className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4"
        onClick={onBackdropClick}
    >
        <div className={`${className} bg-white/5 rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden`}>
            {children}
        </div>
    </div>
);

const SuggestedJobs = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
    const [showUpdateErrorModal, setShowUpdateErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '💼', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/signin');
        }
    }, [router]);

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

    // Fetch suggested jobs data
    const fetchSuggestedJobs = async () => {
        try {
            setLoading(true);

            // Fetch suggested jobs
            const suggestedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/suggested-jobs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            if (suggestedResponse.ok) {
                const suggestedData = await suggestedResponse.json();
                const suggestedJobsList: SuggestedJob[] = suggestedData.data.suggested_jobs || [];

                // Fetch details for each suggested job
                const jobDetailsPromises = suggestedJobsList.map(async (suggestedJob: SuggestedJob) => {
                    try {
                        const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${suggestedJob.job_id}`);
                        if (jobResponse.ok) {
                            const jobData = await jobResponse.json();
                            const publicJob: PublicJobResponse = jobData.data;

                            // Map the public API response to the Job interface expected by the UI
                            return {
                                id: publicJob.id,
                                title: publicJob.title,
                                location: publicJob.location,
                                type: publicJob.type,
                                description: publicJob.description || publicJob.overview,
                                requirements: publicJob.requirements || [],
                                postedDate: publicJob.created_at,
                                applicationDeadline: publicJob.deadline,
                                experience: publicJob.experience,
                                category: publicJob.category,
                                overview: publicJob.overview,
                                matchPercentage: suggestedJob.match_percentage,
                                matchedSkills: suggestedJob.matched_skills,
                                missingSkills: suggestedJob.missing_skills
                            };
                        }
                    } catch (error) {
                        console.error('Error fetching job details:', error);
                    }
                    return null;
                });

                const jobDetails = await Promise.all(jobDetailsPromises);
                const validJobs = jobDetails.filter(job => job !== null) as Job[];
                setSuggestedJobs(validJobs);
                setFilteredJobs(validJobs);
            }
        } catch (error) {
            console.error('Error fetching suggested jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestedJobs();
    }, []);

    // Handle search functionality
    useEffect(() => {
        let filtered = suggestedJobs;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.matchedSkills?.some(skill =>
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply other filters if needed
        if (activeFilters.length > 0) {
            filtered = filtered.filter(job => {
                return activeFilters.some(filter => {
                    if (filter === 'Remote') {
                        return job.location.toLowerCase().includes('remote');
                    }
                    if (filter === 'Beginner' || filter === 'Entry') {
                        return job.experience?.toLowerCase().includes('entry') ||
                            job.experience?.toLowerCase().includes('beginner') ||
                            job.experience?.toLowerCase().includes('junior');
                    }
                    if (filter === 'Intermediate') {
                        return job.experience?.toLowerCase().includes('intermediate') ||
                            job.experience?.toLowerCase().includes('mid');
                    }
                    if (filter === 'Senior') {
                        return job.experience?.toLowerCase().includes('senior') ||
                            job.experience?.toLowerCase().includes('lead');
                    }
                    return false;
                });
            });
        }

        setFilteredJobs(filtered);
    }, [searchQuery, activeFilters, suggestedJobs]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        router.push('/find-jobs');
    };

    // Helper function to format time difference as "X days ago"
    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    const removeFilter = (filterToRemove: string) => {
        setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Handle Update Suggested Jobs - ALL ERRORS CAUGHT AND SHOWN IN DIALOG
    const handleUpdateSuggestedJobs = async () => {
        // Initialize state
        setIsUpdating(true);
        setShowAnalysisModal(true);
        setErrorMessage('');

        try {
            // Step 1: Validate JWT Token
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setErrorMessage('Please log in to update suggested jobs');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            // Step 2: Get CV File Info (to get filename)
            let cvInfoResponse;
            try {
                cvInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/info`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (networkError) {
                console.log('Network error fetching CV info:', networkError);
                setErrorMessage('Network error. Please check your internet connection and try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            // Step 3: Handle CV Info Response
            if (!cvInfoResponse.ok) {
                console.log('CV info response not ok - Status:', cvInfoResponse.status);
                setErrorMessage('No CV found. Please upload your CV first by going to the "Resubmit CV" page.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            let cvInfoData: CVInfoResponse;
            try {
                cvInfoData = await cvInfoResponse.json();
            } catch (parseError) {
                console.log('Error parsing CV info response:', parseError);
                setErrorMessage('Unable to retrieve CV information. Please try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            // Step 4: Validate CV Data
            if (!cvInfoData || cvInfoData.status !== 'success') {
                console.log('Invalid CV info data:', cvInfoData);
                setErrorMessage('Unable to retrieve CV information. Please try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            if (!cvInfoData.data) {
                console.log('No data in CV info response');
                setErrorMessage('No CV file found. Please upload your CV first by going to the "Resubmit CV" page.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            console.log('✓ CV Info retrieved successfully:', cvInfoData.data.original_name);

            // Step 5: Download CV File from Backend (avoids CORS issues)
            let cvFileResponse;
            try {
                cvFileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/file`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });
            } catch (downloadError) {
                console.log('Error downloading CV file:', downloadError);
                setErrorMessage('Unable to access your CV file. Please try re-uploading your CV.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            if (!cvFileResponse.ok) {
                console.log('CV file download failed - Status:', cvFileResponse.status);
                setErrorMessage('Unable to access your CV file. Please try re-uploading your CV.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            let cvBlob;
            try {
                cvBlob = await cvFileResponse.blob();
            } catch (blobError) {
                console.log('Error creating blob from CV file:', blobError);
                setErrorMessage('Unable to process your CV file. Please try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            // Step 6: Validate Blob
            if (cvBlob.size === 0) {
                console.log('CV blob is empty');
                setErrorMessage('Your CV file appears to be empty. Please re-upload your CV.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            const cvFile = new File([cvBlob], cvInfoData.data.original_name || 'cv.pdf', {
                type: 'application/pdf'
            });

            console.log('✓ CV file downloaded successfully:', cvFile.name, 'Size:', cvFile.size, 'bytes');

            // Step 7: Analyze CV with Python API
            const formData = new FormData();
            formData.append('file', cvFile);

            console.log('→ Sending CV to analysis service...');

            let analyzeResponse;
            try {
                analyzeResponse = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/analyze`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: formData,
                });
            } catch (analysisNetworkError) {
                console.log('Network error during CV analysis:', analysisNetworkError);
                setErrorMessage('Unable to connect to the analysis service. Please try again in a few moments.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            if (!analyzeResponse.ok) {
                console.log('Analysis API returned error - Status:', analyzeResponse.status);
                setErrorMessage('CV analysis service is currently unavailable. Please try again later.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            let analyzeData;
            try {
                analyzeData = await analyzeResponse.json();
            } catch (parseError) {
                console.log('Error parsing analysis response:', parseError);
                setErrorMessage('Unable to process analysis results. Please try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            if (analyzeData.status !== 'success') {
                console.log('Analysis status not success:', analyzeData.status);
                setErrorMessage('CV analysis failed. Please ensure your CV is in a valid format and try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            console.log('✓ CV analysis completed successfully');

            // Step 8: Validate Analysis Results
            if (!analyzeData.results) {
                console.log('No results in analysis data');
                setErrorMessage('Analysis completed but no results were returned. Please try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            // Step 9: Update Database
            const updateData = {
                expertise_areas: analyzeData.results.expertise_areas || {},
                suggested_jobs: analyzeData.results.suggested_jobs || []
            };

            console.log('→ Updating your profile with new analysis results...');

            let updateResponse;
            try {
                updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/update-analysis`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });
            } catch (updateNetworkError) {
                console.log('Network error during database update:', updateNetworkError);
                setErrorMessage('Unable to save your updated profile. Please check your connection and try again.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            if (!updateResponse.ok) {
                console.log('Update API returned error - Status:', updateResponse.status);
                // Check specific status codes for better error messages
                if (updateResponse.status === 404) {
                    setErrorMessage('Your profile was not found. Please try re-uploading your CV from the "Resubmit CV" page.');
                } else if (updateResponse.status === 401) {
                    setErrorMessage('Your session has expired. Please log in again.');
                } else {
                    setErrorMessage('Unable to update your profile. Please try again.');
                }
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            try {
                await updateResponse.json();
            } catch (parseError) {
                console.log('Error parsing update response:', parseError);
                setErrorMessage('Update may have succeeded but we couldn\'t confirm. Please refresh the page.');
                setShowAnalysisModal(false);
                setShowUpdateErrorModal(true);
                return;
            }

            console.log('✓ Profile updated successfully');

            // Step 10: Show Success and Refresh
            setTimeout(() => {
                setShowAnalysisModal(false);
                setShowUpdateSuccessModal(true);
            }, 2000);

            setTimeout(async () => {
                try {
                    await fetchSuggestedJobs();
                } catch (refreshError) {
                    console.log('Error refreshing suggested jobs:', refreshError);
                    // Don't show error for refresh failure, jobs were updated successfully
                }
                setShowUpdateSuccessModal(false);
            }, 3000);

        } catch (unexpectedError) {
            // Catch any unexpected errors
            console.log('Unexpected error during update:', unexpectedError);
            setErrorMessage('An unexpected error occurred. Please refresh the page and try again.');
            setShowAnalysisModal(false);
            setShowUpdateErrorModal(true);
        } finally {
            setIsUpdating(false);
        }
    };

    // Analysis Modal Component
    const AnalysisModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Analyzing your CV...<br />Finding the best matching roles for you
                </div>
            </div>
        </ModalWrapper>
    );

    // Update Success Modal Component
    const UpdateSuccessModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Success!<br />Your suggested jobs have been updated
                </div>
            </div>
        </ModalWrapper>
    );

    // Update Error Modal Component
    const UpdateErrorModal = () => (
        <ModalWrapper
            onBackdropClick={() => setShowUpdateErrorModal(false)}
            className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px]"
        >
            <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px]">
                        Update Failed
                    </div>
                    <div className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                        {errorMessage}
                    </div>
                    <div className="flex justify-center w-full max-w-[500px] mt-4">
                        <button
                            className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                            onClick={() => setShowUpdateErrorModal(false)}
                        >
                            <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {/* Header */}
                <header className="bg-white py-4">
                    <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            {/* Logo - Smaller on mobile */}
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

                            {/* Header Actions - Only Profile Icon */}
                            <div className="flex items-center">
                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                            {/* Mobile Sidebar Header */}
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

                            {/* Sidebar Content */}
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

                                {/* Logout Button */}
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

                                {/* Logout Button */}
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
                            {/* Breadcrumb with Hamburger Menu for mobile */}
                            <div className="flex items-center mb-6">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                                <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Suggested Jobs</span>
                                </nav>
                            </div>

                            {/* Suggested Jobs Section */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[25px]">🔎</span>
                                            <h2 className="text-2xl font-medium text-gray-700">Suggested Jobs</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            These jobs are matched based on your profile, CV, and skills.
                                        </p>
                                    </div>

                                    {/* Update Suggested Jobs Button */}
                                    <button
                                        onClick={handleUpdateSuggestedJobs}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-full font-medium text-sm sm:text-base font-['Poppins'] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isUpdating ? 'animate-spin' : ''}`} />
                                        <span>{isUpdating ? 'Updating...' : 'Update Suggested Jobs'}</span>
                                    </button>
                                </div>

                                <div className="relative mb-6 flex items-center gap-3">
                                    {/* Search Bar */}
                                    <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search for the job you are looking for"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                        />
                                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Active Filters */}
                                {activeFilters.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {activeFilters.map((filter, index) => (
                                            <button
                                                key={index}
                                                onClick={() => removeFilter(filter)}
                                                className="px-4 py-2 rounded-full gradient-button text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-none"
                                            >
                                                {filter}
                                                <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Suggested Jobs Container */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => {
                                            // Get the role slug from the job category
                                            const roleSlug = categoryToSlugMap[job.category || ''] || 'other-roles';

                                            return (
                                                <div
                                                    key={job.id}
                                                    className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6"
                                                >
                                                    {/* Job Title */}
                                                    <div className="w-full h-[43px]">
                                                        <div className="w-full h-full text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] group-hover:font-medium text-base font-normal font-['Poppins'] leading-[35px] line-clamp-1 transition-none">
                                                            {job.title}
                                                        </div>
                                                    </div>

                                                    {/* Job Type and Posted Date */}
                                                    <div className="w-full h-[35px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                        {job.type} - Posted {job.postedDate ? formatTimeAgo(job.postedDate) : 'Recently'}
                                                    </div>

                                                    {/* Job Details Grid */}
                                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                                        {/* Match Score */}
                                                        <div className="flex flex-col">
                                                            <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                                {job.matchPercentage ? `${job.matchPercentage}% Match` : 'N/A'}
                                                            </div>
                                                            <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Match Score
                                                            </div>
                                                        </div>

                                                        {/* Experience Level */}
                                                        <div className="flex flex-col">
                                                            <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px] capitalize">
                                                                {job.experience || 'Not specified'}
                                                            </div>
                                                            <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Experience Level
                                                            </div>
                                                        </div>

                                                        {/* Application Deadline */}
                                                        <div className="flex flex-col">
                                                            <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                                {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Not specified'}
                                                            </div>
                                                            <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Application Deadline
                                                            </div>
                                                        </div>

                                                        {/* Location */}
                                                        <div className="flex flex-col">
                                                            <div className="h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                                {job.location}
                                                            </div>
                                                            <div className="h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Location
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Arrow Image Swap on Hover */}
                                                    <Link
                                                        href={`/jobs/${roleSlug}/${job.id}`}
                                                        className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300"
                                                    >
                                                        <div className="w-full h-full group-hover:hidden">
                                                            <Image
                                                                src="/upleft.svg"
                                                                alt="Arrow"
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="hidden w-full h-full group-hover:block">
                                                            <Image
                                                                src="/upleft-hover.svg"
                                                                alt="Hover Arrow"
                                                                width={50}
                                                                height={50}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* View Details Button with Gradient Hover Effect - Fixed Position */}
                                                    <div className="mt-6">
                                                        <Link
                                                            href={`/jobs/${roleSlug}/${job.id}`}
                                                            className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300 block"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-600 text-lg font-poppins mb-4">
                                                {searchQuery ?
                                                    `No jobs found matching "${searchQuery}"` :
                                                    'No suggested jobs available'
                                                }
                                            </div>
                                            <p className="text-gray-500 text-sm">
                                                {!searchQuery && suggestedJobs.length === 0 &&
                                                    'Upload your CV to get personalized job recommendations.'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAnalysisModal && <AnalysisModal />}
            {showUpdateSuccessModal && <UpdateSuccessModal />}
            {showUpdateErrorModal && <UpdateErrorModal />}

            <Footer />
        </div>
    );
};

export default SuggestedJobs;