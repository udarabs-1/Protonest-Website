"use client";

import DashboardLayout from '@/app/components/dashboard-layout';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ApplicationStatus = 'pending' | 'rejected' | 'shortlisted' | 'interviewed' | 'hired';

interface Application {
    _id: string;
    user_id: string;
    job_id: {
        _id: string;
        title: string;
        category?: string;
    };
    status: ApplicationStatus;
    applied_at: string;
    updated_at: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    postedDate?: string;
    applicationDeadline?: string;
    experience?: string;
    category?: string;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
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
}

interface SuggestedJob {
    category: string;
    job_id: string;
    job_title: string;
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
}

interface PublicJobResponse {
    id: string;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[] | null;
    requirements: string[] | null;
    overview: string;
    status: string;
    created_by: string;
    created_at: string;
}

const categoryToSlugMap: { [key: string]: string } = {
    'Front-End': 'front-end',
    'Back-End': 'back-end',
    'Full-Stack': 'full-stack',
    'Electronics': 'electronics',
    'UI/UX Designing': 'ui-ux-designing',
    'Mechanical Engineering': 'mechanical',
    'Embedded Firmware': 'embedded-firmware',
    'Quality Assurance': 'quality-assurance',
    'Other': 'other-roles'
};

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

const Dashboard = () => {
    const router = useRouter();
    const [savedJobsCount, setSavedJobsCount] = useState(0);
    const [appliedJobsCount, setAppliedJobsCount] = useState(0);
    const [applications, setApplications] = useState<Application[]>([]);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showIncompleteAccountModal, setShowIncompleteAccountModal] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [leaveBalances, setLeaveBalances] = useState<Array<{leave_type:string; total_allocated:number; used:number; remaining:number; carried_forward:number;}>>([]);
    const [leaveHistory, setLeaveHistory] = useState<Array<{id:string; leave_type:string; start_date:string; end_date:string; days:number; reason:string; status:string; created_at:string;}>>([]);
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
    });

    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const [profileResponse, cvResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/info`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            let isNameEmpty = true;
            let hasCv = false;

            if (profileResponse.ok) {
                const data = await profileResponse.json();
                if (data.success && data.user) {
                    const userData = data.user;
                    const firstName = userData.first_name || '';
                    const lastName = userData.last_name || '';
                    setProfileData({
                        id: userData.id,
                        firstName,
                        lastName,
                        email: userData.email || '',
                        jobTitle: userData.job_title || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        profileImage: userData.profile_image || '/profile-1.svg',
                        jobUpdates: userData.job_updates || false,
                        newsletter: userData.newsletter || false,
                        isGoogleUser: userData.is_oauth_user || false,
                    });
                    isNameEmpty = !firstName.trim() && !lastName.trim();
                }
            } else if (profileResponse.status === 401) {
                localStorage.removeItem('jwtToken');
                router.push('/signin');
                return;
            }

            if (cvResponse.ok) {
                const cvData = await cvResponse.json();
                hasCv = !!(cvData.status === 'success' && cvData.data && cvData.data.file_url);
            }

            if (isNameEmpty || !hasCv) {
                setShowIncompleteAccountModal(true);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                setLoading(true);

                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData.user);
                } else if (userResponse.status === 401) {
                    localStorage.removeItem('jwtToken');
                    router.push('/signin');
                    return;
                }

                const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/saved-jobs/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (savedResponse.ok) {
                    const savedData = await savedResponse.json();
                    setSavedJobsCount(savedData.data.count || 0);
                }

                const appliedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (appliedResponse.ok) {
                    const appliedData = await appliedResponse.json();
                    setAppliedJobsCount(appliedData.data.count || 0);
                }

                const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
                    const enrichedApplications = await Promise.all(
                        (applicationsData.data || []).map(async (app: Application) => {
                            try {
                                const jobResponse = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${app.job_id._id}`
                                );
                                if (jobResponse.ok) {
                                    const jobData = await jobResponse.json();
                                    return {
                                        ...app,
                                        job_id: {
                                            ...app.job_id,
                                            category: jobData.data.category
                                        }
                                    };
                                }
                            } catch {
                            }
                            return app;
                        })
                    );
                    setApplications(enrichedApplications);
                }

                const suggestedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cv/suggested-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (suggestedResponse.ok) {
                    const suggestedData = await suggestedResponse.json();
                    const suggestedJobsList: SuggestedJob[] = suggestedData.data.suggested_jobs || [];

                    const jobDetailsPromises = suggestedJobsList.map(async (suggestedJob: SuggestedJob) => {
                        try {
                            const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${suggestedJob.job_id}`);
                            if (jobResponse.ok) {
                                const jobData = await jobResponse.json();
                                const publicJob: PublicJobResponse = jobData.data;

                                return {
                                    id: publicJob.id,
                                    title: publicJob.title,
                                    location: publicJob.location,
                                    type: publicJob.type,
                                    description: publicJob.description,
                                    requirements: publicJob.requirements || [],
                                    postedDate: publicJob.created_at,
                                    applicationDeadline: publicJob.deadline,
                                    experience: publicJob.experience,
                                    category: publicJob.category
                                };
                            }
                        } catch {
                        }
                        return null;
                    });

                    const jobDetails = await Promise.all(jobDetailsPromises);
                    setSuggestedJobs(jobDetails.filter(job => job !== null) as Job[]);
                }

                const empRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employees/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (empRes.ok) {
                    const empData = await empRes.json();
                    const emp = empData.status === 'success' && !!empData.data?.employee;
                    setIsEmployee(emp);
                    if (emp) {
                        const [balRes, histRes] = await Promise.all([
                            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/balance`, { headers: { 'Authorization': `Bearer ${token}` } }),
                            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leave/me/history`, { headers: { 'Authorization': `Bearer ${token}` } })
                        ]);
                        if (balRes.ok) { const b = await balRes.json(); setLeaveBalances(b.data || []); }
                        if (histRes.ok) { const h = await histRes.json(); setLeaveHistory(h.data || []); }
                    }
                }
            } catch {
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        fetchUserProfile();
    }, [router]);

    const statsCards = [
        {
            title: 'Saved Jobs',
            value: savedJobsCount.toString(),
            subtitle: "You haven't applied yet",
            type: 'stat',
            path: '/dashboard/saved-jobs'
        },
        {
            title: 'Applied Jobs',
            value: appliedJobsCount.toString(),
            subtitle: 'Track your applications',
            type: 'stat',
            path: '/dashboard/applied-jobs'
        }
    ];

    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatLeaveType = (type: string) => {
        if (type === 'sick') return 'Medical Leave';
        if (type === 'annual') return 'Annual Leave';
        if (type === 'casual' || type === 'half_day') return 'Casual Leave';
        if (type === 'unpaid') return 'Unpaid Leave';
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getMergedBalances = () => {
        const merged: typeof leaveBalances = [];
        let casualEntry: typeof leaveBalances[0] | null = null;
        let halfDayEntry: typeof leaveBalances[0] | null = null;
        for (const b of leaveBalances) {
            if (b.leave_type === 'casual') casualEntry = b;
            else if (b.leave_type === 'half_day') halfDayEntry = b;
            else merged.push(b);
        }
        if (casualEntry && halfDayEntry) {
            merged.unshift({ ...casualEntry, used: casualEntry.used + halfDayEntry.used, remaining: casualEntry.remaining + halfDayEntry.remaining, total_allocated: casualEntry.total_allocated + halfDayEntry.total_allocated, carried_forward: casualEntry.carried_forward + halfDayEntry.carried_forward });
        } else if (casualEntry) { merged.unshift(casualEntry); }
        else if (halfDayEntry) { merged.unshift({ ...halfDayEntry, leave_type: 'casual' }); }
        return merged.filter(b => b.leave_type !== 'unpaid');
    };

    const getLeaveStatusColor = (status: string) => {
        if (status === 'approved') return 'bg-green-100 text-green-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        if (status === 'pending') return 'bg-amber-100 text-amber-700';
        return 'bg-gray-100 text-gray-600';
    };

    const recentLeaves = leaveHistory.filter(r => {
        const created = new Date(r.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return created >= sevenDaysAgo;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'User Dashboard', href: '/dashboard' },
        { label: 'Dashboard Overview' }
    ];

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileData.profileImage}>
            {showIncompleteAccountModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-8 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5530fa] to-[#f51da5] flex items-center justify-center">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h2 className="text-xl font-semibold text-[#6c6c6c] font-montserrat text-center">Account Details Empty</h2>
                        <p className="text-base text-[#6c6c6c] font-poppins text-center leading-relaxed">
                            Your account details are empty! Fill in your details and upload your CV to proceed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => { setShowIncompleteAccountModal(false); router.push('/dashboard/resubmit-cv'); }}
                                className="flex-1 px-4 py-2 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] text-white text-sm font-semibold font-montserrat transition-all"
                            >
                                Fill Details
                            </button>
                            <button
                                onClick={() => setShowIncompleteAccountModal(false)}
                                className="flex-1 px-4 py-2 rounded-[57px] border-2 border-gray-300 text-gray-500 text-sm font-medium font-poppins hover:bg-gray-50 transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-[#6c6c6c] font-['Montserrat']">
                    Welcome back, {user?.first_name || 'User'} 👋
                </h1>
                <p className="text-sm text-gray-400 font-poppins mt-1">Here&apos;s a summary of your activity</p>
            </div>

            <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href="/dashboard/resubmit-cv" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5530fa]/10 to-[#f51da5]/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5530fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#5530fa] transition-colors">Update Personal Details</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">CV & contact info</p>
                        </div>
                    </Link>
                    <Link href="/dashboard/profile" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5530fa]/10 to-[#f51da5]/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f51da5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#f51da5] transition-colors">Account & Security</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Preferences & password</p>
                        </div>
                    </Link>
                    {isEmployee && (
                        <Link href="/dashboard/leave" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5530fa]/10 to-[#f51da5]/10 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5530fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-700 group-hover:text-[#5530fa] transition-colors">Apply for Leave</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Manage your leaves</p>
                            </div>
                        </Link>
                    )}
                    {isEmployee && (
                        <Link href="/dashboard/hris" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5530fa]/10 to-[#f51da5]/10 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f51da5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-700 group-hover:text-[#f51da5] transition-colors">HRIS Profile</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">HR information</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {isEmployee && (
                <>
                    {recentLeaves.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Leave Updates <span className="text-[10px] font-normal text-gray-400 normal-case ml-1">(last 7 days)</span></h2>
                                <Link href="/dashboard/leave" className="text-xs text-[#5530fa] hover:underline flex items-center gap-1">
                                    View all <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="flex flex-col gap-2">
                                {recentLeaves.map(req => (
                                    <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-semibold text-gray-800">{formatLeaveType(req.leave_type)}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(req.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(req.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {req.days} day{req.days !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide self-start sm:self-auto ${getLeaveStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {getMergedBalances().length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Leave Balances</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {getMergedBalances().map(bal => (
                                    <div key={bal.leave_type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{formatLeaveType(bal.leave_type)}</p>
                                        <p className="text-3xl font-bold text-gray-900">{bal.remaining} <span className="text-sm font-normal text-gray-400">days left</span></p>
                                        <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-xs">
                                            <span className="text-gray-400">Allocated: <strong className="text-gray-700">{bal.total_allocated + bal.carried_forward}</strong></span>
                                            <span className="text-gray-400">Used: <strong className="text-gray-700">{bal.used}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Job Updates</h2>
                    <Link href="/dashboard/applied-jobs" className="text-xs text-[#5530fa] hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Job Title</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Applied On</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.length > 0 ? (
                                    applications.map((app, index) => {
                                        const roleSlug = categoryToSlugMap[app.job_id?.category || ''] || 'other-roles';
                                        const statusColors: Record<string, string> = {
                                            pending: 'bg-amber-100 text-amber-700',
                                            shortlisted: 'bg-blue-100 text-blue-700',
                                            interviewed: 'bg-purple-100 text-purple-700',
                                            hired: 'bg-green-100 text-green-700',
                                            rejected: 'bg-red-100 text-red-700',
                                        };
                                        return (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{app.job_id?.title || 'N/A'}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-500">
                                                    {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <Link
                                                        href={`/jobs/${roleSlug}/${app.job_id._id}`}
                                                        className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-full text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                                            No job applications yet. <Link href="/dashboard/all-jobs" className="text-[#5530fa] hover:underline">Browse jobs</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
