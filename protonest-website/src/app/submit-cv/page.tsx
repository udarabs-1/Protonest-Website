'use client';

import { Icon } from '@iconify/react';
import { ChevronDown, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    city: string;
    workFunction: string;
    ndaAcknowledged: boolean;
}

interface FormErrors {
    [key: string]: string;
}

interface DropdownState {
    [key: string]: boolean;
}

interface ExpertiseArea {
    [category: string]: string[];
}

interface SuggestedJob {
    job_id: string;
    job_title: string;
    category: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface AnalyzeResponse {
    status: string;
    results: {
        expertise_areas: ExpertiseArea;
        suggested_jobs: SuggestedJob[];
        analysis_id: string;
        user_id: string;
    };
}

interface PendingJobApplication {
    jobId: string;
    jobTitle: string;
    timestamp: number;
}

// All districts in Sri Lanka
const sriLankaDistricts: string[] = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya'
];

// Work functions list
const workFunctionsList: string[] = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'HR',
    'Operations',
    'Product Management',
    'Customer Support',
    'Business Development',
    'Data Analytics',
    'Quality Assurance',
    'Research & Development',
    'Legal',
    'Administration'
];

// Optimized Background Component
const BackgroundImage = ({ isMobile, className }: { isMobile: boolean; className: string }) => (
    <div className={className}>
        <Image
            src={isMobile ? "/jobs-1-mobile.svg" : "/jobs-1.svg"}
            alt=""
            fill
            className="object-cover object-center"
            quality={85}
            priority={true}
            sizes={isMobile ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"}
            aria-hidden="true"
        />
    </div>
);

// Optimized Modal Components
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
        <div className={`${className} bg-white rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] overflow-hidden`}>
            {children}
        </div>
    </div>
);

// Error Dialog Component
interface ErrorDialogProps {
    message: string;
    onClose: () => void;
    onResubmitCV?: () => void;
}

