"use client";

import {
    ArrowLeft,
    ChevronRight,
    LogOut,
    Menu,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type JobData = {
    id?: string;
    title?: string;
    category?: string;
    publication_status?: 'draft' | 'published' | 'scheduled';
    assignment_status?: 'open' | 'closed' | 'hired';
    description?: string;
    responsibilities?: string[];
    requirements?: string[];
    required_skills?: string[];
    location?: string;
    type?: string;
    experience?: string;
    deadline?: string;
    schedule_at?: string | null;
};

const JobEditor = () => {
    const { id: jobId } = useParams() as { id: string };
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        responsibilities: '',
        requirements: '',
        required_skills: '',
        location: 'Remote',
        type: 'full-time',
        experience: 'intermediate',
        deadline: '',
        schedule_at: '',
        publish_now: false
    });

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin-signin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/pipeline' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Fetch job data using the public API endpoint
    useEffect(() => {
        const fetchJobData = async () => {
            if (!jobId) {
                setError('No job ID provided');
                setIsLoadingData(false);
                return;
            }

            setIsLoadingData(true);
            try {
                console.log('Fetching job data for ID:', jobId);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${jobId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Job not found');
                    } else {
                        setError('Failed to load job data');
                    }
                    setIsLoadingData(false);
                    return;
                }

                const data = await response.json();
                console.log('API response data:', data);

                if (data.status === 'success' && data.data) {
                    setJobData(data.data);
                } else {
                    setError('Invalid job data received');
                }
            } catch (error) {
                console.error('Error fetching job data:', error);
                setError('Failed to load job data. Please try again.');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchJobData();
    }, [jobId]);

    // Initialize form with fetched job data
    useEffect(() => {
        if (jobData) {
            setFormData({
                title: jobData.title || '',
                category: jobData.category || '',
                description: jobData.description || '',
                responsibilities: jobData.responsibilities ? jobData.responsibilities.join('\n') : '',
                requirements: jobData.requirements ? jobData.requirements.join('\n') : '',
                required_skills: jobData.required_skills ? jobData.required_skills.join('\n') : '',
                location: jobData.location || 'Remote',
                type: jobData.type || 'full-time',
                experience: jobData.experience || 'intermediate',
                deadline: jobData.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : '',
                schedule_at: jobData.schedule_at ? new Date(jobData.schedule_at).toISOString().slice(0, 16) : '',
                publish_now: jobData.publication_status === 'published' || jobData.publication_status === 'scheduled'
            });
        }
    }, [jobData]);

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

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const adminToken = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                router.push('/admin-signin');
                return;
            }

            // Validate required fields
            if (!formData.location.trim()) {
                setError('Location is required');
                return;
            }

            // Prepare the data for API
            const apiData = {
                title: formData.title.trim(),
                category: formData.category.trim(),
                location: formData.location.trim(),
                type: formData.type,
                deadline: new Date(formData.deadline).toISOString(),
                experience: formData.experience,
                description: formData.description.trim(),
                responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
                requirements: formData.requirements.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
                required_skills: formData.required_skills.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
                schedule_at: formData.schedule_at ? new Date(formData.schedule_at).toISOString() : null,
                publish_now: formData.publish_now
            };

            console.log('Sending API data:', apiData);

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(apiData),
            });

            const data = await response.json();
            console.log('API response:', data);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin-signin');
                    return;
                }
                throw new Error(data.message || 'Failed to update job');
            }

            if (data.status === 'success') {
                router.push('/admin-dashboard/jobs');
            } else {
                throw new Error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error instanceof Error ? error.message : 'Failed to update job. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const jobCategories = [
        'Front-End',
        'Back-End',
        'Electronics',
        'UI/UX Designing',
        'Mechanical',
        'Embedded Firmware',
        'Quality Assurance',
        'Other Roles'
    ];

    // Show loading state while fetching job data
    if (isLoadingData) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-poppins min-h-screen bg-white relative">
            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Header */}
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

                        {/* Header Actions - Only Settings Button */}
                        <div className="flex items-center">
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
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
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href="/admin-dashboard/jobs" className="hover:text-gray-700">Job Postings</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Edit Job</span>
                            </nav>
                        </div>

                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => router.back()}
                                className="p-2 rounded-full hover:bg-gray-100 mr-2"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                Edit Job Posting {jobData?.title && `- ${jobData.title}`}
                            </h1>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {jobCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Job Type *</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="temporary">Temporary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Experience Level *</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="junior">Junior</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="senior">Senior</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Location *</label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="Remote">Remote</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Application Deadline *</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Schedule Publish (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        name="schedule_at"
                                        value={formData.schedule_at}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="publish_now"
                                        checked={formData.publish_now}
                                        onChange={handleInputChange}
                                        className="mr-2 h-4 w-4 text-[#5530FA] focus:ring-[#5530FA] border-gray-300 rounded"
                                        disabled={isLoading}
                                    />
                                    <label className="text-sm font-medium text-[#4e4e4e]">Publish Immediately</label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Job Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    disabled={isLoading}
                                    required
                                    placeholder="Detailed description of the role"
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Responsibilities *</label>
                                <textarea
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="List the key responsibilities for this role (one per line)"
                                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    disabled={isLoading}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Requirements *</label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="List the requirements for this role (one per line)"
                                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    disabled={isLoading}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Required Skills *</label>
                                <textarea
                                    name="required_skills"
                                    value={formData.required_skills}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="List the required skills for this role (one per line)"
                                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    disabled={isLoading}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin-dashboard/jobs')}
                                    className="px-6 py-2 rounded-[57px] border border-gray-300 text-[#676767] hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update Job'}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default JobEditor;