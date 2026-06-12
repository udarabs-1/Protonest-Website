"use client";
import DashboardLayout from '@/app/components/dashboard-layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface ActivityEntry { action: string; old_value?: string; new_value?: string; timestamp: string; }
interface EmployeeProfile {
    employee_id: string; job_title: string; department: string;
    employment_type: string; hod_name: string; hod_email: string; join_date: string;
    work_email?: string; leave_balance: number; status: string;
    probation_end_date?: string; confirmation_status?: string;
    activity_log?: ActivityEntry[];
    user_details?: { first_name: string; last_name: string; email: string; profile_image?: string; };
}

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
const STATUS_COLORS: Record<string, string> = {
    pre_boarding: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-yellow-100 text-yellow-700',
    left: 'bg-gray-100 text-gray-600',
    terminated: 'bg-red-100 text-red-700'
};

export default function HRISProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [profileImage, setProfileImage] = useState('/profile-1.svg');
    const [loading, setLoading] = useState(true);
    const [notEmployee, setNotEmployee] = useState(false);



    useEffect(() => {
        if (isUserTokenExpired()) {
            router.push('/signin');
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) { router.push('/signin'); return; }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employees/me`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (res.ok && data.data?.employee) {
                    setProfile(data.data.employee);
                    if (data.data.employee.user_details?.profile_image) setProfileImage(data.data.employee.user_details.profile_image);
                } else {
                    setNotEmployee(true);
                }
            } catch { setNotEmployee(true); } finally { setLoading(false); }
        };
        fetchProfile();
    }, [router]);


    const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'My HRIS Profile' }];

    if (loading) return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileImage}>
            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>
        </DashboardLayout>
    );

    if (notEmployee || !profile) return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileImage}>
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-5xl mb-4">🏢</div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">No Employee Profile Found</h2>
                <p className="text-sm text-gray-500">Your HRIS profile is not yet set up. Please contact HR.</p>
            </div>
        </DashboardLayout>
    );

    const name = profile.user_details ? `${profile.user_details.first_name} ${profile.user_details.last_name}`.trim() : 'Employee';

    return (
        <DashboardLayout breadcrumbItems={breadcrumbItems} profileImage={profileImage}>
            <div className="font-poppins space-y-6 pb-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={profileImage} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" onError={e => { (e.target as HTMLImageElement).src = '/profile-1.svg'; }} />
                            <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize border border-white ${STATUS_COLORS[profile.status] || 'bg-gray-100 text-gray-600'}`}>{profile.status}</span>
                        </div>
                        <div>
                            <div className="font-mono text-sm font-bold text-[#5530FA] mb-0.5">{profile.employee_id}</div>
                            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                            <p className="text-sm text-gray-500">{profile.user_details?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            ['Job Title', profile.job_title],
                            ['Department', profile.department],
                            ['Employment Type', profile.employment_type === 'full_time' ? 'Full-time' : 'Freelancer'],
                            ...(profile.hod_name ? [['Head of Department', profile.hod_name]] : []),
                            ...(profile.hod_email ? [['HOD Email', profile.hod_email]] : []),
                            ['Join Date', fmt(profile.join_date)],
                            ...(profile.probation_end_date ? [['Probation End Date', fmt(profile.probation_end_date)]] : []),
                            ['Confirmation Status', profile.confirmation_status ? profile.confirmation_status.charAt(0).toUpperCase() + profile.confirmation_status.slice(1) : (profile.status === 'active' ? 'Active' : 'Pre-boarding')],
                            ...(profile.work_email ? [['Work Email', profile.work_email]] : []),
                        ].map(([label, value]) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                                <div className="text-sm font-medium text-gray-800 break-words">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>


                {profile.activity_log && profile.activity_log.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Employment History</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {[...profile.activity_log].reverse().map((entry, i) => (
                                <div key={i} className="flex items-start gap-3 text-xs bg-gray-50 rounded-lg p-3">
                                    <span className="w-2 h-2 mt-1 rounded-full bg-gradient-to-br from-[#5530FA] to-[#F51DA5] shrink-0" />
                                    <div className="flex-1">
                                        <span className="font-medium capitalize text-gray-800">{entry.action.replace(/_/g, ' ')}</span>
                                        {entry.old_value && entry.new_value && <span className="text-gray-400"> · {entry.old_value} → {entry.new_value}</span>}
                                        <div className="text-gray-400 mt-0.5">{fmt(entry.timestamp)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
