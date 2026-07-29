'use client';

import { Icon } from '@iconify/react';
import {
    ChevronDown,
    Download,
    Eye,
    Upload,
    X
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DashboardLayout from '@/app/components/dashboard-layout';

interface CVInfoResponse {
    status: string;
    message?: string;
    data: CVInfo;
}

interface CVInfo {
    file_url: string;
    original_name: string;
    uploaded_at: string;
    file_size: string;
    file_type: string;
}

interface SuggestedJob {
    job_id: string;
    job_title: string;
    category: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

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

interface ProfileData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    location: string;
    bio: string;
    profileImage: string;
    jobUpdates: boolean;
    newsletter: boolean;
    isGoogleUser?: boolean;
}

interface PendingJobApplication {
    jobId: string;
    jobTitle: string;
    jobUrl: string;
    role: string;
    timestamp: number;
}

interface ExpertiseArea {
    [category: string]: string[];
}

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

const isUserTokenExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    const token = localStorage.getItem('jwtToken');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('tokenExpiration');
            return true;
        }

        return false;
    } catch {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
        return true;
    }
};

const ResubmitCVPage = () => {
    const router = useRouter();
    const pathname = usePathname();


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cvInfo, setCvInfo] = useState<CVInfo | null>(null);
    const [lastSubmitted, setLastSubmitted] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [hasCVUploaded, setHasCVUploaded] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showJobsModal, setShowJobsModal] = useState(false);
    const [showNoMatchModal, setShowNoMatchModal] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState<string | null>(null);

    const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea>({});
    const [cvFullText, setCvFullText] = useState<string>('');
    const [totalYearsExperience, setTotalYearsExperience] = useState<number>(0);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [pendingJob, setPendingJob] = useState<PendingJobApplication | null>(null);
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        location: '',
        bio: '',
        profileImage: '/profile-1.svg',
        jobUpdates: true,
        newsletter: false,
        isGoogleUser: false,
    });

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: '',
        workFunction: '',
        ndaAcknowledged: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
    const [districtSearch, setDistrictSearch] = useState('');
    const [workFunctionSearch, setWorkFunctionSearch] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const dropdownRefs = useMemo(() => ({
        city: { current: null as HTMLDivElement | null },
        workFunction: { current: null as HTMLDivElement | null },
    }), []);

    const inputRefs = useMemo(() => ({
        city: { current: null as HTMLInputElement | null },
        workFunction: { current: null as HTMLInputElement | null },
    }), []);

    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    useEffect(() => {
        if (highlightedIndex >= 0 && dropdownOpen.city) {
            const item = document.getElementById(`city-item-${highlightedIndex}`);
            item?.scrollIntoView({ block: 'nearest' });
        }
        if (highlightedIndex >= 0 && dropdownOpen.workFunction) {
            const item = document.getElementById(`workFunction-item-${highlightedIndex}`);
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, dropdownOpen]);

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Update Personal Details' }
    ];

    useEffect(() => {
        setDistrictSearch(formData.city || '');
    }, [formData.city]);

    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    const userData = data.user;
                    setProfileData({
                        id: userData.id,
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        email: userData.email || '',
                        jobTitle: userData.job_title || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        profileImage: userData.profile_image || '/profile-1.svg',
                        jobUpdates: userData.job_updates || false,
                        newsletter: userData.newsletter || false,
                        isGoogleUser: userData.is_oauth_user || false,
                    });
                }
            } else if (response.status === 401) {
                localStorage.removeItem('jwtToken');
                router.push('/signin');
            }
        } catch (error) {
        }
    };

    const resetPage = useCallback(() => {
        setShowJobsModal(false);
        setShowNoMatchModal(false);
        setSelectedFile(null);
        setExtractedSkills([]);
        setSuggestedJobs([]);
        setError('');
        setSuccess('');
        setHasAttemptedSubmit(false);
    }, []);

    useEffect(() => {
        fetchCVInfo();
        populateUserData();
        fetchUserProfile();

        const pendingJobStr = localStorage.getItem('pendingJobApplication');
        if (pendingJobStr) {
            try {
                const jobData = JSON.parse(pendingJobStr);

                const isValid = Date.now() - jobData.timestamp < 10 * 60 * 1000;
                if (isValid) {
                    setPendingJob(jobData);
                } else {

                    localStorage.removeItem('pendingJobApplication');
                }
            } catch {
                localStorage.removeItem('pendingJobApplication');
            }
        }
    }, []);

    const populateUserData = () => {
        const userStr = localStorage.getItem('userData');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                    email: userData.email || ''
                }));
            } catch {
                console.error('Error parsing user data');
            }
        }
    };

    const fetchCVInfo = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/info`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: CVInfoResponse = await response.json();
                if (data.status === 'success' && data.data) {
                    setCvInfo(data.data);
                    setLastSubmitted(new Date(data.data.uploaded_at).toLocaleDateString());
                    setHasCVUploaded(true);
                }
            } else if (response.status === 404) {
                setCvInfo(null);
                setLastSubmitted('Never');
                setHasCVUploaded(false);
            } else if (response.status === 401) {
                localStorage.removeItem('jwtToken');
                router.push('/signin');
            } else {
                throw new Error('Failed to fetch CV info');
            }
        } catch {
            setHasCVUploaded(false);
        }
    };

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
        if (!formData.city) newErrors.city = 'District is required';
        if (!formData.workFunction.trim()) newErrors.workFunction = 'At least one work function is required';
        if (!selectedFile) newErrors.cv = 'CV upload is required';
        if (!formData.ndaAcknowledged) newErrors.nda = 'NDA acknowledgment is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, selectedFile]);

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean): void => {
        if (field === 'workFunction') {
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

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const toggleDropdown = useCallback((field: string): void => {
        setDropdownOpen(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    }, []);

    const handleFileSelect = async (file: File) => {
        if (file.type === 'application/pdf') {
            setSelectedFile(file);
            setError('');
            setErrors(prev => ({ ...prev, cv: '' }));

            setShowAnalysisModal(true);

            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setSelectedFile(null);
                setShowAnalysisModal(false);
                setShowErrorDialog('Please log in to analyze your CV');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            let response;
            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/analyze`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: formData,
                });
            } catch {
                setSelectedFile(null);
                setShowAnalysisModal(false);
                setShowErrorDialog('CV upload failed. Please try again.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'CV upload failed. Please try again.';
                setSelectedFile(null);
                setShowAnalysisModal(false);
                setShowErrorDialog(errorMessage);
                return;
            }

            let data;
            try {
                data = await response.json();
            } catch {
                setSelectedFile(null);
                setShowAnalysisModal(false);
                setShowErrorDialog('CV upload failed. Please try again.');
                return;
            }

            if (data.status === 'success') {
                const expertiseAreasData = data.results.expertise_areas || {};
                const allSkills: string[] = [];
                Object.values(expertiseAreasData).forEach((skills: string[] | unknown) => {
                    if (Array.isArray(skills)) {
                        allSkills.push(...skills);
                    }
                });

                setExtractedSkills(allSkills);
                setExpertiseAreas(expertiseAreasData);
                setSuggestedJobs(data.results.suggested_jobs || []);
                setCvFullText(data.results.cv_full_text || '');
                setTotalYearsExperience(data.results.total_years_experience || 0);

                console.log(`✅ CV analyzed: ${allSkills.length} skills, ${(data.results.suggested_jobs || []).length} jobs (70%+ match)`);

                setTimeout(() => {
                    setShowAnalysisModal(false);
                }, 2000);
            } else {
                setSelectedFile(null);
                setShowAnalysisModal(false);
                setShowErrorDialog('CV upload failed. Please try again.');
            }
        } else {
            setShowErrorDialog('Please select a PDF file only.');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        setHasAttemptedSubmit(true);

        if (!hasCVUploaded) {
            if (!validateForm()) return;
        } else {

            if (!selectedFile) {
                setError('Please select a file first.');
                return;
            }
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');
        setShowSubmissionModal(true);

        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                throw new Error('Please log in to submit your CV');
            }

            const submitData = new FormData();
            submitData.append('cv', selectedFile!);

            submitData.append('skip_analysis', 'true');
            submitData.append('already_analyzed', 'true');

            submitData.append('skills', JSON.stringify(extractedSkills));
            submitData.append('expertiseAreas', JSON.stringify(expertiseAreas));
            submitData.append('suggestedJobs', JSON.stringify(suggestedJobs));
            submitData.append('cvFullText', cvFullText);
            submitData.append('totalYearsExperience', totalYearsExperience.toString());

            if (!hasCVUploaded) {
                submitData.append('fullName', formData.fullName);
                submitData.append('email', formData.email);
                submitData.append('phoneNumber', formData.phoneNumber);
                submitData.append('country', 'Sri Lanka');
                submitData.append('city', formData.city);
                submitData.append('workFunction', formData.workFunction);
                submitData.append('ndaAcknowledged', formData.ndaAcknowledged.toString());
            }

            const endpoint = hasCVUploaded
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/update`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/upload`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: submitData,
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                const cvData = data.data;

                if (cvData.skills) {
                    setExtractedSkills(cvData.skills);
                }

                if (cvData.suggested_jobs) {
                    setSuggestedJobs(cvData.suggested_jobs);
                }

                setSuccess('CV updated successfully!');
                await fetchCVInfo();

                setTimeout(() => {
                    setShowSubmissionModal(false);

                    if (pendingJob && pendingJob.jobUrl) {

                        sessionStorage.setItem('cvUploadedForJob', JSON.stringify({
                            jobTitle: pendingJob.jobTitle,
                            jobId: pendingJob.jobId,
                            timestamp: Date.now()
                        }));

                        window.location.replace(pendingJob.jobUrl);
                    } else if (cvData.suggested_jobs && cvData.suggested_jobs.length > 0) {
                        setShowJobsModal(true);
                    } else {
                        setShowNoMatchModal(true);
                    }
                }, 3000);
            } else {
                throw new Error(data.message || 'Failed to update CV');
            }
        } catch {
            console.error('Error updating CV');
            setError('Failed to update CV. Please try again.');
            setShowSubmissionModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadCV = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setError('Please log in to download your CV');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/file`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (!response.ok) {
                setError('Failed to download CV');
                return;
            }

            const blob = await response.blob();

            let extension = '.pdf';
            if (cvInfo && cvInfo.file_type) {
                extension = cvInfo.file_type.toLowerCase().startsWith('.')
                    ? cvInfo.file_type.toLowerCase()
                    : `.${cvInfo.file_type.toLowerCase()}`;
            }

            let filename = 'CV.pdf';
            const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

            if (fullName) {

                const cleanName = fullName.replace(/\s+/g, '_');
                filename = `${cleanName}_CV${extension}`;
            }

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);

        } catch (error) {
            console.error('Error downloading CV:', error);
            setError('Failed to download CV');
        }
    };

    const handlePreviewCV = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setError('Please log in to preview your CV');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/file`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
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
                    setError('Please allow pop-ups to preview your CV');
                }
            } else {
                setError('Failed to preview CV');
            }
        } catch (error) {
            console.error('Error previewing CV:', error);
            setError('Failed to preview CV');
        }
    };

    const isFormValid = useMemo(() => {
        if (hasCVUploaded) {
            return !!selectedFile;
        }
        return !!(
            formData.fullName.trim() &&
            formData.email.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData.phoneNumber.trim() &&
            formData.city &&
            formData.workFunction.trim() &&
            selectedFile &&
            formData.ndaAcknowledged
        );
    }, [formData, selectedFile, hasCVUploaded]);

    const ErrorDialog = ({ message, onClose }: { message: string; onClose: () => void }) => {
        const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }, [onClose]);

        return (
            <div
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm px-4"
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
                    <h3 className="text-xl font-semibold text-[#6c6c6c] font-['Montserrat'] mb-4 text-center">
                        Error
                    </h3>
                    <p className="text-base text-[#6c6c6c] font-['Poppins'] mb-6 text-center">
                        {message}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-['Montserrat'] transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

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

    const AnalysisModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Thanks for uploading your CV!<br />Parsing your CV to match your areas of expertise
                </div>
            </div>
        </ModalWrapper>
    );

    const SubmissionModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    {pendingJob ? (
                        <>Thanks for submitting your updated CV!<br />Processing your submission for {pendingJob.jobTitle}...</>
                    ) : hasCVUploaded ? (
                        <>Thanks for submitting your updated CV!<br />Processing your submission and finding matching roles...</>
                    ) : (
                        <>Thanks for submitting your CV!<br />Adding you to our talent pool and finding matching roles...</>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );

    const JobsModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                resetPage();
            }
        };

        return (
            <ModalWrapper
                onBackdropClick={handleBackdropClick}
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[1117px] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center gradient-icon">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-full h-full" />
                        </div>
                    </div>

                    <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px] mb-6 sm:mb-8 md:mb-10">
                        {hasCVUploaded ? (
                            <>Your CV has been updated successfully!<br />Here are recommended roles based on your updated CV</>
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
                                            onClick={() => {
                                                resetPage();
                                                router.push(`/jobs/view/${job.job_id}`);
                                            }}
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
                        Check all available jobs for you!
                    </div>
                    <div className="flex justify-center mt-4 gap-3">
                        <button
                            className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] gradient-border flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                            onClick={() => {
                                resetPage();
                                router.push('/dashboard');
                            }}
                        >
                            <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">View All Available Jobs</span>
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    const NoMatchModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                resetPage();
            }
        };

        return (
            <ModalWrapper
                onBackdropClick={handleBackdropClick}
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px]"
            >
                <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center gradient-icon">
                                <Icon icon="solar:check-circle-bold-duotone" className="w-full h-full" />
                            </div>
                        </div>

                        <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px]">
                            {hasCVUploaded ? 'Your CV has been updated successfully!' : 'Welcome to our talent pool!'}
                        </div>
                        <div className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                            We couldn&apos;t find matching roles right now, but don&apos;t worry!<br />
                            We&apos;ll contact you when something opens up that fits your profile.
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] mt-4">
                            <button
                                className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                onClick={() => {
                                    resetPage();
                                    router.push('/dashboard');
                                }}
                            >
                                <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Go to Dashboard</span>
                            </button>
                            <button
                                className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                                onClick={() => {
                                    setShowNoMatchModal(false);
                                    setSelectedFile(null);
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

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
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

            <div className="bg-white pb-6 pt-1 flex flex-col gap-6">
                <div className="flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col justify-start items-start gap-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:cloud-upload-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                    Update Personal Details
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                {pendingJob ? (
                                    `Complete your application for ${pendingJob.jobTitle} by uploading your CV. After upload, you'll be redirected to continue the application process.`
                                ) : hasCVUploaded
                                    ? 'Keep your CV up to date so we can better match you with the right freelance projects at Protonest.'
                                    : 'Upload your CV to join our talent pool and get matched with the right freelance projects at Protonest.'
                                }
                            </p>
                        </div>
                        {hasCVUploaded && (
                            <button
                                onClick={async () => {
                                    try {
                                        const jwtToken = localStorage.getItem('jwtToken');
                                        if (!jwtToken) return;
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/file`, {
                                            headers: { 'Authorization': `Bearer ${jwtToken}` }
                                        });
                                        if (res.ok) {
                                            const blob = await res.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const w = window.open(url, '_blank');
                                            if (w) setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                                            else window.URL.revokeObjectURL(url);
                                        }
                                    } catch {}
                                }}
                                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Montserrat'] hover:opacity-90 transition-opacity text-xs sm:text-sm"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                Preview CV
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="pb-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                {hasCVUploaded && !pendingJob && (
                    <div className="bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] p-6 lg:p-12 mb-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-6 text-center lg:text-left">
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">Current CV Status</h3>
                                <div className="space-y-1 text-[#6c6c6c]">
                                    <p className="text-base">
                                        <span className="font-medium">Last Submitted:</span> {lastSubmitted}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center lg:items-stretch w-[160px] sm:w-[200px]">
                                <button
                                    onClick={handlePreviewCV}
                                    disabled={!cvInfo}
                                    className="flex h-[40px] sm:h-[50px] w-full items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white cursor-pointer font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                                >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Preview CV
                                </button>
                                <button
                                    onClick={handleDownloadCV}
                                    disabled={!cvInfo}
                                    className="flex h-[40px] sm:h-[50px] w-full items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-4 rounded-[57px] gradient-border text-[#4d4d4d] font-medium font-['Poppins'] hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                                >
                                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Download CV
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {(!hasCVUploaded || (hasCVUploaded && !pendingJob)) && (
                    <>
                        {!hasCVUploaded && (
                            <div className="space-y-8 mb-8">
                                <div className="grid grid-cols-1 gap-6">
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

                                    <div>
                                        <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                            Phone Number
                                        </label>
                                        <div className="flex items-center">
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

                                    <div>
                                        <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                            District
                                        </label>
                                        <div className="relative" ref={dropdownRefs.city}>
                                            <div className="relative">
                                                <input
                                                    ref={(el) => { if (inputRefs.city) inputRefs.city.current = el; }}
                                                    type="text"
                                                    value={districtSearch}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setDistrictSearch(val);
                                                        setHighlightedIndex(-1);
                                                        if (!dropdownOpen.city) toggleDropdown('city');
                                                        if (sriLankaDistricts.includes(val)) {
                                                            handleInputChange('city', val);
                                                        } else {
                                                            handleInputChange('city', '');
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        if (!dropdownOpen.city) toggleDropdown('city');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const filteredDistricts = sriLankaDistricts.filter(district => district.toLowerCase().includes(districtSearch.toLowerCase()));
                                                        if (e.key === 'ArrowDown') {
                                                            e.preventDefault();
                                                            setHighlightedIndex(prev => (prev < filteredDistricts.length - 1 ? prev + 1 : prev));
                                                        } else if (e.key === 'ArrowUp') {
                                                            e.preventDefault();
                                                            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                                                        } else if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (highlightedIndex >= 0 && highlightedIndex < filteredDistricts.length) {
                                                                const selected = filteredDistricts[highlightedIndex];
                                                                setDistrictSearch(selected);
                                                                handleInputChange('city', selected);
                                                                if (dropdownOpen.city) toggleDropdown('city');
                                                                setHighlightedIndex(-1);
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Type or select district"
                                                    className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left outline-none transition-colors font-['Poppins'] focus:border-[rgba(85,48,250,1)] text-gray-700 text-sm sm:text-base md:text-base lg:text-base pr-8"
                                                />
                                                <ChevronDown className={`absolute right-3 top-3.5 w-4 h-4 transition-transform pointer-events-none text-gray-400 ${dropdownOpen.city ? 'rotate-180' : ''}`} />
                                            </div>
                                            {dropdownOpen.city && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                    {sriLankaDistricts
                                                        .filter(district => district.toLowerCase().includes(districtSearch.toLowerCase()))
                                                        .map((district, index) => (
                                                            <button
                                                                key={district}
                                                                id={`city-item-${index}`}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDistrictSearch(district);
                                                                    handleInputChange('city', district);
                                                                    toggleDropdown('city');
                                                                    setHighlightedIndex(-1);
                                                                    inputRefs.city.current?.focus();
                                                                }}
                                                                className={`w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base ${index === highlightedIndex ? 'bg-gray-100' : ''}`}
                                                            >
                                                                {district}
                                                            </button>
                                                        ))}
                                                    {sriLankaDistricts.filter(district => district.toLowerCase().includes(districtSearch.toLowerCase())).length === 0 && (
                                                        <div className="p-3 text-gray-500 text-sm font-['Poppins']">No districts found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {errors.city && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
                                            What functions do you prefer to work in?
                                        </label>

                                        {formData.workFunction && (
                                            <div className="mb-3 flex flex-wrap gap-2">
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

                                        <div className="relative" ref={dropdownRefs.workFunction}>
                                            <div className="relative">
                                                <input
                                                    ref={(el) => { if (inputRefs.workFunction) inputRefs.workFunction.current = el; }}
                                                    type="text"
                                                    value={workFunctionSearch}
                                                    onChange={(e) => {
                                                        setWorkFunctionSearch(e.target.value);
                                                        setHighlightedIndex(-1);
                                                        if (!dropdownOpen.workFunction) toggleDropdown('workFunction');
                                                    }}
                                                    onFocus={() => {
                                                        if (!dropdownOpen.workFunction) toggleDropdown('workFunction');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const available = workFunctionsList.filter(func => !formData.workFunction.split(',').includes(func));
                                                        const filtered = available.filter(f => f.toLowerCase().includes(workFunctionSearch.toLowerCase()));

                                                        if (e.key === 'ArrowDown') {
                                                            e.preventDefault();
                                                            setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                                        } else if (e.key === 'ArrowUp') {
                                                            e.preventDefault();
                                                            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                                                        } else if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
                                                                const match = filtered[highlightedIndex];
                                                                handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${match}` : match);
                                                                setWorkFunctionSearch('');
                                                                setHighlightedIndex(-1);
                                                                setDropdownOpen(prev => ({ ...prev, workFunction: false }));
                                                            } else if (filtered.length > 0 && workFunctionSearch) {
                                                                const match = filtered[0];
                                                                handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${match}` : match);
                                                                setWorkFunctionSearch('');
                                                                setDropdownOpen(prev => ({ ...prev, workFunction: false }));
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Type to search functions (Enter to select)"
                                                    className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left outline-none transition-colors font-['Poppins'] focus:border-[rgba(85,48,250,1)] text-gray-700 text-sm sm:text-base md:text-base lg:text-base pr-8"
                                                />
                                                <ChevronDown className={`absolute right-3 top-3.5 w-4 h-4 transition-transform pointer-events-none text-gray-400 ${dropdownOpen.workFunction ? 'rotate-180' : ''}`} />
                                            </div>

                                            {dropdownOpen.workFunction && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                    {workFunctionsList
                                                        .filter(func => !formData.workFunction.split(',').includes(func))
                                                        .filter(func => func.toLowerCase().includes(workFunctionSearch.toLowerCase()))
                                                        .map((func, index) => (
                                                            <button
                                                                key={func}
                                                                id={`workFunction-item-${index}`}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${func}` : func);
                                                                    setWorkFunctionSearch('');
                                                                    setHighlightedIndex(-1);
                                                                    setDropdownOpen(prev => ({ ...prev, workFunction: false }));
                                                                    inputRefs.workFunction.current?.focus();
                                                                }}
                                                                className={`w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base ${index === highlightedIndex ? 'bg-gray-100' : ''}`}
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

                                        {errors.workFunction && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.workFunction}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] p-6 lg:p-12">
                            <div className="mb-6">
                                <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">
                                    {hasCVUploaded ? 'Upload a New Version' : 'Upload Your CV'}
                                </h3>
                                <p className="text-base text-[#6c6c6c] leading-[30px]">
                                    {pendingJob ? (
                                        `Upload your CV to complete your application for ${pendingJob.jobTitle}. Your CV should be in PDF format and highlight your relevant skills and experience.`
                                    ) : hasCVUploaded
                                        ? 'Upload your latest resume in PDF format. Include any new skills, experience, or portfolio links that reflect your current expertise.'
                                        : 'Upload your resume in PDF format. Include your skills, experience, and portfolio links that reflect your expertise.'
                                    }
                                </p>
                            </div>

                            <div className="mb-6">
                                <div
                                    className={`relative rounded-[20px] border-2 border-dashed transition-all duration-300 ${isDragging
                                        ? 'border-[#5530fa] bg-[#5530fa]/5'
                                        : selectedFile
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-[#6c6c6c] bg-white'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex flex-col items-center justify-center py-12 px-6">
                                        {selectedFile ? (
                                            <div className="space-y-4 text-center">
                                                <div className="w-16 h-16 gradient-icon rounded-full flex items-center justify-center mx-auto">
                                                    <Icon icon="solar:file-check-bold-duotone" className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <p className="text-[#6c6c6c] font-medium text-base">{selectedFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 text-center">
                                                <Upload className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
                                                <div>
                                                    <p className="text-[#6c6c6c] text-xs sm:text-sm lg:text-base mb-4">
                                                        Click the Upload button to upload your CV.<br />
                                                        You can add an updated CV at any time.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={handleBrowseClick}
                                        className="px-6 py-2 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-medium text-sm sm:text-base font-['Poppins'] transition-all duration-300"
                                    >
                                        Browse
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                            </div>

                            {!hasCVUploaded && (
                                <div className="flex items-start space-x-3 mb-6">
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
                            )}

                            {!hasCVUploaded && !isFormValid && hasAttemptedSubmit && (
                                <div className="bg-white rounded-lg border-2 border-red-200 p-4 flex items-start gap-3 mb-6">
                                    <div className="flex-shrink-0">
                                        <Icon icon="solar:danger-circle-bold" className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-red-600 text-sm font-['Poppins']">
                                            Please complete all required fields before submitting.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-end">
                                {!hasCVUploaded && !pendingJob && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({
                                                fullName: '',
                                                email: '',
                                                phoneNumber: '',
                                                city: '',
                                                workFunction: '',
                                                ndaAcknowledged: false
                                            });
                                            setWorkFunctionSearch('');
                                            setSelectedFile(null);
                                            setExtractedSkills([]);
                                            setErrors({});
                                            setHasAttemptedSubmit(false);
                                        }}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 border-2 gradient-border text-gray-600 rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 text-sm sm:text-base transition-all duration-300 hover:bg-purple-50"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none text-sm sm:text-base transition-all duration-300"
                                >
                                    {isSubmitting ? 'Submitting...' : pendingJob ? `Submit CV and Continue Application` : hasCVUploaded ? 'Submit Updated CV' : 'Submit CV and Join Talent Pool'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showAnalysisModal && <AnalysisModal />}
            {showSubmissionModal && <SubmissionModal />}
            {showJobsModal && <JobsModal />}
            {showNoMatchModal && <NoMatchModal />}
            {showErrorDialog && <ErrorDialog message={showErrorDialog} onClose={() => window.location.reload()} />}
        </DashboardLayout>
    );
};

export default ResubmitCVPage;