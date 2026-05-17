"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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

    const checkAuthAndFetch = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/signin');
            return;
        }

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
            setError(null);
            
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
                setApplyForm({ leave_type: employeeStatus === 'pre_boarding' ? 'unpaid' : 'annual', start_date: '', end_date: '', reason: '', half_day: false });
                checkAuthAndFetch(); // Refresh data
            } else {
                setError(data.message || 'Failed to submit leave request');
            }
        } catch {
            setError('An error occurred while submitting');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelLeave = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this leave request?')) return;
        
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
                        onClick={() => { setApplyForm(f => ({ ...f, leave_type: employeeStatus === 'pre_boarding' ? 'unpaid' : 'annual' })); setShowApplyModal(true); }}
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

                {/* Balances */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {balances.length === 0 ? (
                        <div className="col-span-full p-6 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                            No leave balances found for current year.
                        </div>
                    ) : (
                        balances.map(bal => (
                            <div key={bal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{bal.leave_type.replace('_', ' ')}</h3>
                                <div className="text-3xl font-bold text-gray-900 mt-2">{bal.remaining} <span className="text-sm font-normal text-gray-400">days left</span></div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs">
                                    <span className="text-gray-500">Allocated: <strong className="text-gray-800">{bal.total_allocated + bal.carried_forward}</strong></span>
                                    <span className="text-gray-500">Used: <strong className="text-gray-800">{bal.used}</strong></span>
                                </div>
                            </div>
                        ))
                    )}
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
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{req.leave_type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{req.days}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={req.reason}>
                                                {req.reason || '-'}
                                                {req.manager_comment && (
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
                                                        onClick={() => handleCancelLeave(req.id)}
                                                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        Cancel
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
                                            <option value="annual">Annual Leave</option>
                                            <option value="sick">Sick Leave</option>
                                            <option value="casual">Casual Leave</option>
                                            <option value="unpaid">Unpaid Leave</option>
                                            <option value="other">Other</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            
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
                            
                            <label className="flex items-center gap-2 cursor-pointer mt-2">
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
        </DashboardLayout>
    );
}
