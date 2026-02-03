"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    Edit,
    Eye,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    cover_image: string;
    content: string;
    published: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
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

const BlogManager = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    const fetchBlogPosts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setBlogPosts(result.data || []);
            } else {
                throw new Error(result.message || 'Failed to fetch blog posts');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching blog posts:', err);
            setBlogPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteBlogPost = async (id: string) => {
        setConfirmDialog({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this blog post?',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('adminToken');

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/blogs/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete blog post');
                    }

                    const result = await response.json();

                    if (result.status === 'success') {
                        setBlogPosts(prev => prev.filter(post => post.id !== id));
                        setSuccessDialog({ title: 'Success', message: 'Blog post deleted successfully' });
                    } else {
                        throw new Error(result.message || 'Failed to delete blog post');
                    }
                } catch (err) {
                    setErrorDialog({
                        title: 'Error',
                        message: err instanceof Error ? err.message : 'An error occurred while deleting'
                    });
                    console.error('Error deleting blog post:', err);
                }
            }
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    const filteredBlogPosts = blogPosts.filter(post => {
        if (activeFilter === 'published' && !post.published) return false;
        if (activeFilter === 'draft' && post.published) return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                post.title.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Blog Manager' }
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



            <div className="bg-white pb-2 pt-1 font-montserrat">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon
                                    icon="solar:document-add-bold-duotone"
                                    className="w-7 h-7"
                                />
                            </div>
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                Blog Manager
                            </h1>
                        </div>
                        <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                            Create and manage blog articles that appear on the Protonest site.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex justify-end">
                        <Link href="/admin-dashboard/blog/create">
                            <button className="max-w-[180px] lg:w-auto lg:max-w-none px-4 py-2.5 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-sm font-semibold font-montserrat hover:shadow-lg transition-shadow">
                                + New Blog Post
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[40px] pl-4 pr-12 text-gray-600 focus:outline-none"
                            placeholder="Search by blog title"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="inline-flex justify-start items-center gap-2 mb-2">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'all'
                            ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="text-center text-xs font-semibold font-montserrat">
                            All
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterChange('published')}
                        className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'published'
                            ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="text-center text-[11px] font-medium font-poppins">
                            Published
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterChange('draft')}
                        className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'draft'
                            ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="text-center text-[11px] font-medium font-poppins">
                            Draft
                        </span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                    <p className="text-gray-500">Loading blog posts...</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchBlogPosts}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="hidden md:grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                            <div className="col-span-4">Blog Title</div>
                            <div className="col-span-3">Published On</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-2">Actions</div>
                        </div>
                        <div className="md:hidden text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                            Blog Posts
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredBlogPosts.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                {searchQuery ? 'No blog posts match your search' : 'No blog posts found'}
                            </div>
                        ) : (
                            filteredBlogPosts.map((post) => (
                                <div key={post.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <div className="md:hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-[11px] font-medium font-poppins text-[#676767] mb-1">
                                                    &quot;{post.title}&quot;
                                                </h3>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                    <span>{formatDate(post.published_at)}</span>
                                                    <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {post.published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <Link
                                                    href={`/admin-dashboard/blog/edit/${post.id}`}
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteBlogPost(post.id)}
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-4">
                                            <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                &quot;{post.title}&quot;
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                {formatDate(post.published_at)}
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className={`text-[11px] font-medium font-poppins ${post.published ? 'text-green-600' : 'text-gray-600'}`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <Link
                                                    href={`/admin-dashboard/blog/edit/${post.id}`}
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteBlogPost(post.id)}
                                                    className="p-1 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BlogManager;