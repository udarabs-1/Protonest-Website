"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    ArrowLeft,
    Plus,
    Trash2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    selection_criteria?: {
        prompt?: string;
        questions?: Array<{ question: string; weight: number; type: 'technical' | 'experience' | 'soft_skills' }>;
        min_years_experience?: number;
        preferred_years_experience?: number;
    };
};

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

const JobEditor = () => {
    const { id: jobId } = useParams() as { id: string };
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string; onOk?: () => void } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
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
        publish_later: false,
        selection_criteria: {
            prompt: '',
            questions: [{ question: '', weight: 5, type: 'technical' as 'technical' | 'experience' | 'soft_skills' }],
            min_years_experience: 0,
            preferred_years_experience: 3
        }
    });

    const breadcrumbItems = [
        { label: 'Admin Portal', href: '/admin-dashboard' },
        { label: 'Job Postings', href: '/admin-dashboard/jobs' },
        { label: 'Edit Job' },
    ];

    useEffect(() => {
        const fetchJobData = async () => {
            if (!jobId) {
                setError('No job ID provided');
                setIsLoadingData(false);
                return;
            }

            setIsLoadingData(true);
            try {
                const adminToken = localStorage.getItem('adminToken');
                if (!adminToken) {
                    router.push('/admin-signin');
                    return;
                }

                console.log('Fetching job data for ID:', jobId);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/jobs/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Job not found');
                    } else if (response.status === 401) {
                        localStorage.removeItem('adminToken');
                        router.push('/admin-signin');
                        return;
                    } else {
                        setError('Failed to load job data');
                    }
                    setIsLoadingData(false);
                    return;
                }

                const data = await response.json();
                console.log('API response data:', data);

                if (data.status === 'success' && data.data) {
                    const job = data.data.job || data.data;
                    setJobData(job);
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

    useEffect(() => {
        if (jobData) {
            const selectionCriteria = jobData.selection_criteria || {
                prompt: '',
                questions: [{ question: '', weight: 5, type: 'technical' as const }],
                min_years_experience: 0,
                preferred_years_experience: 3
            };

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
                publish_later: jobData.publication_status === 'scheduled',
                selection_criteria: {
                    prompt: selectionCriteria.prompt || '',
                    questions: selectionCriteria.questions && selectionCriteria.questions.length > 0
                        ? selectionCriteria.questions
                        : [{ question: '', weight: 5, type: 'technical' as const }],
                    min_years_experience: selectionCriteria.min_years_experience || 0,
                    preferred_years_experience: selectionCriteria.preferred_years_experience || 3
                }
            });
        }
    }, [jobData]);

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

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

    const handleCriteriaChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            selection_criteria: {
                ...prev.selection_criteria,
                [field]: value
            }
        }));
    };

    const handleQuestionChange = (index: number, field: string, value: string | number) => {
        const newQuestions = [...formData.selection_criteria.questions];
        newQuestions[index] = {
            ...newQuestions[index],
            [field]: value
        } as typeof newQuestions[0];

        setFormData(prev => ({
            ...prev,
            selection_criteria: {
                ...prev.selection_criteria,
                questions: newQuestions
            }
        }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            selection_criteria: {
                ...prev.selection_criteria,
                questions: [
                    ...prev.selection_criteria.questions,
                    { question: '', weight: 5, type: 'technical' as const }
                ]
            }
        }));
    };

    const removeQuestion = (index: number) => {
        if (formData.selection_criteria.questions.length <= 1) {
            return;
        }

        const newQuestions = formData.selection_criteria.questions.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            selection_criteria: {
                ...prev.selection_criteria,
                questions: newQuestions
            }
        }));
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const prepareApiData = () => {

        const validQuestions = formData.selection_criteria.questions.filter(q => q.question.trim() !== '');

        return {
            title: formData.title.trim(),
            category: formData.category.trim(),
            location: formData.location.trim(),
            type: formData.type,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            experience: formData.experience,
            description: formData.description.trim(),
            responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
            requirements: formData.requirements.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
            required_skills: formData.required_skills.split('\n').filter(line => line.trim() !== '').map(line => line.trim()),
            schedule_at: (formData.publish_later && formData.schedule_at) ? new Date(formData.schedule_at).toISOString() : null,
            publish_now: !formData.publish_later,
            selection_criteria: {
                prompt: formData.selection_criteria.prompt.trim(),
                questions: validQuestions,
                min_years_experience: formData.selection_criteria.min_years_experience,
                preferred_years_experience: formData.selection_criteria.preferred_years_experience
            }
        };
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Job title is required');
            return false;
        }

        if (!formData.category.trim()) {
            setError('Category is required');
            return false;
        }

        if (!formData.location.trim()) {
            setError('Location is required');
            return false;
        }

        if (!formData.deadline) {
            setError('Application deadline is required');
            return false;
        }

        if (!formData.description.trim()) {
            setError('Job description is required');
            return false;
        }

        if (!formData.responsibilities.trim()) {
            setError('Responsibilities are required');
            return false;
        }

        if (!formData.requirements.trim()) {
            setError('Requirements are required');
            return false;
        }

        if (!formData.required_skills.trim()) {
            setError('Required skills are required');
            return false;
        }

        if (formData.publish_later) {
            if (!formData.schedule_at) {
                setError('Please select a publish date and time or uncheck "Publish Later"');
                return false;
            }

            const scheduleTime = new Date(formData.schedule_at);
            const now = new Date();

            if (scheduleTime <= now) {
                setError('Scheduled publish time must be in the future');
                return false;
            }
        }

        if (formData.selection_criteria.min_years_experience < 0) {
            setError('Minimum years of experience cannot be negative');
            return false;
        }

        if (formData.selection_criteria.preferred_years_experience < formData.selection_criteria.min_years_experience) {
            setError('Preferred years of experience must be greater than or equal to minimum years');
            return false;
        }

        return true;
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

            if (!validateForm()) {
                setIsLoading(false);
                return;
            }

            const apiData = prepareApiData();

            console.log('Updating job with data:', apiData);

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
                const message = formData.publish_later
                    ? 'Job scheduled for publishing successfully!'
                    : 'Job updated successfully!';
                setSuccessDialog({
                    title: 'Success',
                    message: message,
                    onOk: () => router.push('/admin-dashboard/jobs')
                });
            } else {
                throw new Error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorDialog({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to update job. Please try again.'
            });
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

    if (isLoadingData) {
        return (
            <AdminLayout breadcrumbItems={breadcrumbItems}>
                <div className="font-poppins flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading job data...</p>
                    </div>
                </div>
            </AdminLayout>
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

                {successDialog && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            if (successDialog.onOk) successDialog.onOk();
                            setSuccessDialog(null);
                        }}
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                        <div
                            className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-green-600 mb-4">{successDialog.title}</h3>
                            <p className="text-gray-600 mb-6">{successDialog.message}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        if (successDialog.onOk) successDialog.onOk();
                                        setSuccessDialog(null);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {errorDialog && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setErrorDialog(null)}
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
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
                )}

                <main>


                    <div className="sticky top-0 z-40 bg-white pb-6 flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full hover:bg-gray-100 mr-2"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon
                                    icon="solar:document-bold-duotone"
                                    className="w-7 h-7"
                                />
                            </div>
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                Edit Job Posting {jobData?.title && `- ${jobData.title}`}
                            </h1>
                        </div>
                    </div>

                    {
                        error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )
                    }

                    <form onSubmit={handleSubmit} className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#4e4e4e] mb-4 pb-2 border-b border-gray-200">
                                Basic Information
                            </h2>

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
                                        <option value="project-based">Project Based</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="internship">Internship</option>
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
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="experienced">Experienced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4e4e4e] mb-2">Location *</label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[5530FA]"
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
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>


                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start mb-3">
                                    <input
                                        type="checkbox"
                                        name="publish_later"
                                        checked={formData.publish_later}
                                        onChange={handleInputChange}
                                        className="mr-3 h-4 w-4 text-[#5530FA] focus:ring-[#5530FA] border-gray-300 rounded mt-0.5"
                                        disabled={isLoading}
                                    />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-[#4e4e4e] cursor-pointer">
                                            Schedule for Later
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select a date and time to automatically publish this job
                                        </p>
                                    </div>
                                </div>

                                {formData.publish_later && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-[#4e4e4e] mb-2">
                                            Publish Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="schedule_at"
                                            value={formData.schedule_at}
                                            onChange={handleInputChange}
                                            min={getMinDateTime()}
                                            className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                            disabled={isLoading}
                                            required={formData.publish_later}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            📅 The job will be automatically published at the scheduled time
                                        </p>
                                    </div>
                                )}
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
                        </div>


                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#4e4e4e] mb-2 pb-2 border-b border-gray-200">
                                Selection Criteria for AI Ranking
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">
                                These criteria will be used to automatically rank and analyze candidates using AI when you click the &quot;Analyze&quot; button.
                            </p>


                            <div className="mb-6">
                                <h3 className="text-base font-medium text-[#4e4e4e] mb-3">Experience Requirements</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#4e4e4e] mb-2">
                                            Minimum Years of Experience *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={formData.selection_criteria.min_years_experience}
                                            onChange={(e) => handleCriteriaChange('min_years_experience', parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                            disabled={isLoading}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Candidates below this will receive lower scores</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#4e4e4e] mb-2">
                                            Preferred Years of Experience *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={formData.selection_criteria.preferred_years_experience}
                                            onChange={(e) => handleCriteriaChange('preferred_years_experience', parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                            disabled={isLoading}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Candidates at or above this will receive perfect experience scores</p>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#4e4e4e] mb-2">
                                    Ideal Candidate Description (AI Prompt)
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Describe the ideal candidate in detail. AI will use this to evaluate and rank applicants based on how well they match this description.
                                </p>
                                <textarea
                                    value={formData.selection_criteria.prompt}
                                    onChange={(e) => handleCriteriaChange('prompt', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    disabled={isLoading}
                                    placeholder="Example: We're looking for a senior full-stack developer with strong expertise in React and Node.js. The ideal candidate should have experience building scalable microservices, excellent problem-solving abilities, and strong communication skills for mentoring junior developers. They should be comfortable working in an agile environment and have experience with cloud platforms like AWS or Azure."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Tip: Be specific about technical skills, soft skills, and team dynamics you value
                                </p>
                            </div>


                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-[#4e4e4e]">
                                            Specific Evaluation Criteria (Optional)
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Add specific yes/no or measurable criteria that AI will evaluate for each candidate
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {formData.selection_criteria.questions.map((question, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#4e4e4e] mb-1">
                                                            Question / Criteria
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={question.question}
                                                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] text-sm"
                                                            placeholder="E.g., Has experience with CI/CD pipelines and DevOps practices?"
                                                            disabled={isLoading}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#4e4e4e] mb-1">
                                                                Type
                                                            </label>
                                                            <select
                                                                value={question.type}
                                                                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                                                className="w-full px-3 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] text-sm"
                                                                disabled={isLoading}
                                                            >
                                                                <option value="technical">Technical Skill</option>
                                                                <option value="experience">Experience</option>
                                                                <option value="soft_skills">Soft Skills</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#4e4e4e] mb-1">
                                                                Importance (1-10)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="10"
                                                                value={question.weight}
                                                                onChange={(e) => handleQuestionChange(index, 'weight', parseInt(e.target.value) || 5)}
                                                                className="w-full px-3 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] text-sm"
                                                                disabled={isLoading}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {formData.selection_criteria.questions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(index)}
                                                        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        disabled={isLoading}
                                                        title="Remove question"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>


                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-gray-500">Priority:</span>
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#5530FA] to-[#F51DA5]"
                                                        style={{ width: `${(question.weight / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">{question.weight}/10</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="mt-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-[#5530FA] hover:bg-[#5530FA]/5 hover:border-[#5530FA] transition-colors flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Another Evaluation Criterion
                                </button>

                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>How it works:</strong> When you click &quot;Analyze&quot; on the job posting, AI will:
                                    </p>
                                    <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                                        <li>Evaluate each candidate&apos;s CV against your ideal candidate description</li>
                                        <li>Score candidates on each specific criterion you&apos;ve defined</li>
                                        <li>Calculate experience match based on years requirement</li>
                                        <li>Rank all candidates with an overall score (0-100%)</li>
                                        <li>Provide detailed reasoning for each evaluation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push('/admin-dashboard/jobs')}
                                className="px-6 py-2 rounded-[57px] border border-gray-300 text-[#676767] hover:bg-gray-50 transition-colors disabled:opacity-50 order-3 sm:order-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="cursor-pointer px-6 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {formData.publish_later ? 'Scheduling...' : 'Updating...'}
                                    </>
                                ) : (
                                    <>
                                        {formData.publish_later ? '📅 Schedule Update' : 'Update Job'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </AdminLayout>
    );
};

export default JobEditor;