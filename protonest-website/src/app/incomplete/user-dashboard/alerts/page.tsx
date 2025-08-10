"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ManageAlertsPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [frequency, setFrequency] = useState('immediate');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/user-dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/user-dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/user-dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/user-dashboard/applied-jobs' },
        { icon: '✍️', label: 'Ongoing Projects', path: '/user-dashboard/projects' },
        { icon: '📨', label: 'Resubmit CV', path: '/user-dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/user-dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/user-dashboard/profile' },
        { icon: '⚙️', label: 'Settings', path: '/user-dashboard/settings' },
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

    const handleSavePreferences = () => {
        // Handle save preferences logic here
        console.log('Saving preferences:', {
            notificationsEnabled,
            frequency,
            emailNotifications,
            inAppNotifications
        });
        alert('Preferences saved successfully!');
    };

    const handleReset = () => {
        setNotificationsEnabled(true);
        setFrequency('immediate');
        setEmailNotifications(true);
        setInAppNotifications(false);
    };

    const RadioButton = ({
        checked,
        onChange,
        label,
        name,
        value
    }: {
        checked: boolean;
        onChange: (value: string) => void;
        label: string;
        name: string;
        value: string;
    }) => (
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={() => onChange(value)}
                    className="sr-only"
                />
                <div
                    className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-colors ${checked
                        ? 'border-[#5530fa] bg-white'
                        : 'border-[#6c6c6c] bg-white'
                        }`}
                    onClick={() => onChange(value)}
                >
                    {checked && (
                        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full absolute top-0.5 left-0.5" />
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

                            {/* Header Actions */}
                            <div className="flex items-center space-x-4">
                                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                </button>
                                <Link href="/user-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>
                                <Link href="/user-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                    <Link href="/user-dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Manage Alerts</span>
                                </nav>
                            </div>

                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[25px]">📣</span>
                                    <h2 className="text-2xl font-medium text-gray-700">Manage Alerts</h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Customize how you receive updates about job matches and platform notifications.
                                </p>
                            </div>

                            {/* Notification Settings Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                <h3 className="text-lg font-medium text-[#6c6c6c] mb-6 font-['Poppins']">
                                    Manage Notification
                                </h3>
                                <div className="space-y-4">
                                    <RadioButton
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(true)}
                                        label="Turn notifications on"
                                        name="notifications"
                                        value="on"
                                    />
                                    <RadioButton
                                        checked={!notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(false)}
                                        label="Turn notifications off"
                                        name="notifications"
                                        value="off"
                                    />
                                </div>
                            </div>

                            {/* Frequency and Delivery Method Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                {/* Notification Frequency Section */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-[#6c6c6c] mb-6 font-['Poppins']">
                                        Notification Frequency
                                    </h3>
                                    <div className="space-y-4">
                                        <RadioButton
                                            checked={frequency === 'immediate'}
                                            onChange={(value) => setFrequency(value)}
                                            label="Immediately when new roles go live"
                                            name="frequency"
                                            value="immediate"
                                        />
                                        <RadioButton
                                            checked={frequency === 'daily'}
                                            onChange={(value) => setFrequency(value)}
                                            label="Daily Digest"
                                            name="frequency"
                                            value="daily"
                                        />
                                        <RadioButton
                                            checked={frequency === 'weekly'}
                                            onChange={(value) => setFrequency(value)}
                                            label="Weekly Digest"
                                            name="frequency"
                                            value="weekly"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Method Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-[#6c6c6c] mb-6 font-['Poppins']">
                                        Delivery Method
                                    </h3>
                                    <div className="space-y-4">
                                        <RadioButton
                                            checked={emailNotifications}
                                            onChange={() => setEmailNotifications(true)}
                                            label="Email Notifications"
                                            name="email"
                                            value="email"
                                        />
                                        <RadioButton
                                            checked={inAppNotifications}
                                            onChange={() => setInAppNotifications(!inAppNotifications)}
                                            label="In-App Notifications"
                                            name="inapp"
                                            value="inapp"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                                <button
                                    onClick={handleSavePreferences}
                                    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow"
                                >
                                    Save My Preferences
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-full sm:w-auto px-6 py-4 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] font-medium font-['Poppins'] hover:bg-gray-50 transition-colors"
                                >
                                    Reset
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