const ErrorDialog = ({ message, onClose, onResubmitCV }: ErrorDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const isCVExistsError = message.toLowerCase().includes('already submitted') || message.toLowerCase().includes('duplicate');

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
                    {isCVExistsError ? 'CV Already Submitted' : 'Error'}
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {message}
                </p>
                <div className="flex flex-col gap-3">
                    {isCVExistsError && onResubmitCV ? (
                        <>
                            <button
                                onClick={onResubmitCV}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                            >
                                Go to Dashboard to Resubmit CV
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

export default function OnboardingPage() {
    const router = useRouter();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: '',
        workFunction: '',
        ndaAcknowledged: false
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [uploadedCV, setUploadedCV] = useState<File | null>(null);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea>({});
    const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setWorkFunctionSearch] = useState('');
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showJobApplicationSuccessModal, setShowJobApplicationSuccessModal] = useState(false);
    const [showJobsModal, setShowJobsModal] = useState(false);
    const [showNoMatchModal, setShowNoMatchModal] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState<string | null>(null);
    const [pendingJob, setPendingJob] = useState<PendingJobApplication | null>(null);
    const [redirectAfterSubmit, setRedirectAfterSubmit] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoized dropdown refs
    const dropdownRefs = useMemo(() => ({
        city: { current: null as HTMLDivElement | null },
        workFunction: { current: null as HTMLDivElement | null },
    }), []);

    // Debounced screen size check
    const checkIsMobile = useCallback(() => {
        return window.innerWidth < 640;
    }, []);

    // Authentication check - MUST BE FIRST
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                // Store current URL to redirect back after sign in
                const currentPath = window.location.pathname;
                if (currentPath !== '/signin') {
                    sessionStorage.setItem('redirectAfterSignIn', currentPath);
                }
                router.push('/signin');
                return;
            }

            setIsAuthChecking(false);
        }
    }, [router]);

    useEffect(() => {
        checkIsMobile();

        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkIsMobile, 150);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [checkIsMobile]);

    useEffect(() => {
        if (typeof window !== 'undefined' && !isAuthChecking) {
            // Check for pending job application
            const pendingJobStr = localStorage.getItem('pendingJobApplication');
            if (pendingJobStr) {
                try {
                    const jobData = JSON.parse(pendingJobStr);
                    // Check if the job application is still valid (within 24 hours)
                    const isValid = Date.now() - jobData.timestamp < 24 * 60 * 60 * 1000;
                    if (isValid) {
                        setPendingJob(jobData);
                        // Store the redirect URL
                        setRedirectAfterSubmit(jobData.jobUrl || `/jobs/${jobData.role}/${jobData.jobId}`);
                    } else {
                        // Remove expired job application
                        localStorage.removeItem('pendingJobApplication');
                    }
                } catch {
                    // Remove invalid job application data
                    localStorage.removeItem('pendingJobApplication');
                }
            }

            // Pre-populate user data if available
            const userStr = localStorage.getItem('userData');
            if (userStr) {
                try {
                    const userData = JSON.parse(userStr);
                    setFormData(prev => ({
                        ...prev,
                        fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                        email: userData.email || ''
                    }));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
    }, [isAuthChecking]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isOutsideDropdown = Object.values(dropdownRefs).every(ref =>
                ref.current && !ref.current.contains(event.target as Node)
            );

            if (isOutsideDropdown && Object.values(dropdownOpen).some(isOpen => isOpen)) {
                setDropdownOpen({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen, dropdownRefs]);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.workFunction.trim()) newErrors.workFunction = 'At least one work function is required';
        if (!uploadedCV) newErrors.cv = 'CV upload is required';
        if (!formData.ndaAcknowledged) newErrors.nda = 'NDA acknowledgment is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, uploadedCV]);

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean): void => {
        if (field === 'workFunction') {
            // Remove any duplicate functions when adding new ones
            const functionsArray = (value as string).split(',').filter(Boolean);
            const uniqueFunctions = [...new Set(functionsArray)].join(',');
            setFormData(prev => ({
                ...prev,
                [field]: uniqueFunctions
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const analyzeCV = useCallback(async (file: File): Promise<void> => {
        setShowAnalysisModal(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Get user token from localStorage
            const userToken = localStorage.getItem('jwtToken');

            if (!userToken) {
                throw new Error('User token not found. Please sign in first.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: AnalyzeResponse = await response.json();

            if (data.status === 'success') {
                // Extract all skills from expertise areas
                const allSkills: string[] = [];
                Object.values(data.results.expertise_areas).forEach(skills => {
                    allSkills.push(...skills);
                });

                setExtractedSkills(allSkills);
                setExpertiseAreas(data.results.expertise_areas);
                setSuggestedJobs(data.results.suggested_jobs);
            } else {
                throw new Error('CV analysis failed');
            }
        } catch (error) {
            console.error('CV analysis error:', error);
            setErrors({ cv: 'Failed to analyze CV. Please try again.' });

            // Fallback to mock skills if analysis fails
            const mockSkills = ['Designing', 'UI/UX', 'Photoshop', 'JavaScript', 'React', 'Node.js', 'Python', 'Java'];
            const randomSkills = mockSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
            setExtractedSkills(randomSkills);
        } finally {
            setTimeout(() => {
                setShowAnalysisModal(false);
            }, 2000);
        }
    }, []);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, cv: 'File must be smaller than 5MB' }));
                return;
            }

            setUploadedCV(file);
            setErrors(prev => ({ ...prev, cv: '' }));
            setExtractedSkills([]);
            setExpertiseAreas({});
            setSuggestedJobs([]);

            // Call the Python API to analyze the CV
            analyzeCV(file);
        }
    }, [analyzeCV]);

    const removeSkill = useCallback((skillToRemove: string): void => {
        setExtractedSkills(prev => prev.filter(skill => skill !== skillToRemove));
    }, []);

    const handleSubmit = useCallback(async (): Promise<void> => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setShowSubmissionModal(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('country', 'Sri Lanka'); // Always Sri Lanka
            submitData.append('city', formData.city);
            submitData.append('workFunction', formData.workFunction);
            submitData.append('ndaAcknowledged', formData.ndaAcknowledged.toString());
            submitData.append('skills', JSON.stringify(extractedSkills));
            submitData.append('expertiseAreas', JSON.stringify(expertiseAreas));
            submitData.append('suggestedJobs', JSON.stringify(suggestedJobs));

            // IMPORTANT: For job applications, we DON'T apply yet - just upload CV
            // The actual application will happen after user confirms on the job details page
            if (pendingJob) {
                // User is uploading CV for a specific job - DON'T skip talent pool or apply yet
                submitData.append('skip_talent_pool', 'false'); // Add them to talent pool
                // Don't include pending_job_id here - application happens later
            } else {
                // User is just uploading CV to join talent pool
                submitData.append('skip_talent_pool', 'false');
            }

            if (uploadedCV) {
                submitData.append('cv', uploadedCV);
            }

            // Get JWT token
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            // Upload CV using new endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: submitData,
            });

            // Parse response
            const responseData = await response.json().catch(() => ({}));

            if (response.ok) {
                console.log('CV upload successful:', responseData);

                // Simulate processing time
                setTimeout(() => {
                    setShowSubmissionModal(false);

                    // Check if this was a job application scenario
                    if (pendingJob && redirectAfterSubmit) {
                        // DON'T clear the pending job application yet - it's still needed
                        // The job details page will use it to show the apply confirmation
                        console.log('CV uploaded successfully, redirecting to job page for application');

                        // Set a flag to indicate CV has been uploaded and they can now apply
                        sessionStorage.setItem('cvUploadedForJob', JSON.stringify({
                            jobTitle: pendingJob.jobTitle,
                            jobId: pendingJob.jobId,
                            timestamp: Date.now()
                        }));

                        // Redirect to the job details page where they can confirm the application
                        window.location.href = redirectAfterSubmit;
                    } else if (suggestedJobs.length > 0) {
                        // For talent pool, show suggested jobs
                        setShowJobsModal(true);
                    } else {
                        // For talent pool with no matches
                        setShowNoMatchModal(true);
                    }
                }, 3000);
            } else {
                // Handle error responses
                setShowSubmissionModal(false);

                // Check for duplicate CV error - check both status code and error message
                const errorMessage = responseData.message || responseData.error || 'Unknown error';
                const isDuplicateError =
                    response.status === 409 ||
                    response.status === 400 ||
                    response.status === 500 && (
                        errorMessage.toLowerCase().includes('duplicate') ||
                        errorMessage.toLowerCase().includes('e11000') ||
                        errorMessage.toLowerCase().includes('already exists') ||
                        errorMessage.toLowerCase().includes('duplicate key error')
                    );

                if (isDuplicateError) {
                    setShowErrorDialog('You have already submitted a CV. If you wish to update your CV, please use the "Resubmit CV" option in the Dashboard.');
                } else {
                    setShowErrorDialog(errorMessage || `Failed to submit application. Status: ${response.status}`);
                }
            }

        } catch (error) {
            console.error('Submission error:', error);
            setShowSubmissionModal(false);

            // Check if it's a duplicate error in the catch block as well
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
            const isDuplicateError =
                errorMessage.toLowerCase().includes('duplicate') ||
                errorMessage.toLowerCase().includes('e11000') ||
                errorMessage.toLowerCase().includes('already exists') ||
                errorMessage.toLowerCase().includes('duplicate key error');

            if (isDuplicateError) {
                setShowErrorDialog('You have already submitted a CV. If you wish to update your CV, please use the "Resubmit CV" option in the Dashboard.');
            } else {
                setShowErrorDialog(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [validateForm, formData, extractedSkills, expertiseAreas, suggestedJobs, pendingJob, redirectAfterSubmit, uploadedCV]);

    const handleReset = useCallback((): void => {
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            city: '',
            workFunction: '',
            ndaAcknowledged: false
        });
        setUploadedCV(null);
        setExtractedSkills([]);
        setExpertiseAreas({});
        setSuggestedJobs([]);
        setErrors({});
        setWorkFunctionSearch('');
    }, []);

    const toggleDropdown = useCallback((field: string): void => {
        setDropdownOpen(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    }, []);

    // Get button text based on pending job
    const getButtonText = useCallback(() => {
        if (pendingJob) {
            return 'Submit CV and Apply for the Job';
        } else {
            return 'Submit CV and Join Talent Pool';
        }
    }, [pendingJob]);

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        return !!(
            formData.fullName.trim() &&
            formData.email.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData.phoneNumber.trim() &&
            formData.city &&
            formData.workFunction.trim() &&
            uploadedCV &&
            formData.ndaAcknowledged
        );
    }, [formData, uploadedCV]);

    const handleResubmitCV = useCallback(() => {
        setShowErrorDialog(null);
        router.push('/dashboard/resubmit-cv');
    }, [router]);

    const closeErrorDialog = useCallback(() => {
        setShowErrorDialog(null);
    }, []);

    // Analysis Modal Component
    const AnalysisModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Thanks for submitting your CV!<br />Parsing your CV to match your areas of expertise
                </div>
            </div>
        </ModalWrapper>
    );

    // Submission Modal Component
    const SubmissionModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    {pendingJob ? (
                        <>Thanks for submitting your CV!<br />Processing your application for {pendingJob.jobTitle}...</>
                    ) : (
                        <>Thanks for submitting your CV!<br />Adding you to our talent pool and finding matching roles…</>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );

    // Jobs Modal Component
    const JobsModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                setShowJobsModal(false);
            }
        };

        return (
            <ModalWrapper
                onBackdropClick={handleBackdropClick}
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[1117px] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px] mb-6 sm:mb-8 md:mb-10">
                        {pendingJob ? (
                            <>Your application for {pendingJob.jobTitle} was submitted successfully!<br />Here are other recommended roles based on your CV</>
                        ) : (
                            <>Welcome to our talent pool!<br />Based on your CV, we recommend the following roles</>
                        )}
                    </div>

                    {suggestedJobs && suggestedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                            {suggestedJobs.map((job, index) => (
                                <div key={index} className="flex flex-col justify-start items-center gap-4 sm:gap-6 p-4 rounded-lg">
                                    <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px] min-h-[60px] flex items-center">
                                        {job.job_title}
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[30px]">Good Fit<br /></span>
                                        <span className="text-[#6c6c6c] text-base sm:text-lg font-medium font-poppins leading-[30px]">
                                            {job.match_percentage}% Match
                                        </span>
                                    </div>
                                    <div className="w-full max-w-[261px]">
                                        <button
                                            className="w-full h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                            onClick={() => router.push(`/jobs/view/${job.job_id}`)}
                                        >
                                            <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">View Suggested Job</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-[#6c6c6c] text-lg font-normal font-poppins leading-[30px] py-8">
                            No matching jobs found at the moment.
                        </div>
                    )}

                    <div className="text-center text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] mt-6 sm:mt-8 md:mt-10">
                        {pendingJob ? (
                            <>Check all available jobs for you!</>
                        ) : (
                            <>You&apos;re now in our talent pool! Check all available jobs for you!</>
                        )}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                            onClick={() => router.push('/dashboard')}
                        >
                            <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">View All Available Jobs</span>
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    // No Match Modal Component
    const NoMatchModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                setShowNoMatchModal(false);
            }
        };

        return (
            <ModalWrapper
                onBackdropClick={handleBackdropClick}
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px]"
            >
                <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px]">
                            {pendingJob ? (
                                <>You have successfully applied for {pendingJob.jobTitle}!</>
                            ) : (
                                <>Welcome to our talent pool!</>
                            )}
                        </div>
                        <div className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                            {pendingJob ? (
                                <>Your application has been submitted successfully</>
                            ) : (
                                <>We couldn&apos;t find matching roles right now, but don&apos;t worry!<br />
                                    We&apos;ll contact you when something opens up that fits your profile.</>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] mt-4">
                            <button
                                className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                onClick={() => {
                                    // Clear pending job application
                                    if (pendingJob) {
                                        localStorage.removeItem('pendingJobApplication');
                                    }
                                    router.push('/');
                                }}
                            >
                                <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Return to Homepage</span>
                            </button>
                            <button
                                className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                                onClick={() => {
                                    setShowNoMatchModal(false);
                                    setUploadedCV(null);
                                    setExtractedSkills([]);
                                    if (fileInputRef.current) fileInputRef.current.click();
                                }}
                            >
                                <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">Re-Upload CV</span>
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    // Job Application Success Modal Component
    const JobApplicationSuccessModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                setShowJobApplicationSuccessModal(false);
            }
        };

        return (
            <ModalWrapper
                onBackdropClick={handleBackdropClick}
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px]"
            >
                <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        {/* Success Icon */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center gradient-icon">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-full h-full" />
                        </div>

                        {/* Success Message */}
                        <div className="text-center">
                            <h2 className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px] mb-4">
                                Application Submitted Successfully!
                            </h2>
                            <p className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                                Your application for <strong>{pendingJob?.jobTitle}</strong> has been submitted successfully.<br />
                                We&apos;ll be in touch soon with updates on your application status.
                            </p>
                        </div>

                        {/* Additional suggested jobs if available */}
                        {suggestedJobs && suggestedJobs.length > 0 && (
                            <div className="text-center text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] mt-4">
                                We&apos;ve also found other roles that might interest you!
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] mt-4">
                            {suggestedJobs && suggestedJobs.length > 0 ? (
                                <>
                                    <button
                                        className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                        onClick={() => {
                                            setShowJobApplicationSuccessModal(false);
                                            setShowJobsModal(true);
                                        }}
                                    >
                                        <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">View Other Recommended Jobs</span>
                                    </button>
                                    <button
                                        className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">Go to Dashboard</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Go to Dashboard</span>
                                    </button>
                                    <button
                                        className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                                        onClick={() => router.push('/jobs')}
                                    >
                                        <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">Browse All Jobs</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    return (
        <div>
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

            {/* SVG Gradient Definition */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            <Navbar />

            {/* Optimized Header Section */}
            <header className="h-[400px] lg:h-[500px] xl:h-[439px] relative">
                {/* Background Images */}
                <BackgroundImage
                    isMobile={true}
                    className="absolute inset-0 -z-10 block sm:hidden"
                />
                <BackgroundImage
                    isMobile={false}
                    className="absolute inset-0 -z-10 hidden sm:block"
                />

                {/* Gradient Overlays */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10" />

                {/* Hero Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-0">
                    <div className="text-center max-w-4xl xl:max-w-[1120px]">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                            <span className="text-[#6c6c6c]">Submit Your CV and</span>
                            <br />
                            {pendingJob ? (
                                <>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Apply for {pendingJob.jobTitle}</span>
                                </>
                            ) : (
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Join Our Talent Network</span>
                            )}
                        </h1>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px] max-w-2xl xl:max-w-[1120px] mx-auto">
                            {pendingJob ? (
                                <>
                                    Complete your application by uploading your CV.<br />
                                </>
                            ) : (
                                <>
                                    Tell us a little about yourself.<br />
                                    We&apos;ll match your skills with any opportunities at Protonest according to your preferences
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </header>

            <main className="min-h-screen relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] 2xl:px-[180px]">
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Full Name - Always full width */}
                            <div>
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-base"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.fullName}</p>}
                            </div>

                            {/* Email and Phone - Side by side on large screens */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-base"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.email}</p>}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center">
                                        {/* Country Code - Fixed for Sri Lanka */}
                                        <div className="flex items-center p-3 border-b-2 border-gray-300 bg-transparent mr-2 flex-shrink-0">
                                            <span className="mr-1">🇱🇰</span>
                                            <span className="text-gray-700 text-sm sm:text-base md:text-base lg:text-base">+94</span>
                                        </div>

                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            placeholder="For faster communication"
                                            className="flex-1 p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-base"
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.phoneNumber}</p>}
                                </div>
                            </div>

                            {/* City Dropdown */}
                            <div>
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                    District
                                </label>
                                <div className="relative" ref={dropdownRefs.city}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown('city');
                                        }}
                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left flex justify-between items-center focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins']"
                                    >
                                        <span className={formData.city ? 'text-gray-700 text-sm sm:text-base md:text-base lg:text-base' : 'text-gray-400 text-sm sm:text-base md:text-base lg:text-base'}>
                                            {formData.city || 'Select district'}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.city ? 'rotate-180' : ''}`} />
                                    </button>
                                    {dropdownOpen.city && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {sriLankaDistricts.map(district => (
                                                <button
                                                    key={district}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInputChange('city', district);
                                                        toggleDropdown('city');
                                                    }}
                                                    className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
                                                >
                                                    {district}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.city && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.city}</p>}
                            </div>

                            {/* Work Function - Dropdown */}
                            <div>
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                    What functions do you prefer to work in?
                                </label>
                                <div className="relative" ref={dropdownRefs.workFunction}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown('workFunction');
                                        }}
                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left flex justify-between items-center focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins']"
                                    >
                                        <span className={formData.workFunction ? 'text-gray-700 text-sm sm:text-base md:text-base lg:text-base' : 'text-gray-400 text-sm sm:text-base md:text-base lg:text-base'}>
                                            {formData.workFunction ? 'Functions selected' : 'Select work functions'}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.workFunction ? 'rotate-180' : ''}`} />
                                    </button>

                                    {dropdownOpen.workFunction && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {workFunctionsList
                                                .filter(func => !formData.workFunction.split(',').includes(func))
                                                .map(func => (
                                                    <button
                                                        key={func}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${func}` : func);
                                                        }}
                                                        className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
                                                    >
                                                        {func}
                                                    </button>
                                                ))}
                                            {workFunctionsList.filter(func => !formData.workFunction.split(',').includes(func)).length === 0 && (
                                                <div className="p-3 text-gray-500 text-sm text-center font-['Poppins']">
                                                    All functions selected
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Display selected functions as tags */}
                                {formData.workFunction && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {formData.workFunction.split(',').filter(Boolean).map((func, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 gradient-border text-gray-600 font-medium text-sm font-['Poppins']"
                                            >
                                                <span>{func}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedFunctions = formData.workFunction.split(',')
                                                            .filter(f => f !== func)
                                                            .join(',');
                                                        handleInputChange('workFunction', updatedFunctions);
                                                    }}
                                                    className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {errors.workFunction && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.workFunction}</p>}
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div className="space-y-4">
                            <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold font-['Poppins']">
                                Upload CV
                            </label>
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-6 lg:p-12 text-center shadow-sm">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {!uploadedCV ? (
                                    <>
                                        <Upload className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600 mb-4 text-xs sm:text-sm lg:text-base font-['Poppins']">
                                            Click the Upload button to upload your CV.<br />
                                            You can add an updated CV at any time.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-medium text-sm sm:text-base font-['Poppins'] transition-all duration-300"
                                        >
                                            Browse
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 gradient-icon flex items-center justify-center">
                                                <Icon icon="solar:check-circle-bold" className="w-full h-full" />
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm sm:text-base font-['Poppins']">{uploadedCV.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-1 lg:px-6 lg:py-2 border-2 gradient-border text-[#6c6c6c] hover:cursor-pointer rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 text-sm sm:text-base font-['Poppins']"
                                        >
                                            Replace CV
                                        </button>
                                    </div>
                                )}
                            </div>
                            {errors.cv && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.cv}</p>}
                        </div>

                        {/* Extracted Skills - Only show expertise areas */}
                        {extractedSkills.length > 0 && (
                            <div className="space-y-4">
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold font-['Poppins']">
                                    Expertise Areas According To Your CV
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {extractedSkills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 gradient-border text-gray-600 font-medium text-sm font-['Poppins']"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NDA Acknowledgment */}
                        <div className="flex items-start space-x-3">
                            <button
                                type="button"
                                onClick={() => handleInputChange('ndaAcknowledged', !formData.ndaAcknowledged)}
                                className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex-shrink-0 mt-1 transition-colors ${formData.ndaAcknowledged
                                    ? 'bg-[rgba(85,48,250,1)] border-[rgba(85,48,250,1)]'
                                    : 'border-gray-400'
                                    }`}
                            >
                                {formData.ndaAcknowledged && (
                                    <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white m-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                            <div>
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-1 font-['Poppins']">
                                    NDA Acknowledgment
                                </label>
                                <p className="text-gray-500 text-xs sm:text-sm font-['Poppins'] leading-relaxed">
                                    In the case that I am selected for a role, I understand that I must sign a Non-disclosure agreement before detailed project discussions.
                                </p>
                                {errors.nda && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.nda}</p>}
                            </div>
                        </div>

                        {/* Error Summary - Only show if form is not valid and has been submitted */}
                        {!isFormValid && Object.keys(errors).length > 0 && (
                            <div className="bg-white rounded-lg border-2 border-red-200 p-4 flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <Icon icon="solar:danger-circle-bold" className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-red-600 text-sm font-['Poppins']">
                                        {errors.submit || 'Please complete all required fields before submitting.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className="flex-1 max-w-1/6 px-6 py-3 lg:px-8 lg:py-4 border-2 gradient-border text-gray-600 rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 text-sm sm:text-base transition-all duration-300 hover:bg-purple-50"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 sm:max-w-md px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none text-sm sm:text-base transition-all duration-300"
                            >
                                {getButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showAnalysisModal && <AnalysisModal />}
            {showSubmissionModal && <SubmissionModal />}
            {showJobApplicationSuccessModal && <JobApplicationSuccessModal />}
            {showJobsModal && <JobsModal />}
            {showNoMatchModal && <NoMatchModal />}

            {/* Error Dialog */}
            {showErrorDialog && (
                <ErrorDialog
                    message={showErrorDialog}
                    onClose={closeErrorDialog}
                    onResubmitCV={showErrorDialog.toLowerCase().includes('already submitted') ? handleResubmitCV : undefined}
                />
            )}

            <Footer />
        </div>
    );
}