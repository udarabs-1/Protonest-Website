"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import {
    Camera,
    Edit,
    Save,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [sendingResetLink, setSendingResetLink] = useState(false);
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deletingAccount, setDeletingAccount] = useState(false);

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
        cvData: undefined
    });
    const [editedData, setEditedData] = useState<ProfileData>({ ...profileData });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Profile', active: true }
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
            const errorData = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    const loadProfile = useCallback(async () => {
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
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
            console.error('Error loading profile');
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

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
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
            console.error('Error uploading image');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        try {
            setDeletingAccount(true);
            setError(null);

            const response = await apiCall('/auth/user/account', {
                method: 'DELETE',
            });

            if (response.success) {
                localStorage.removeItem('jwtToken');
                setShowDeleteDialog(false);
                router.push('/careers');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete account');
            console.error('Error deleting account');
        } finally {
            setDeletingAccount(false);
        }
    };

    const handlePreviewCV = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                setError('Please log in to preview your CV');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/file`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const newWindow = window.open(url, '_blank');

                if (newWindow) {
                    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                } else {
                    window.URL.revokeObjectURL(url);
                    setError('Please allow pop-ups to preview your CV');
                }
            } else {
                setError('Failed to preview CV');
            }
        } catch (error) {
            console.error('Error previewing CV:', error);
            setError('Failed to preview CV');
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
            {showDeleteDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => !deletingAccount && setShowDeleteDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Delete Account</h3>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">
                            This action cannot be undone. This will permanently delete your account and remove all your data including profile info, CV, saved jobs, and applications.
                        </p>
                        <p className="text-gray-600 mb-4 text-sm">
                            Please type <strong className="text-red-600">DELETE</strong> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 mb-6 text-sm"
                            disabled={deletingAccount}
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteConfirmText('');
                                }}
                                disabled={deletingAccount}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                                {deletingAccount ? (
                                    <>
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                <div className="sticky top-0 z-10 bg-white pb-6 pt-1 flex flex-col gap-6">
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
                                        disabled={saving}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 text-sm whitespace-nowrap"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving}
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
                            <div className="relative">
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
                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full p-2 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {uploadingImage ? (
                                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        ) : (
                                            <Camera className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                className="hidden"
                            />
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
                                    </div>
                                ) : (
                                    <h2 className="text-[#6c6c6c] text-lg sm:text-[22px] font-medium font-['Poppins'] break-words">
                                        {profileData.firstName} {profileData.lastName}
                                    </h2>
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

                    <div className="mb-8 flex flex-col items-center sm:items-start">
                        <h3 className="text-lg font-medium text-[#6c6c6c] font-['Poppins'] mb-4 text-center sm:text-left">Current CV</h3>
                        <button
                            onClick={handlePreviewCV}
                            className="w-auto px-6 py-2 sm:px-6 sm:py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Montserrat'] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                            Preview CV
                        </button>
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

                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="group inline-block w-full text-left cursor-pointer py-4"
                    >
                        <span className="text-red-600 group-hover:text-red-700 text-base font-normal font-['Poppins'] flex items-center gap-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </span>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;