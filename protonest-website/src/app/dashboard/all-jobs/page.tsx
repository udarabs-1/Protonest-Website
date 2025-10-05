"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    created_at: string;
}

type FilterType = 'experience' | 'location' | 'datePosted' | 'jobType' | 'category';
type Filters = {
    experience: string[];
    location: string[];
    datePosted: string[];
    jobType: string[];
    category: string[];
};

const FilterCheckbox = ({
    isSelected,
    onClick,
    label
}: {
    isSelected: boolean;
    onClick: () => void;
    label: string;
}) => (
    <div className="flex items-center mb-2">
        <button
            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 ${isSelected ? 'outline-2 outline-offset-[-2px] outline-[#5530fa]' : 'border-[#6c6c6c]'
                }`}
            onClick={onClick}
            aria-checked={isSelected}
            role="checkbox"
        >
            {isSelected && (
                <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
            )}
        </button>
        <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">{label}</span>
    </div>
);

const JobCard = ({ job }: { job: Job }) => {
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

    return (
        <Link
            href={`/dashboard/all-jobs/${job.id}`}
            className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between">
                <div className="w-3/4">
                    <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                        {job.title}
                    </h3>
                    <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                        {job.location} ‐ Posted {formatTimeAgo(job.created_at)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">{job.type.replace('-', ' ')}</p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                </div>
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c]">
                        {formatDate(job.deadline)}
                    </p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                </div>
                <div>
                    <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
                        {job.experience}
                    </p>
                    <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                </div>
            </div>

            <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
                <div className="w-full h-full group-hover:hidden">
                    <Image
                        src="/upleft.svg"
                        alt="Arrow"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="hidden w-full h-full group-hover:block">
                    <Image
                        src="/upleft-hover.svg"
                        alt="Hover Arrow"
                        width={50}
                        height={50}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                View Details
            </button>
        </Link>
    );
};

const AllJobsPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        experience: [],
        location: [],
        datePosted: [],
        jobType: [],
        category: []
    });
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '💼', label: 'All Jobs', path: '/dashboard/all-jobs' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
    ];

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

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs`);

                if (response.ok) {
                    const data = await response.json();
                    const jobsData = data.data || [];
                    setJobs(jobsData);
                    setFilteredJobs(jobsData);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (filters.experience.length > 0) {
            filtered = filtered.filter(job => filters.experience.includes(job.experience));
        }
        if (filters.location.length > 0) {
            filtered = filtered.filter(job => filters.location.includes(job.location));
        }
        if (filters.jobType.length > 0) {
            filtered = filtered.filter(job => filters.jobType.includes(job.type));
        }
        if (filters.category.length > 0) {
            filtered = filtered.filter(job => filters.category.includes(job.category));
        }
        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.datePosted.length > 0) {
            filtered.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return filters.datePosted.includes('Newest') ? dateB - dateA : dateA - dateB;
            });
        }

        setFilteredJobs(filtered);
    }, [filters, searchQuery, jobs]);

    const handleFilterToggle = (filterType: FilterType, value: string) => {
        setFilters(prev => {
            const currentFilters = [...prev[filterType]];
            const index = currentFilters.indexOf(value);

            if (index > -1) {
                currentFilters.splice(index, 1);
            } else {
                currentFilters.push(value);
            }

            return {
                ...prev,
                [filterType]: currentFilters
            };
        });
    };

    const clearAllFilters = () => {
        setFilters({
            experience: [],
            location: [],
            datePosted: [],
            jobType: [],
            category: []
        });
    };

    const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
    const uniqueJobTypes = Array.from(new Set(jobs.map(job => job.type)));
    const uniqueCategories = Array.from(new Set(jobs.map(job => job.category)));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="font-poppins min-h-screen bg-white relative">
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

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

                            <div className="flex items-center space-x-4">
                                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                </button>
                                <Link href="/dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>
                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                    <Image
                                        src="/profile-1.svg"
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
                                    <span className="text-[#5C4EC9]">All Jobs</span>
                                </nav>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[25px]">💼</span>
                                    <h2 className="text-2xl font-medium text-gray-700">All Jobs</h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Browse all available job opportunities at Protonest
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                <aside className="w-full lg:w-1/4 hidden lg:block">
                                    <div className="bg-white rounded-xl p-6 shadow-lg">
                                        <h3 className="text-xl font-medium font-poppins text-[#6c6c6c] mb-6">Filter Jobs by</h3>

                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa] transition-colors"
                                        >
                                            Clear All Filters
                                        </button>

                                        <div className="mb-8">
                                            <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Experience Level →</h4>
                                            {['junior', 'intermediate', 'senior', 'expert'].map(level => (
                                                <FilterCheckbox
                                                    key={level}
                                                    isSelected={filters.experience.includes(level)}
                                                    onClick={() => handleFilterToggle('experience', level)}
                                                    label={level}
                                                />
                                            ))}
                                        </div>

                                        {uniqueCategories.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Category →</h4>
                                                {uniqueCategories.map(category => (
                                                    <FilterCheckbox
                                                        key={category}
                                                        isSelected={filters.category.includes(category)}
                                                        onClick={() => handleFilterToggle('category', category)}
                                                        label={category}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {uniqueLocations.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Location →</h4>
                                                {uniqueLocations.map(location => (
                                                    <FilterCheckbox
                                                        key={location}
                                                        isSelected={filters.location.includes(location)}
                                                        onClick={() => handleFilterToggle('location', location)}
                                                        label={location}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Date Posted →</h4>
                                            {['Newest', 'Oldest'].map(date => (
                                                <FilterCheckbox
                                                    key={date}
                                                    isSelected={filters.datePosted.includes(date)}
                                                    onClick={() => handleFilterToggle('datePosted', date)}
                                                    label={date}
                                                />
                                            ))}
                                        </div>

                                        {uniqueJobTypes.length > 0 && (
                                            <div>
                                                <h4 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">Job Type →</h4>
                                                {uniqueJobTypes.map(type => (
                                                    <FilterCheckbox
                                                        key={type}
                                                        isSelected={filters.jobType.includes(type)}
                                                        onClick={() => handleFilterToggle('jobType', type)}
                                                        label={type.replace('-', ' ')}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </aside>

                                <div className="w-full lg:w-3/4">
                                    <div className="relative mb-6 flex items-center gap-3">
                                        <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                            <input
                                                type="text"
                                                placeholder="Search for jobs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                            />
                                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="lg:hidden mb-6">
                                        <button
                                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                                            className="w-full bg-white rounded-[20px] shadow-sm py-3 px-4 text-gray-600 flex items-center justify-between"
                                        >
                                            <span>Filters</span>
                                            <Image
                                                src="/down-arrow.svg"
                                                width={24}
                                                height={24}
                                                alt=""
                                                className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {showMobileFilters && (
                                            <div className="mt-4 bg-white rounded-[20px] shadow-lg p-6">
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa]"
                                                >
                                                    Clear All
                                                </button>
                                                {/* Mobile filters - same structure as desktop */}
                                            </div>
                                        )}
                                    </div>

                                    {filteredJobs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredJobs.map(job => (
                                                <JobCard key={job.id} job={job} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600 text-lg font-poppins">
                                                {searchQuery || Object.values(filters).some(arr => arr.length > 0)
                                                    ? 'No jobs match your filters. Try adjusting your search criteria.'
                                                    : 'No jobs available at the moment.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllJobsPage;