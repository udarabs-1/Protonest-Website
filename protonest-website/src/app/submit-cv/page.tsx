'use client';

import { ChevronDown, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

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

export default function OnboardingPage() {
    const router = useRouter();

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
    const [uploadedCV, setUploadedCV] = useState<File | null>(null);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea>({});
    const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(countryCodes[0]);
    const [workFunctionSearch, setWorkFunctionSearch] = useState('');
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showJobsModal, setShowJobsModal] = useState(false);
    const [showNoMatchModal, setShowNoMatchModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRefs = useMemo(() => ({
        countryCode: { current: null as HTMLDivElement | null },
        country: { current: null as HTMLDivElement | null },
        city: { current: null as HTMLDivElement | null },
    }), []);

    const countries: string[] = ['Sri Lanka', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'India'];
    const workFunctions: string[] = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Product Management'];

    const filteredWorkFunctions = workFunctions.filter(func =>
        func.toLowerCase().includes(workFunctionSearch.toLowerCase()) &&
        !formData.workFunction.split(',').includes(func)
    );

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
        if (!uploadedCV) newErrors.cv = 'CV upload is required';
        if (!formData.ndaAcknowledged) newErrors.nda = 'NDA acknowledgment is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
        if (field === 'workFunction') {
            // Remove any duplicate functions when adding new ones
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

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Reset city when country changes
        if (field === 'country') {
            setFormData(prev => ({ ...prev, city: '' }));
        }
    };

    const analyzeCV = async (file: File): Promise<void> => {
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
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
    };

    const removeSkill = (skillToRemove: string): void => {
        setExtractedSkills(prev => prev.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (): Promise<void> => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setShowSubmissionModal(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('country', formData.country);
            submitData.append('city', formData.city);
            submitData.append('workFunction', formData.workFunction);
            submitData.append('ndaAcknowledged', formData.ndaAcknowledged.toString());
            submitData.append('skills', JSON.stringify(extractedSkills));
            submitData.append('expertiseAreas', JSON.stringify(expertiseAreas));
            submitData.append('suggestedJobs', JSON.stringify(suggestedJobs));

            if (uploadedCV) {
                submitData.append('cv', uploadedCV);
            }

            // Get JWT token from where you store it (localStorage, context, etc.)
            const token = localStorage.getItem('jwtToken'); // or from your auth context
            // Alternative: const token = await getAuthToken(); // if you have a function to get it

            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/uploadcv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type for FormData - browser will set it automatically with boundary
                },
                body: submitData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('CV upload successful:', responseData);

                // Simulate processing time
                setTimeout(() => {
                    setShowSubmissionModal(false);
                    if (suggestedJobs.length > 0) {
                        setShowJobsModal(true);
                    } else {
                        setShowNoMatchModal(true);
                    }
                }, 3000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to submit application. Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Submission error:', error);
            setErrors({
                submit: error instanceof Error
                    ? error.message
                    : 'Failed to submit application. Please try again.'
            });
            setShowSubmissionModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = (): void => {
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            country: '',
            city: '',
            workFunction: '',
            ndaAcknowledged: false
        });
        setUploadedCV(null);
        setExtractedSkills([]);
        setExpertiseAreas({});
        setSuggestedJobs([]);
        setErrors({});
        setSelectedCountryCode(countryCodes[0]);
        setWorkFunctionSearch('');
    };

    const toggleDropdown = (field: string): void => {
        setDropdownOpen(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Analysis Modal Component
    const AnalysisModal = () => (
        <div className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4">
            <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[833px] h-[250px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[365px] bg-white/5 rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">
                <div className="flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                        <div className="w-full h-full rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-r-blue-500 animate-spin bg-gradient-to-r from-pink-500 to-blue-500 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, #F51DA5, #5530FA, #F51DA5)',
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)',
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)'
                        }}></div>
                    </div>
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Thanks for submitting your CV!<br />Parsing your CV to match your areas of expertise
                </div>
            </div>
        </div>
    );

    // Submission Modal Component
    const SubmissionModal = () => (
        <div className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4">
            <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[833px] h-[250px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[365px] bg-white/5 rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">
                <div className="flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                        <div className="w-full h-full rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-r-blue-500 animate-spin bg-gradient-to-r from-pink-500 to-blue-500 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, #F51DA5, #5530FA, #F51DA5)',
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)',
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)'
                        }}></div>
                    </div>
                </div>
                <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                    Thanks for submitting your CV to our Talent Pool!<br />Parsing your CV to match you with available roles…
                </div>
            </div>
        </div>
    );

    // Jobs Modal Component
    const JobsModal = () => {
        const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                setShowJobsModal(false);
            }
        };

        return (
            <div
                className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4"
                onClick={handleBackdropClick}
            >
                <div className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[1117px] max-h-[90vh] bg-white/5 rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
                    <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px] mb-6 sm:mb-8 md:mb-10">
                        Based on your CV, we recommend the following roles
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
                                        <button className="w-full h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95">
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
                    <div className="flex justify-center mt-4">
                        <button
                            className="w-full max-w-[264px] h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 rounded-[57px] border border-[#5530fa] flex justify-center items-center cursor-pointer transition-all duration-200 hover:bg-[#5530fa]/10 active:scale-95"
                            onClick={() => router.push('/dashboard')}
                        >
                            <span className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">View All Suggested Jobs</span>
                        </button>
                    </div>
                </div>
            </div>
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
            <div
                className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4"
                onClick={handleBackdropClick}
            >
                <div className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[833px] bg-white/5 rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        <div className="text-center text-[#6c6c6c] text-lg sm:text-xl md:text-[25px] font-normal font-poppins leading-[30px]">
                            We couldn&apos;t find a perfect match just yet.
                        </div>
                        <div className="text-center text-[#6c6c6c] text-base sm:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] px-2">
                            Don&apos;t worry! Your CV is now part of our talent pool.<br />
                            We&apos;ll contact you when something opens up that fits your profile.
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] mt-4">
                            <button
                                className="flex-1 h-[45px] sm:h-[48px] md:h-[51px] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                                onClick={() => router.push('/')}
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
            </div>
        );
    };

    return (
        <div>
            <Navbar />

            {/* Updated Header Section */}
            <div className="h-[400px] lg:h-[500px] xl:h-[439px] relative">
                {/* Background Image - Mobile */}
                <div className="absolute inset-0 -z-10 block sm:hidden">
                    <Image
                        src="/jobs-1-mobile.svg"
                        alt="Careers background mobile"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Background Image - Desktop */}
                <div className="absolute inset-0 -z-10 hidden sm:block">
                    <Image
                        src="/jobs-1.svg"
                        alt="Careers background"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10" />

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10" />

                {/* Hero Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-0">
                    <div className="text-center max-w-4xl xl:max-w-[1120px]">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                            <span className="text-[#6c6c6c]">Submit Your CV and</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Join Our Talent Network</span>
                        </h1>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px] max-w-2xl xl:max-w-[1120px] mx-auto">
                            Tell us a little about yourself.<br />
                            We&apos;ll match your skills with any opportunities at Protonest according to your preferences
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-screen relative overflow-hidden">
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
                                        {/* Country Code Dropdown */}
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
                                                <span className="text-gray-700 text-sm sm:text-base md:text-base lg:text-base">{selectedCountryCode.dialCode}</span>
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
                                                            className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
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
                                            className="flex-1 p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-base"
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.phoneNumber}</p>}
                                </div>
                            </div>

                            {/* Location - Country and City side by side on large screens */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Country Dropdown */}
                                <div>
                                    <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
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
                                            <span className={formData.country ? 'text-gray-700 text-sm sm:text-base md:text-base lg:text-base' : 'text-gray-400 text-sm sm:text-base md:text-base lg:text-base'}>
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
                                                        className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
                                                    >
                                                        {country}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.country && <p className="text-red-500 text-sm mt-1 font-['Poppins']">{errors.country}</p>}
                                </div>

                                {/* City Dropdown */}
                                <div>
                                    <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
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
                                            <span className={formData.city ? 'text-gray-700 text-sm sm:text-base md:text-base lg:text-base' : 'text-gray-400 text-sm sm:text-base md:text-base lg:text-base'}>
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
                                                        className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
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

                            {/* Work Function - Typeable with autocomplete */}
                            <div>
                                <label className="block text-gray-600 text-base sm:text-lg md:text-lg lg:text-lg font-semibold mb-2 font-['Poppins']">
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
                                        className="w-full p-3 border-b-2 border-gray-300 bg-transparent focus:border-[rgba(85,48,250,1)] outline-none transition-colors font-['Poppins'] placeholder:font-['Poppins'] placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-base"
                                    />

                                    {/* Autocomplete suggestions */}
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
                                                    className="w-full p-3 text-left hover:bg-gray-100 font-['Poppins'] text-sm md:text-base lg:text-base"
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
                                            className="px-6 py-2 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-medium text-sm sm:text-base font-['Poppins']"
                                        >
                                            Browse
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
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

                        {/* Error Summary */}
                        {(Object.keys(errors).length > 0 || errors.submit) && (
                            <div className="text-red-500 text-sm font-['Poppins']">
                                {errors.submit || 'Please complete all required fields before submitting.'}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 sm:max-w-md px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] text-white rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none text-sm sm:text-base"
                            >
                                Sign Up and Add to Talent Pool
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className="flex-1 sm:max-w-xs px-6 py-3 lg:px-8 lg:py-4 border-2 gradient-border text-gray-600 rounded-full font-semibold hover:cursor-pointer font-['Montserrat'] disabled:opacity-50 text-sm sm:text-base"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAnalysisModal && <AnalysisModal />}
            {showSubmissionModal && <SubmissionModal />}
            {showJobsModal && <JobsModal />}
            {showNoMatchModal && <NoMatchModal />}

            <Footer />
        </div>
    );
}