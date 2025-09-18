"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    Camera,
    ChevronRight,
    Edit,
    LogOut,
    Menu,
    Save,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
}

const ProfilePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loadingCV, setLoadingCV] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        location: '',
        bio: '',
        profileImage: '/profile-1.svg',
        jobUpdates: true,
        newsletter: false
    });
    const [editedData, setEditedData] = useState<ProfileData>({ ...profileData });

    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

    // API utility function
    const apiCall = async (endpoint: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('jwtToken');

        const defaultHeaders: Record<string, string> = {};

        // Only add Content-Type for non-FormData requests
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

    // Load profile data
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
                };

                setProfileData(mappedData);
                setEditedData(mappedData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load profile on mount
    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

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

    // Clear messages after delay
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

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setError(null);

            // Map frontend field names to backend field names
            const updateData = {
                first_name: editedData.firstName,
                last_name: editedData.lastName,
                email: editedData.email,
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
                };

                setProfileData(mappedData);
                setEditedData(mappedData);
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            console.error('Error updating profile:', err);
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

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        // Validate file type
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

                // Update both profile data and edited data
                setProfileData(prev => ({ ...prev, profileImage: newImageUrl }));
                setEditedData(prev => ({ ...prev, profileImage: newImageUrl }));
                setSuccess('Profile image updated successfully!');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
            console.error('Error uploading image:', err);
        } finally {
            setUploadingImage(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleChangePassword = () => {
        // This could navigate to a change password page or open a modal
        console.log('Change password clicked');
        // You can implement this based on your app's architecture
    };

    const handlePreviewCV = async () => {
        try {
            setLoadingCV(true);
            setError(null);

            const response = await apiCall('/cv/info');

            if (response.status === 'success' && response.data) {
                const cvInfo = response.data;
                // Open CV file in a new tab
                if (cvInfo.file_url) {
                    window.open(cvInfo.file_url, '_blank');
                } else {
                    setError('CV file URL not available');
                }
            } else {
                setError('No CV found. Please upload a CV first.');
            }
        } catch (err) {
            if (err instanceof Error && err.message.includes('No CV found')) {
                setError('No CV found. Please upload a CV first.');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load CV');
            }
            console.error('Error loading CV:', err);
        } finally {
            setLoadingCV(false);
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
            <div className="font-poppins min-h-screen bg-white relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {/* Error/Success Messages */}
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
                                <Link href="/dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>
                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                    <Image
                                        src={profileData.profileImage}
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
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Profile</span>
                                </nav>
                            </div>

                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex flex-col justify-start items-start gap-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[20px] sm:text-[25px]">👤</span>
                                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                                                Profile
                                            </h1>
                                        </div>
                                        <p className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-['Montserrat'] max-w-full">
                                            Manage your personal information and account settings.
                                        </p>
                                    </div>

                                    {/* Edit/Save Button */}
                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="px-6 py-2 bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={saving}
                                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-8 mb-8">
                                {/* Profile Header Section */}
                                <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-gray-100">
                                    {/* Profile Image */}
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

                                    {/* Profile Info */}
                                    <div className="flex-1">
                                        {/* Name */}
                                        <div className="mb-2">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editedData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="flex-1 text-[#6c6c6c] text-[22px] font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                        placeholder="First Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editedData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="flex-1 text-[#6c6c6c] text-[22px] font-medium font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            ) : (
                                                <h2 className="text-[#6c6c6c] text-[22px] font-medium font-['Poppins']">
                                                    {profileData.firstName} {profileData.lastName}
                                                </h2>
                                            )}
                                        </div>

                                        {/* Job Title */}
                                        <div className="mb-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedData.jobTitle}
                                                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                                    className="w-full text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                    placeholder="Job Title"
                                                />
                                            ) : (
                                                <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins']">
                                                    {profileData.jobTitle || 'No job title specified'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="mb-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedData.location}
                                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                                    className="w-full text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                    placeholder="Location"
                                                />
                                            ) : (
                                                <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins']">
                                                    {profileData.location || 'No location specified'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={editedData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="w-full text-[#6c6c6c]/80 text-sm font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-[#5530fa]"
                                                    placeholder="Email"
                                                />
                                            ) : (
                                                <p className="text-[#6c6c6c]/80 text-sm font-normal font-['Poppins']">
                                                    {profileData.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-[#6c6c6c] font-['Poppins'] mb-4">About</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={editedData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            className="w-full h-24 text-[#6c6c6c]/80 text-base font-normal font-['Poppins'] bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5530fa] resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="text-[#6c6c6c]/80 text-base font-normal font-['Poppins'] leading-[30px]">
                                            {profileData.bio || 'No bio added yet.'}
                                        </p>
                                    )}
                                </div>

                                {/* Preferences Section */}
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

                                {/* CV Section */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-medium text-[#6c6c6c] font-['Poppins'] mb-4">Current CV</h3>
                                    <button
                                        onClick={handlePreviewCV}
                                        disabled={loadingCV}
                                        className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Montserrat'] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingCV ? (
                                            <>
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                Loading...
                                            </>
                                        ) : (
                                            'Preview CV'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Account Security Section */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-8">
                                <h3 className="text-[22px] font-medium text-[#6c6c6c] font-['Poppins'] mb-6 flex items-center gap-2">
                                    <span className="text-xl">🔐</span>
                                    Account Security
                                </h3>
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full text-left text-[#6c6c6c]/80 text-base font-normal font-['Poppins'] hover:text-[#5530fa] transition-colors cursor-pointer py-4 border-b border-gray-100"
                                >
                                    Change Password
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