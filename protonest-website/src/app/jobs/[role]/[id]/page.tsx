'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Types
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
    created_at: string;
};

type User = {
    id: string;
    email: string;
    name: string;
};

type SuccessPopupProps = {
    type: 'apply' | 'save';
    onClose: () => void;
    onViewSavedJobs?: () => void;
};

// Success Popup Component with visible background
const SuccessPopup: React.FC<SuccessPopupProps> = ({ type, onClose, onViewSavedJobs }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={handleBackgroundClick}
        >
            <div className="w-[359px] h-[365px] relative bg-white/90 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] backdrop-blur-[20px] overflow-hidden">
                <div className="w-[117px] h-[281px] left-[120px] top-[28px] absolute">
                    <div className="w-[120px] h-[138.89px] left-[-2px] top-[29.35px] absolute text-center justify-center text-white text-[120px] font-semibold font-['Montserrat']">
                        {type === 'apply' ? '👍' : '🙌'}
                    </div>
                </div>
                <div className="w-[357px] h-[26px] left-[1px] top-[214px] absolute text-center justify-start text-[#6c6c6c] text-[25px] font-normal font-['Poppins'] leading-[30px]">
                    {type === 'apply' ? 'Applied Successfully!' : 'Job Saved Successfully!'}
                </div>
                {type === 'apply' ? (
                    <div className="w-[285px] h-[26px] left-[37px] top-[270px] absolute text-center justify-start text-[#6c6c6c] text-base font-normal font-['Poppins'] leading-[30px]">
                        Stay tuned for further updates.
                    </div>
                ) : (
                    <div
                        data-property-1="Default"
                        className="w-[295px] h-[51px] px-6 py-4 left-[32px] top-[281px] absolute bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] inline-flex justify-center items-center gap-1 cursor-pointer hover:from-[#f51da5] hover:to-[#5530fa]"
                        onClick={onViewSavedJobs}
                    >
                        <div className="text-center justify-start text-white text-base font-semibold font-['Montserrat']">View Saved Jobs</div>
                    </div>
                )}
            </div>
        </div>
    );
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

// Helper function to format date as "MMM D, YYYY"
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwtToken');
    }
    return null;
};

