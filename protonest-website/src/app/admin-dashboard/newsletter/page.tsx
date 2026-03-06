"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Project {
    id: string;
    title: string;
    cover_image: string;
    short_description: string;
}

interface Research {
    id: string;
    title: string;
    cover_image: string;
    short_description: string;
}

interface BlogPost {
    id: string;
    title: string;
    cover_image: string;
    content: string;
    slug: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    job_type: string;
}

interface NewsletterHistory {
    id: string;
    newsletter_title: string;
    founder_message?: string;
    projects?: Project[];
    research?: Research[];
    blogs?: BlogPost[];
    jobs?: Job[];
    sent_count: number;
    failed_count: number;
    total_count: number;
    sent_at: string;
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

const NewsletterManager = () => {
    const router = useRouter();
    const [newsletterTitle, setNewsletterTitle] = useState('');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImageURL, setCoverImageURL] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [founderMessage, setFounderMessage] = useState('');
    const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
    const [selectedResearch, setSelectedResearch] = useState<Research[]>([]);
    const [selectedBlogs, setSelectedBlogs] = useState<BlogPost[]>([]);
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
    const [draggedProject, setDraggedProject] = useState<Project | null>(null);
    const [draggedResearch, setDraggedResearch] = useState<Research | null>(null);
    const [draggedBlog, setDraggedBlog] = useState<BlogPost | null>(null);
    const [draggedJob, setDraggedJob] = useState<Job | null>(null);

