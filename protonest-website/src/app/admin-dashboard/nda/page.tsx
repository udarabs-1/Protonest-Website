"use client";

import { Icon } from '@iconify/react';
import {
    ChevronRight,
    Edit,
    Eye,
    Menu,
    Search,
    Settings,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface NDARecord {
    id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    job: {
        _id: string;
        title: string;
    };
    status: string;
    nda_status?: {
        status: 'not_sent' | 'sent' | 'submitted';
        sent_on?: string;
        submitted_on?: string;
        compliance_notes?: string;
        resend_count: number;
        created_at: string;
        updated_at: string;
    };
    added_at: string;
    updated_at: string;
    added_by: string;
    notes?: string;
    interview_date?: string;
    interview_notes?: string;
    rejection_reason?: string;
}

interface NDAStatusUpdate {
    status: 'not_sent' | 'sent' | 'submitted';
    compliance_notes?: string;
}

interface NDADocument {
    id: string;
    download_url: string;
    file_name: string;
    file_size: number;
    version: number;
    uploaded_by: string;
    description?: string;
    is_active: boolean;
    uploaded_at: string;
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

const NDAComplianceLog = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ndaRecords, setNdaRecords] = useState<NDARecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [ndaStatusFilter, setNdaStatusFilter] = useState<'all' | 'submitted' | 'sent' | 'not_sent'>('all');
    const [editingNote, setEditingNote] = useState<{ id: string; note: string } | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [ndaDialog, setNdaDialog] = useState<NDARecord | null>(null);
    const [selectedNda, setSelectedNda] = useState<'template' | 'upload'>('template');
    const [ndaDocuments, setNdaDocuments] = useState<NDADocument[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadingNDA, setUploadingNDA] = useState(false);
    const [ndaSubject, setNdaSubject] = useState('');
    const [ndaBody, setNdaBody] = useState('');
    const [sendingNDA, setSendingNDA] = useState(false);
    const [successDialog, setSuccessDialog] = useState<{ title: string; message: string } | null>(null);
    const [errorDialog, setErrorDialog] = useState<{ title: string; message: string } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const sidebarItems = [
        { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: 'solar:user-bold-duotone', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: 'solar:document-bold-duotone', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: 'mingcute:refresh-3-line', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
        { icon: 'solar:pen-new-square-bold-duotone', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: 'solar:bell-bold-duotone', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: 'solar:document-add-bold-duotone', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: 'solar:magnifer-bold-duotone', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: 'solar:users-group-two-rounded-bold-duotone', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: 'solar:dialog-2-bold-duotone', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: 'solar:settings-bold-duotone', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    const fetchNDADocuments = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch NDA documents');
            }

            const data = await response.json();
            if (data.documents && Array.isArray(data.documents)) {
                setNdaDocuments(data.documents);
                const activeDoc = data.documents.find((doc: NDADocument) => doc.is_active);
                if (activeDoc) {
                    setSelectedTemplate(activeDoc.id);
                }
            }
        } catch (error) {
            console.error('Error fetching NDA documents:', error);
        }
    };

    useEffect(() => {
        const fetchNDARecords = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/nda/all`, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch NDA records');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    const candidatesData = data.data?.nda_logs || data.data || [];
                    setNdaRecords(Array.isArray(candidatesData) ? candidatesData : []);
                } else {
                    throw new Error(data.message || 'Failed to fetch NDA records');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An error occurred while fetching NDA records');
                }
                console.error('Error fetching NDA records:', err);
                setNdaRecords([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNDARecords();
        fetchNDADocuments();
    }, []);

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

    const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const trimmedInput = searchInput.trim();
            if (!activeFilters.includes(trimmedInput)) {
                setActiveFilters([...activeFilters, trimmedInput]);
            }
            setSearchInput('');
        }
    };

    const handleRemoveFilter = (filterToRemove: string) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const getNDAStatusDisplay = (record: NDARecord) => {
        if (!record.nda_status) {
            return { icon: '❌', text: 'Not Sent', color: 'text-red-600' };
        }

        switch (record.nda_status.status) {
            case 'sent':
                return { icon: '🟠', text: 'Sent', color: 'text-orange-600' };
            case 'submitted':
                return { icon: '✅', text: 'Submitted', color: 'text-green-600' };
            default:
                return { icon: '❌', text: 'Not Sent', color: 'text-red-600' };
        }
    };

    const getDaysPending = (record: NDARecord) => {
        if (!record.nda_status?.sent_on || record.nda_status.status === 'submitted') {
            return '-';
        }

        const sentDate = new Date(record.nda_status.sent_on);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - sentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays.toString();
    };

    const getActionButton = (record: NDARecord) => {
        if (!record.nda_status || record.nda_status.status === 'not_sent') {
            return { text: 'Send NDA', action: 'send', variant: 'primary' };
        } else if (record.nda_status.status === 'sent') {
            return { text: 'Resend NDA', action: 'resend', variant: 'secondary' };
        } else {
            return { text: 'Add Note', action: 'note', variant: 'tertiary' };
        }
    };



    const setNdaDialogContent = (record: NDARecord) => {
        const defaultSubject = `Protonest NDA for ${record.job?.title || '[Role Name]'} – Action Required`;
        const defaultBody = `Hello ${record.user?.name?.split(' ')[0] || '[Candidate First Name]'},\n\nWe're excited to move forward with your application for the role of ${record.job?.title || '[Role Name]'} at Protonest.\n\nTo proceed, please review and sign the attached Non-Disclosure Agreement (NDA). Here's what to do:\n\n1. Download and carefully read the attached NDA document\n2. Sign the document electronically or print, sign, and scan\n3. Upload the signed NDA to your candidate portal or reply to this email with the signed document attached\n\nPlease complete this within 3 business days. If you have any questions about the NDA, feel free to reach out.\n\nBest regards,\nProtonest Team`;

        setNdaSubject(defaultSubject);
        setNdaBody(defaultBody);
        setNdaDialog(record);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
            setUploadedFile(file);
        } else {
            setErrorDialog({ title: 'Invalid File', message: 'Please select a PDF file under 10MB' });
        }
    };

    const uploadNDADocument = async (file: File): Promise<string | null> => {
        try {
            setUploadingNDA(true);
            const adminToken = localStorage.getItem('adminToken');

            const formData = new FormData();
            formData.append('document', file);
            formData.append('description', `NDA for ${ndaDialog?.user?.name || 'candidate'}`);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/nda/admin/upload`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload NDA document');
            }

            const data = await response.json();

            if (data.success && data.data?.document_url) {
                await fetchNDADocuments();
                return data.data.document_url;
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Error uploading NDA document:', error);
            setErrorDialog({ title: 'Upload Failed', message: error instanceof Error ? error.message : 'Failed to upload NDA document' });
            return null;
        } finally {
            setUploadingNDA(false);
        }
    };

    const sendNDA = async (recordId: string, ndaDocumentId?: string, uploadedFileUrl?: string) => {
        setSendingNDA(true);
        try {
            const adminToken = localStorage.getItem('adminToken');

            const requestBody: {
                nda_document_id?: string;
                nda_document_url?: string;
                compliance_notes?: string;
                subject: string;
                message: string;
            } = {
                subject: ndaSubject,
                message: ndaBody,
                compliance_notes: ndaBody || ''
            };

            if (selectedNda === 'template' && ndaDocumentId) {
                requestBody.nda_document_id = ndaDocumentId;
            } else if (selectedNda === 'upload' && uploadedFileUrl) {
                requestBody.nda_document_url = uploadedFileUrl;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/nda/send`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send NDA');
            }

            await response.json();

            const record = ndaRecords.find(r => r.id === recordId);
            setNdaRecords(prev => prev.map(record =>
                record.id === recordId
                    ? {
                        ...record,
                        nda_status: {
                            status: 'sent',
                            sent_on: new Date().toISOString(),
                            compliance_notes: ndaBody || '',
                            resend_count: record.nda_status?.resend_count || 0,
                            created_at: record.nda_status?.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    }
                    : record
            ));

            setSuccessDialog({
                title: 'NDA Sent Successfully',
                message: `NDA has been sent to ${record?.user?.name} (${record?.user?.email}) with the PDF attachment.`
            });
            return true;
        } catch (error) {
            console.error('Error sending NDA:', error);
            setErrorDialog({ title: 'Send Failed', message: error instanceof Error ? error.message : 'Failed to send NDA' });
            return false;
        } finally {
            setSendingNDA(false);
        }
    };

    const resendNDA = async (recordId: string, ndaDocumentId?: string, uploadedFileUrl?: string) => {
        setSendingNDA(true);
        try {
            const adminToken = localStorage.getItem('adminToken');

            const requestBody: {
                nda_document_id?: string;
                nda_document_url?: string;
                compliance_notes?: string;
                subject: string;
                message: string;
            } = {
                subject: ndaSubject,
                message: ndaBody,
                compliance_notes: ndaBody || ''
            };

            if (selectedNda === 'template' && ndaDocumentId) {
                requestBody.nda_document_id = ndaDocumentId;
            } else if (selectedNda === 'upload' && uploadedFileUrl) {
                requestBody.nda_document_url = uploadedFileUrl;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/nda/resend`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to resend NDA');
            }

            await response.json();

            const record = ndaRecords.find(r => r.id === recordId);
            setNdaRecords(prev => prev.map(record =>
                record.id === recordId && record.nda_status
                    ? {
                        ...record,
                        nda_status: {
                            ...record.nda_status,
                            sent_on: new Date().toISOString(),
                            compliance_notes: ndaBody || record.nda_status.compliance_notes || '',
                            resend_count: (record.nda_status.resend_count || 0) + 1,
                            updated_at: new Date().toISOString()
                        }
                    }
                    : record
            ));

            setSuccessDialog({
                title: 'NDA Resent Successfully',
                message: `NDA has been resent to ${record?.user?.name} (${record?.user?.email}) with the PDF attachment.`
            });
            return true;
        } catch (error) {
            console.error('Error resending NDA:', error);
            setErrorDialog({ title: 'Resend Failed', message: error instanceof Error ? error.message : 'Failed to resend NDA' });
            return false;
        } finally {
            setSendingNDA(false);
        }
    };

    const updateNDAStatus = async (recordId: string, statusUpdate: NDAStatusUpdate) => {
        try {
            setUpdatingStatus(recordId);
            const adminToken = localStorage.getItem('adminToken');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/nda`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: statusUpdate.status,
                        compliance_notes: statusUpdate.compliance_notes || ''
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update NDA status');
            }

            const refetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/nda/all`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (refetchResponse.ok) {
                const data = await refetchResponse.json();
                if (data.status === 'success') {
                    const candidatesData = data.data?.nda_logs || data.data || [];
                    setNdaRecords(Array.isArray(candidatesData) ? candidatesData : []);
                }
            }

            setSuccessDialog({ title: 'Success', message: 'NDA status updated successfully!' });
        } catch (error) {
            console.error('Error updating NDA status:', error);
            setErrorDialog({ title: 'Update Failed', message: 'Failed to update NDA status' });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleSendNda = async () => {
        if (!ndaDialog) return;

        let ndaDocumentUrl: string | null = null;
        let ndaDocumentId: string | undefined = undefined;

        if (selectedNda === 'upload') {
            if (!uploadedFile) {
                setErrorDialog({ title: 'No File Selected', message: 'Please select a file to upload' });
                return;
            }

            ndaDocumentUrl = await uploadNDADocument(uploadedFile);
            if (!ndaDocumentUrl) {
                return;
            }
        } else {
            if (!selectedTemplate) {
                setErrorDialog({ title: 'No Template Selected', message: 'Please select an NDA template' });
                return;
            }
            ndaDocumentId = selectedTemplate;
        }

        const success = await sendNDA(
            ndaDialog.id,
            ndaDocumentId,
            ndaDocumentUrl || undefined
        );

        if (success) {

            setNdaDialog(null);
            setNdaSubject('');
            setNdaBody('');
            setUploadedFile(null);
            setSelectedNda('template');
            setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
        }
    };

    const handleResendNda = async () => {
        if (!ndaDialog) return;

        let ndaDocumentUrl: string | null = null;
        let ndaDocumentId: string | undefined = undefined;

        if (selectedNda === 'upload') {
            if (!uploadedFile) {
                setErrorDialog({ title: 'No File Selected', message: 'Please select a file to upload' });
                return;
            }

            ndaDocumentUrl = await uploadNDADocument(uploadedFile);
            if (!ndaDocumentUrl) {
                return;
            }
        } else {
            if (!selectedTemplate) {
                setErrorDialog({ title: 'No Template Selected', message: 'Please select an NDA template' });
                return;
            }
            ndaDocumentId = selectedTemplate;
        }

        const success = await resendNDA(
            ndaDialog.id,
            ndaDocumentId,
            ndaDocumentUrl || undefined
        );

        if (success) {

            setNdaDialog(null);
            setNdaSubject('');
            setNdaBody('');
            setUploadedFile(null);
            setSelectedNda('template');
            setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
        }
    };

    const handleActionClick = (record: NDARecord) => {
        const action = getActionButton(record);

        switch (action.action) {
            case 'send':
                setNdaDialogContent(record);
                break;
            case 'resend':
                setNdaDialogContent(record);
                break;
            case 'note':
                const currentNote = record.nda_status?.compliance_notes || '';
                setEditingNote({ id: record.id, note: currentNote });
                break;
        }
    };

    const handleSaveNote = () => {
        if (editingNote) {
            updateNDAStatus(editingNote.id, {
                status: 'submitted',
                compliance_notes: editingNote.note
            });
            setEditingNote(null);
        }
    };

    const handleStatusChange = (record: NDARecord, newStatus: 'not_sent' | 'sent' | 'submitted') => {
        setConfirmDialog({
            title: 'Confirm Status Change',
            message: `Change NDA status to ${newStatus.replace('_', ' ')} for ${record.user.name}?`,
            onConfirm: () => {
                updateNDAStatus(record.id, { status: newStatus });
                setConfirmDialog(null);
            }
        });
    };

    const filteredRecords = ndaRecords.filter(record => {
        if (!record) return false;

        const matchesStatusFilter = ndaStatusFilter === 'all' ||
            (record.nda_status?.status === ndaStatusFilter) ||
            (!record.nda_status && ndaStatusFilter === 'not_sent');

        if (!matchesStatusFilter) return false;

        if (activeFilters.length === 0) return true;

        return activeFilters.some(filter => {
            const lowerFilter = filter.toLowerCase();

            if (record.user?.name && record.user.name.toLowerCase().includes(lowerFilter)) return true;
            if (record.job?.title && record.job.title.toLowerCase().includes(lowerFilter)) return true;
            if (record.user?.email && record.user.email.toLowerCase().includes(lowerFilter)) return true;
            if (record.nda_status?.status && record.nda_status.status.toLowerCase().includes(lowerFilter)) return true;

            return false;
        });
    });

    const getStatusCounts = () => {
        const counts = {
            all: ndaRecords.length,
            submitted: ndaRecords.filter(r => r.nda_status?.status === 'submitted').length,
            sent: ndaRecords.filter(r => r.nda_status?.status === 'sent').length,
            not_sent: ndaRecords.filter(r => !r.nda_status || r.nda_status?.status === 'not_sent').length
        };
        return counts;
    };

    if (loading) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading NDA records...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-[#5530FA] text-white rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="font-poppins min-h-screen bg-white relative">
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


            {showLogoutDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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


            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}


            <header className="bg-white py-4">
                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="w-[100px] lg:w-[130px] relative">
                                <Image
                                    src="/logo.webp"
                                    alt="Protonest Logo"
                                    width={130}
                                    height={80}
                                    className="object-contain"
                                />
                            </Link>
                        </div>


                        <div className="flex items-center">
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>
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
                                    src="/logo.webp"
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
                                            ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white' : 'text-gray-600 hover:bg-gray-50'
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

                            <div className="pt-8">
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


                    <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 lg:mr-auto flex-shrink-0">
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


                    <main className={`flex-1 min-w-0 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">NDA & Compliance Log</span>
                            </nav>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                                    <Icon
                                        icon="solar:pen-new-square-bold-duotone"
                                        className="w-7 h-7"
                                    />
                                </div>
                                <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                                    NDA & Compliance Log
                                </h1>
                            </div>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and track all NDA requests and submissions across job roles. This helps ensure that freelancers complete compliance requirements before onboarding.
                            </p>
                        </div>


                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => setNdaStatusFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${ndaStatusFilter === 'all'
                                    ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All ({getStatusCounts().all})
                            </button>
                            <button
                                onClick={() => setNdaStatusFilter('submitted')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${ndaStatusFilter === 'submitted'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                    }`}
                            >
                                Signed ({getStatusCounts().submitted})
                            </button>
                            <button
                                onClick={() => setNdaStatusFilter('sent')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${ndaStatusFilter === 'sent'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                    }`}
                            >
                                Sent & Not Submitted ({getStatusCounts().sent})
                            </button>
                            <button
                                onClick={() => setNdaStatusFilter('not_sent')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${ndaStatusFilter === 'not_sent'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Not Sent ({getStatusCounts().not_sent})
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={handleAddFilter}
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA]"
                                    placeholder="Type and press Enter to add filter (name, role, email, status...)"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>


                        {activeFilters.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Current Filters:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activeFilters.map((filter, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full text-sm font-medium"
                                        >
                                            <span>{filter}</span>
                                            <button
                                                onClick={() => handleRemoveFilter(filter)}
                                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                                aria-label={`Remove filter: ${filter}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Freelancer Name
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Applied For
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            NDA Status
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Sent On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Submitted On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Days Pending
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Resend Count
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Compliance Notes
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRecords.length > 0 ? (
                                        filteredRecords.map((record) => {
                                            const statusDisplay = getNDAStatusDisplay(record);
                                            const actionButton = getActionButton(record);

                                            return (
                                                <tr key={record.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {record.user?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767] underline">
                                                        <Link href={`/admin-dashboard/jobs/${record.job?._id}`} className="hover:text-[#5530FA]">
                                                            {record.job?.title || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td className={`px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins ${statusDisplay.color}`}>
                                                        {statusDisplay.icon} {statusDisplay.text}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {formatDate(record.nda_status?.sent_on)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {formatDate(record.nda_status?.submitted_on)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {getDaysPending(record)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                        {record.nda_status?.resend_count || 0}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767] max-w-xs truncate">
                                                        {record.nda_status?.compliance_notes || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleActionClick(record)}
                                                                disabled={updatingStatus === record.id}
                                                                className={`px-3 py-1 rounded-[15px] text-[10px] font-medium font-poppins transition-opacity ${actionButton.variant === 'primary'
                                                                    ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white hover:opacity-90'
                                                                    : actionButton.variant === 'secondary'
                                                                        ? 'bg-orange-500 text-white hover:opacity-90'
                                                                        : 'bg-gray-500 text-white hover:opacity-90'
                                                                    } ${updatingStatus === record.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {updatingStatus === record.id ? 'Processing...' : actionButton.text}
                                                            </button>
                                                            <div className="flex items-center gap-1 ml-2">
                                                                <button
                                                                    onClick={() => {

                                                                        window.location.href = `/admin-dashboard/candidates?highlight=${record.id}`;
                                                                    }}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const currentNote = record.nda_status?.compliance_notes || '';
                                                                        setEditingNote({ id: record.id, note: currentNote });
                                                                    }}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="Edit Notes"
                                                                >
                                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                                </button>
                                                                <select
                                                                    value={record.nda_status?.status || 'not_sent'}
                                                                    onChange={(e) => handleStatusChange(record, e.target.value as 'not_sent' | 'sent' | 'submitted')}
                                                                    className="text-xs border border-gray-300 rounded px-1 py-1"
                                                                    title="Change Status"
                                                                    disabled={updatingStatus === record.id}
                                                                >
                                                                    <option value="not_sent">Not Sent</option>
                                                                    <option value="sent">Sent</option>
                                                                    <option value="submitted">Submitted</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-[#676767] text-sm font-poppins">
                                                {activeFilters.length > 0
                                                    ? `No NDA records found matching filters: ${activeFilters.join(', ')}`
                                                    : 'No NDA records found.'
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>


            {editingNote && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setEditingNote(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Edit Compliance Notes
                            </h3>
                            <textarea
                                value={editingNote.note}
                                onChange={(e) => setEditingNote({ ...editingNote, note: e.target.value })}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none"
                                placeholder="Enter compliance notes..."
                                maxLength={500}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {editingNote.note.length}/500 characters
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditingNote(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNote}
                                disabled={updatingStatus === editingNote.id}
                                className="px-4 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updatingStatus === editingNote.id ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {ndaDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={() => setNdaDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] w-full max-w-[979px] max-h-[95vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 sm:p-6 lg:p-8">

                            <div className="mb-6">
                                <h2 className="text-lg sm:text-[22px] font-medium font-poppins text-[#6c6c6c] mb-2">
                                    {getActionButton(ndaDialog).action === 'resend' ? 'Resend' : 'Send'} NDA to Freelancer
                                </h2>
                                <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 leading-[15px]">
                                    You&apos;re about to {getActionButton(ndaDialog).action === 'resend' ? 'resend' : 'send'} a Non-Disclosure Agreement to the selected candidate. You can use an existing template or upload a new file
                                </p>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 text-center">
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1">
                                        {ndaDialog.user?.name || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Candidate</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1 break-all">
                                        {ndaDialog.user?.email || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Email</div>
                                </div>
                                <div>
                                    <div className="text-sm sm:text-base font-medium font-poppins text-[#6c6c6c] mb-1">
                                        {ndaDialog.job?.title || 'N/A'}
                                    </div>
                                    <div className="text-xs sm:text-sm font-light font-poppins text-[#6c6c6c]">Role</div>
                                </div>
                            </div>


                            <div className="mb-6">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">NDA File</h3>

                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="template"
                                                name="ndaType"
                                                checked={selectedNda === 'template'}
                                                onChange={() => setSelectedNda('template')}
                                                className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                            />
                                            <label htmlFor="template" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
                                                Select from previously uploaded NDAs:
                                            </label>
                                        </div>

                                        {selectedNda === 'template' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-7">
                                                {ndaDocuments.length > 0 ? (
                                                    ndaDocuments.map((doc) => (
                                                        <button
                                                            key={doc.id}
                                                            onClick={() => setSelectedTemplate(doc.id)}
                                                            className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[57px] text-xs sm:text-sm font-semibold transition-colors ${selectedTemplate === doc.id
                                                                ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                                                : 'border border-[#5530fa] text-[#4d4d4d]'
                                                                }`}
                                                        >
                                                            {doc.file_name}
                                                            {doc.is_active && (
                                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500 col-span-2">No NDA templates available. Please upload one.</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="upload"
                                                name="ndaType"
                                                checked={selectedNda === 'upload'}
                                                onChange={() => setSelectedNda('upload')}
                                                className="w-4 h-4 text-[#5530fa] bg-gray-100 border-gray-300 focus:ring-[#5530fa] mt-1"
                                            />
                                            <label htmlFor="upload" className="ml-3 text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80">
                                                Upload a New NDA Document:
                                            </label>
                                        </div>

                                        {selectedNda === 'upload' && (
                                            <div className="ml-7">
                                                <div className="border-2 border-dashed border-[#6c6c6c] rounded-[35px] p-6 sm:p-8 text-center">
                                                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-[#6c6c6c] mb-4" />
                                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c] leading-[18px] mb-4">
                                                        Upload the file by drag and drop here or<br />
                                                        click on the browse button<br />
                                                        <span className="block mt-2">Allowed file types: .pdf<br />Max size: 10MB</span>
                                                    </p>
                                                    {uploadedFile && (
                                                        <div className="mb-4 p-2 bg-green-100 rounded-lg">
                                                            <p className="text-xs sm:text-sm text-green-700">Selected: {uploadedFile.name}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={uploadingNDA}
                                                        className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {uploadingNDA ? 'Uploading...' : 'Browse'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="mb-4">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Title</h3>
                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <input
                                        type="text"
                                        value={ndaSubject}
                                        onChange={(e) => setNdaSubject(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80"
                                        placeholder="Enter email subject..."
                                    />
                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-2">{ndaSubject.length}/100</p>
                                </div>
                            </div>


                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-medium font-poppins text-[#6c6c6c] mb-4">Email Body</h3>
                                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-4 sm:p-6">
                                    <textarea
                                        value={ndaBody}
                                        onChange={(e) => setNdaBody(e.target.value)}
                                        rows={8}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5530FA] focus:border-[#5530FA] outline-none text-sm sm:text-base font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed resize-none"
                                        placeholder="Enter email body..."
                                    />
                                    <p className="text-xs font-normal font-poppins text-[#6c6c6c]/80 text-right mt-4">{ndaBody.length}/1000</p>
                                </div>
                            </div>


                            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
                                <button
                                    onClick={() => {
                                        const actionButton = getActionButton(ndaDialog);
                                        if (actionButton.action === 'resend') {
                                            handleResendNda();
                                        } else {
                                            handleSendNda();
                                        }
                                    }}
                                    disabled={sendingNDA || uploadingNDA || (selectedNda === 'template' && !selectedTemplate) || (selectedNda === 'upload' && !uploadedFile)}
                                    className="w-full sm:w-[209px] h-[51px] px-6 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-montserrat disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sendingNDA ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : uploadingNDA ? 'Processing...' : (getActionButton(ndaDialog).action === 'resend' ? 'Resend NDA' : 'Send NDA')}
                                </button>
                                <button
                                    onClick={() => {
                                        setNdaDialog(null);
                                        setNdaSubject('');
                                        setNdaBody('');
                                        setUploadedFile(null);
                                        setSelectedNda('template');
                                        setSelectedTemplate(ndaDocuments.find(doc => doc.is_active)?.id || '');
                                    }}
                                    disabled={uploadingNDA}
                                    className="w-full sm:w-[209px] h-[51px] px-6 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {successDialog && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-white rounded-full p-3">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center">
                                {successDialog.title}
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 text-center mb-6">
                                {successDialog.message}
                            </p>
                            <button
                                onClick={() => setSuccessDialog(null)}
                                className="w-full px-6 py-3 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
            />

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
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{errorDialog.title}</h3>
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


            {confirmDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setConfirmDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl bg-opacity-50"></div>
                    <div
                        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{confirmDialog.title}</h3>
                        <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDialog(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDialog.onConfirm}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NDAComplianceLog;
