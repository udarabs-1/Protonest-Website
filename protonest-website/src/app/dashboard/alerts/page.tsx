"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import {
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface ProfileData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    location: string;
    bio: string;
    profileImage: string;
    jobUpdates: boolean;
    newsletter: boolean;
    isGoogleUser?: boolean;
}

const isUserTokenExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    const token = localStorage.getItem('jwtToken');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('tokenExpiration');
            return true;
        }

        return false;
    } catch {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
        return true;
    }
};

const ManageAlertsPage = () => {
    const router = useRouter();
    const [jobAlertsEnabled, setJobAlertsEnabled] = useState(true);
    const [newsletterEnabled, setNewsletterEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        location: '',
        bio: '',
        profileImage: '/profile-1.svg',
        jobUpdates: true,
        newsletter: false,
        isGoogleUser: false,
    });

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Manage Alerts', href: '/dashboard/alerts', active: true }
    ];

    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    const userData = data.user;
                    setProfileData({
                        id: userData.id,
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        email: userData.email || '',
                        jobTitle: userData.job_title || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        profileImage: userData.profile_image || '/profile-1.svg',
                        jobUpdates: userData.job_updates || false,
                        newsletter: userData.newsletter || false,
                        isGoogleUser: userData.is_oauth_user || false,
                    });
                    setJobAlertsEnabled(userData.job_updates || false);
                    setNewsletterEnabled(userData.newsletter || false);
                }
            } else if (response.status === 401) {
                localStorage.removeItem('jwtToken');
                router.push('/signin');
                return;
            }
        } catch (error) {
            // Silently handle errors to prevent console messages during logout
        }
    }, [router]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const showSuccessMessage = (message: string) => {
        setDialogMessage(message);
        setShowSuccessDialog(true);
    };

    const showErrorMessage = (message: string) => {
        setDialogMessage(message);
        setShowErrorDialog(true);
    };

    const updatePreferences = async (jobUpdates: boolean, newsletter: boolean) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                showErrorMessage('Authentication required. Please login again.');
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
                if (data.user) {
                    setJobAlertsEnabled(data.user.job_updates || false);
                    setNewsletterEnabled(data.user.newsletter || false);
                }
                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    showErrorMessage('Session expired. Please login again.');
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                    return false;
                }
                showErrorMessage(errorData.error || `Failed to update preferences: ${response.status}`);
                return false;
            }
        } catch {
            showErrorMessage('Failed to update preferences. Please check your connection and try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleNewsletterToggle = async (enabled: boolean) => {
        setNewsletterEnabled(enabled);
        await updatePreferences(jobAlertsEnabled, enabled);
    };

    const handleJobAlertsToggle = async (enabled: boolean) => {
        setJobAlertsEnabled(enabled);
        await updatePreferences(enabled, newsletterEnabled);
    };

    return (
        <DashboardLayout
            breadcrumbItems={breadcrumbItems}
            profileImage={profileData.profileImage}
        >
            <div className="font-poppins relative">
                {showSuccessDialog && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowSuccessDialog(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Success!</h3>
                                <p className="text-gray-600 mb-6 text-center">
                                    {dialogMessage}
                                </p>
                                <button
                                    onClick={() => setShowSuccessDialog(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showErrorDialog && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowErrorDialog(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Oops!</h3>
                                <p className="text-gray-600 mb-6 text-center">
                                    {dialogMessage}
                                </p>
                                <button
                                    onClick={() => setShowErrorDialog(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sticky top-0 z-10 bg-white pb-6 pt-1 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon
                                    icon="solar:bell-bold-duotone"
                                    className="w-7 h-7"
                                />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                Manage Alerts
                            </h1>
                        </div>
                        <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                            Customize how you receive updates about job matches and platform notifications.
                        </p>
                    </div>
                </div>

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8 mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-base sm:text-lg text-[#6c6c6c] font-['Poppins']">
                            Manage Job Alerts via Email
                        </h3>
                        <button
                            onClick={() => handleJobAlertsToggle(!jobAlertsEnabled)}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer flex-shrink-0 ${jobAlertsEnabled
                                ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]'
                                : 'bg-gray-300'
                                }`}
                            title={jobAlertsEnabled ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${jobAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-base sm:text-lg text-[#6c6c6c] font-['Poppins']">
                            Manage Email Notifications from the Newsletter
                        </h3>
                        <button
                            onClick={() => handleNewsletterToggle(!newsletterEnabled)}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer flex-shrink-0 ${newsletterEnabled
                                ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]'
                                : 'bg-gray-300'
                                }`}
                            title={newsletterEnabled ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsletterEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageAlertsPage;