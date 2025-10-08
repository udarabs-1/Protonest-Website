"use client";

import {
    Bell,
    CheckCircle,
    ChevronRight,
    Download,
    Edit2,
    FileText,
    Lock,
    LogOut,
    Menu,
    Settings,
    Shield,
    Trash2,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const AdminSettings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [ndaDocuments, setNdaDocuments] = useState<NDADocument[]>([]);
    const [activeNDA, setActiveNDA] = useState<NDADocument | null>(null);
    const [uploadingNDA, setUploadingNDA] = useState(false);
    const [editingDescription, setEditingDescription] = useState<string | null>(null);
    const [descriptionText, setDescriptionText] = useState('');
    const [updatingDescription, setUpdatingDescription] = useState(false);
    const [activatingNDA, setActivatingNDA] = useState<string | null>(null);
    const [deletingNDA, setDeletingNDA] = useState<string | null>(null);
    const [ndaDescription, setNdaDescription] = useState('');
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null);
    const [deleteNDAConfirm, setDeleteNDAConfirm] = useState<NDADocument | null>(null);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const ndaFileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                const adminsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/all`, {
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
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

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
            return { id: payload.id, role: payload.role };
        } catch {
            return null;
        }
    };

    const isSuperAdmin = () => {
        const currentAdmin = getCurrentAdmin();
        return currentAdmin?.role === 'super_admin';
    };

    const handleAddAdmin = async () => {
        if (!newAdminEmail.trim()) {
            alert('Please enter an email address');
            return;
        }

        if (!isSuperAdmin()) {
            alert('Only super admins can add new admins');
            return;
        }

        try {
            setAddingAdmin(true);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ email: newAdminEmail.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add admin');
            }

            const data = await response.json();
            setAdmins([...admins, data.data]);
            setNewAdminEmail('');
            alert('Admin added successfully! A temporary password has been sent to their email.');
        } catch (err) {
            console.error('Error adding admin:', err);
            alert(err instanceof Error ? err.message : 'Failed to add admin');
        } finally {
            setAddingAdmin(false);
        }
    };

    const handleDeleteAdmin = async () => {
        if (!deleteAdmin) return;

        if (!isSuperAdmin()) {
            alert('Only super admins can delete admins');
            return;
        }

        try {
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${deleteAdmin.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (!response.ok) {
                throw new Error('Failed to delete admin');
            }

            setAdmins(admins.filter(a => a.id !== deleteAdmin.id));
            setDeleteAdmin(null);
            alert('Admin deleted successfully');
        } catch (err) {
            console.error('Error deleting admin:', err);
            alert('Failed to delete admin');
        }
    };

    const handleUploadNDA = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
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
            alert('NDA uploaded successfully');
        } catch (err) {
            console.error('Error uploading NDA:', err);
            alert(err instanceof Error ? err.message : 'Failed to upload NDA');
        } finally {
            setUploadingNDA(false);
            if (ndaFileInputRef.current) {
                ndaFileInputRef.current.value = '';
            }
        }
    };

    const handleUpdateDescription = async (documentId: string) => {
        if (!descriptionText.trim()) {
            alert('Description cannot be empty');
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
            alert('Description updated successfully');
        } catch (err) {
            console.error('Error updating description:', err);
            alert(err instanceof Error ? err.message : 'Failed to update description');
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

            alert('Document activated successfully');
        } catch (err) {
            console.error('Error activating document:', err);
            alert(err instanceof Error ? err.message : 'Failed to activate document');
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
            alert('Document deleted successfully');
        } catch (err) {
            console.error('Error deleting document:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete document');
        } finally {
            setDeletingNDA(null);
        }
    };

    const handleDownloadNDA = (url: string) => {
        window.open(url, '_blank');
    };

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            alert('Password changed successfully');
            setPasswordDialog(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            console.error('Error changing password:', err);
            alert(err instanceof Error ? err.message : 'Failed to change password');
        }
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
        <div className="font-poppins min-h-screen bg-white relative">
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="w-[100px] lg:w-[130px] relative">
                                <Image src="/logo.png" alt="Protonest Logo" width={130} height={80} className="object-contain" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>
                            <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                <Image src="/profile-1.svg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div ref={sidebarRef} className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex justify-between items-center p-4">
                            <Link href="/" className="w-[100px] relative">
                                <Image src="/logo.png" alt="Protonest Logo" width={100} height={60} className="object-contain" />
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="overflow-y-auto h-full p-4">
                            <nav className="space-y-1">
                                {sidebarItems.map((item, index) => (
                                    <Link key={index} href={item.path} onClick={() => setSidebarOpen(false)} className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-8">
                                <Link href="/logout" className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 lg:mr-auto">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <nav className="p-4 space-y-1">
                                {sidebarItems.map((item, index) => (
                                    <Link key={index} href={item.path} className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 pt-8">
                                <Link href="/logout" className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                    <LogOut className="w-5 h-5 mr-4" />
                                    <span className="font-normal">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                        <div className="flex items-center mb-6">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100">
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Settings</span>
                            </nav>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">⚙️ Settings</h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">Configure Protonest&apos;s system preferences, branding, and other admin-only features.</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg md:text-[22px] font-medium text-[#6c6c6c] mb-4 font-poppins">Admin Users & Access Control</h2>
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8 mb-6">
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
                                                        <span className={`px-2 py-1 rounded-full ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-[11px] font-medium text-[#676767]">{formatDate(admin.last_login || admin.created_at)}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {isSuperAdmin() && admin.role !== 'super_admin' && (
                                                                <button onClick={() => setDeleteAdmin(admin)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete admin">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!isSuperAdmin() && (
                                    <p className="text-right text-[9px] text-red-600 mt-4 font-medium">Only super admin can do these actions</p>
                                )}
                            </div>

                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6 lg:p-8">
                                <h3 className="text-base font-semibold text-[#6c6c6c]/80 mb-4 font-poppins">Add New Admin</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="Enter new admin email here" disabled={!isSuperAdmin()} className="w-full px-6 py-4 bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] text-[#6c6c6c]/80 text-base font-normal font-poppins disabled:opacity-50" />
                                        <p className="text-right text-xs text-[#6c6c6c]/80 mt-1">{newAdminEmail.length}/50</p>
                                    </div>
                                    <button onClick={handleAddAdmin} disabled={addingAdmin || !isSuperAdmin()} className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                        {addingAdmin ? 'Adding...' : 'Add New Admin'}
                                    </button>
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
                                <button onClick={() => setPasswordDialog(true)} className="w-full text-left px-6 py-4 text-[#6c6c6c]/80 text-base font-normal font-poppins hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                                    <Lock className="w-5 h-5" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {deleteAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteAdmin(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Admin User</h3>
                            <p className="text-gray-600 text-sm sm:text-base">Are you sure you want to delete <span className="font-medium">{deleteAdmin.first_name} {deleteAdmin.last_name}</span> ({deleteAdmin.email})? This action cannot be undone.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button onClick={() => setDeleteAdmin(null)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleDeleteAdmin} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteNDAConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteNDAConfirm(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete NDA Document</h3>
                            <p className="text-gray-600 text-sm sm:text-base">Are you sure you want to delete <span className="font-medium">{deleteNDAConfirm.file_name}</span> (Version {deleteNDAConfirm.version})? This action cannot be undone.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button onClick={() => setDeleteNDAConfirm(null)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleDeleteNDA} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {passwordDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setPasswordDialog(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-[#5530FA]" />
                                    Change Password
                                </h2>
                                <button onClick={() => setPasswordDialog(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none" placeholder="Enter current password" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none" placeholder="Enter new password (min 6 characters)" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none" placeholder="Confirm new password" />
                                </div>
                                {passwordData.new_password && passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password && (
                                    <p className="text-red-500 text-sm">Passwords do not match</p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button onClick={() => setPasswordDialog(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleChangePassword} disabled={!passwordData.current_password || !passwordData.new_password || passwordData.new_password !== passwordData.confirm_password} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;