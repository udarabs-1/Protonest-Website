"use client";

import {
    ChevronRight,
    Edit,
    Eye,
    LogOut,
    Menu,
    Search,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Updated interface to match CandidateManagement structure
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

const NDAComplianceLog = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ndaRecords, setNdaRecords] = useState<NDARecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [editingNote, setEditingNote] = useState<{ id: string; note: string } | null>(null);
    const [sendingNDA, setSendingNDA] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin-signin');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin-signin');
    };

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/pipeline' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Updated to use the same API endpoint as CandidateManagement
    useEffect(() => {
        const fetchNDARecords = async () => {
            try {
                setLoading(true);
                const adminToken = localStorage.getItem('adminToken');

                // Use the same endpoint as CandidateManagement page
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
    }, []);

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

    // Handle adding a filter
    const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const trimmedInput = searchInput.trim();
            if (!activeFilters.includes(trimmedInput)) {
                setActiveFilters([...activeFilters, trimmedInput]);
            }
            setSearchInput('');
        }
    };

    // Handle removing a filter
    const handleRemoveFilter = (filterToRemove: string) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

    // Helper functions
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

    // Updated to match CandidateManagement NDA status display
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

    // Updated API functions to use new endpoint structure
    const sendNDA = async (recordId: string, notes?: string) => {
        try {
            setSendingNDA(recordId);
            const adminToken = localStorage.getItem('adminToken');

            // Updated to match CandidateManagement endpoint structure
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/nda/send`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ compliance_notes: notes || '' })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to send NDA');
            }

            // Update local state instead of full reload
            setNdaRecords(prev => prev.map(record =>
                record.id === recordId
                    ? {
                        ...record,
                        nda_status: {
                            status: 'sent',
                            sent_on: new Date().toISOString(),
                            compliance_notes: notes || '',
                            resend_count: record.nda_status?.resend_count || 0,
                            created_at: record.nda_status?.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    }
                    : record
            ));

            alert('NDA sent successfully!');
        } catch (error) {
            console.error('Error sending NDA:', error);
            alert('Failed to send NDA');
        } finally {
            setSendingNDA(null);
        }
    };

    const resendNDA = async (recordId: string, notes?: string) => {
        try {
            setSendingNDA(recordId);
            const adminToken = localStorage.getItem('adminToken');

            // Updated to match CandidateManagement endpoint structure
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/nda/resend`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ compliance_notes: notes || '' })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to resend NDA');
            }

            // Update local state
            setNdaRecords(prev => prev.map(record =>
                record.id === recordId && record.nda_status
                    ? {
                        ...record,
                        nda_status: {
                            ...record.nda_status,
                            sent_on: new Date().toISOString(),
                            compliance_notes: notes || record.nda_status.compliance_notes || '',
                            resend_count: (record.nda_status.resend_count || 0) + 1,
                            updated_at: new Date().toISOString()
                        }
                    }
                    : record
            ));

            alert('NDA resent successfully!');
        } catch (error) {
            console.error('Error resending NDA:', error);
            alert('Failed to resend NDA');
        } finally {
            setSendingNDA(null);
        }
    };

    // Updated to use new candidate structure endpoint
    const updateNDAStatus = async (recordId: string, statusUpdate: NDAStatusUpdate) => {
        try {
            setUpdatingStatus(recordId);
            const adminToken = localStorage.getItem('adminToken');

            // Use the candidate status update endpoint
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/admin/${recordId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'hired', // Assuming NDA completion means hired
                        notes: statusUpdate.compliance_notes
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update NDA status');
            }

            // Update local state
            setNdaRecords(prev => prev.map(record =>
                record.id === recordId
                    ? {
                        ...record,
                        nda_status: {
                            status: statusUpdate.status,
                            sent_on: record.nda_status?.sent_on,
                            submitted_on: statusUpdate.status === 'submitted' ? new Date().toISOString() : record.nda_status?.submitted_on,
                            compliance_notes: statusUpdate.compliance_notes || record.nda_status?.compliance_notes,
                            resend_count: record.nda_status?.resend_count || 0,
                            created_at: record.nda_status?.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    }
                    : record
            ));

            alert('NDA status updated successfully!');
        } catch (error) {
            console.error('Error updating NDA status:', error);
            alert('Failed to update NDA status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleActionClick = (record: NDARecord) => {
        const action = getActionButton(record);

        switch (action.action) {
            case 'send':
                if (confirm(`Send NDA to ${record.user.name}?`)) {
                    sendNDA(record.id);
                }
                break;
            case 'resend':
                if (confirm(`Resend NDA to ${record.user.name}?`)) {
                    resendNDA(record.id);
                }
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
        if (confirm(`Change NDA status to ${newStatus.replace('_', ' ')} for ${record.user.name}?`)) {
            updateNDAStatus(record.id, { status: newStatus });
        }
    };

    // Updated filter with null safety
    const filteredRecords = ndaRecords.filter(record => {
        if (!record) return false;

        // If no filters, show all records
        if (activeFilters.length === 0) return true;

        // Check if record matches ANY of the active filters
        return activeFilters.some(filter => {
            const lowerFilter = filter.toLowerCase();

            // Search in candidate name (with null check)
            if (record.user?.name && record.user.name.toLowerCase().includes(lowerFilter)) return true;

            // Search in job title (with null check)
            if (record.job?.title && record.job.title.toLowerCase().includes(lowerFilter)) return true;

            // Search in email (with null check)
            if (record.user?.email && record.user.email.toLowerCase().includes(lowerFilter)) return true;

            // Search in NDA status
            if (record.nda_status?.status && record.nda_status.status.toLowerCase().includes(lowerFilter)) return true;

            return false;
        });
    });

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
            {/* Logout Confirmation Dialog */}
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

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
            )}

            {/* Header */}
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

                        {/* Header Actions - Only Settings Button */}
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
                    {/* Sidebar - Mobile */}
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
                                        <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                        <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

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
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                ✍️ NDA & Compliance Log
                            </h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and track all NDA requests and submissions across job roles. This helps ensure that freelancers complete compliance requirements before onboarding.
                            </p>
                        </div>

                        {/* Search Bar */}
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

                        {/* Active Filters Display */}
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

                        {/* NDA Records Table */}
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
                                                                disabled={sendingNDA === record.id || updatingStatus === record.id}
                                                                className={`px-3 py-1 rounded-[15px] text-[10px] font-medium font-poppins transition-opacity ${actionButton.variant === 'primary'
                                                                    ? 'bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white hover:opacity-90'
                                                                    : actionButton.variant === 'secondary'
                                                                        ? 'bg-orange-500 text-white hover:opacity-90'
                                                                        : 'bg-gray-500 text-white hover:opacity-90'
                                                                    } ${(sendingNDA === record.id || updatingStatus === record.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {(sendingNDA === record.id || updatingStatus === record.id) ? 'Processing...' : actionButton.text}
                                                            </button>
                                                            <div className="flex items-center gap-1 ml-2">
                                                                <button
                                                                    onClick={() => {
                                                                        // Navigate to candidate details
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

            {/* Edit Note Modal */}
            {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingNote(null)}></div>
                    <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
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
        </div>
    );
};

export default NDAComplianceLog;