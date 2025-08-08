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

interface OngoingProject {
    title: string;
    client: string;
    type: string;
    price: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'awaiting_feedback' | 'in_review';
    description: string;
}

const OngoingProjectCard = ({ project }: { project: OngoingProject }) => {
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'active':
                return { emoji: '🟢', text: 'Active', color: 'outline-[#0fbf0f]' };
            case 'awaiting_feedback':
                return { emoji: '🟠', text: 'Awaiting Feedback', color: 'outline-[#e58300]' };
            case 'in_review':
                return { emoji: '🟡', text: 'In Review', color: 'outline-[#e5c300]' };
            default:
                return { emoji: '🟢', text: 'Active', color: 'outline-[#0fbf0f]' };
        }
    };

    const statusDisplay = getStatusDisplay(project.status);

    return (
        <Link
            href={`/user-dashboard/projects/${project.title.toLowerCase().replace(/ /g, '-')}`}
            className="group relative w-full bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden hover:shadow-lg transition-shadow p-6 flex flex-col"
        >
            {/* Header with Title */}
            <div className="flex justify-between items-start mb-2 pr-10">
                <div className="flex-1">
                    <h3 className="text-base font-medium font-['Poppins'] leading-[35px] line-clamp-2 text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA]">
                        {project.title}
                    </h3>
                </div>
            </div>

            {/* Arrow Images - Absolute positioned */}
            <div className="absolute top-6 right-6">
                <div className="w-[70px] h-[70px] group-hover:hidden">
                    <Image
                        src="/upleft.svg"
                        alt="Arrow"
                        width={70}
                        height={70}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="hidden w-[100px] h-[100px] group-hover:block">
                    <Image
                        src="/upleft-hover.svg"
                        alt="Hover Arrow"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Client */}
            <div className="text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px] mb-4">
                Client: {project.client}
            </div>

            {/* Status Badge */}
            <div className={`inline-flex justify-center items-center gap-2.5 w-fit h-[29px] p-2.5 rounded-[30px] outline-1 outline-offset-[-1px] ${statusDisplay.color} mb-4`}>
                <div className="text-[#83848b] text-[8px] font-normal font-['Poppins'] leading-normal">
                    {statusDisplay.emoji} {statusDisplay.text}
                </div>
            </div>

            {/* Project Details */}
            <div className="flex flex-wrap gap-4 mb-4">
                {/* Price Section */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {project.price}
                    </div>
                    <div className="text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        {project.type}
                    </div>
                </div>

                {/* Start Date Section */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {project.startDate}
                    </div>
                    <div className="text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Start Date
                    </div>
                </div>

                {/* End Date Section */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                        {project.endDate}
                    </div>
                    <div className="text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                        Estimated End Date
                    </div>
                </div>
            </div>

            {/* Project Description */}
            <div className="text-[#6c6c6c] text-[9px] font-medium font-['Poppins'] leading-[18px] line-clamp-2 flex-1">
                {project.description}
            </div>
        </Link>
    );
};

const StatusFilter = ({
    activeFilter,
    onFilterChange
}: {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}) => {
    const filters = [
        { key: 'all', label: '📎 All', emoji: '📎' },
        { key: 'active', label: '🟢 Active', emoji: '🟢' },
        { key: 'awaiting_feedback', label: '🟠 Awaiting Feedback', emoji: '🟠' },
        { key: 'in_review', label: '🟡 In Review', emoji: '🟡' }
    ];

    return (
        <div className="flex gap-2 mb-6 overflow-x-auto">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-[57px] outline-1 outline-offset-[-1px] outline-[#5530fa] flex items-center gap-2 whitespace-nowrap transition-all ${activeFilter === filter.key
                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                        : 'text-[#6c6c6c] hover:bg-gray-50'
                        }`}
                >
                    <span className="text-xs font-medium font-['Montserrat']">
                        {filter.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/user-dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/user-dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/user-dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/user-dashboard/applied-jobs' },
        { icon: '✍️', label: 'Ongoing Projects', path: '/user-dashboard/projects' },
        { icon: '📨', label: 'Resubmit CV', path: '/user-dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/user-dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/user-dashboard/profile' },
        { icon: '⚙️', label: 'Settings', path: '/user-dashboard/settings' },
    ];

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

    const ongoingProjects: OngoingProject[] = [
        {
            title: 'IoT Environmental Monitoring System',
            client: 'GreenSpark IoT',
            type: 'Fixed-price',
            price: '$2,500',
            startDate: 'May 15, 2025',
            endDate: 'July 10, 2025',
            status: 'active',
            description: 'Developing a comprehensive IoT system for environmental monitoring including temperature, humidity, air quality sensors with real-time data visualization dashboard.',
        },
        {
            title: 'Smart Agriculture Control System',
            client: 'FarmTech Solutions',
            type: 'Fixed-price',
            price: '$3,200',
            startDate: 'April 20, 2025',
            endDate: 'June 30, 2025',
            status: 'awaiting_feedback',
            description: 'Building an automated irrigation and climate control system for greenhouse operations with mobile app integration and predictive analytics.',
        },
        {
            title: 'Industrial Automation Dashboard',
            client: 'Manufacturing Pro',
            type: 'Hourly',
            price: '$45/hr',
            startDate: 'March 10, 2025',
            endDate: 'August 15, 2025',
            status: 'in_review',
            description: 'Creating a comprehensive dashboard for monitoring industrial equipment, predictive maintenance alerts, and production optimization analytics.',
        },
        {
            title: 'Wireless Sensor Network',
            client: 'TechVision Corp',
            type: 'Fixed-price',
            price: '$1,800',
            startDate: 'June 1, 2025',
            endDate: 'September 20, 2025',
            status: 'active',
            description: 'Designing and implementing a mesh network of wireless sensors for building automation and energy management systems.',
        }
    ];

    const filteredProjects = ongoingProjects.filter(project => {
        const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div>
            <div className="font-poppins min-h-screen bg-white relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {/* Header */}
                <header className="bg-white py-4">
                    <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            {/* Logo - Smaller on mobile */}
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
                                <Link href="/user-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>

                                <Link href="/user-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                    <Link href="/user-dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Ongoing Projects</span>
                                </nav>
                            </div>

                            {/* Ongoing Projects Section */}
                            <div className="mb-8">
                                <div className="flex flex-col mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[25px]">✍️</span>
                                        <h2 className="text-2xl font-medium text-gray-700">Ongoing Projects</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Track your active projects, monitor progress, and manage deliverables with real-time status updates.
                                    </p>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-6 flex items-center gap-3">
                                    <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search for ongoing projects..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                        />
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Status Filters */}
                                <StatusFilter
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                />

                                {/* Ongoing Projects Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredProjects.map((project, index) => (
                                        <OngoingProjectCard key={index} project={project} />
                                    ))}
                                </div>

                                {/* No Results Message */}
                                {filteredProjects.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-lg mb-2">📋</div>
                                        <p className="text-gray-500">No ongoing projects found matching your criteria.</p>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboard;