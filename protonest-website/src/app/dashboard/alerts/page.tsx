"use client";

import Footer from '@/app/components/footer';
import {
    ChevronRight,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const ManageAlertsPage = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobAlertsEnabled, setJobAlertsEnabled] = useState(true);
    const [newsletterEnabled, setNewsletterEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '💼', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/signin');
        }
    }, [router]);

    // Fetch user data function
    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched user data:', data); // Debug log

                // Fixed: Access the properties from the user object
                setJobAlertsEnabled(data.user.job_updates || false);
                setNewsletterEnabled(data.user.newsletter || false);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to fetch user data:', errorData);

                if (response.status === 401) {
                    // Token might be expired
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [router]);

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

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

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        router.push('/signin');
    };

    const updatePreferences = async (jobUpdates: boolean, newsletter: boolean) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert('Authentication required. Please login again.');
                return false;
            }

            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    job_updates: jobUpdates,
                    newsletter: newsletter
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Updated preferences:', data); // Debug log

                // Update local state to reflect server response
                if (data.user) {
                    setJobAlertsEnabled(data.user.job_updates || false);
                    setNewsletterEnabled(data.user.newsletter || false);
                }

                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    alert('Session expired. Please login again.');
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                    return false;
                }

                alert(errorData.error || `Failed to update preferences: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            alert('Failed to update preferences. Please check your connection and try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        const success = await updatePreferences(jobAlertsEnabled, newsletterEnabled);
        if (success) {
            // Show success message
            alert('Preferences saved successfully! Your subscription settings have been updated.');

            // Optionally refresh data to ensure sync
            setTimeout(() => {
                fetchUserData();
            }, 1000);
        }
    };

    const handleNewsletterToggle = (enabled: boolean) => {
        setNewsletterEnabled(enabled);
    };

    const handleJobAlertsToggle = (enabled: boolean) => {
        setJobAlertsEnabled(enabled);
    };

    const RadioButton = ({
        checked,
        onChange,
        label,
        name,
        value
    }: {
        checked: boolean;
        onChange: (value: boolean) => void;
        label: string;
        name: string;
        value: boolean;
    }) => (
        <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center">
                <input
                    type="radio"
                    name={name}
                    checked={checked}
                    onChange={() => onChange(value)}
                    className="sr-only"
                />
                <div
                    className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-colors flex items-center justify-center ${checked
                        ? 'border-[#5530fa] bg-white'
                        : 'border-[#6c6c6c] bg-white'
                        }`}
                    onClick={() => onChange(value)}
                >
                    {checked && (
                        <div className="w-2 h-2 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full" />
                    )}
                </div>
            </div>
            <label
                className="text-[#6c6c6c]/80 text-sm sm:text-base font-normal font-['Poppins'] leading-[30px] cursor-pointer flex-1"
                onClick={() => onChange(value)}
            >
                {label}
            </label>
        </div>
    );

    return (
        <div>
            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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

            <div className="font-poppins min-h-screen bg-white relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {/* Header */}
                <header className="bg-white py-4">
                    <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            {/* Logo */}
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

                            {/* Header Actions - Only Profile Icon */}
                            <div className="flex items-center">
                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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

                                {/* Logout Button */}
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
                            {/* Breadcrumb with Hamburger Menu for mobile */}
                            <div className="flex items-center mb-6">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                                <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Manage Alerts</span>
                                </nav>
                            </div>

                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[25px]">📨</span>
                                    <h2 className="text-2xl font-medium text-gray-700">Manage Alerts</h2>
                                </div>
                                <p className="text-gray-600 text-xs">
                                    Customize how you receive updates about job matches and platform notifications.
                                </p>
                            </div>

                            {/* Job Alerts Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                <h3 className="text-lg font-medium text-[#6c6c6c] mb-6 font-['Poppins']">
                                    Manage Job Alerts via Email
                                </h3>
                                <div className="space-y-4">
                                    <RadioButton
                                        checked={jobAlertsEnabled}
                                        onChange={() => handleJobAlertsToggle(true)}
                                        label="Turn on"
                                        name="jobAlerts"
                                        value={true}
                                    />
                                    <RadioButton
                                        checked={!jobAlertsEnabled}
                                        onChange={() => handleJobAlertsToggle(false)}
                                        label="Turn off"
                                        name="jobAlerts"
                                        value={false}
                                    />
                                </div>
                            </div>

                            {/* Newsletter Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                <h3 className="text-lg font-medium text-[#6c6c6c] mb-6 font-['Poppins']">
                                    Manage Email Notifications from the Newsletter
                                </h3>
                                <div className="space-y-4">
                                    <RadioButton
                                        checked={newsletterEnabled}
                                        onChange={() => handleNewsletterToggle(true)}
                                        label="Turn on"
                                        name="newsletter"
                                        value={true}
                                    />
                                    <RadioButton
                                        checked={!newsletterEnabled}
                                        onChange={() => handleNewsletterToggle(false)}
                                        label="Turn off"
                                        name="newsletter"
                                        value={false}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-center lg:justify-end">
                                <button
                                    onClick={handleSavePreferences}
                                    disabled={loading}
                                    className={`w-full sm:w-auto px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {loading ? 'Saving...' : 'Save My Preferences'}
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ManageAlertsPage;