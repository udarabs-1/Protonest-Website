"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    Download,
    Eye,
    FileText,
    LogOut,
    Menu,
    Settings,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ResubmitCVPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '✍️', label: 'Ongoing Projects', path: '/dashboard/projects' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
        { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
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

    // Handle file upload
    const handleFileSelect = (file: File) => {
        if (file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a PDF file only.');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (selectedFile) {
            // Handle CV submission logic here
            console.log('Submitting CV:', selectedFile.name);
            alert('CV submitted successfully!');
        } else {
            alert('Please select a file first.');
        }
    };

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
                            {/* Logo */}
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
                                    <Link href="/dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Resubmit CV</span>
                                </nav>
                            </div>

                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[25px]">📨</span>
                                    <h2 className="text-2xl font-medium text-gray-700">Resubmit Your CV</h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Keep your CV up to date so we can better match you with the right freelance projects at Protonest.
                                </p>
                            </div>

                            {/* Current CV Status Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12 mb-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">Current CV Status</h3>
                                        <div className="space-y-1 text-[#6c6c6c]">
                                            <p className="text-base">
                                                <span className="font-medium">Last Submitted:</span> March 22, 2025
                                            </p>
                                            <p className="text-base">
                                                <span className="font-medium">Current File:</span> name_firmware_cv_2025.pdf
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 justify-center max-w-[300px]">
                                        <button className="flex h-[50px] items-center justify-center gap-2 px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow">
                                            <Eye className="w-4 h-4" />
                                            Preview CV
                                        </button>
                                        <button className="flex h-[50px] items-center justify-center gap-2 px-6 py-4 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] font-medium font-['Poppins'] hover:bg-gray-50 transition-colors">
                                            <Download className="w-4 h-4" />
                                            Download CV
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Upload New Version Card */}
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] p-6 lg:p-12">
                                <div className="mb-6">
                                    <h3 className="text-xl font-medium text-[#6c6c6c] mb-4">Upload a New Version</h3>
                                    <p className="text-base text-[#6c6c6c] leading-[30px]">
                                        Upload your latest resume in PDF format. Include any new skills, experience, or portfolio links that reflect your current expertise.
                                    </p>
                                </div>

                                {/* File Upload Area */}
                                <div className="mb-6">
                                    <div
                                        className={`relative rounded-[35px] border-2 border-dashed transition-all duration-300 ${isDragging
                                            ? 'border-[#5530fa] bg-[#5530fa]/5'
                                            : selectedFile
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-[#6c6c6c] bg-white'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="flex flex-col items-center justify-center py-12 px-6">
                                            {selectedFile ? (
                                                <div className="space-y-4 text-center">
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                        <FileText className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#6c6c6c] font-medium">{selectedFile.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 text-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#6c6c6c] text-base">
                                                            Upload the file by drag and drop here or
                                                            <br />
                                                            click on the browse button.
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2">Supported format: .pdf</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Browse Button */}
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={handleBrowseClick}
                                            className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow"
                                        >
                                            Browse Files
                                        </button>
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center lg:justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white font-semibold font-['Montserrat'] hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!selectedFile}
                                    >
                                        Submit Updated CV
                                    </button>
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

export default ResubmitCVPage;