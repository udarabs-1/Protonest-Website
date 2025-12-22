"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Subscription {
    id: string;
    name: string;
    email: string;
    career_updates: boolean;
    newsletter: boolean;
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

const SubscriptionManagement = () => {
    const router = useRouter();
    const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    setError('Authentication required. Please login again.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/subscriptions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.data && Array.isArray(data.data)) {
                        setAllSubscriptions(data.data);
                        setSubscriptions(data.data);
                    } else if (Array.isArray(data)) {
                        setAllSubscriptions(data);
                        setSubscriptions(data);
                    } else if (data.data === null) {

                        setAllSubscriptions([]);
                        setSubscriptions([]);
                    } else {
                        console.error('Unexpected response structure:', data);
                        setError('Unexpected data format received from server');
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    setError(errorData.message || `Failed to fetch subscriptions: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                setError('Failed to fetch subscriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSubscriptions(allSubscriptions);
            return;
        }

        const search = searchTerm.toLowerCase().trim();
        const filtered = allSubscriptions.filter(sub =>
            sub.name.toLowerCase().includes(search) ||
            sub.email.toLowerCase().includes(search)
        );
        setSubscriptions(filtered);
    }, [searchTerm, allSubscriptions]);



    const toggleSubscriptionStatus = async (id: string, currentStatus: boolean, type: 'career_updates' | 'newsletter') => {
        setAllSubscriptions(prev => prev.map(sub =>
            sub.id === id
                ? { ...sub, [type]: !currentStatus }
                : sub
        ));

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Authentication required. Please login again.');
                setAllSubscriptions(prev => prev.map(sub =>
                    sub.id === id
                        ? { ...sub, [type]: currentStatus }
                        : sub
                ));
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/subscriptions/${id}/toggle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.message || 'Failed to update subscription');
                setAllSubscriptions(prev => prev.map(sub =>
                    sub.id === id
                        ? { ...sub, [type]: currentStatus }
                        : sub
                ));
            }
        } catch (error) {
            console.error('Error toggling subscription status:', error);
            setError('Failed to update subscription. Please try again.');
            setAllSubscriptions(prev => prev.map(sub =>
                sub.id === id
                    ? { ...sub, [type]: currentStatus }
                    : sub
            ));
        }
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">Error</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#5530FA] text-white rounded-md hover:bg-[#4628D1] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Subscription Management' }
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





            <div className="bg-white pb-2 pt-1">
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                            <Icon
                                icon="solar:bell-bold-duotone"
                                className="w-7 h-7"
                            />
                        </div>
                        <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                            Subscription Management
                        </h1>
                    </div>
                    <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                        View and manage freelancers subscribed to job alert notifications.
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-2">
                    <div className="relative flex-1 bg-white rounded-[20px] shadow-sm border border-gray-300 overflow-hidden">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[40px] py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                            placeholder="Search by name or email"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                {subscriptions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No subscriptions found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Subscriber Name
                                </th>
                                <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Newsletter
                                </th>
                                <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Career Updates
                                </th>
                                <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscriptions.map((subscription) => (
                                <tr key={subscription.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                        {subscription.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                        {subscription.email}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => toggleSubscriptionStatus(subscription.id, subscription.newsletter, 'newsletter')}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${subscription.newsletter
                                                ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]'
                                                : 'bg-gray-300'
                                                }`}
                                            title={subscription.newsletter ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${subscription.newsletter ? 'translate-x-4.5' : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => toggleSubscriptionStatus(subscription.id, subscription.career_updates, 'career_updates')}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${subscription.career_updates
                                                ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]'
                                                : 'bg-gray-300'
                                                }`}
                                            title={subscription.career_updates ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${subscription.career_updates ? 'translate-x-4.5' : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                        {new Date(subscription.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default SubscriptionManagement;