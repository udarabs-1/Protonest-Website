"use client";

import { Icon } from '@iconify/react';
import {
    ChevronRight,
    Edit,
    Eye,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    Trash2,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    cover_image: string;
    content: string;
    author: string;
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const sidebarItems = [
        { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: 'solar:user-bold-duotone', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: 'solar:document-bold-duotone', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: 'mingcute:refresh-3-line', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: 'solar:pen-new-square-bold-duotone', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: 'solar:bell-bold-duotone', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: 'solar:document-add-bold-duotone', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: 'solar:magnifer-bold-duotone', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: 'solar:users-group-two-rounded-bold-duotone', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: 'solar:dialog-2-bold-duotone', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: 'solar:settings-bold-duotone', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

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
                post.title.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="font-poppins min-h-screen bg-white relative">
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

            {showLogoutDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowLogoutDialog(false)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
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

            {/* Success Dialog */}
            {successDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSuccessDialog(null)}
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
                                onClick={() => setSuccessDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Dialog */}
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

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setConfirmDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{confirmDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDialog(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDialog.onConfirm}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="w-[100px] lg:w-[130px] relative">
                                <Image
                                    src="/logo.webp"
                                    alt="Protonest Logo"
                                    width={130}
                                    height={80}
                                    className="object-contain"
                                />
                            </Link>
                        </div>

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
                    <div
                        ref={sidebarRef}
                        className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="flex justify-between items-center p-4">
                            <Link href="/" className="w-[100px] relative">
                                <Image
                                    src="/logo.webp"
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
                                        <div className={`w-5 h-5 mr-4 flex items-center justify-center ${pathname !== item.path ? 'gradient-icon' : ''}`}>
                                            <Icon
                                                icon={item.icon}
                                                className={`w-5 h-5 ${pathname === item.path ? 'text-white' : ''}`}
                                            />
                                        </div>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="pt-8">
                                <button
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                        <Icon
                                            icon="solar:login-3-bold-duotone"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                    <span className="font-normal">Logout</span>
                                </button>
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
                                        <div className={`w-5 h-5 mr-4 flex items-center justify-center ${pathname !== item.path ? 'gradient-icon' : ''}`}>
                                            <Icon
                                                icon={item.icon}
                                                className={`w-5 h-5 ${pathname === item.path ? 'text-white' : ''}`}
                                            />
                                        </div>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 pt-8">
                                <button
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                        <Icon
                                            icon="solar:login-3-bold-duotone"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                    <span className="font-normal">Logout</span>
                                </button>
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
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Blog Manager</span>
                            </nav>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
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
                            <div className="flex-shrink-0">
                                <Link href="/admin-dashboard/blog/create">
                                    <button className="w-full lg:w-auto px-6 py-4 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow">
                                        + New Blog Post
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Search by blog title or author"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="inline-flex justify-start items-center gap-2 mb-6">
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
                                        <div className="col-span-2">Author</div>
                                        <div className="col-span-2">Published On</div>
                                        <div className="col-span-2">Status</div>
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
                                                            <p className="text-[10px] text-gray-500 mb-1">
                                                                By {post.author}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                                <span>{formatDate(post.published_at)}</span>
                                                                <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                    {post.published ? 'Published' : 'Draft'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <Link href={`/admin-dashboard/blog/edit/${post.id}`}>
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => deleteBlogPost(post.id)}
                                                                className="p-1 hover:bg-gray-100 rounded"
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
                                                    <div className="col-span-2">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {post.author}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                            {formatDate(post.published_at)}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className={`text-[11px] font-medium font-poppins ${post.published ? 'text-green-600' : 'text-gray-600'}`}>
                                                            {post.published ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <Link href={`/admin-dashboard/blog/edit/${post.id}`}>
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => deleteBlogPost(post.id)}
                                                                className="p-1 hover:bg-gray-100 rounded"
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
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BlogManager;