"use client";

import {
    ChevronRight,
    Edit,
    Eye,
    LogOut,
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
import { useCallback, useEffect, useRef, useState } from 'react';

interface ResearchPost {
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

interface ProjectPost {
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

const ResearchProjectsManager = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeContentType, setActiveContentType] = useState<'research' | 'projects'>('research');
    const [researchPosts, setResearchPosts] = useState<ResearchPost[]>([]);
    const [projectPosts, setProjectPosts] = useState<ProjectPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin-signin');
        }
    }, [router]);

    // Fetch research posts from API
    const fetchResearchPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/research`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch research posts');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setResearchPosts(result.data || []);
            } else {
                throw new Error(result.message || 'Failed to fetch research posts');
            }
        } catch (err) {
            console.error('Error fetching research posts:', err);
            setResearchPosts([]);
        }
    };

    // Fetch project posts from API
    const fetchProjectPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch project posts');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setProjectPosts(result.data || []);
            } else {
                throw new Error(result.message || 'Failed to fetch project posts');
            }
        } catch (err) {
            console.error('Error fetching project posts:', err);
            setProjectPosts([]);
        }
    };

    // Fetch all content
    const fetchAllContent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([fetchResearchPosts(), fetchProjectPosts()]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete a research post
    const deleteResearchPost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this research post?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/research/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete research post');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setResearchPosts(prev => prev.filter(post => post.id !== id));
            } else {
                throw new Error(result.message || 'Failed to delete research post');
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An error occurred while deleting');
            console.error('Error deleting research post:', err);
        }
    };

    // Delete a project post
    const deleteProjectPost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setProjectPosts(prev => prev.filter(post => post.id !== id));
            } else {
                throw new Error(result.message || 'Failed to delete project');
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An error occurred while deleting');
            console.error('Error deleting project:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    // Fetch content on component mount
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            return;
        }
        fetchAllContent();
    }, [fetchAllContent]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    // Get current posts based on active content type
    const getCurrentPosts = () => {
        return activeContentType === 'research' ? researchPosts : projectPosts;
    };

    // Filter posts based on active filter and search query
    const filteredPosts = getCurrentPosts().filter(post => {
        // Status filter
        if (activeFilter === 'published' && !post.published) return false;
        if (activeFilter === 'draft' && post.published) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                post.title.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query)
            );
        }

        return true;
    });

    // Fixed routes to match the create and edit pages
    const getCreateUrl = () => {
        return `/admin-dashboard/research/create?type=${activeContentType}`;
    };

    const getEditUrl = (id: string) => {
        return `/admin-dashboard/research/edit/${id}?type=${activeContentType}`;
    };

    const getViewUrl = (slug: string) => {
        return activeContentType === 'research'
            ? `/research-and-project/research/${slug}`
            : `/research-and-project/projects/${slug}`;
    };

    const getDeleteFunction = () => {
        return activeContentType === 'research' ? deleteResearchPost : deleteProjectPost;
    };

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
                        {/* Breadcrumb */}
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
                                <span className="text-[#5C4EC9]">Research & Projects Manager</span>
                            </nav>
                        </div>

                        {/* Page Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                    🔬 Research & Projects Manager
                                </h1>
                                <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                                    Manage and publish R&D content, technical showcases, and innovation projects from the Protonest team.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Link href={getCreateUrl()}>
                                    <button className="w-full lg:w-auto px-6 py-4 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow">
                                        + New {activeContentType === 'research' ? 'Research' : 'Project'}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Content Type Toggle */}
                        <div className="inline-flex justify-start items-center gap-2 mb-6">
                            <button
                                onClick={() => setActiveContentType('research')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeContentType === 'research'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-center text-xs font-semibold font-montserrat">
                                    🔬 Research
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveContentType('projects')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeContentType === 'projects'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-center text-xs font-semibold font-montserrat">
                                    🚀 Projects
                                </span>
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder={`Search by ${activeContentType} title or author`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Filter Buttons */}
                        <div className="inline-flex justify-start items-center gap-2 mb-6">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'all'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-center text-xs font-semibold font-montserrat">
                                    📎 All
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
                                    ✅ Published
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
                                    ⌛ Draft
                                </span>
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading {activeContentType}...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] p-8 text-center">
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm mb-4">Error: {error}</p>
                                    <button
                                        onClick={fetchAllContent}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Content Table */}
                        {!loading && !error && (
                            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                {/* Table Header */}
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="hidden md:grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                        <div className="col-span-4">{activeContentType === 'research' ? 'Research' : 'Project'} Title</div>
                                        <div className="col-span-2">Author</div>
                                        <div className="col-span-2">Published On</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Actions</div>
                                    </div>
                                    <div className="md:hidden text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                        {activeContentType === 'research' ? 'Research Articles' : 'Projects'}
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200">
                                    {filteredPosts.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-gray-500">
                                            {searchQuery ? `No ${activeContentType} match your search` : `No ${activeContentType} found`}
                                        </div>
                                    ) : (
                                        filteredPosts.map((post) => (
                                            <div key={post.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                                {/* Mobile Layout */}
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
                                                                    {post.published ? '✅ Published' : '⌛ Draft'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <Link href={getViewUrl(post.slug)} target="_blank">
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <Link href={getEditUrl(post.id)}>
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => getDeleteFunction()(post.id)}
                                                                className="p-1 hover:bg-gray-100 rounded"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Desktop Layout */}
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
                                                            {post.published ? '✅ Published' : '⌛ Draft'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <Link href={getViewUrl(post.slug)} target="_blank">
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <Link href={getEditUrl(post.id)}>
                                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => getDeleteFunction()(post.id)}
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

export default ResearchProjectsManager;