"use client";

import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bell,
    Bold,
    ChevronRight,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    LogOut,
    Menu,
    Settings,
    Underline,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

const CreateResearchProjectContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contentType, setContentType] = useState<'research' | 'projects'>('research');
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingContentImage, setUploadingContentImage] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const typeFromUrl = searchParams.get('type') as 'research' | 'projects' || 'research';

    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            TextStyle,
            FontFamily,
        ],
        content: '<p>Start writing your content here...</p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
            },
        },
    });

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
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    // Set content type from URL on mount
    useEffect(() => {
        setContentType(typeFromUrl);
    }, [typeFromUrl]);

    // Handle content type change
    const handleContentTypeChange = (type: 'research' | 'projects') => {
        setContentType(type);
        // Update URL without navigation
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('type', type);
        window.history.replaceState({}, '', currentUrl.toString());
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG)');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('File size should be less than 2MB');
                return;
            }

            setCoverImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileList = {
                0: file,
                length: 1,
                item: (index: number) => index === 0 ? file : null,
                [Symbol.iterator]: function* () {
                    yield file;
                }
            } as FileList;

            const event = {
                target: {
                    files: fileList
                }
            } as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(event);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Add image to editor
    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setError('Please select a valid image file (JPG, PNG)');
                    return;
                }

                // Validate file size (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    setError('Image size should be less than 2MB');
                    return;
                }

                setUploadingContentImage(true);
                setError(null);

                try {
                    const token = localStorage.getItem('adminToken');
                    const formData = new FormData();
                    formData.append('cover_image', file);

                    const endpoint = contentType === 'research'
                        ? '/api/v1/auth/admin/research/upload-image'
                        : '/api/v1/auth/admin/projects/upload-image';

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Failed to upload image');
                    }

                    const result = await response.json();

                    if (result.status === 'success' && result.data.url) {
                        editor?.chain().focus().setImage({ src: result.data.url }).run();
                    } else {
                        throw new Error(result.message || 'Failed to upload image');
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to upload image');
                } finally {
                    setUploadingContentImage(false);
                }
            }
        };
        input.click();
    }, [editor, contentType]);

    // Add link to editor
    const addLink = useCallback(() => {
        const url = prompt('Enter URL:');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    // Submit as draft
    const handleSaveAsDraft = async () => {
        await submitContent(false);
    };

    // Submit as published
    const handlePublish = async () => {
        await submitContent(true);
    };

    // Submit content
    const submitContent = async (published: boolean) => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        const content = editor?.getHTML() || '';
        if (!content.trim() || content === '<p></p>' || content === '<p>Start writing your content here...</p>') {
            setError('Content is required');
            return;
        }

        if (!coverImage) {
            setError('Cover image is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();

            formData.append('title', title);
            formData.append('content', content);
            formData.append('published', published.toString());
            formData.append('cover_image', coverImage);

            const endpoint = contentType === 'research'
                ? '/api/v1/auth/admin/research'
                : '/api/v1/auth/admin/projects';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to create ${contentType.slice(0, -1)}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                router.push('/admin-dashboard/research');
            } else {
                throw new Error(result.message || `Failed to create ${contentType.slice(0, -1)}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

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

    if (!editor) {
        return (
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-poppins min-h-screen bg-white relative">
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

                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Link>
                            <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                        {/* Breadcrumb */}
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
                                <Link href="/admin-dashboard/research" className="hover:text-gray-700">Research & Projects Manager</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-[#5C4EC9]">Create New {contentType === 'research' ? 'Research' : 'Project'}</span>
                            </nav>
                        </div>

                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                🔬 Create New {contentType === 'research' ? 'Research Article' : 'Project'}
                            </h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px]">
                                Share your {contentType === 'research' ? 'research findings and technical insights' : 'project details and development showcases'} with the community.
                            </p>
                        </div>

                        {/* Content Type Selection */}
                        <div className="mb-6">
                            <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Content Type</h2>
                            <div className="inline-flex justify-start items-center gap-2">
                                <button
                                    onClick={() => handleContentTypeChange('research')}
                                    className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-all ${contentType === 'research'
                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="text-center text-xs font-semibold font-montserrat">
                                        🔬 Research Article
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleContentTypeChange('projects')}
                                    className={`h-[34px] py-4 px-4 rounded-[57px] flex justify-center items-center gap-3 transition-all ${contentType === 'projects'
                                        ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="text-center text-xs font-semibold font-montserrat">
                                        🚀 Project Showcase
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Title Section */}
                        <div className="mb-6">
                            <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">
                                {contentType === 'research' ? 'Research' : 'Project'} Title
                            </h2>
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full text-base font-normal font-poppins text-[#6c6c6c] bg-transparent border-none outline-none placeholder-[#6c6c6c]/80"
                                    placeholder={`Enter a clear and concise title for your ${contentType === 'research' ? 'research article' : 'project'}.`}
                                    maxLength={50}
                                />
                                <div className="text-right text-xs text-[#6c6c6c]/80 mt-2">
                                    {title.length}/50
                                </div>
                            </div>
                        </div>

                        {/* Cover Image Upload Section */}
                        <div className="mb-6">
                            <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Cover Image Upload *</h2>
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                                <div
                                    className="bg-white rounded-[35px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.08)] border border-[#6c6c6c] h-[327px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    {coverImagePreview ? (
                                        <div className="w-full h-full relative rounded-[35px] overflow-hidden">
                                            <Image
                                                src={coverImagePreview}
                                                alt="Cover preview"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 327px"
                                                style={{ borderRadius: '35px' }}
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm">Click to change image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-[75px] h-24 text-gray-400 mb-4" />
                                            <div className="text-center text-[#6c6c6c] text-base font-normal font-poppins">
                                                Upload the file by drag and drop here or<br />
                                                click on the browse button.<br />
                                                Supported format: .JPG, PNG<br />
                                                Max Size: 2MB
                                            </div>
                                            <button className="mt-6 px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow">
                                                Browse
                                            </button>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Content Editor Section */}
                        <div className="mb-8">
                            <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Content Editor</h2>
                            <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] overflow-hidden">

                                {/* Toolbar */}
                                <div className="border-b border-gray-200 p-4 bg-gray-50">
                                    <div className="flex flex-wrap gap-2">
                                        {/* Text Formatting */}
                                        <button
                                            onClick={() => editor.chain().focus().toggleBold().run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                                            title="Bold"
                                        >
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().toggleItalic().run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                                            title="Italic"
                                        >
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().toggleStrike().run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                                            title="Strikethrough"
                                        >
                                            <Underline className="w-4 h-4" />
                                        </button>

                                        <div className="w-px h-8 bg-gray-300 mx-1" />

                                        {/* Headers */}
                                        <select
                                            onChange={(e) => {
                                                const level = parseInt(e.target.value);
                                                if (level === 0) {
                                                    editor.chain().focus().setParagraph().run();
                                                } else {
                                                    editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                                                }
                                            }}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                            value={
                                                editor.isActive('heading', { level: 1 }) ? '1' :
                                                    editor.isActive('heading', { level: 2 }) ? '2' :
                                                        editor.isActive('heading', { level: 3 }) ? '3' :
                                                            editor.isActive('heading', { level: 4 }) ? '4' : '0'
                                            }
                                        >
                                            <option value="0">Normal</option>
                                            <option value="1">Heading 1</option>
                                            <option value="2">Heading 2</option>
                                            <option value="3">Heading 3</option>
                                            <option value="4">Heading 4</option>
                                        </select>

                                        <div className="w-px h-8 bg-gray-300 mx-1" />

                                        {/* Lists */}
                                        <button
                                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                                            title="Bullet List"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                                            title="Numbered List"
                                        >
                                            <span className="text-sm font-bold">1.</span>
                                        </button>

                                        <div className="w-px h-8 bg-gray-300 mx-1" />

                                        {/* Alignment */}
                                        <button
                                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                                            title="Align Left"
                                        >
                                            <AlignLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                                            title="Align Center"
                                        >
                                            <AlignCenter className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                            className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                                            title="Align Right"
                                        >
                                            <AlignRight className="w-4 h-4" />
                                        </button>

                                        <div className="w-px h-8 bg-gray-300 mx-1" />

                                        {/* Links and Images */}
                                        <button
                                            onClick={addLink}
                                            className="p-2 hover:bg-gray-200 rounded"
                                            title="Insert Link"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={addImage}
                                            disabled={uploadingContentImage}
                                            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                                            title="Insert Image"
                                        >
                                            {uploadingContentImage ? (
                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4" />
                                            )}
                                        </button>

                                        <div className="w-px h-8 bg-gray-300 mx-1" />

                                        {/* Text Color */}
                                        <input
                                            type="color"
                                            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                            title="Text Color"
                                        />

                                        {/* Font Size */}
                                        <select
                                            onChange={(e) => {
                                                const size = e.target.value;
                                                if (size) {
                                                    editor.chain().focus().setFontFamily(size).run();
                                                }
                                            }}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        >
                                            <option value="">Font</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Times New Roman">Times</option>
                                            <option value="Courier New">Courier</option>
                                            <option value="Georgia">Georgia</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Editor */}
                                <EditorContent editor={editor} className="min-h-[400px]" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mb-8">
                            <button
                                onClick={handleSaveAsDraft}
                                disabled={loading}
                                className="px-6 py-4 rounded-[57px] border border-[#5530fa] text-[#4d4d4d] text-base font-medium font-poppins hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save as Draft'}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={loading}
                                className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow disabled:opacity-50"
                            >
                                {loading ? 'Publishing...' : 'Publish Now'}
                            </button>
                        </div>
                    </main>
                </div>
            </div>

            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                    padding: 1.5rem;
                    min-height: 400px;
                    font-family: 'Poppins', sans-serif;
                    line-height: 1.6;
                }
                
                .ProseMirror h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 1rem 0;
                }
                
                .ProseMirror h2 {
                    font-size: 1.75rem;
                    font-weight: bold;
                    margin: 0.875rem 0;
                }
                
                .ProseMirror h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0.75rem 0;
                }
                
                .ProseMirror h4 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 0.625rem 0;
                }
                
                .ProseMirror ul, .ProseMirror ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }
                
                .ProseMirror li {
                    margin: 0.5rem 0;
                }
                
                .ProseMirror p {
                    margin: 1rem 0;
                }
                
                .ProseMirror a {
                    color: #5530fa;
                    text-decoration: underline;
                }
                
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
                
                .ProseMirror blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    background-color: #f9fafb;
                    padding: 1rem;
                    border-radius: 4px;
                }
                
                .ProseMirror code {
                    background-color: #f3f4f6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }
                
                .ProseMirror pre {
                    background-color: #1f2937;
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                
                .ProseMirror pre code {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                }
            `}</style>
        </div>
    );
};

const CreateResearchProject = () => {
    return (
        <Suspense fallback={
            <div className="font-poppins min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <CreateResearchProjectContent />
        </Suspense>
    );
};

export default CreateResearchProject;