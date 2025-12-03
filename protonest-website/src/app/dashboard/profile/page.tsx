"use client";

import Footer from '@/app/components/footer';
import { Icon } from '@iconify/react';
import {
    Camera,
    ChevronRight,
    Edit,
    LogOut,
    Menu,
    Save,
    Trash2,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CVData {
    id?: string;
    phone_number: string;
    city: string;
    work_function: string;
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

const ProfilePage = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [sendingResetLink, setSendingResetLink] = useState(false);
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: 'solar:folder-with-files-bold-duotone', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: 'solar:minimalistic-magnifer-bold-duotone', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: 'solar:diskette-bold-duotone', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: 'solar:target-bold-duotone', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: 'solar:cloud-upload-bold-duotone', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: 'solar:bell-bold-duotone', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: 'solar:user-bold-duotone', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
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
                        work_function: userData.cv.work_function || ''
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
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
            if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen, showProfileDropdown]);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setShowProfileDropdown(false);
        setShowLogoutDialog(false);
        router.push('/careers');
    };

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
                        work_function: editedData.cvData.work_function,
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
        <div>
            
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
                        <p className="text-gray-600 mb-4">
                            This action cannot be undone. This will permanently delete your account and remove all your data including:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                            <li>Profile information</li>
                            <li>Uploaded CV</li>
                            <li>Saved jobs</li>
                            <li>Job applications</li>
                            <li>Subscription preferences</li>
                        </ul>
                        <p className="text-gray-600 mb-4">
                            Please type <strong className="text-red-600">DELETE</strong> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 mb-6"
                            disabled={deletingAccount}
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteConfirmText('');
                                }}
                                disabled={deletingAccount}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                            <p className="text-gray-600 mb-6 text-center">
                                We&apos;ve sent a password reset link to {profileData.email}. Please check your email to reset your password.
                            </p>
                            <button
                                onClick={() => setShowPasswordSuccess(false)}
                                className="px-6 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
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
                        <p className="text-gray-600 mb-6">
                            We&apos;ll send a password reset link to your email address: <strong>{profileData.email}</strong>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPasswordDialog(false)}
                                disabled={sendingResetLink}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendPasswordResetLink}
                                disabled={sendingResetLink}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
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
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {(error || success) && (
                    <div className="fixed top-4 right-4 z-50 max-w-md">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">
                                {success}
                            </div>
                        )}
                    </div>
                )}

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

                            <div className="flex items-center relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-offset-2"
                                >
                                    <Image
                                        src={profileData.profileImage}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {showProfileDropdown && (
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-medium">Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                setShowLogoutDialog(true);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
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
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Profile</span>
                                </nav>
                            </div>

                            <div className="mb-8">
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

                                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
                                                        className="w-full text-[#6c6c6c] text-lg sm:text-[22px] font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                        placeholder="First Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editedData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="w-full text-[#6c6c6c] text-lg sm:text-[22px] font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
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

                                            <div className="sm:col-span-2 lg:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Preferred Function
                                                </label>
                                                {isEditing && editedData.cvData ? (
                                                    <input
                                                        type="text"
                                                        value={editedData.cvData.work_function}
                                                        onChange={(e) => handleCVInputChange('work_function', e.target.value)}
                                                        className="w-full text-[#6c6c6c] text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5530fa]"
                                                        placeholder="Preferred Function"
                                                    />
                                                ) : (
                                                    <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-gray-50 rounded-lg px-3 py-2 break-words">
                                                        {profileData.cvData.work_function || 'Not provided'}
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
                                            <label className="flex items-center gap-3">
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
                                            <label className="flex items-center gap-3">
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

                                <div className="mb-8">
                                    <h3 className="text-lg sm:text-xl font-medium text-[#6c6c6c] font-['Poppins'] mb-4">Current CV</h3>
                                    <button
                                        onClick={handlePreviewCV}
                                        className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Montserrat'] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        Preview CV
                                    </button>
                                </div>
                            </div>

                            
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8">
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
                                        <span className="text-[#6c6c6c]/80 group-hover:bg-gradient-to-r group-hover:from-[#5530fa] group-hover:to-[#f51da5] group-hover:text-transparent group-hover:bg-clip-text text-base font-normal font-['Poppins']">
                                            Change Password
                                        </span>
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="group inline-block w-full text-left cursor-pointer py-4"
                                >
                                    <span className="text-red-600 group-hover:text-red-700 text-base font-normal font-['Poppins'] flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </span>
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

export default ProfilePage;