// Helper function to get user from localStorage
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
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isJobSaved, setIsJobSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState<'apply' | 'save' | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Check user authentication status
    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
    }, []);

    // Memoize the functions with useCallback
    const checkJobSavedStatus = useCallback(async () => {
        if (!user || !job) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/check/${job.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsJobSaved(data.data?.saved || false);
            }
        } catch (error) {
            console.error('Error checking job saved status:', error);
        }
    }, [user, job]);

    const checkApplicationStatus = useCallback(async () => {
        if (!user || !job) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/status/${job.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setHasApplied(data.data?.applied || false);
            }
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    }, [user, job]);

    // Now this useEffect can include the memoized functions in its dependency array
    useEffect(() => {
        if (user && job) {
            checkJobSavedStatus();
            checkApplicationStatus();
        }
    }, [user, job, checkJobSavedStatus, checkApplicationStatus]);

    const handleSaveJob = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        if (!job) return;

        setActionLoading(true);
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
                setShowMenu(false);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Failed to save job. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApplyJob = async () => {
        if (!user) {
            // Store job information for signin flow
            if (job) {
                localStorage.setItem('pendingJobApplication', JSON.stringify({
                    jobId: job.id,
                    jobTitle: job.title,
                    timestamp: Date.now()
                }));
            }
            router.push('/signin'); // Changed from '/signup' to '/signin'
            return;
        }

        if (!job || hasApplied) return;

        setActionLoading(true);
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
                setShowSuccessPopup('apply');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to apply for job');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Failed to apply for job. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewSavedJobs = () => {
        setShowSuccessPopup(null);
        router.push('/saved-jobs'); // Adjust this route as needed
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const jobId = Array.isArray(id) ? id[0] : id;

                // Fetch the specific job
                const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${jobId}`);

                if (!jobResponse.ok) {
                    throw new Error(`Failed to fetch job: ${jobResponse.status}`);
                }

                const jobData = await jobResponse.json();

                if (jobData.status === 'success' && jobData.data) {
                    const jobDetails = jobData.data;

                    // Transform the API response to match our Job type
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
                        created_at: jobDetails.created_at
                    };

                    setJob(transformedJob);

                    // Fetch similar jobs in the same category
                    const similarResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs?category=${encodeURIComponent(jobDetails.category)}&limit=3`);

                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();

                        if (similarData.status === 'success' && similarData.data) {
                            // Filter out the current job and transform the response
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
                    throw new Error('Invalid job response format');
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError(err instanceof Error ? err.message : 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

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
                    <p className="text-red-600 text-lg mb-4">{error || 'Job not found.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                        Try Again
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-white overflow-x-hidden">
            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 lg:py-12">
                {/* Job Title and Menu */}
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-[#6c6c6c] text-[20px] sm:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat">
                        {job.title}
                    </h1>

                    {/* Three dots menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-[#6c6c6c] text-2xl md:p-2"
                        >
                            &#8942;
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-[#6c6c6c] hover:bg-gray-100 font-poppins disabled:opacity-50"
                                    onClick={handleSaveJob}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Loading...' : (isJobSaved ? 'Remove from Saved' : 'Save Job')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category and Posted Date */}
                <div className="items-center gap-8 mb-6">
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-2">
                        <span>Category: </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)]">{job.category}</span>
                    </div>
                    <div className="text-[#6c6c6c] text-xs font-light font-poppins">
                        Posted {job.posted}
                    </div>
                </div>

                {/* Job Details - Job Type, Location, Deadline, Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">✍️</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins capitalize">{job.type.replace('-', ' ')}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Job Type</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">📍</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.location}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Location</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">⏳</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.deadline}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Application Deadline</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">📝</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins capitalize">{job.experience}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Experience Level</div>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                    <p className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                        {job.description}
                    </p>
                </div>

                {/* What You'll Be Doing */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Be Doing</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.responsibilities.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* What We're Looking For */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What We&apos;re Looking For</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.requirements.map((item, index) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Apply Button - Applied state as information display */}
                <div className="mb-6">
                    {hasApplied ? (
                        <div className="bg-green-500 rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat text-center inline-block">
                            Applied
                        </div>
                    ) : (
                        <button
                            onClick={handleApplyJob}
                            disabled={actionLoading}
                            className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] hover:cursor-pointer rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionLoading ? 'Applying...' : (user ? 'Apply' : 'Sign in & Apply')}
                        </button>
                    )}
                </div>

                {!user && (
                    <div className="mb-12">
                        <p className="text-[#6c6c6c] text-base font-normal font-poppins">
                            If you do not already have an account,{' '}
                            <button
                                onClick={() => {
                                    // Store job information for signup flow
                                    if (job) {
                                        localStorage.setItem('pendingJobApplication', JSON.stringify({
                                            jobId: job.id,
                                            jobTitle: job.title,
                                            timestamp: Date.now()
                                        }));
                                    }
                                    router.push('/signup');
                                }}
                                className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] underline cursor-pointer"
                            >
                                Sign up to apply
                            </button>
                        </p>
                    </div>
                )}

                {/* Similar Jobs Section - Only shown if there are similar jobs */}
                {similarJobs.length > 0 && (
                    <div className="pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#6c6c6c] text-2xl font-medium font-montserrat">Explore similar jobs on Protonest</h2>
                            <Link
                                href={`/jobs/${role}`}
                                className="text-[#6c6c6c] text-base font-poppins flex items-center hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:to-[rgba(85,48,250,1)] hover:from-[rgba(245,29,165,1)]"
                            >
                                View more
                                <span className="ml-2 text-xl">&gt;</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {similarJobs.map(similarJob => (
                                <Link
                                    key={similarJob.id}
                                    href={`/jobs/${role}/${similarJob.id}`}
                                    className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between">
                                        <div className="w-3/4">
                                            <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                                                {similarJob.title}
                                            </h3>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                                                {similarJob.location} ‐ Posted {similarJob.posted}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{similarJob.type.replace('-', ' ')}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{similarJob.deadline}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{similarJob.experience}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                                        </div>
                                    </div>

                                    {/* Arrow Image Swap on Hover */}
                                    <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
                                        {/* Default Arrow */}
                                        <div className="w-full h-full group-hover:hidden">
                                            <Image
                                                src="/upleft.svg"
                                                alt="Arrow"
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Hover Arrow */}
                                        <div className="hidden w-full h-full group-hover:block">
                                            <Image
                                                src="/upleft-hover.svg"
                                                alt="Hover Arrow"
                                                width={50}
                                                height={50}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                                        View Details
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <SuccessPopup
                    type={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(null)}
                    onViewSavedJobs={handleViewSavedJobs}
                />
            )}

            <Footer />
        </div>
    );
}