"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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

interface LeaveBalance {
    id: string;
    leave_type: string;
    total_allocated: number;
    used: number;
    remaining: number;
    carried_forward: number;
}

interface LeaveRequest {
    id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: string;
    manager_comment?: string;
    created_at: string;
}

export default function EmployeeLeavePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applyError, setApplyError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [balances, setBalances] = useState<LeaveBalance[]>([]);
    const [history, setHistory] = useState<LeaveRequest[]>([]);
    const [profileImage, setProfileImage] = useState('/profile-1.svg');
    const [employeeStatus, setEmployeeStatus] = useState('active');

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyForm, setApplyForm] = useState({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
        half_day: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [overlayLoading, setOverlayLoading] = useState(false);

    const formatLeaveType = (type: string) => {
        if (type === 'sick') return 'Medical Leave';
        if (type === 'annual') return 'Annual Leave';
        if (type === 'casual' || type === 'half_day') return 'Casual Leave';
        if (type === 'unpaid') return 'Unpaid Leave';
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const formatLeaveTypeShort = (type: string) => {
        if (type === 'sick') return 'Medical';
        if (type === 'annual') return 'Annual';
        if (type === 'casual' || type === 'half_day') return 'Casual';
        if (type === 'unpaid') return 'Unpaid';
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getMergedBalances = (bals: LeaveBalance[]) => {
        const merged: (LeaveBalance & { _merged?: boolean })[] = [];
        let casualEntry: LeaveBalance | null = null;
        let halfDayEntry: LeaveBalance | null = null;
        for (const b of bals) {
            if (b.leave_type === 'casual') casualEntry = b;
            else if (b.leave_type === 'half_day') halfDayEntry = b;
            else merged.push(b);
        }
        if (casualEntry && halfDayEntry) {
            merged.unshift({
                ...casualEntry,
                used: casualEntry.used + halfDayEntry.used,
                remaining: casualEntry.remaining + halfDayEntry.remaining,
                total_allocated: casualEntry.total_allocated + halfDayEntry.total_allocated,
                carried_forward: casualEntry.carried_forward + halfDayEntry.carried_forward,
            });
        } else if (casualEntry) {
            merged.unshift(casualEntry);
        } else if (halfDayEntry) {
            merged.unshift({ ...halfDayEntry, leave_type: 'casual' });
        }
        return merged;
    };

    const checkAuthAndFetch = useCallback(async () => {
        if (isUserTokenExpired()) {
            router.push('/signin');
            return;
        }
        const token = localStorage.getItem('jwtToken');

        try {
            setLoading(true);
            
            // Fetch User profile image first
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (profileRes.ok) {
                const pData = await profileRes.json();
                if (pData.success && pData.user?.profile_image) {
                    setProfileImage(pData.user.profile_image);
                }
            }

            // Fetch balances
            const balRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (balRes.status === 401 || balRes.status === 403) {
                router.push('/dashboard'); // Not an active employee
                return;
            }

            if (balRes.ok) {
                const bData = await balRes.json();
                setBalances(bData.data || []);
                if (bData.employee_status) setEmployeeStatus(bData.employee_status);
            }

            // Fetch history
            const histRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (histRes.ok) {
                const hData = await histRes.json();
                setHistory(hData.data || []);
            }

        } catch (err) {
            setError('Failed to load leave data');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkAuthAndFetch();
    }, [checkAuthAndFetch]);

    const handleApplyLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        
        try {
            setSubmitting(true);
            setApplyError(null);
            setOverlayLoading(true);
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(applyForm)
            });

            const data = await res.json();
            
            if (res.ok) {
                setSuccess('Leave request submitted successfully');
                setShowApplyModal(false);
                setOverlayLoading(false);
                setApplyForm({ leave_type: employeeStatus === 'pre_boarding' ? 'unpaid' : (balances.length > 0 ? balances[0].leave_type : 'unpaid'), start_date: '', end_date: '', reason: '', half_day: false });
                checkAuthAndFetch();
            } else {
                setOverlayLoading(false);
                setApplyError(data.message || 'Failed to submit leave request');
            }
        } catch {
            setOverlayLoading(false);
            setApplyError('An error occurred while submitting');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelLeave = async (id: string) => {
        setCancelConfirmId(null);
        setCancelling(true);
        setOverlayLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/cancel/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setSuccess('Leave request cancelled');
                checkAuthAndFetch();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to cancel');
            }
        } catch {
            setError('Error cancelling request');
        } finally {
            setCancelling(false);
            setOverlayLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA]"></div>
            </div>
        );
    }

    return (
        <DashboardLayout breadcrumbItems={[{ label: 'User Dashboard', href: '/dashboard' }, { label: 'Leave Management' }]} profileImage={profileImage}>
            <div className="font-poppins space-y-6">
                
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <span>{success}</span>
                        <button onClick={() => setSuccess(null)}>✕</button>
                    </div>
                )}

                <div className="flex justify-between items-end flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Icon icon="solar:calendar-date-bold-duotone" className="w-8 h-8 text-[#5530FA]" />
                            Leave Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">View your balances and apply for time off.</p>
                    </div>
                    <button
                        onClick={() => { setApplyForm(f => ({ ...f, leave_type: employeeStatus === 'pre_boarding' ? 'unpaid' : (balances.length > 0 ? balances[0].leave_type : 'unpaid') })); setShowApplyModal(true); }}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                    >
                        Apply for Leave
                    </button>
                </div>

                {employeeStatus === 'pre_boarding' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div>
                            <strong>Pre-boarding Period</strong>
                            <p className="mt-0.5 text-blue-700">Your account is in pre-boarding status. You can only apply for <strong>Unpaid Leave</strong> until your join date is confirmed and your status is set to Active by HR.</p>
                        </div>
                    </div>
                )}

                {/* Leaves Taken */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Leaves Taken</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {balances.length === 0 ? (
                            <div className="col-span-full p-4 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                No leave data found for current year.
                            </div>
                        ) : (
                            getMergedBalances(balances).map(bal => (
                                <div key={bal.leave_type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                                    <div className="text-2xl font-bold text-gray-900">{bal.used}</div>
                                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-1">{formatLeaveType(bal.leave_type)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Leave Balances */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Leave Balances</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getMergedBalances(balances).filter(b => b.leave_type !== 'unpaid').length === 0 ? (
                            <div className="col-span-full p-4 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                No leave balances found for current year. You may apply for Unpaid Leave.
                            </div>
                        ) : (
                            getMergedBalances(balances)
                                .filter(b => b.leave_type !== 'unpaid')
                                .map(bal => (
                                    <div key={bal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{formatLeaveType(bal.leave_type)}</h3>
                                        <div className="text-3xl font-bold text-gray-900 mt-2">{bal.remaining} <span className="text-sm font-normal text-gray-400">days left</span></div>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs">
                                            <span className="text-gray-500">Allocated: <strong className="text-gray-800">{bal.total_allocated + bal.carried_forward}</strong></span>
                                            <span className="text-gray-500">Used: <strong className="text-gray-800">{bal.used}</strong></span>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-gray-900">Leave History</h2>
                    </div>
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No leave requests found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white">
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Days</th>
                                        <th className="px-6 py-4">Reason</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {history.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{formatLeaveTypeShort(req.leave_type)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{req.days}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={req.reason}>
                                                {req.reason && req.manager_comment !== 'Past leave recorded manually' ? req.reason : req.reason || '-'}
                                                {req.manager_comment && req.manager_comment !== 'Past leave recorded manually' && (
                                                    <div className="text-xs text-[#F51DA5] mt-1" title={`Manager: ${req.manager_comment}`}>
                                                        Reply: {req.manager_comment}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {req.status === 'pending' && (
                                                    <button 
                                                        onClick={() => setCancelConfirmId(req.id)}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    >
                                                        Cancel Request
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* Apply Leave Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !submitting && setShowApplyModal(false)}>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full font-poppins" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
                            <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        {applyError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start justify-between">
                                <span>{applyError}</span>
                                <button onClick={() => setApplyError(null)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                            </div>
                        )}

                        <form onSubmit={handleApplyLeave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
                                <select
                                    required
                                    value={applyForm.leave_type}
                                    onChange={e => setApplyForm({...applyForm, leave_type: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5530FA]"
                                >
                                    {employeeStatus === 'pre_boarding' ? (
                                        <option value="unpaid">Unpaid Leave</option>
                                    ) : (
                                        <>
                                            {getMergedBalances(balances)
                                                .filter(b => b.leave_type !== 'unpaid' && b.remaining > 0)
                                                .map(b => (
                                                    <option key={b.leave_type} value={b.leave_type}>
                                                        {formatLeaveType(b.leave_type)} (Remaining: {b.remaining})
                                                    </option>
                                                ))}
                                            <option value="unpaid">Unpaid Leave</option>
                                        </>
                                    )}
                                </select>
                                {(() => {
                                    const selectedType = applyForm.leave_type;
                                    if (selectedType === 'unpaid') return null;
                                    const bal = getMergedBalances(balances).find(b => b.leave_type === selectedType);
                                    if (!bal || bal.remaining > 0) return null;
                                    return <p className="text-xs text-amber-600 mt-1">⚠ No remaining balance. Consider applying for Unpaid Leave instead.</p>;
                                })()}
                                {applyForm.leave_type === 'casual' && (
                                    <p className="text-xs text-gray-500 mt-1">Casual leave cannot exceed 2 consecutive days.</p>
                                )}
                            </div>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={applyForm.half_day}
                                    onChange={e => setApplyForm({
                                        ...applyForm, 
                                        half_day: e.target.checked,
                                        end_date: e.target.checked ? applyForm.start_date : applyForm.end_date
                                    })}
                                    className="w-4 h-4 text-[#5530FA] rounded border-gray-300 focus:ring-[#5530FA]"
                                />
                                <span className="text-sm font-semibold text-gray-700">Apply for Half-Day Leave</span>
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input 
                                        type="date" required
                                        value={applyForm.start_date}
                                        onChange={e => setApplyForm({...applyForm, start_date: e.target.value, end_date: applyForm.half_day ? e.target.value : applyForm.end_date})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5530FA]"
                                    />
                                </div>
                                {!applyForm.half_day && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                        <input 
                                            type="date" required
                                            value={applyForm.end_date}
                                            onChange={e => setApplyForm({...applyForm, end_date: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5530FA]"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Reason (Optional)</label>
                                <textarea 
                                    rows={3}
                                    value={applyForm.reason}
                                    onChange={e => setApplyForm({...applyForm, reason: e.target.value})}
                                    placeholder="Briefly explain your reason..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5530FA] resize-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowApplyModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />}
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !cancelling && setCancelConfirmId(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full font-poppins z-10">
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Cancel Leave Request?</h3>
                            <p className="text-sm text-gray-500">This will notify your HOD that you have cancelled your request.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setCancelConfirmId(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">Keep Request</button>
                            <button
                                onClick={() => handleCancelLeave(cancelConfirmId)}
                                disabled={cancelling}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancelling && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/20 border-t-white" />}
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blur Overlay Loading */}
            {overlayLoading && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#5530FA]" />
                        <span className="text-sm font-semibold text-gray-700">Processing...</span>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
