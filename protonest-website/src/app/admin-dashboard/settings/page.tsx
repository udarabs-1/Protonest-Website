"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Edit2,
    FileText,
    Info,
    Lock,
    Mail,
    Shield,
    Trash2,
    Upload,
    User,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Admin {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'super_admin' | 'admin';
    created_at: string;
    last_login?: string;
}

interface NDADocument {
    id: string;
    file_name: string;
    file_size: number;
    version: number;
    uploaded_by: string;
    uploaded_at: string;
    is_active: boolean;
    description: string;
    download_url: string;
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

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [addAdminDialog, setAddAdminDialog] = useState(false);
    const [ndaDocuments, setNdaDocuments] = useState<NDADocument[]>([]);
    const [activeNDA, setActiveNDA] = useState<NDADocument | null>(null);
    const [uploadingNDA, setUploadingNDA] = useState(false);
    const [editingDescription, setEditingDescription] = useState<string | null>(null);
    const [descriptionText, setDescriptionText] = useState('');
    const [updatingDescription, setUpdatingDescription] = useState(false);
    const [activatingNDA, setActivatingNDA] = useState<string | null>(null);
    const [deletingNDA, setDeletingNDA] = useState<string | null>(null);
    const [ndaDescription, setNdaDescription] = useState('');
    const [passwordResetDialog, setPasswordResetDialog] = useState(false);
    const [sendingResetLink, setSendingResetLink] = useState(false);
    const [resetLinkError, setResetLinkError] = useState('');
    const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null);
    const [deleteNDAConfirm, setDeleteNDAConfirm] = useState<NDADocument | null>(null);
    const [newAdminFirstName, setNewAdminFirstName] = useState('');
    const [newAdminLastName, setNewAdminLastName] = useState('');
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const ndaFileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    router.push('/admin-signin');
                    return;
                }

                const adminsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/users/all`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });

                const ndaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/all`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });

                if (adminsResponse.ok) {
                    const adminsData = await adminsResponse.json();
                    setAdmins(adminsData.data || []);
                }

                if (ndaResponse.ok) {
                    const ndaData = await ndaResponse.json();
                    setNdaDocuments(ndaData.documents || []);
                    const active = ndaData.documents?.find((doc: NDADocument) => doc.is_active);
                    setActiveNDA(active || null);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);



    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getCurrentAdmin = () => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) return null;

        try {
            const payload = JSON.parse(atob(adminToken.split('.')[1]));
            return { id: payload.id, role: payload.role, email: payload.email };
        } catch {
            return null;
        }
    };

    const isSuperAdmin = () => {
        const currentAdmin = getCurrentAdmin();
        return currentAdmin?.role === 'super_admin';
    };

    const openAddAdminDialog = () => {
        if (!isSuperAdmin()) {
            setErrorDialog({ title: 'Access Denied', message: 'Only super admins can add new admins' });
            return;
        }
        setAddAdminDialog(true);
        setNewAdminEmail('');
        setNewAdminFirstName('');
        setNewAdminLastName('');
    };

    const closeAddAdminDialog = () => {
        setAddAdminDialog(false);
        setNewAdminEmail('');
        setNewAdminFirstName('');
        setNewAdminLastName('');
    };

    const handleAddAdmin = async () => {
        if (!newAdminEmail.trim()) {
            setErrorDialog({ title: 'Validation Error', message: 'Please enter an email address' });
            return;
        }

        if (!newAdminFirstName.trim()) {
            setErrorDialog({ title: 'Validation Error', message: 'Please enter a first name' });
            return;
        }

        if (!newAdminLastName.trim()) {
            setErrorDialog({ title: 'Validation Error', message: 'Please enter a last name' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newAdminEmail)) {
            setErrorDialog({ title: 'Validation Error', message: 'Please enter a valid email address' });
            return;
        }

        try {
            setAddingAdmin(true);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    email: newAdminEmail.trim(),
                    first_name: newAdminFirstName.trim(),
                    last_name: newAdminLastName.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add admin');
            }

            setAdmins([...admins, data.data]);
            setAddAdminDialog(false);
            setNewAdminEmail('');
            setNewAdminFirstName('');
            setNewAdminLastName('');
            setSuccessDialog({ title: 'Success', message: 'Admin added successfully! Login credentials have been sent to their email.' });
        } catch (err) {
            console.error('Error adding admin:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to add admin' });
        } finally {
            setAddingAdmin(false);
        }
    };

    const handleDeleteAdmin = async () => {
        if (!deleteAdmin) return;

        try {
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/users/${deleteAdmin.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete admin');
            }

            setAdmins(admins.filter(a => a.id !== deleteAdmin.id));
            setDeleteAdmin(null);
            setSuccessDialog({ title: 'Success', message: 'Admin deleted successfully' });
        } catch (err) {
            console.error('Error deleting admin:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to delete admin' });
        }
    };

    const handleUploadNDA = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setErrorDialog({ title: 'Validation Error', message: 'Please upload a PDF file' });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrorDialog({ title: 'Validation Error', message: 'File size must be less than 10MB' });
            return;
        }

        try {
            setUploadingNDA(true);
            const adminToken = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('document', file);
            if (ndaDescription.trim()) {
                formData.append('description', ndaDescription.trim());
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminToken}` },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload NDA');
            }

            const ndaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/all`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (ndaResponse.ok) {
                const ndaData = await ndaResponse.json();
                setNdaDocuments(ndaData.documents || []);
                const active = ndaData.documents?.find((doc: NDADocument) => doc.is_active);
                setActiveNDA(active || null);
            }

            setNdaDescription('');
            setSuccessDialog({ title: 'Success', message: 'NDA uploaded successfully' });
        } catch (err) {
            console.error('Error uploading NDA:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to upload NDA' });
        } finally {
            setUploadingNDA(false);
            if (ndaFileInputRef.current) {
                ndaFileInputRef.current.value = '';
            }
        }
    };

    const handleUpdateDescription = async (documentId: string) => {
        if (!descriptionText.trim()) {
            setErrorDialog({ title: 'Validation Error', message: 'Description cannot be empty' });
            return;
        }

        try {
            setUpdatingDescription(true);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/${documentId}/description`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ description: descriptionText.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update description');
            }

            setNdaDocuments(ndaDocuments.map(doc =>
                doc.id === documentId
                    ? { ...doc, description: descriptionText.trim() }
                    : doc
            ));

            if (activeNDA?.id === documentId) {
                setActiveNDA({ ...activeNDA, description: descriptionText.trim() });
            }

            setEditingDescription(null);
            setDescriptionText('');
            setSuccessDialog({ title: 'Success', message: 'Description updated successfully' });
        } catch (err) {
            console.error('Error updating description:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to update description' });
        } finally {
            setUpdatingDescription(false);
        }
    };

    const handleSetActiveNDA = async (documentId: string) => {
        try {
            setActivatingNDA(documentId);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/${documentId}/activate`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to activate document');
            }

            setNdaDocuments(ndaDocuments.map(doc => ({
                ...doc,
                is_active: doc.id === documentId
            })));

            const newActive = ndaDocuments.find(doc => doc.id === documentId);
            if (newActive) {
                setActiveNDA({ ...newActive, is_active: true });
            }

            setSuccessDialog({ title: 'Success', message: 'Document activated successfully' });
        } catch (err) {
            console.error('Error activating document:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to activate document' });
        } finally {
            setActivatingNDA(null);
        }
    };

    const handleDeleteNDA = async () => {
        if (!deleteNDAConfirm) return;

        try {
            setDeletingNDA(deleteNDAConfirm.id);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/${deleteNDAConfirm.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete document');
            }

            setNdaDocuments(ndaDocuments.filter(doc => doc.id !== deleteNDAConfirm.id));
            setDeleteNDAConfirm(null);
            setSuccessDialog({ title: 'Success', message: 'Document deleted successfully' });
        } catch (err) {
            console.error('Error deleting document:', err);
            setErrorDialog({ title: 'Error', message: err instanceof Error ? err.message : 'Failed to delete document' });
        } finally {
            setDeletingNDA(null);
        }
    };

    const handleDownloadNDA = (url: string) => {
        window.open(url, '_blank');
    };

    const handleSendPasswordResetLink = async () => {
        setResetLinkError('');

        const currentAdmin = getCurrentAdmin();
        if (!currentAdmin || !currentAdmin.email) {
            setResetLinkError('Unable to retrieve admin information. Please sign in again.');
            return;
        }

        try {
            setSendingResetLink(true);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    email: currentAdmin.email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send password reset link');
            }

            setPasswordResetDialog(false);
            setSuccessDialog({
                title: 'Link Sent',
                message: 'Password reset link has been sent to your email address. You will now be logged out. Please check your email to reset your password.'
            });

            setTimeout(() => {
                localStorage.removeItem('adminToken');
                router.push('/admin-signin');
            }, 3000);
        } catch (err) {
            console.error('Error sending reset link:', err);
            setResetLinkError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
        } finally {
            setSendingResetLink(false);
        }
    };

    const resetPasswordResetDialog = () => {
        setPasswordResetDialog(false);
        setResetLinkError('');
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Settings' }
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

            {successDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSuccessDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-green-600 mb-4">{successDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{successDialog.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSuccessDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setErrorDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-red-600 mb-4">{errorDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{errorDialog.message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setErrorDialog(null)}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addAdminDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-6 h-6 text-[#5530FA]" />
                                    Add New Admin
                                </h2>
                                <button
                                    onClick={closeAddAdminDialog}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={addingAdmin}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-blue-900 mb-1">How it works</h4>
                                            <p className="text-sm text-blue-800">
                                                A temporary password will be automatically generated and sent to the admin&apos;s email address.
                                                They will be able to sign in and change their password immediately.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAdminFirstName}
                                        onChange={(e) => setNewAdminFirstName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                        placeholder="First Name"
                                        disabled={addingAdmin}
                                        maxLength={50}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAdminLastName}
                                        onChange={(e) => setNewAdminLastName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                        placeholder="Last Name"
                                        disabled={addingAdmin}
                                        maxLength={50}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={newAdminEmail}
                                            onChange={(e) => setNewAdminEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                            placeholder="admin@example.com"
                                            disabled={addingAdmin}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-amber-900 mb-1">Important Notes</h4>
                                            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                                                <li>New admin will have standard admin privileges</li>
                                                <li>They cannot create or delete other admins</li>
                                                <li>Login credentials will be sent via email</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={closeAddAdminDialog}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={addingAdmin}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={addingAdmin || !newAdminEmail.trim() || !newAdminFirstName.trim() || !newAdminLastName.trim()}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingAdmin ? 'Creating Admin...' : 'Create Admin'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                    Delete Admin User
                                </h3>
                                <button
                                    onClick={() => setDeleteAdmin(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-red-900 mb-1">Warning: Permanent Action</h4>
                                        <p className="text-sm text-red-800">
                                            This action cannot be undone. The admin user will immediately lose access to the system.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Are you sure you want to delete the following admin user?
                                </p>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Name:</p>
                                    <p className="font-semibold text-gray-900">{deleteAdmin.first_name} {deleteAdmin.last_name}</p>
                                    <p className="text-sm text-gray-600 mt-2">Email:</p>
                                    <p className="font-semibold text-gray-900">{deleteAdmin.email}</p>
                                    <p className="text-sm text-gray-600 mt-2">Role:</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${deleteAdmin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {deleteAdmin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setDeleteAdmin(null)}
                                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAdmin}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteNDAConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setDeleteNDAConfirm(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2" > Delete NDA Document </h3>
                            <p className="text-gray-600 text-sm sm:text-base">Are you sure you want to delete <span className="font-medium">{deleteNDAConfirm.file_name}</span> (Version {deleteNDAConfirm.version})? This action cannot be undone.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button onClick={() => setDeleteNDAConfirm(null)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleDeleteNDA} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {passwordResetDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-[#5530FA]" />
                                    Reset Password
                                </h2>
                                <button
                                    onClick={resetPasswordResetDialog}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={sendingResetLink}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Password Reset Via Email</h4>
                                            <p className="text-sm text-blue-800">
                                                A password reset link will be sent to your registered email address. After sending the link, you will be automatically logged out for security reasons.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Reset link will be sent to:</p>
                                    <p className="text-base font-semibold text-gray-900">{getCurrentAdmin()?.email}</p>
                                </div>

                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-amber-900 mb-1">Important</h4>
                                            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                                                <li>You will be logged out immediately</li>
                                                <li>Check your email for the reset link</li>
                                                <li>The reset link expires in 1 hour</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {resetLinkError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{resetLinkError}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={resetPasswordResetDialog}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={sendingResetLink}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendPasswordResetLink}
                                    disabled={sendingResetLink}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingResetLink ? 'Sending Link...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                        <Icon
                            icon="solar:settings-bold-duotone"
                            className="w-7 h-7"
                        />
                    </div>
                    <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">Settings</h1>
                </div>
                <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">Configure Protonest&apos;s system preferences, branding, and other admin-only features.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-lg md:text-[22px] font-medium text-[#6c6c6c] mb-4 font-poppins">Admin Users & Access Control</h2>


                {!isSuperAdmin() && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-amber-900 mb-1">Limited Access</h4>
                                <p className="text-sm text-amber-800">
                                    Only super admins can create new admin users or delete existing admins. Contact your super admin if you need to manage admin users.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold text-[#6c6c6c]/80 font-poppins">Current Admin Users ({admins.length})</h3>
                        {isSuperAdmin() && (
                            <button
                                onClick={openAddAdminDialog}
                                className="px-4 py-2 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white text-sm font-semibold font-montserrat hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Add New Admin
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-[#4e4e4e] uppercase tracking-wider">Admin Name</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-[#4e4e4e] uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-[#4e4e4e] uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-[#4e4e4e] uppercase tracking-wider">Last Login</th>
                                    <th className="px-4 py-3 text-center text-[11px] font-medium text-[#4e4e4e] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {admins.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="px-4 py-3 text-[11px] font-medium text-[#676767]">{admin.first_name} {admin.last_name}</td>
                                        <td className="px-4 py-3 text-[11px] font-medium text-[#676767]">{admin.email}</td>
                                        <td className="px-4 py-3 text-[11px] font-medium text-[#676767]">
                                            <span className={`px-2 py-1 rounded-full text-xs ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] font-medium text-[#676767]">{formatDate(admin.last_login || admin.created_at)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {isSuperAdmin() && admin.role !== 'super_admin' && admin.id !== getCurrentAdmin()?.id && (
                                                    <button
                                                        onClick={() => setDeleteAdmin(admin)}
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete admin"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {admin.role === 'super_admin' && (
                                                    <span className="text-xs text-gray-400 italic">Protected</span>
                                                )}
                                                {admin.id === getCurrentAdmin()?.id && admin.role !== 'super_admin' && (
                                                    <span className="text-xs text-gray-400 italic">You</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg md:text-[22px] font-medium text-[#6c6c6c] mb-4 font-poppins">Compliance & Legal - NDA Management</h2>

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-6">
                    <h3 className="text-base font-semibold text-[#6c6c6c]/80 mb-4 font-poppins flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload New NDA Document
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                            <input type="text" value={ndaDescription} onChange={(e) => setNdaDescription(e.target.value)} placeholder="e.g., Updated terms for 2025" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none" maxLength={200} />
                        </div>
                        <button onClick={() => ndaFileInputRef.current?.click()} disabled={uploadingNDA} className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            {uploadingNDA ? 'Uploading...' : 'Upload New NDA (PDF, Max 10MB)'}
                        </button>
                        <input ref={ndaFileInputRef} type="file" accept=".pdf" onChange={handleUploadNDA} className="hidden" />
                    </div>
                </div>

                {activeNDA && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] p-4 sm:p-6 lg:p-8 mb-6 border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-800 font-poppins">Currently Active NDA</h3>
                        </div>
                        <div className="bg-white rounded-xl p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-5 h-5 text-[#5530FA]" />
                                        <p className="text-base font-semibold text-gray-800">{activeNDA.file_name}</p>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">v{activeNDA.version}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1 ml-7">
                                        <p>Size: {formatFileSize(activeNDA.file_size)}</p>
                                        <p>Uploaded: {formatDate(activeNDA.uploaded_at)}</p>
                                        {activeNDA.description && <p className="text-gray-700 italic">&quot;{activeNDA.description}&quot;</p>}
                                    </div>
                                </div>
                                <button onClick={() => handleDownloadNDA(activeNDA.download_url)} className="ml-4 p-2 text-[#5530FA] hover:bg-purple-50 rounded-lg transition-colors" title="Download NDA">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8">
                    <h3 className="text-base font-semibold text-[#6c6c6c]/80 mb-4 font-poppins">All NDA Documents ({ndaDocuments.length})</h3>
                    <div className="space-y-4">
                        {ndaDocuments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No NDA documents uploaded yet</p>
                            </div>
                        ) : (
                            ndaDocuments.map((doc) => (
                                <div key={doc.id} className={`border rounded-xl p-4 transition-all ${doc.is_active ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-5 h-5 text-[#5530FA] flex-shrink-0" />
                                                <p className="text-sm font-semibold text-gray-800 truncate">{doc.file_name}</p>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${doc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>v{doc.version}</span>
                                                {doc.is_active && <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex-shrink-0">ACTIVE</span>}
                                            </div>
                                            <div className="text-xs text-gray-600 space-y-1 ml-7">
                                                <p>Size: {formatFileSize(doc.file_size)} • Uploaded: {formatDate(doc.uploaded_at)}</p>
                                                {editingDescription === doc.id ? (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <input type="text" value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)} className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none" placeholder="Enter description" maxLength={200} />
                                                        <button onClick={() => handleUpdateDescription(doc.id)} disabled={updatingDescription} className="px-3 py-1 bg-[#5530FA] text-white text-xs rounded hover:opacity-90 disabled:opacity-50">{updatingDescription ? 'Saving...' : 'Save'}</button>
                                                        <button onClick={() => { setEditingDescription(null); setDescriptionText(''); }} className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-gray-700 italic">{doc.description || 'No description'}</p>
                                                        <button onClick={() => { setEditingDescription(doc.id); setDescriptionText(doc.description || ''); }} className="text-[#5530FA] hover:text-[#4520d9] p-1" title="Edit description">
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => handleDownloadNDA(doc.download_url)} className="p-2 text-[#5530FA] hover:bg-purple-50 rounded-lg transition-colors" title="Download">
                                                <Download className="w-5 h-5" />
                                            </button>
                                            {!doc.is_active && (
                                                <>
                                                    <button onClick={() => handleSetActiveNDA(doc.id)} disabled={activatingNDA === doc.id} className="px-3 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" title="Set as active">{activatingNDA === doc.id ? 'Activating...' : 'Set Active'}</button>
                                                    <button onClick={() => setDeleteNDAConfirm(doc)} disabled={deletingNDA === doc.id} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg md:text-[22px] font-medium text-[#6c6c6c] mb-4 font-poppins">Account & Security</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8">
                    <button onClick={() => setPasswordResetDialog(true)} className="w-full text-left px-6 py-4 text-[#6c6c6c]/80 text-base font-normal font-poppins hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        Reset Password
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;