"use client";

import { Icon } from '@iconify/react';
import {
    ChevronRight,
    Eye,
    Mail,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
}

const ContactFormMessages = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

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

    useEffect(() => {
        const fetchContactMessages = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    setError('Authentication required. Please log in.');
                    setLoading(false);
                    return;
                }

                let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contacts`;
                const params = new URLSearchParams();

                if (searchTerm) {
                    params.append('search', searchTerm);
                }
                if (statusFilter !== 'all') {
                    params.append('status', statusFilter);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.status === 'success') {
                    setContactMessages(data.data || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch contacts');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching contact messages:', err);
                setContactMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchContactMessages();
    }, [searchTerm, statusFilter]);

    const updateContactStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Authentication required. Please log in.');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contacts/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.statusText}`);
            }

            setContactMessages(prev => prev.map(msg =>
                msg.id === id ? { ...msg, status: newStatus } : msg
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status');
            console.error('Error updating contact status:', err);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getMessagePreview = (message: string) => {
        return message.length > 50 ? `"${message.substring(0, 50)}..."` : `"${message}"`;
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-[#e2ff86]';
            case 'Replied':
                return 'bg-[#86ffae]';
            case 'Archived':
                return 'bg-gray-200';
            default:
                return 'bg-gray-100';
        }
    };

    const handleReply = (email: string) => {
        window.open(`mailto:${email}`, '_blank');
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading contact messages...</p>
                </div>
            </div>
        );
    }

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


            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}


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
                                <span className="text-[#5C4EC9]">Contact Form Messages</span>
                            </nav>
                        </div>


                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:dialog-2-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                    Contact Form Messages
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and respond to messages sent via the Contact Us form. Use the reply button to respond via email.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                                <button
                                    onClick={() => setError(null)}
                                    className="float-right text-red-800 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        )}


                        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                            <div className="relative flex-1 w-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Search by name, email, or message content"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    className="px-4 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Replied">Replied</option>
                                    <option value="Archived">Archived</option>
                                </select>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>


                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Message Preview
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Submitted On
                                            </th>
                                            <th className="px-4 py-3 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contactMessages.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                    {searchTerm || statusFilter !== 'all'
                                                        ? 'No messages match your search criteria'
                                                        : 'No contact messages found'
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            contactMessages.map((message) => (
                                                <tr key={message.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {message.name}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {message.email}
                                                    </td>
                                                    <td className="px-4 py-3 text-[11px] font-medium font-poppins text-[#676767]">
                                                        <div className="max-w-xs truncate">
                                                            {getMessagePreview(message.message)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <select
                                                            value={message.status}
                                                            onChange={(e) => updateContactStatus(message.id, e.target.value)}
                                                            className={`px-3 py-1 rounded-[15px] text-[11px] font-medium font-poppins text-[#4e4e4e] ${getStatusColor(message.status)} outline-[0.80px] outline-offset-[-0.80px] border-none focus:ring-0`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Replied">Replied</option>
                                                            <option value="Archived">Archived</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {formatDate(message.created_at)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleReply(message.email)}
                                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                title="Reply via email"
                                                            >
                                                                <Mail className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                title="View details"
                                                                onClick={() => {

                                                                    alert(`Message: ${message.message}`);
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ContactFormMessages;