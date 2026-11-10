"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import ProfileImageCropper, { profileImageFileError } from '@/app/components/profile-image-cropper';
import ProfilePhotoActions from '@/app/components/profile-photo-actions';
import { Icon } from '@iconify/react';
import {
    Edit,
    Save,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface CVData {
    id?: string;
    phone_number: string;
    city: string;
}

interface ProfileData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    location: string;
    bio: string;
    dateOfBirth?: string;
    profileImage: string;
    jobUpdates: boolean;
    newsletter: boolean;
    isGoogleUser?: boolean;
    cvData?: CVData;
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

const ProfilePage = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [removingImage, setRemovingImage] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [sendingResetLink, setSendingResetLink] = useState(false);
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
    const [jobAlertsEnabled, setJobAlertsEnabled] = useState(false);
    const [newsletterEnabled, setNewsletterEnabled] = useState(false);
    const [savingAlerts, setSavingAlerts] = useState(false);

    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        location: '',
        bio: '',
        dateOfBirth: '',
        profileImage: '/profile-1.svg',
        jobUpdates: true,
        newsletter: false,
        isGoogleUser: false,
        cvData: undefined
    });
    const [editedData, setEditedData] = useState<ProfileData>({ ...profileData });

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Account Preferences & Security' }
    ];

    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    const apiCall = async (endpoint: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('jwtToken');
        const defaultHeaders: Record<string, string> = {};

        if (!(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/json';
        }

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('jwtToken');
                window.location.href = '/signin';
                return;
            }
            const errorData = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    const loadProfile = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            const response = await apiCall('/auth/user/profile');

            if (response.success && response.user) {
                const userData = response.user;
                const mappedData: ProfileData = {
                    id: userData.id,
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    email: userData.email || '',
                    jobTitle: userData.job_title || '',
                    location: userData.location || '',
                    bio: userData.bio || '',
                    dateOfBirth: userData.date_of_birth ? new Date(userData.date_of_birth).toISOString().split('T')[0] : '',
                    profileImage: userData.profile_image || '/profile-1.svg',
                    jobUpdates: userData.job_updates || false,
                    newsletter: userData.newsletter || false,
                    isGoogleUser: userData.is_oauth_user || false,
                    cvData: userData.cv ? {
                        id: userData.cv.id,
                        phone_number: userData.cv.phone_number || '',
                        city: userData.cv.city || '',
                    } : undefined
                };

                setProfileData(mappedData);
                setEditedData(mappedData);
                setJobAlertsEnabled(userData.job_updates || false);
                setNewsletterEnabled(userData.newsletter || false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCVInputChange = (field: string, value: string) => {
        setEditedData(prev => ({
            ...prev,
            cvData: {
                ...prev.cvData!,
                [field]: value
            }
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setError(null);

            const updateData = {
                first_name: editedData.firstName,
                last_name: editedData.lastName,
                job_title: editedData.jobTitle,
                location: editedData.location,
                bio: editedData.bio,
                date_of_birth: editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString() : null,
                job_updates: editedData.jobUpdates,
                newsletter: editedData.newsletter,
            };

            const response = await apiCall('/auth/user/profile', {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });

            if (response.success && response.user) {
                if (editedData.cvData && profileData.cvData) {
                    const cvUpdateData = {
                        phone_number: editedData.cvData.phone_number,
                        city: editedData.cvData.city,
                    };

                    try {
                        await apiCall('/cv/update-profile', {
                            method: 'PUT',
                            body: JSON.stringify(cvUpdateData),
                        });
                    } catch (cvErr) {
                        console.error('Failed to update CV profile:', cvErr);
                    }
                }

                await loadProfile();
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            console.error('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedData({ ...profileData });
        setIsEditing(false);
        setError(null);
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        const fileError = profileImageFileError(file);
        if (fileError) {
            setError(fileError);
            return;
        }
        setError(null);
        setSuccess(null);
        setCropFile(file);
    };

    const uploadCroppedImage = async (file: File) => {
        try {
            setUploadingImage(true);
            setError(null);

            const formData = new FormData();
            formData.append('image', file);

            const response = await apiCall('/auth/user/profile/image', {
                method: 'POST',
                body: formData,
            });

            if (response.success && response.user) {
                const newImageUrl = response.profile_image || response.user.profile_image;
                setProfileData(prev => ({ ...prev, profileImage: newImageUrl }));
                setEditedData(prev => ({ ...prev, profileImage: newImageUrl }));
                setSuccess('Profile image updated successfully!');
            } else {
                throw new Error('Failed to upload image. Try again.');
            }
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        setRemovingImage(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await apiCall('/auth/user/profile/image', { method: 'DELETE' });
            if (!response?.success) throw new Error('Failed to remove profile photo. Try again.');
            setProfileData(previous => ({ ...previous, profileImage: '/profile-1.svg' }));
            setEditedData(previous => ({ ...previous, profileImage: '/profile-1.svg' }));
            setSuccess('Profile photo removed successfully.');
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Failed to remove profile photo.');
        } finally {
            setRemovingImage(false);
        }
    };

    const handleChangePassword = () => {
        setShowPasswordDialog(true);
    };

    const handleSendPasswordResetLink = async () => {
        try {
            setSendingResetLink(true);
            setError(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: profileData.email }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowPasswordDialog(false);
                setShowPasswordSuccess(true);
            } else {
                setError(data.error || 'Failed to send reset email. Please try again.');
                setShowPasswordDialog(false);
            }
        } catch {
            setError('Network error. Please try again.');
            setShowPasswordDialog(false);
        } finally {
            setSendingResetLink(false);
        }
    };

    const updateAlerts = async (jobUpdates: boolean, newsletter: boolean) => {
        try {
            setSavingAlerts(true);
            const token = localStorage.getItem('jwtToken');
            if (!token) return;
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_updates: jobUpdates, newsletter })
            });
        } catch {
        } finally {
            setSavingAlerts(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530fa]"></div>
            </div>
        );
    }

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            {cropFile && <ProfileImageCropper file={cropFile} onClose={() => setCropFile(null)} onConfirm={uploadCroppedImage} />}

            {showPasswordSuccess && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowPasswordSuccess(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="text-6xl mb-4">📩</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Reset Link Sent!</h3>
                            <p className="text-gray-600 mb-6 text-center text-sm">
                                We&apos;ve sent a password reset link to {profileData.email}. Please check your email to reset your password.
                            </p>
                            <button
                                onClick={() => setShowPasswordSuccess(false)}
                                className="px-6 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPasswordDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => !sendingResetLink && setShowPasswordDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            We&apos;ll send a password reset link to your email address: <strong>{profileData.email}</strong>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPasswordDialog(false)}
                                disabled={sendingResetLink}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendPasswordResetLink}
                                disabled={sendingResetLink}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                                {sendingResetLink ? (
                                    <>
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative">
                {(error || success) && (
                    <div className="fixed top-24 right-4 z-50 max-w-md">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2 text-sm">
                                {success}
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white pb-6 pt-1 flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col justify-start items-start gap-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:user-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                    Profile
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                Manage your personal information and account settings.
                            </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving || uploadingImage || removingImage}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 text-sm whitespace-nowrap"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving || uploadingImage || removingImage}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex flex-col items-center sm:items-start">
                            <div>
                                <div className="w-[92px] h-[88px] p-0.5 bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full inline-flex justify-center items-center">
                                    <div className="w-[88px] h-[84px] p-px bg-white rounded-full flex justify-center items-center">
                                        <Image
                                            className="w-[78px] h-[78px] rounded-full object-cover"
                                            src={isEditing ? editedData.profileImage : profileData.profileImage}
                                            alt="Profile"
                                            width={78}
                                            height={78}
                                        />
                                    </div>
                                </div>
                            </div>
                            {(isEditing || profileData.profileImage === '/profile-1.svg') && (
                                <div className="mt-3">
                                    <ProfilePhotoActions
                                        hasPhoto={editedData.profileImage !== '/profile-1.svg'}
                                        busy={uploadingImage || removingImage}
                                        onSelect={handleImageSelect}
                                        onRemove={handleRemoveImage}
                                        status={uploadingImage ? 'Uploading photo...' : removingImage ? 'Removing photo...' : undefined}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="mb-2">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={editedData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full text-[#6c6c6c] text-lg font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                            placeholder="First Name"
                                        />
                                        <input
                                            type="text"
                                            value={editedData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="w-full text-[#6c6c6c] text-lg font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                            placeholder="Last Name"
                                        />
                                        <label className="text-sm font-medium text-gray-500 mt-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={editedData.dateOfBirth || ''}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            className="w-full text-[#6c6c6c] text-sm font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-[#6c6c6c] text-lg sm:text-[22px] font-medium font-['Poppins'] break-words">
                                            {profileData.firstName} {profileData.lastName}
                                        </h2>
                                        {profileData.dateOfBirth && (
                                            <p className="text-[#6c6c6c]/80 text-sm mt-1">Born: {new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div>
                                <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] break-words">
                                    {profileData.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {profileData.cvData && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-[#6c6c6c] font-['Poppins'] mb-4 flex items-center gap-3">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:document-add-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                CV Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    {isEditing && editedData.cvData ? (
                                        <input
                                            type="tel"
                                            value={editedData.cvData.phone_number}
                                            onChange={(e) => handleCVInputChange('phone_number', e.target.value)}
                                            className="w-full text-[#6c6c6c] text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5530fa]"
                                            placeholder="Phone Number"
                                        />
                                    ) : (
                                        <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-gray-50 rounded-lg px-3 py-2 break-words">
                                            {profileData.cvData.phone_number || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    {isEditing && editedData.cvData ? (
                                        <input
                                            type="text"
                                            value={editedData.cvData.city}
                                            onChange={(e) => handleCVInputChange('city', e.target.value)}
                                            className="w-full text-[#6c6c6c] text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5530fa]"
                                            placeholder="City"
                                        />
                                    ) : (
                                        <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-gray-50 rounded-lg px-3 py-2 break-words">
                                            {profileData.cvData.city || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-[#6c6c6c] font-['Poppins'] mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editedData.jobUpdates}
                                        onChange={(e) => handleInputChange('jobUpdates', e.target.checked)}
                                        className="w-4 h-4 text-[#5530fa] border-gray-300 rounded focus:ring-[#5530fa]"
                                    />
                                    <span className="text-[#6c6c6c] text-sm font-normal font-['Poppins']">
                                        Receive job update notifications
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editedData.newsletter}
                                        onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                                        className="w-4 h-4 text-[#5530fa] border-gray-300 rounded focus:ring-[#5530fa]"
                                    />
                                    <span className="text-[#6c6c6c] text-sm font-normal font-['Poppins']">
                                        Subscribe to newsletter
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-8">
                        <h3 className="text-lg sm:text-[22px] font-medium text-[#6c6c6c] font-['Poppins'] mb-6 flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon
                                    icon="solar:bell-bold-duotone"
                                    className="w-7 h-7"
                                />
                            </div>
                            Notification Preferences
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-sm font-medium text-[#6c6c6c] font-['Poppins']">Job Alert Emails</p>
                                    <p className="text-xs text-gray-400 font-['Poppins'] mt-0.5">Receive email notifications when new matching jobs are posted</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const next = !jobAlertsEnabled;
                                        setJobAlertsEnabled(next);
                                        await updateAlerts(next, newsletterEnabled);
                                    }}
                                    disabled={savingAlerts}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer flex-shrink-0 ${
                                        jobAlertsEnabled ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${jobAlertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-sm font-medium text-[#6c6c6c] font-['Poppins']">Newsletter</p>
                                    <p className="text-xs text-gray-400 font-['Poppins'] mt-0.5">Receive platform updates and newsletter emails</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const next = !newsletterEnabled;
                                        setNewsletterEnabled(next);
                                        await updateAlerts(jobAlertsEnabled, next);
                                    }}
                                    disabled={savingAlerts}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer flex-shrink-0 ${
                                        newsletterEnabled ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5]' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsletterEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-8">
                        <h3 className="text-lg sm:text-[22px] font-medium text-[#6c6c6c] font-['Poppins'] mb-6 flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                <Icon
                                    icon="solar:shield-keyhole-bold-duotone"
                                    className="w-7 h-7"
                                />
                            </div>
                            Account Security
                        </h3>

                        {!profileData.isGoogleUser && (
                            <button
                                onClick={handleChangePassword}
                                className="group inline-block w-full text-left cursor-pointer py-4 border-b border-gray-100"
                            >
                                <span className="text-[#6c6c6c]/80 group-hover:bg-gradient-to-r group-hover:from-[#5530fa] group-hover:to-[#f51da5] group-hover:text-transparent group-hover:bg-clip-text text-base font-normal font-['Poppins'] transition-all">
                                    Change Password
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
