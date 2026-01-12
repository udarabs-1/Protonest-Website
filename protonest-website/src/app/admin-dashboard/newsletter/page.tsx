"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [selectedResearch, setSelectedResearch] = useState<string[]>([]);
    const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

    const [projects, setProjects] = useState<Project[]>([]);
    const [research, setResearch] = useState<Research[]>([]);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const [projectsRes, researchRes, blogsRes, jobsRes] = await Promise.all([
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
                })
            ]);

            const projectsData = await projectsRes.json();
            const researchData = await researchRes.json();
            const blogsData = await blogsRes.json();
            const jobsData = await jobsRes.json();

            if (projectsData.status === 'success') setProjects(projectsData.data || []);
            if (researchData.status === 'success') setResearch(researchData.data || []);
            if (blogsData.status === 'success') setBlogs((blogsData.data || []).filter((b: BlogPost) => b.slug));
            if (jobsData.status === 'success') setJobs(jobsData.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleItem = (type: 'project' | 'research' | 'blog' | 'job', id: string) => {
        const getState = () => {
            switch (type) {
                case 'project': return selectedProjects;
                case 'research': return selectedResearch;
                case 'blog': return selectedBlogs;
                case 'job': return selectedJobs;
            }
        };

        const setState = (items: string[]) => {
            switch (type) {
                case 'project': setSelectedProjects(items); break;
                case 'research': setSelectedResearch(items); break;
                case 'blog': setSelectedBlogs(items); break;
                case 'job': setSelectedJobs(items); break;
            }
        };

        const current = getState();
        if (current.includes(id)) {
            setState(current.filter(item => item !== id));
        } else {
            if (current.length >= 3) return;
            setState([...current, id]);
        }
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

                // Show immediate success message
                setSuccessDialog({
                    title: 'Newsletter Sending Started',
                    message: 'Your newsletter is being sent to all subscribers. This may take a few minutes.'
                });

                // Send newsletter in background
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
                            project_ids: selectedProjects,
                            research_ids: selectedResearch,
                            blog_ids: selectedBlogs,
                            job_ids: selectedJobs
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
                                <p className="text-sm text-gray-600 mb-4">Select up to 3 projects to feature (Selected: {selectedProjects.length}/3)</p>

                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                    {projects.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-4 text-center">No projects available</p>
                                    ) : (
                                        projects.map(project => (
                                            <label
                                                key={project.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedProjects.includes(project.id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    } ${selectedProjects.length >= 3 && !selectedProjects.includes(project.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProjects.includes(project.id)}
                                                    onChange={() => handleToggleItem('project', project.id)}
                                                    disabled={selectedProjects.length >= 3 && !selectedProjects.includes(project.id)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                />
                                                <img src={project.cover_image} alt={project.title} className="w-16 h-16 object-cover rounded" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-800">{project.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{project.short_description}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Monthly Updates - Research</h2>
                                <p className="text-sm text-gray-600 mb-4">Select up to 3 research items to feature (Selected: {selectedResearch.length}/3)</p>

                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                    {research.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-4 text-center">No research available</p>
                                    ) : (
                                        research.map(item => (
                                            <label
                                                key={item.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedResearch.includes(item.id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    } ${selectedResearch.length >= 3 && !selectedResearch.includes(item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedResearch.includes(item.id)}
                                                    onChange={() => handleToggleItem('research', item.id)}
                                                    disabled={selectedResearch.length >= 3 && !selectedResearch.includes(item.id)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                />
                                                <img src={item.cover_image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{item.short_description}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Featured Blog Posts</h2>
                                <p className="text-sm text-gray-600 mb-4">Select up to 3 blog posts to feature (Selected: {selectedBlogs.length}/3)</p>

                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                    {blogs.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-4 text-center">No blog posts available</p>
                                    ) : (
                                        blogs.map(blog => (
                                            <label
                                                key={blog.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedBlogs.includes(blog.id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    } ${selectedBlogs.length >= 3 && !selectedBlogs.includes(blog.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBlogs.includes(blog.id)}
                                                    onChange={() => handleToggleItem('blog', blog.id)}
                                                    disabled={selectedBlogs.length >= 3 && !selectedBlogs.includes(blog.id)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                />
                                                <img src={blog.cover_image} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-800">{blog.title}</h4>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-6">
                                <h2 className="text-lg font-semibold text-[#6c6c6c] mb-2">Latest Careers</h2>
                                <p className="text-sm text-gray-600 mb-4">Select up to 3 job openings to feature (Selected: {selectedJobs.length}/3)</p>

                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                    {jobs.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-4 text-center">No job openings available</p>
                                    ) : (
                                        jobs.map(job => (
                                            <label
                                                key={job.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedJobs.includes(job.id)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    } ${selectedJobs.length >= 3 && !selectedJobs.includes(job.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedJobs.includes(job.id)}
                                                    onChange={() => handleToggleItem('job', job.id)}
                                                    disabled={selectedJobs.length >= 3 && !selectedJobs.includes(job.id)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-800">{job.title}</h4>
                                                    <p className="text-xs text-gray-500">{job.location} • {job.job_type}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
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
