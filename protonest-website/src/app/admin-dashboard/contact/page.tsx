"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    Eye,
    Mail,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
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

const ContactFormMessages = () => {
    const [allContactMessages, setAllContactMessages] = useState<ContactMessage[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMessageDialog, setViewMessageDialog] = useState<{ name: string; message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

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

                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contacts`;

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
                    setAllContactMessages(data.data || []);
                    setContactMessages(data.data || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch contacts');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching contact messages:', err);
                setAllContactMessages([]);
                setContactMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchContactMessages();
    }, []);

    useEffect(() => {
        let filtered = [...allContactMessages];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(msg => msg.status === statusFilter);
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(search) ||
                msg.email.toLowerCase().includes(search) ||
                msg.message.toLowerCase().includes(search)
            );
        }

        setContactMessages(filtered);
    }, [searchTerm, statusFilter, allContactMessages]);

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

            setAllContactMessages(prev => prev.map(msg =>
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
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Contact Form Messages' }
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

            {viewMessageDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
                    onClick={() => setViewMessageDialog(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Message from {viewMessageDialog.name}</h3>
                            <button onClick={() => setViewMessageDialog(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto mb-6">
                            <p className="text-gray-600 whitespace-pre-wrap">{viewMessageDialog.message}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setViewMessageDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="sticky top-0 z-40 bg-white pb-2 pt-1 font-montserrat">
                <div className="mb-4">
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

                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                    <div className="relative flex-1 w-full h-[40px] bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden flex items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full h-[40px] pl-4 pr-12 text-gray-600 focus:outline-none"
                            placeholder="Search by name, email, or message content"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="relative w-full md:w-auto h-[40px]">
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full md:w-[160px] h-full px-4 pr-10 rounded-[20px] shadow-sm border border-gray-300 bg-white text-[#6c6c6c] text-sm font-medium font-poppins cursor-pointer appearance-none focus:outline-none"
                                style={{ direction: 'ltr' }}
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Replied">Replied</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-[#6c6c6c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 mt-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center font-montserrat">
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-800 font-bold hover:text-red-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

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
                                            <div className="relative inline-block">
                                                <select
                                                    value={message.status}
                                                    onChange={(e) => updateContactStatus(message.id, e.target.value)}
                                                    className={`px-3 py-1.5 pr-8 rounded-[15px] text-[11px] font-medium font-poppins text-[#4e4e4e] ${getStatusColor(message.status)} outline-none border-none cursor-pointer appearance-none`}
                                                    style={{ direction: 'ltr' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Replied">Replied</option>
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className="w-3 h-3 text-[#4e4e4e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
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
                                                        setViewMessageDialog({ name: message.name, message: message.message });
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
        </AdminLayout >
    );
};

export default ContactFormMessages;