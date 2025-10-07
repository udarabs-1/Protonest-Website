"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronDown,
    ChevronRight,
    Download,
    Eye,
    FileText,
    LogOut,
    Menu,
    Settings,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    country: string;
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

interface CountryCode {
    code: string;
    dialCode: string;
    flag: string;
    name: string;
}

// Static data
const cities: { [key: string]: string[] } = {
    'Sri Lanka': ['Colombo', 'Negombo', 'Kandy', 'Galle', 'Jaffna'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Singapore': ['Singapore'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
};

const countryCodes: CountryCode[] = [
    { code: 'LK', dialCode: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
    { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
];

const countries = ['Sri Lanka', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'India'];

const workFunctions = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Product Management'];

const ResubmitCVPage = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cvInfo, setCvInfo] = useState<CVInfo | null>(null);
    const [lastSubmitted, setLastSubmitted] = useState<string>('');
    const [currentFileName, setCurrentFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [hasCVUploaded, setHasCVUploaded] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showJobsModal, setShowJobsModal] = useState(false);
    const [showNoMatchModal, setShowNoMatchModal] = useState(false);

    // Form data states
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        workFunction: '',
        ndaAcknowledged: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
    const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(countryCodes[0]);
    const [workFunctionSearch, setWorkFunctionSearch] = useState('');

    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const countryCodeRef = useRef<HTMLDivElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const cityRef = useRef<HTMLDivElement>(null);
    const dropdownRefs = useMemo(() => ({
        countryCode: countryCodeRef,
        country: countryRef,
        city: cityRef,
    }), [countryCodeRef, countryRef, cityRef]);
    const pathname = usePathname();

    const resetPage = () => {
        setShowJobsModal(false);
        setShowNoMatchModal(false);
        setSelectedFile(null);
        setExtractedSkills([]);
        setSuggestedJobs([]);
        setError('');
        setSuccess('');
    };

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

    useEffect(() => {
        fetchCVInfo();
        populateUserData();
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
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    };

    const fetchCVInfo = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setError('Please log in to access this feature');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/info`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: CVInfoResponse = await response.json();
                if (data.status === 'success' && data.data) {
                    setCvInfo(data.data);
                    setLastSubmitted(new Date(data.data.uploaded_at).toLocaleDateString());
                    setCurrentFileName(data.data.original_name);
                    setHasCVUploaded(true);
                }
            } else if (response.status === 404) {
                setCvInfo(null);
                setLastSubmitted('Never');
                setCurrentFileName('No file uploaded');
                setHasCVUploaded(false);
            } else {
                throw new Error('Failed to fetch CV info');
            }
        } catch (error) {
            console.error('Error fetching CV info:', error);
            setHasCVUploaded(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }

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
    }, [sidebarOpen, dropdownOpen, dropdownRefs]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.workFunction.trim()) newErrors.workFunction = 'At least one work function is required';
        if (!selectedFile) newErrors.cv = 'CV upload is required';
        if (!formData.ndaAcknowledged) newErrors.nda = 'NDA acknowledgment is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
        if (field === 'workFunction') {
            const functionsArray = (value as string).split(',').filter(Boolean);
            const uniqueFunctions = [...new Set(functionsArray)].join(',');
            setFormData(prev => ({
                ...prev,
                [field]: uniqueFunctions
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        if (field === 'country') {
            setFormData(prev => ({ ...prev, city: '' }));
        }
    };

    const toggleDropdown = (field: string): void => {
        setDropdownOpen(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const filteredWorkFunctions = workFunctions.filter(func =>
        func.toLowerCase().includes(workFunctionSearch.toLowerCase()) &&
        !formData.workFunction.split(',').includes(func)
    );

    const handleFileSelect = async (file: File) => {
        if (file.type === 'application/pdf') {
            setSelectedFile(file);
            setError('');
            setErrors(prev => ({ ...prev, cv: '' }));

            setShowAnalysisModal(true);

            try {
                const jwtToken = localStorage.getItem('jwtToken');
                if (!jwtToken) {
                    throw new Error('Please log in to analyze your CV');
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/analyze`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Analysis failed with status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    const expertiseAreasData = data.results.expertise_areas || {};
                    const allSkills: string[] = [];
                    Object.values(expertiseAreasData).forEach((skills: string[] | unknown) => {
                        if (Array.isArray(skills)) {
                            allSkills.push(...skills);
                        }
                    });

                    setExtractedSkills(allSkills);
                    setSuggestedJobs(data.results.suggested_jobs || []);
                }
            } catch (error) {
                console.error('CV analysis error:', error);
                setError('Failed to analyze CV. You can still submit it.');
            } finally {
                setTimeout(() => {
                    setShowAnalysisModal(false);
                }, 2000);
            }
        } else {
            setError('Please select a PDF file only.');
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
        // If user hasn't uploaded CV before, validate full form
        if (!hasCVUploaded) {
            if (!validateForm()) return;
        } else {
            // If resubmitting, only require file
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

            // Add form data only if it's first time upload
            if (!hasCVUploaded) {
                submitData.append('fullName', formData.fullName);
                submitData.append('email', formData.email);
                submitData.append('phoneNumber', formData.phoneNumber);
                submitData.append('country', formData.country);
                submitData.append('city', formData.city);
                submitData.append('workFunction', formData.workFunction);
                submitData.append('ndaAcknowledged', formData.ndaAcknowledged.toString());
                submitData.append('skills', JSON.stringify(extractedSkills));
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

                    if (cvData.suggested_jobs && cvData.suggested_jobs.length > 0) {
                        setShowJobsModal(true);
                    } else {
                        setShowNoMatchModal(true);
                    }
                }, 3000);
            } else {
                throw new Error(data.message || 'Failed to update CV');
            }
        } catch (error) {
            console.error('Error updating CV:', error);
            setError(error instanceof Error ? error.message : 'Failed to update CV. Please try again.');
            setShowSubmissionModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreviewCV = () => {
        if (cvInfo?.file_url) {
            window.open(cvInfo.file_url, '_blank');
        } else {
            setError('No CV available for preview');
        }
    };

    const handleDownloadCV = () => {
        if (cvInfo?.file_url) {
            const link = document.createElement('a');
            link.href = cvInfo.file_url;
            link.download = cvInfo.original_name || 'cv.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setExtractedSkills(prev => prev.filter(skill => skill !== skillToRemove));
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

    // Analysis Modal Component
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

    // Submission Modal Component
    const SubmissionModal = () => (
        <ModalWrapper>
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 h-full">
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    {hasCVUploaded ? (
                        <>Thanks for submitting your updated CV!<br />Processing your submission and finding matching roles…</>
                    ) : (
                        <>Thanks for submitting your CV!<br />Adding you to our talent pool and finding matching roles…</>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );

    // Jobs Modal Component
    const JobsModal = () => {
        return (
            <ModalWrapper
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[1117px] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-4 sm:p-6 md:p-8">
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

                    <div className="flex justify-center mt-6 sm:mt-8">
                        <button
                            className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                            onClick={resetPage}
                        >
                            <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Close</span>
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    // No Match Modal Component
    const NoMatchModal = () => {
        return (
            <ModalWrapper
                className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px]"
            >
                <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px]">
                            {hasCVUploaded ? 'Your CV has been updated successfully!' : 'Welcome to our talent pool!'}
                        </div>
                        <div className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                            We couldn&apos;t find matching roles right now, but don&apos;t worry!<br />
                            We&apos;ll contact you when something opens up that fits your profile.
                        </div>

                        <div className="flex justify-center w-full max-w-[500px] mt-4">
                            <button
                                className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                onClick={resetPage}
                            >
                                <span className="text-center text-white text-sm sm:text-base font-semibold font-montserrat">Close</span>
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    return (
        <div>
            <div className="font-poppins min-h-screen bg-white relative">
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

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
                                <Link href="/dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>
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

                        <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
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
                                    <span className="text-[#5C4EC9]">{hasCVUploaded ? 'Resubmit CV' : 'Upload CV'}</span>
                                </nav>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[25px]">📨</span>
                                    <h2 className="text-2xl font-medium text-gray-700">
                                        {hasCVUploaded ? 'Resubmit Your CV' : 'Upload Your CV'}
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {hasCVUploaded
                                        ? 'Keep your CV up to date so we can better match you with the right freelance projects at Protonest.'
                                        : 'Upload your CV to join our talent pool and get matched with the right freelance projects at Protonest.'
                                    }
                                </p>
                            </div>

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

                            {hasCVUploaded && (
                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">Current CV Status</h3>
                                            <div className="space-y-1 text-[#6c6c6c]">
                                                <p className="text-base">
                                                    <span className="font-medium">Last Submitted:</span> {lastSubmitted}
                                                </p>
                                                <p className="text-base">
                                                    <span className="font-medium">Current File:</span> {currentFileName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 justify-center max-w-[300px]">
                                            <button
                                                onClick={handlePreviewCV}
                                                disabled={!cvInfo}
                                                className="flex h-[50px] items-center justify-center gap-2 px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Preview CV
                                            </button>
                                            <button
                                                onClick={handleDownloadCV}
                                                disabled={!cvInfo}
                                                className="flex h-[50px] items-center justify-center gap-2 px-6 py-4 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] font-medium font-['Poppins'] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download CV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!hasCVUploaded && (
                                <div className="space-y-8 mb-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="Your Full Name"
                                                className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400"
                                            />
                                            {errors.fullName && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.fullName}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder="you@company.com"
                                                    className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400"
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                    Phone Number
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="relative mr-2 flex-shrink-0" ref={dropdownRefs.countryCode}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDropdown('countryCode');
                                                            }}
                                                            className="flex items-center p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins']"
                                                        >
                                                            <span className="mr-1">{selectedCountryCode.flag}</span>
                                                            <span className="text-gray-700">{selectedCountryCode.dialCode}</span>
                                                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen.countryCode ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        {dropdownOpen.countryCode && (
                                                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto w-48">
                                                                {countryCodes.map((country) => (
                                                                    <button
                                                                        key={country.code}
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedCountryCode(country);
                                                                            toggleDropdown('countryCode');
                                                                        }}
                                                                        className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins']"
                                                                    >
                                                                        <span className="mr-2">{country.flag}</span>
                                                                        <span className="text-gray-700">{country.name}</span>
                                                                        <span className="ml-auto text-gray-500">{country.dialCode}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="tel"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                        placeholder="For faster communication"
                                                        className="flex-1 p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400"
                                                    />
                                                </div>
                                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.phoneNumber}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                    Country
                                                </label>
                                                <div className="relative" ref={dropdownRefs.country}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown('country');
                                                        }}
                                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left flex justify-between items-center focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins']"
                                                    >
                                                        <span className={formData.country ? 'text-gray-700' : 'text-gray-400'}>
                                                            {formData.country || 'Select country'}
                                                        </span>
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.country ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {dropdownOpen.country && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                            {countries.map(country => (
                                                                <button
                                                                    key={country}
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleInputChange('country', country);
                                                                        toggleDropdown('country');
                                                                    }}
                                                                    className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins']"
                                                                >
                                                                    {country}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.country && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.country}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                    City
                                                </label>
                                                <div className="relative" ref={dropdownRefs.city}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (formData.country) toggleDropdown('city');
                                                        }}
                                                        disabled={!formData.country}
                                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent text-left flex justify-between items-center focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] disabled:opacity-50"
                                                    >
                                                        <span className={formData.city ? 'text-gray-700' : 'text-gray-400'}>
                                                            {formData.city || 'Select city'}
                                                        </span>
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.city ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {!formData.country && <p className="text-red-500 text-sm mt-1 font-['Poppins']">Select the country first</p>}
                                                    {dropdownOpen.city && formData.country && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                            {cities[formData.country]?.map(city => (
                                                                <button
                                                                    key={city}
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleInputChange('city', city);
                                                                        toggleDropdown('city');
                                                                    }}
                                                                    className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins']"
                                                                >
                                                                    {city}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.city && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.city}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-2 font-['Poppins']">
                                                What functions do you prefer to work in?
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={workFunctionSearch}
                                                    onChange={(e) => setWorkFunctionSearch(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && workFunctionSearch.trim() && !formData.workFunction.includes(workFunctionSearch.trim())) {
                                                            e.preventDefault();
                                                            handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${workFunctionSearch.trim()}` : workFunctionSearch.trim());
                                                            setWorkFunctionSearch('');
                                                        }
                                                    }}
                                                    placeholder="Type and press Enter to add functions"
                                                    className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400"
                                                />

                                                {workFunctionSearch && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                        {filteredWorkFunctions.map(func => (
                                                            <button
                                                                key={func}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleInputChange('workFunction', formData.workFunction ? `${formData.workFunction},${func}` : func);
                                                                    setWorkFunctionSearch('');
                                                                }}
                                                                className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins']"
                                                            >
                                                                {func}
                                                            </button>
                                                        ))}
                                                        {filteredWorkFunctions.length === 0 && (
                                                            <div className="p-3 text-gray-500 text-sm text-center font-['Poppins']">
                                                                No matching functions found
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {formData.workFunction && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {formData.workFunction.split(',').filter(Boolean).map((func, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 border-[#5530fa] text-gray-600 font-medium text-sm font-['Poppins']"
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
                                </div>
                            )}

                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12">
                                <div className="mb-6">
                                    <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">
                                        {hasCVUploaded ? 'Upload a New Version' : 'Upload Your CV'}
                                    </h3>
                                    <p className="text-base text-[#6c6c6c] leading-[30px]">
                                        {hasCVUploaded
                                            ? 'Upload your latest resume in PDF format. Include any new skills, experience, or portfolio links that reflect your current expertise.'
                                            : 'Upload your resume in PDF format. Include your skills, experience, and portfolio links that reflect your expertise.'
                                        }
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <div
                                        className={`relative rounded-[35px] border-2 border-dashed transition-all duration-300 ${isDragging
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
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                        <FileText className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#6c6c6c] font-medium">{selectedFile.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 text-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#6c6c6c] text-base">
                                                            Upload the file by drag and drop here or
                                                            <br />
                                                            click on the browse button.
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2">Supported format: .pdf</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={handleBrowseClick}
                                            className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow"
                                        >
                                            Browse Files
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

                                {extractedSkills.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-[#6c6c6c] mb-3">
                                            Extracted Skills from Your CV
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {extractedSkills.map((skill, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 border-[#5530fa] text-gray-600 font-medium text-sm font-['Poppins']"
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
                                            <label className="block text-gray-600 text-base sm:text-lg font-semibold mb-1 font-['Poppins']">
                                                NDA Acknowledgment
                                            </label>
                                            <p className="text-gray-500 text-xs sm:text-sm font-['Poppins'] leading-relaxed">
                                                In the case that I am selected for a role, I understand that I must sign a Non-disclosure agreement before detailed project discussions.
                                            </p>
                                            {errors.nda && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.nda}</p>}
                                        </div>
                                    </div>
                                )}

                                {(Object.keys(errors).length > 0 || errors.submit) && (
                                    <div className="text-red-500 text-sm font-['Poppins'] mb-6">
                                        {errors.submit || 'Please complete all required fields before submitting.'}
                                    </div>
                                )}

                                <div className="flex justify-center lg:justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedFile || isSubmitting}
                                        className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : hasCVUploaded ? 'Submit Updated CV' : 'Submit CV'}
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {showAnalysisModal && <AnalysisModal />}
            {showSubmissionModal && <SubmissionModal />}
            {showJobsModal && <JobsModal />}
            {showNoMatchModal && <NoMatchModal />}

            <Footer />
        </div>
    );
};

export default ResubmitCVPage;