    const [projects, setProjects] = useState<Project[]>([]);
    const [research, setResearch] = useState<Research[]>([]);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [history, setHistory] = useState<NewsletterHistory[]>([]);
    const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        } else {
            fetchAllData();
        }
    }, [router]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const [projectsRes, researchRes, blogsRes, jobsRes, historyRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/projects`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/research`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/newsletter/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const projectsData = await projectsRes.json();
            const researchData = await researchRes.json();
            const blogsData = await blogsRes.json();
            const jobsData = await jobsRes.json();
            const historyData = await historyRes.json();

            if (projectsData.status === 'success') setProjects(projectsData.data || []);
            if (researchData.status === 'success') setResearch(researchData.data || []);
            if (blogsData.status === 'success') setBlogs((blogsData.data || []).filter((b: BlogPost) => b.slug));
            if (jobsData.status === 'success') setJobs(jobsData.data || []);
            if (historyData.status === 'success') setHistory(historyData.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleProject = (project: Project) => {
        const isSelected = selectedProjects.some(p => p.id === project.id);
        if (isSelected) {
            setSelectedProjects(selectedProjects.filter(p => p.id !== project.id));
        } else {
            setSelectedProjects([...selectedProjects, project]);
        }
    };

    const handleToggleResearch = (item: Research) => {
        const isSelected = selectedResearch.some(r => r.id === item.id);
        if (isSelected) {
            setSelectedResearch(selectedResearch.filter(r => r.id !== item.id));
        } else {
            setSelectedResearch([...selectedResearch, item]);
        }
    };

    const handleToggleBlog = (blog: BlogPost) => {
        const isSelected = selectedBlogs.some(b => b.id === blog.id);
        if (isSelected) {
            setSelectedBlogs(selectedBlogs.filter(b => b.id !== blog.id));
        } else {
            setSelectedBlogs([...selectedBlogs, blog]);
        }
    };

    const handleToggleJob = (job: Job) => {
        const isSelected = selectedJobs.some(j => j.id === job.id);
        if (isSelected) {
            setSelectedJobs(selectedJobs.filter(j => j.id !== job.id));
        } else {
            setSelectedJobs([...selectedJobs, job]);
        }
    };

    const handleProjectDragStart = (project: Project) => setDraggedProject(project);
    const handleProjectDragOver = (e: React.DragEvent, target: Project) => {
        e.preventDefault();
        if (!draggedProject || draggedProject.id === target.id) return;
        const draggedIndex = selectedProjects.findIndex(p => p.id === draggedProject.id);
        const targetIndex = selectedProjects.findIndex(p => p.id === target.id);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const newItems = [...selectedProjects];
        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedProject);
        setSelectedProjects(newItems);
    };
    const handleProjectDragEnd = () => setDraggedProject(null);
    const moveProject = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedProjects.length) return;
        const newItems = [...selectedProjects];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setSelectedProjects(newItems);
    };

    const handleResearchDragStart = (item: Research) => setDraggedResearch(item);
    const handleResearchDragOver = (e: React.DragEvent, target: Research) => {
        e.preventDefault();
        if (!draggedResearch || draggedResearch.id === target.id) return;
        const draggedIndex = selectedResearch.findIndex(r => r.id === draggedResearch.id);
        const targetIndex = selectedResearch.findIndex(r => r.id === target.id);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const newItems = [...selectedResearch];
        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedResearch);
        setSelectedResearch(newItems);
    };
    const handleResearchDragEnd = () => setDraggedResearch(null);
    const moveResearch = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedResearch.length) return;
        const newItems = [...selectedResearch];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setSelectedResearch(newItems);
    };

    const handleBlogDragStart = (blog: BlogPost) => setDraggedBlog(blog);
    const handleBlogDragOver = (e: React.DragEvent, target: BlogPost) => {
        e.preventDefault();
        if (!draggedBlog || draggedBlog.id === target.id) return;
        const draggedIndex = selectedBlogs.findIndex(b => b.id === draggedBlog.id);
        const targetIndex = selectedBlogs.findIndex(b => b.id === target.id);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const newItems = [...selectedBlogs];
        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedBlog);
        setSelectedBlogs(newItems);
    };
    const handleBlogDragEnd = () => setDraggedBlog(null);
    const moveBlog = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedBlogs.length) return;
        const newItems = [...selectedBlogs];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setSelectedBlogs(newItems);
    };

    const handleJobDragStart = (job: Job) => setDraggedJob(job);
    const handleJobDragOver = (e: React.DragEvent, target: Job) => {
        e.preventDefault();
        if (!draggedJob || draggedJob.id === target.id) return;
        const draggedIndex = selectedJobs.findIndex(j => j.id === draggedJob.id);
        const targetIndex = selectedJobs.findIndex(j => j.id === target.id);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const newItems = [...selectedJobs];
        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedJob);
        setSelectedJobs(newItems);
    };
    const handleJobDragEnd = () => setDraggedJob(null);
    const moveJob = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedJobs.length) return;
        const newItems = [...selectedJobs];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setSelectedJobs(newItems);
    };

    const handleCoverImageUpload = async (file: File) => {
        setUploadingImage(true);
        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/newsletter/upload-cover`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.status === 'success') {
                setCoverImageURL(data.data.url);
            } else {
                alert(`Failed to upload image: ${data.message}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSendNewsletter = async () => {
        if (!newsletterTitle.trim()) {
            alert('Please enter a newsletter title');
            return;
        }

        if (!founderMessage.trim()) {
            alert('Please enter a founder\'s message');
            return;
        }

        setConfirmDialog({
            title: 'Send Newsletter',
            message: 'Are you sure you want to send this newsletter to all subscribers?',
            onConfirm: async () => {
                setConfirmDialog(null);

                setSuccessDialog({
                    title: 'Newsletter Sending Started',
                    message: 'Your newsletter is being sent to all subscribers. This may take a few minutes.'
                });

                try {
                    const token = localStorage.getItem('adminToken');
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/newsletter/send`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            newsletter_title: newsletterTitle,
                            cover_image_url: coverImageURL,
                            founder_message: founderMessage,
                            project_ids: selectedProjects.map(p => p.id),
                            research_ids: selectedResearch.map(r => r.id),
                            blog_ids: selectedBlogs.map(b => b.id),
                            job_ids: selectedJobs.map(j => j.id)
                        })
                    }).then(response => response.json())
                        .then(data => {
                            console.log('Newsletter send result:', data);
                        })
                        .catch(error => {
                            console.error('Error sending newsletter:', error);
                        });
                } catch (error) {
                    console.error('Error initiating newsletter send:', error);
                }
            }
        });
    };

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Newsletter Manager' }
            ]}
        >
            <style jsx global>{`
                .gradient-icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon svg path {
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

            <div className="bg-white pb-2 pt-1 font-montserrat">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon icon="solar:letter-bold-duotone" className="w-7 h-7" />
                            </div>
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                Newsletter Manager
                            </h1>
                        </div>
                        <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                            Compose and send monthly newsletters to subscribers with curated content.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                        <p className="text-gray-500">Loading content...</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-4">Newsletter Details</h2>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Newsletter Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newsletterTitle}
                                        onChange={(e) => setNewsletterTitle(e.target.value)}
                                        placeholder="e.g., JANUARY 26TH EDITION"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setCoverImageFile(file);
                                                    handleCoverImageUpload(file);
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                        {uploadingImage && (
                                            <span className="text-sm text-gray-500">Uploading...</span>
                                        )}
                                    </div>
                                    {coverImageURL && (
                                        <div className="mt-4">
                                            <img src={coverImageURL} alt="Cover preview" className="w-full max-w-md rounded-lg border" />
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        Upload a custom cover image or leave empty to use default
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-4">Founder&apos;s Message *</h2>
                                <textarea
                                    value={founderMessage}
                                    onChange={(e) => setFounderMessage(e.target.value)}
                                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Enter your message to subscribers..."
                                />
                                <p className="text-xs text-gray-500 mt-2">{founderMessage.length} characters</p>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Monthly Updates - Projects</h2>
                                <p className="text-sm text-gray-600 mb-4">Select and order projects to feature in the newsletter. Drag or use arrows to reorder.</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Projects</h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {projects.filter(p => !selectedProjects.some(sp => sp.id === p.id)).length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center">
                                                    {projects.length === 0 ? 'No projects available' : 'All projects selected'}
                                                </p>
                                            ) : (
                                                projects.filter(p => !selectedProjects.some(sp => sp.id === p.id)).map(project => (
                                                    <div
                                                        key={project.id}
                                                        onClick={() => handleToggleProject(project)}
                                                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                                    >
                                                        <img src={project.cover_image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{project.title}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{project.short_description}</p>
                                                        </div>
                                                        <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Selected Projects ({selectedProjects.length})
                                            {selectedProjects.length > 0 && <span className="text-gray-500 font-normal ml-2">- Ordered by priority</span>}
                                        </h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {selectedProjects.length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                                                    Select projects from the left to add here
                                                </p>
                                            ) : (
                                                selectedProjects.map((project, index) => (
                                                    <div
                                                        key={project.id}
                                                        draggable
                                                        onDragStart={() => handleProjectDragStart(project)}
                                                        onDragOver={(e) => handleProjectDragOver(e, project)}
                                                        onDragEnd={handleProjectDragEnd}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-purple-500 bg-purple-50 transition-all ${draggedProject?.id === project.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveProject(index, 'up')}
                                                                disabled={index === 0}
                                                                className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-up-linear" className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveProject(index, 'down')}
                                                                disabled={index === selectedProjects.length - 1}
                                                                className={`p-1 rounded ${index === selectedProjects.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                                                            <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
                                                        </div>
                                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full">
                                                            {index + 1}
                                                        </span>
                                                        <img src={project.cover_image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{project.title}</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleProject(project)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                                        >
                                                            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Monthly Updates - Research</h2>
                                <p className="text-sm text-gray-600 mb-4">Select and order research items to feature in the newsletter. Drag or use arrows to reorder.</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Research</h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {research.filter(r => !selectedResearch.some(sr => sr.id === r.id)).length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center">
                                                    {research.length === 0 ? 'No research available' : 'All research selected'}
                                                </p>
                                            ) : (
                                                research.filter(r => !selectedResearch.some(sr => sr.id === r.id)).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleToggleResearch(item)}
                                                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                                    >
                                                        <img src={item.cover_image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{item.title}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{item.short_description}</p>
                                                        </div>
                                                        <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Selected Research ({selectedResearch.length})
                                            {selectedResearch.length > 0 && <span className="text-gray-500 font-normal ml-2">- Ordered by priority</span>}
                                        </h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {selectedResearch.length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                                                    Select research from the left to add here
                                                </p>
                                            ) : (
                                                selectedResearch.map((item, index) => (
                                                    <div
                                                        key={item.id}
                                                        draggable
                                                        onDragStart={() => handleResearchDragStart(item)}
                                                        onDragOver={(e) => handleResearchDragOver(e, item)}
                                                        onDragEnd={handleResearchDragEnd}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-purple-500 bg-purple-50 transition-all ${draggedResearch?.id === item.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveResearch(index, 'up')}
                                                                disabled={index === 0}
                                                                className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-up-linear" className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveResearch(index, 'down')}
                                                                disabled={index === selectedResearch.length - 1}
                                                                className={`p-1 rounded ${index === selectedResearch.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                                                            <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
                                                        </div>
                                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full">
                                                            {index + 1}
                                                        </span>
                                                        <img src={item.cover_image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{item.title}</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleResearch(item)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                                        >
                                                            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Featured Blog Posts</h2>
                                <p className="text-sm text-gray-600 mb-4">Select and order blog posts to feature in the newsletter. Drag or use arrows to reorder.</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Blogs</h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {blogs.filter(b => !selectedBlogs.some(sb => sb.id === b.id)).length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center">
                                                    {blogs.length === 0 ? 'No blog posts available' : 'All blogs selected'}
                                                </p>
                                            ) : (
                                                blogs.filter(b => !selectedBlogs.some(sb => sb.id === b.id)).map(blog => (
                                                    <div
                                                        key={blog.id}
                                                        onClick={() => handleToggleBlog(blog)}
                                                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                                    >
                                                        <img src={blog.cover_image} alt={blog.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{blog.title}</h4>
                                                        </div>
                                                        <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Selected Blogs ({selectedBlogs.length})
                                            {selectedBlogs.length > 0 && <span className="text-gray-500 font-normal ml-2">- Ordered by priority</span>}
                                        </h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {selectedBlogs.length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                                                    Select blogs from the left to add here
                                                </p>
                                            ) : (
                                                selectedBlogs.map((blog, index) => (
                                                    <div
                                                        key={blog.id}
                                                        draggable
                                                        onDragStart={() => handleBlogDragStart(blog)}
                                                        onDragOver={(e) => handleBlogDragOver(e, blog)}
                                                        onDragEnd={handleBlogDragEnd}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-purple-500 bg-purple-50 transition-all ${draggedBlog?.id === blog.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveBlog(index, 'up')}
                                                                disabled={index === 0}
                                                                className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-up-linear" className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveBlog(index, 'down')}
                                                                disabled={index === selectedBlogs.length - 1}
                                                                className={`p-1 rounded ${index === selectedBlogs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                                                            <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
                                                        </div>
                                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full">
                                                            {index + 1}
                                                        </span>
                                                        <img src={blog.cover_image} alt={blog.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{blog.title}</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleBlog(blog)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                                        >
                                                            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Latest Careers</h2>
                                <p className="text-sm text-gray-600 mb-4">Select and order job openings to feature in the newsletter. Drag or use arrows to reorder.</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Jobs</h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {jobs.filter(j => !selectedJobs.some(sj => sj.id === j.id)).length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center">
                                                    {jobs.length === 0 ? 'No job openings available' : 'All jobs selected'}
                                                </p>
                                            ) : (
                                                jobs.filter(j => !selectedJobs.some(sj => sj.id === j.id)).map(job => (
                                                    <div
                                                        key={job.id}
                                                        onClick={() => handleToggleJob(job)}
                                                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{job.title}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{job.location} • {job.job_type}</p>
                                                        </div>
                                                        <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Selected Jobs ({selectedJobs.length})
                                            {selectedJobs.length > 0 && <span className="text-gray-500 font-normal ml-2">- Ordered by priority</span>}
                                        </h3>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                            {selectedJobs.length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                                                    Select jobs from the left to add here
                                                </p>
                                            ) : (
                                                selectedJobs.map((job, index) => (
                                                    <div
                                                        key={job.id}
                                                        draggable
                                                        onDragStart={() => handleJobDragStart(job)}
                                                        onDragOver={(e) => handleJobDragOver(e, job)}
                                                        onDragEnd={handleJobDragEnd}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-purple-500 bg-purple-50 transition-all ${draggedJob?.id === job.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveJob(index, 'up')}
                                                                disabled={index === 0}
                                                                className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-up-linear" className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveJob(index, 'down')}
                                                                disabled={index === selectedJobs.length - 1}
                                                                className={`p-1 rounded ${index === selectedJobs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-100'}`}
                                                            >
                                                                <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                                                            <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
                                                        </div>
                                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full">
                                                            {index + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">{job.title}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{job.location} • {job.job_type}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleJob(job)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                                        >
                                                            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSendNewsletter}
                                className="px-6 py-3 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow"
                            >
                                Send Newsletter
                            </button>
                        </div>

                        {/* History Table */}
                        <div className="mt-12 bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                            <h2 className="text-lg font-semibold text-[#6c6c6c] mb-4">Newsletter Send History</h2>

                            {history.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4 text-center">No history documented yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                                        <thead className="lowercase tracking-wider border-b-2">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 font-semibold w-12"></th>
                                                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                                                <th scope="col" className="px-6 py-4 font-semibold text-center">Successful Sends</th>
                                                <th scope="col" className="px-6 py-4 font-semibold text-center">Failed Sends</th>
                                                <th scope="col" className="px-6 py-4 font-semibold">Sent At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((record) => (
                                                <React.Fragment key={record.id}>
                                                    <tr className="border-b hover:bg-neutral-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => setExpandedHistoryId(expandedHistoryId === record.id ? null : record.id)}
                                                                className="text-gray-500 hover:text-purple-600 transition-colors"
                                                            >
                                                                <Icon
                                                                    icon={expandedHistoryId === record.id ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                                                                    className="w-5 h-5"
                                                                />
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-800">{record.newsletter_title}</td>
                                                        <td className="px-6 py-4 text-center text-green-600">{record.sent_count} / {record.total_count}</td>
                                                        <td className="px-6 py-4 text-center text-red-500">{record.failed_count}</td>
                                                        <td className="px-6 py-4 text-gray-500">{new Date(record.sent_at).toLocaleString()}</td>
                                                    </tr>
                                                    {expandedHistoryId === record.id && (
                                                        <tr className="bg-neutral-50 border-b">
                                                            <td colSpan={5} className="p-6 h-auto">
                                                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm whitespace-normal space-y-6">
                                                                    {record.founder_message && (
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold mb-2 font-montserrat tracking-wide uppercase text-purple-600">Founder&apos;s Message</h4>
                                                                            <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-purple-200 pl-4">{record.founder_message}</p>
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                                                                        {record.projects && record.projects.length > 0 && (
                                                                            <div>
                                                                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Icon icon="solar:folder-with-files-bold" className="text-blue-500" /> Projects featured</h4>
                                                                                <ul className="space-y-2">
                                                                                    {record.projects.map((p, i) => (
                                                                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                                                            <span className="text-gray-400 mt-0.5">•</span>
                                                                                            <span>{p.title}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                        {record.research && record.research.length > 0 && (
                                                                            <div>
                                                                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Icon icon="solar:test-tube-bold" className="text-green-500" /> Research featured</h4>
                                                                                <ul className="space-y-2">
                                                                                    {record.research.map((r, i) => (
                                                                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                                                            <span className="text-gray-400 mt-0.5">•</span>
                                                                                            <span>{r.title}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                        {record.blogs && record.blogs.length > 0 && (
                                                                            <div>
                                                                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Icon icon="solar:document-text-bold" className="text-orange-500" /> Blogs featured</h4>
                                                                                <ul className="space-y-2">
                                                                                    {record.blogs.map((b, i) => (
                                                                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                                                            <span className="text-gray-400 mt-0.5">•</span>
                                                                                            <span>{b.title}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                        {record.jobs && record.jobs.length > 0 && (
                                                                            <div>
                                                                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Icon icon="solar:briefcase-bold" className="text-pink-500" /> Jobs featured</h4>
                                                                                <ul className="space-y-2">
                                                                                    {record.jobs.map((j, i) => (
                                                                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                                                            <span className="text-gray-400 mt-0.5">•</span>
                                                                                            <span>{j.title} <span className="text-xs text-gray-400 ml-1">({j.location})</span></span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {confirmDialog && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{confirmDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDialog(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDialog.onConfirm}
                                className="px-4 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:shadow-lg transition-shadow"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {successDialog && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-green-600 mb-2">{successDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{successDialog.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setSuccessDialog(null);
                                    window.location.reload();
                                }}
                                className="px-4 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:shadow-lg transition-shadow"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default NewsletterManager;
