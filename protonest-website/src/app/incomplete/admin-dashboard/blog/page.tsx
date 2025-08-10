"use client";

import {
    Bell,
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
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const BlogManager = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

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
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

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

    // Sample blog posts data
    const blogPosts = [
        {
            id: 1,
            title: "The Power of Rapid IoT Prototyping",
            author: "Protonest Team",
            publishedOn: "May 22, 2025",
            status: "✅ Published"
        },
        {
            id: 2,
            title: "The Power of Rapid IoT Prototyping",
            author: "Protonest Team",
            publishedOn: "May 10, 2025",
            status: "✅ Published"
        },
        {
            id: 3,
            title: "The Power of Rapid IoT Prototyping",
            author: "Protonest Team",
            publishedOn: "May 19, 2025",
            status: "✅ Published"
        },
        {
            id: 4,
            title: "The Power of Rapid IoT Prototyping",
            author: "Protonest Team",
            publishedOn: "-",
            status: "⌛ Draft"
        },
        {
            id: 5,
            title: "The Power of Rapid IoT Prototyping",
            author: "Protonest Team",
            publishedOn: "-",
            status: "⌛ Draft"
        }
    ];

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    // Filter blog posts based on active filter
    const filteredBlogPosts = blogPosts.filter(post => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'published') return post.status === '✅ Published';
        if (activeFilter === 'draft') return post.status === '⌛ Draft';
        return true;
    });

    return (
        <div className="font-poppins min-h-screen bg-white relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Header */}
            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo - Smaller on mobile */}
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

                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>

                            <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                    {/* Sidebar - Mobile */}
                    <div
                        ref={sidebarRef}
                        className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        {/* Mobile Sidebar Header */}
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

                        {/* Sidebar Content */}
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

                            {/* Logout Button */}
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

                            {/* Logout Button */}
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

                    {/* Main Content */}
                    <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                        {/* Breadcrumb with Hamburger Menu for mobile */}
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

                        {/* Page Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                    📝 Blog Manager
                                </h1>
                                <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                                    Create and manage blog articles that appear on the Protonest site.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button className="w-full lg:w-auto px-6 py-4 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow">
                                    + New Blog Post
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] opacity-50"
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

                        {/* Filter Buttons */}
                        <div className="inline-flex justify-start items-center gap-2 mb-6">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeFilter === 'all'
                                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                    : ' outline-1 outline-[#5530fa] text-[#676767] hover:bg-gray-50'
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
                                    : ' outline-1 outline-[#5530fa] text-[#676767] hover:bg-gray-50'
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
                                    : ' outline-1 outline-[#5530fa] text-[#676767] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-center text-[11px] font-medium font-poppins">
                                    ⌛ Draft
                                </span>
                            </button>
                        </div>

                        {/* Blog Posts Table */}
                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                            {/* Table Header */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    <div className="col-span-12 md:col-span-4">Blog Title</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Author</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Published On</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Status</div>
                                    <div className="col-span-12 md:col-span-2 hidden md:block">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {filteredBlogPosts.map((post) => (
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
                                                        <span>{post.publishedOn}</span>
                                                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded">
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
                                                    {post.publishedOn}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[11px] font-medium font-poppins text-[#676767]">
                                                    {post.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                                                        <Trash2 className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BlogManager;