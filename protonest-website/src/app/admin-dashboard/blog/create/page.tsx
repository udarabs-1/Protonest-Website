"use client";

import AdminLayout from '@/app/components/admin-layout';
import { Icon } from '@iconify/react';
import type { NodeViewRendererProps } from '@tiptap/core';
import { Extension, mergeAttributes } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlertTriangle,
    AlignCenter,
    AlignLeft,
    AlignRight,
    ArrowLeft,
    Bold,
    ChevronDown,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    Plus,
    Trash2,
    Underline,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const CustomTextStyle = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: element => element.style.fontSize,
                renderHTML: attributes => {
                    if (!attributes.fontSize) {
                        return {}
                    }
                    return {
                        style: `font-size: ${attributes.fontSize}`,
                    }
                },
            },
        }
    },
});

interface SelectedImageNode {
    node: {
        attrs: {
            src: string;
            alt?: string;
            width?: number;
            height?: number;
            style?: string;
        };
    };
    getPos: () => number;
    container: HTMLDivElement;
    img: HTMLImageElement;
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

interface BlogCategory {
    id: string;
    name: string;
}

const CreateBlogPost = () => {
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [availableCategories, setAvailableCategories] = useState<BlogCategory[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(false);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingContentImage, setUploadingContentImage] = useState(false);
    const [selectedImageNode, setSelectedImageNode] = useState<SelectedImageNode | null>(null);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blog-categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success' && Array.isArray(result.data)) {
                    setAvailableCategories(result.data);
                }
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    useEffect(() => {
        if (isAdminTokenExpired()) {
            router.push('/admin-signin');
        }
    }, [router]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const ResizableImage = ImageExtension.extend({
        name: 'resizableImage',

        addAttributes() {
            return {
                src: {
                    default: null,
                },
                alt: {
                    default: null,
                },
                title: {
                    default: null,
                },
                width: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('width'),
                    renderHTML: (attributes: Record<string, string | number>) => {
                        if (!attributes.width) return {};
                        return { width: attributes.width };
                    },
                },
                height: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('height'),
                    renderHTML: (attributes: Record<string, string | number>) => {
                        if (!attributes.height) return {};
                        return { height: attributes.height };
                    },
                },
                style: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.getAttribute('style'),
                    renderHTML: (attributes: Record<string, string | number>) => {
                        if (!attributes.style) return {};
                        return { style: attributes.style };
                    },
                },
            }
        },

        renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string | number> }) {
            return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
        },

        addNodeView() {
            return (props: NodeViewRendererProps) => {
                const { node, getPos, editor } = props;

                const container = document.createElement('div');
                container.className = 'image-container';
                container.style.cssText = `
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                    margin: 1rem 0;
                `;

                const img = document.createElement('img');
                img.src = node.attrs.src || '';
                img.alt = node.attrs.alt || '';
                img.style.cssText = `
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    cursor: pointer;
                    ${node.attrs.width ? `width: ${node.attrs.width}px;` : ''}
                    ${node.attrs.height ? `height: ${node.attrs.height}px;` : ''}
                    ${node.attrs.style || ''}
                `;

                const resizeHandles = ['nw', 'ne', 'sw', 'se'].map(position => {
                    const handle = document.createElement('div');
                    handle.className = `resize-handle resize-${position}`;
                    handle.style.cssText = `
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: #5530fa;
                        border: 2px solid white;
                        border-radius: 50%;
                        cursor: ${position}-resize;
                        display: none;
                        ${position.includes('n') ? 'top: -5px;' : 'bottom: -5px;'}
                        ${position.includes('w') ? 'left: -5px;' : 'right: -5px;'}
                    `;
                    return handle;
                });

                const showHandles = () => {
                    resizeHandles.forEach(handle => handle.style.display = 'block');
                    container.style.outline = '2px solid #5530fa';
                    setSelectedImageNode({
                        node: { attrs: node.attrs as SelectedImageNode['node']['attrs'] },
                        getPos: getPos as () => number,
                        container,
                        img
                    });
                };

                const hideHandles = () => {
                    resizeHandles.forEach(handle => handle.style.display = 'none');
                    container.style.outline = 'none';
                    setSelectedImageNode(null);
                };

                img.addEventListener('click', showHandles);

                const handleDocumentClick = (e: Event) => {
                    const target = e.target as HTMLElement;
                    if (!container.contains(target)) {
                        hideHandles();
                    }
                };

                document.addEventListener('click', handleDocumentClick);

                resizeHandles.forEach((handle, index) => {
                    handle.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startWidth = img.offsetWidth;
                        const startHeight = img.offsetHeight;
                        const aspectRatio = startWidth / startHeight;

                        const onMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startX;

                            let newWidth = startWidth;
                            let newHeight = startHeight;

                            const position = ['nw', 'ne', 'sw', 'se'][index];

                            if (position.includes('e')) {
                                newWidth = startWidth + deltaX;
                            } else {
                                newWidth = startWidth - deltaX;
                            }

                            newHeight = newWidth / aspectRatio;

                            newWidth = Math.max(50, Math.min(800, newWidth));
                            newHeight = Math.max(50, Math.min(600, newHeight));

                            img.style.width = `${newWidth}px`;
                            img.style.height = `${newHeight}px`;
                        };

                        const onMouseUp = () => {
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);

                            if (typeof getPos === 'function') {
                                const pos = getPos();
                                if (pos !== undefined) {
                                    editor.view.dispatch(
                                        editor.view.state.tr.setNodeMarkup(pos, null, {
                                            ...node.attrs,
                                            width: img.offsetWidth,
                                            height: img.offsetHeight,
                                        })
                                    );
                                }
                            }
                        };

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });

                    container.appendChild(handle);
                });

                container.appendChild(img);

                return {
                    dom: container,
                    destroy: () => {
                        document.removeEventListener('click', handleDocumentClick);
                    }
                };
            };
        },
    });

    const LineHeight = Extension.create({
        name: 'lineHeight',
        addOptions() {
            return {
                types: ['paragraph', 'heading'],
            };
        },
        addGlobalAttributes() {
            return [
                {
                    types: this.options.types,
                    attributes: {
                        lineHeight: {
                            default: null,
                            parseHTML: element => element.style.lineHeight || null,
                            renderHTML: attributes => {
                                if (!attributes.lineHeight) {
                                    return {};
                                }
                                return {
                                    style: `line-height: ${attributes.lineHeight}`,
                                };
                            },
                        },
                    },
                },
            ];
        },
        addCommands() {
            return {
                setLineHeight: (lineHeight: string) => ({ commands }) => {
                    return this.options.types.every((type: string) =>
                        commands.updateAttributes(type, { lineHeight })
                    );
                },
                unsetLineHeight: () => ({ commands }) => {
                    return this.options.types.every((type: string) =>
                        commands.resetAttributes(type, 'lineHeight')
                    );
                },
            };
        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            BulletList,
            OrderedList,
            ListItem,
            LineHeight,
            ResizableImage.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: true,
                inline: false,
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'resizableImage'],
            }),
            Color,
            CustomTextStyle,
            FontFamily,
        ],
        content: '<p>Start writing your blog post here...</p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
            },
            handleDrop: (view, event, slice, moved) => {
                if (moved) {
                    return false;
                }

                const files = Array.from(event.dataTransfer?.files || []);
                const imageFile = files.find(file => file.type.startsWith('image/'));

                if (imageFile) {
                    event.preventDefault();
                    handleImageUploadToEditor(imageFile);
                    return true;
                }

                return false;
            },
        },
    });


    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setShowCategoryDropdown(false);
    };

    const handleClearCategory = () => {
        setSelectedCategory('');
    };

    const handleDeleteCategory = (e: React.MouseEvent, categoryId: string, categoryName: string) => {
        e.stopPropagation();
        setCategoryToDelete({ id: categoryId, name: categoryName });
        setShowDeleteCategoryDialog(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;

        setDeletingCategory(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/blog-categories/${categoryToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchCategories();
                if (selectedCategory === categoryToDelete.name) {
                    setSelectedCategory('');
                }
                setShowDeleteCategoryDialog(false);
                setCategoryToDelete(null);
            } else {
                console.error('Failed to delete category');
                setError('Failed to delete category');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Error deleting category');
        } finally {
            setDeletingCategory(false);
        }
    };


    const handleCreateCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;

        setCreatingCategory(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/blog-categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                await fetchCategories();
                setSelectedCategory(name);
                setNewCategoryName('');
                setShowCreateCategoryModal(false);
            } else {
                setError(result.message || 'Failed to create category');
            }
        } catch (err) {
            setError('Failed to create category');
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG)');
                return;
            }

            setCoverImage(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

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

    const handleImageUploadToEditor = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file (JPG, PNG)');
            return;
        }

        setUploadingContentImage(true);
        setError(null);

        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('cover_image', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/blogs/upload-image`, {
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
                editor?.chain().focus().setImage({
                    src: result.data.url,
                    alt: file.name,
                    width: 400,
                }).run();
            } else {
                throw new Error(result.message || 'Failed to upload image');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploadingContentImage(false);
        }
    }, [editor]);

    const alignImageLeft = () => {
        if (selectedImageNode) {
            const { container } = selectedImageNode;
            container.style.textAlign = 'left';
            container.style.float = 'left';
            container.style.marginRight = '1rem';
            container.style.marginLeft = '0';
            container.style.display = 'inline-block';
        }
    };

    const alignImageCenter = () => {
        if (selectedImageNode) {
            const { container } = selectedImageNode;
            container.style.textAlign = 'center';
            container.style.float = 'none';
            container.style.margin = '1rem auto';
            container.style.display = 'block';
            container.style.width = 'fit-content';
            container.style.marginLeft = 'auto';
            container.style.marginRight = 'auto';
        }
    };

    const alignImageRight = () => {
        if (selectedImageNode) {
            const { container } = selectedImageNode;
            container.style.textAlign = 'right';
            container.style.float = 'right';
            container.style.marginLeft = '1rem';
            container.style.marginRight = '0';
            container.style.display = 'inline-block';
        }
    };

    const deleteSelectedImage = () => {
        if (selectedImageNode && selectedImageNode.getPos) {
            const pos = selectedImageNode.getPos();
            editor?.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
            setSelectedImageNode(null);
        }
    };

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                await handleImageUploadToEditor(file);
            }
        };
        input.click();
    }, [handleImageUploadToEditor]);

    const addLink = useCallback(() => {
        const url = prompt('Enter URL:');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const handleSaveAsDraft = async () => {
        setShowDraftDialog(true);
    };

    const handlePublish = async () => {
        setShowPublishDialog(true);
    };

    const confirmSaveAsDraft = async () => {
        setShowDraftDialog(false);
        await submitBlog(false);
    };

    const confirmPublish = async () => {
        setShowPublishDialog(false);
        await submitBlog(true);
    };

    const submitBlog = async (published: boolean) => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        const content = editor?.getHTML() || '';
        if (!content.trim() || content === '<p></p>') {
            setError('Content is required');
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
            formData.append('categories', JSON.stringify(selectedCategory ? [selectedCategory] : []));
            formData.append('keywords', JSON.stringify(keywords));

            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/blogs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create blog post');
            }

            const result = await response.json();

            if (result.status === 'success') {
                setSuccessMessage(published ? 'Blog post published successfully!' : 'Blog post saved as draft successfully!');
                setShowSuccessDialog(true);
            } else {
                throw new Error(result.message || 'Failed to create blog post');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };



    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <AdminLayout
            breadcrumbItems={[
                { label: 'Admin Portal', href: '/admin-dashboard' },
                { label: 'Blog Manager', href: '/admin-dashboard/blog' },
                { label: 'New Blog Post' }
            ]}
        >
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



            <div className="bg-white pb-6 flex items-center">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 mr-2"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center gradient-icon flex-shrink-0">
                        <Icon
                            icon="solar:document-add-bold-duotone"
                            className="w-7 h-7"
                        />
                    </div>
                    <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] font-montserrat">
                        Add New Blog Post
                    </h1>
                </div>
            </div>
            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat max-w-[653px] mb-6">
                Create a blog post to share product updates, IoT insights, or company news with the Protonest community.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Blog Title</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-base font-normal font-poppins text-[#6c6c6c] bg-transparent border-none outline-none placeholder-[#6c6c6c]/80"
                        placeholder="Enter a clear and concise title for the blog post."
                    />
                </div>
            </div>

            <div className="mb-6 relative z-30">
                <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Blog Category</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1" ref={categoryDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-[15px] text-left hover:border-gray-300 transition-colors"
                            >
                                <span className={`text-base font-poppins ${selectedCategory ? 'text-[#6c6c6c]' : 'text-[#6c6c6c]/60'}`}>
                                    {selectedCategory || 'Select a category'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showCategoryDropdown && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-[15px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] border border-gray-100 max-h-[200px] overflow-y-auto">
                                    {availableCategories.length === 0 ? (
                                        <div className="px-4 py-3 text-[#6c6c6c]/60 text-sm font-poppins text-center">
                                            No categories yet. Click + to create one.
                                        </div>
                                    ) : (
                                        availableCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-[15px] last:rounded-b-[15px] border-b border-gray-50 last:border-b-0 cursor-pointer group ${selectedCategory === category.name ? 'bg-gray-50' : ''}`}
                                                onClick={() => handleCategorySelect(category.name)}
                                            >
                                                <span className={`text-sm font-poppins ${selectedCategory === category.name ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] font-medium' : 'text-[#6c6c6c]'}`}>
                                                    {category.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteCategory(e, category.id, category.name)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    title="Delete category"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateCategoryModal(true)}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white hover:shadow-lg transition-shadow flex-shrink-0"
                            title="Create new category"
                        >
                            <Plus className="w-6 h-6" />
                        </button>

                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={handleClearCategory}
                                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                                title="Clear selection"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">SEO Keywords (Optional)</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const keyword = keywordInput.trim();
                                    if (keyword && !keywords.includes(keyword)) {
                                        setKeywords([...keywords, keyword]);
                                        setKeywordInput('');
                                    }
                                }
                            }}
                            placeholder="Type a keyword and press Enter"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-[15px] text-base font-poppins text-[#6c6c6c] outline-none focus:border-[#5530FA] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const keyword = keywordInput.trim();
                                if (keyword && !keywords.includes(keyword)) {
                                    setKeywords([...keywords, keyword]);
                                    setKeywordInput('');
                                }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[15px] font-semibold font-montserrat hover:from-[#F51DA5] hover:to-[#5530FA] transition-all"
                        >
                            Add
                        </button>
                    </div>
                    {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#5530FA]/10 to-[#F51DA5]/10 rounded-full border border-[#5530FA]/20"
                                >
                                    <span className="text-sm font-poppins text-[#6c6c6c]">{keyword}</span>
                                    <button
                                        type="button"
                                        onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                                        className="text-[#6c6c6c] hover:text-[#F51DA5] transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-[#6c6c6c]/60 font-poppins mt-3">
                        Add relevant keywords to improve SEO. Press Enter or click Add to include a keyword.
                    </p>
                </div>
            </div>

            {showCreateCategoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.20)] p-8 w-full max-w-md mx-4">
                        <h3 className="text-xl font-medium text-[#6c6c6c] font-poppins mb-6">Create New Category</h3>

                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                            className="w-full px-4 py-3 border border-gray-200 rounded-[15px] text-base font-poppins text-[#6c6c6c] outline-none focus:border-[#5530FA] transition-colors mb-6"
                            placeholder="Enter category name"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateCategoryModal(false);
                                    setNewCategoryName('');
                                }}
                                disabled={creatingCategory}
                                className="px-6 py-3 rounded-[57px] border border-gray-300 text-[#4d4d4d] text-sm font-medium font-poppins hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={creatingCategory || !newCategoryName.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[57px] text-white text-sm font-semibold font-montserrat hover:shadow-lg transition-shadow disabled:opacity-50"
                            >
                                {creatingCategory ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteCategoryDialog && categoryToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.20)] p-8 w-full max-w-md mx-4 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-medium text-[#6c6c6c] font-poppins mb-3">Delete Category?</h3>
                        <p className="text-[#6c6c6c] text-sm font-poppins mb-8">
                            Are you sure you want to delete the category <span className="font-semibold text-gray-800">"{categoryToDelete.name}"</span>?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteCategoryDialog(false)}
                                disabled={deletingCategory}
                                className="px-6 py-3 rounded-[57px] border border-gray-300 text-[#4d4d4d] text-sm font-medium font-poppins hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteCategory}
                                disabled={deletingCategory}
                                className="px-6 py-3 bg-red-500 rounded-[57px] text-white text-sm font-semibold font-montserrat hover:bg-red-600 hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {deletingCategory ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Cover Image Upload</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] p-6">
                    <div
                        className="bg-white rounded-[35px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.08)] border border-[#6c6c6c] w-full aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        {coverImagePreview ? (
                            <div className="w-full h-full relative rounded-[35px] overflow-hidden">
                                <Image
                                    src={coverImagePreview}
                                    alt="Cover preview"
                                    width={500}
                                    height={327}
                                    className="w-full h-full object-cover"
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

            <div className="mb-8">
                <h2 className="text-[22px] font-medium text-[#6c6c6c] font-poppins mb-4">Blog Content Editor</h2>
                <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border backdrop-blur-[20px] overflow-hidden">

                    <div className="border-b border-gray-200 p-4 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
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

                            <select
                                onChange={(e) => {
                                    const fontFamily = e.target.value;
                                    if (fontFamily) {
                                        editor.chain().focus().setFontFamily(fontFamily).run();
                                    }
                                }}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value="">Font</option>
                                <option value="Poppins">Poppins</option>
                                <option value="Montserrat">Montserrat</option>
                            </select>

                            <div className="w-px h-8 bg-gray-300 mx-1" />

                            <select
                                onChange={(e) => {
                                    const fontSize = e.target.value;
                                    if (fontSize) {
                                        editor.chain().focus().setMark('textStyle', { fontSize }).run();
                                    }
                                }}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value="">Size</option>
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                                <option value="24px">24px</option>
                                <option value="28px">28px</option>
                                <option value="32px">32px</option>
                                <option value="36px">36px</option>
                                <option value="48px">48px</option>
                            </select>

                            <div className="w-px h-8 bg-gray-300 mx-1" />

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
                                <option value="0">Paragraph</option>
                                <option value="1">Heading 1</option>
                                <option value="2">Heading 2</option>
                                <option value="3">Heading 3</option>
                                <option value="4">Heading 4</option>
                            </select>

                            <select
                                onChange={(e) => {
                                    const lineHeight = e.target.value;
                                    if (lineHeight === 'default') {
                                        editor.chain().focus().unsetLineHeight().run();
                                    } else {
                                        editor.chain().focus().setLineHeight(lineHeight).run();
                                    }
                                }}
                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-2"
                                title="Line Spacing"
                            >
                                <option value="default">Line Spacing</option>
                                <option value="1.0">1.0</option>
                                <option value="1.5">1.5</option>
                                <option value="2.0">2.0</option>
                            </select>

                            <div className="w-px h-8 bg-gray-300 mx-1" />

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

                            <div className="flex gap-2">
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
                            </div>

                            <div className="w-px h-8 bg-gray-300 mx-1" />

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

                            {selectedImageNode && (
                                <>
                                    <button
                                        onClick={alignImageLeft}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Align Image Left"
                                    >
                                        <span className="text-xs font-bold">⬅️</span>
                                    </button>
                                    <button
                                        onClick={alignImageCenter}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Center Image"
                                    >
                                        <span className="text-xs font-bold">⬆️</span>
                                    </button>
                                    <button
                                        onClick={alignImageRight}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Align Image Right"
                                    >
                                        <span className="text-xs font-bold">➡️</span>
                                    </button>
                                    <button
                                        onClick={deleteSelectedImage}
                                        className="p-2 hover:bg-red-200 rounded text-red-600"
                                        title="Delete Image"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            <div className="w-px h-8 bg-gray-300 mx-1" />

                            <input
                                type="color"
                                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                title="Text Color"
                            />
                        </div>
                    </div>

                    <EditorContent editor={editor} className="h-[500px] overflow-y-auto" />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => setShowDiscardDialog(true)}
                    disabled={loading}
                    className="px-6 py-4 rounded-[57px] border border-gray-300 cursor-pointer text-[#4d4d4d] text-base font-medium font-poppins hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Discard
                </button>
                <button
                    onClick={handleSaveAsDraft}
                    disabled={loading}
                    className="px-6 py-4 rounded-[57px] gradient-border cursor-pointer text-[#4d4d4d] text-base font-medium font-poppins hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base font-semibold font-montserrat hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : 'Publish'}
                </button>
            </div>


            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                    padding: 1.5rem;
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
                
                .ProseMirror ul {
                    list-style-type: disc;
                }
                
                .ProseMirror ol {
                    list-style-type: decimal;
                }
                
                .ProseMirror li {
                    margin: 0.5rem 0;
                    display: list-item;
                }
                
                .ProseMirror p {
                    margin: 1rem 0;
                }
                
                .ProseMirror a {
                    color: #5530fa;
                    text-decoration: underline;
                }
                
                .ProseMirror .image-container {
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                    margin: 1rem 0;
                    user-select: none;
                }
                
                .ProseMirror .image-container img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: box-shadow 0.2s ease;
                }
                
                .ProseMirror .image-container:hover img {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .ProseMirror .resize-handle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #5530fa;
                    border: 2px solid white;
                    border-radius: 50%;
                    display: none;
                    z-index: 10;
                }
                
                .ProseMirror .resize-handle:hover {
                    background: #4520d9;
                    transform: scale(1.2);
                }
                
                .ProseMirror .resize-nw {
                    top: -5px;
                    left: -5px;
                    cursor: nw-resize;
                }
                
                .ProseMirror .resize-ne {
                    top: -5px;
                    right: -5px;
                    cursor: ne-resize;
                }
                
                .ProseMirror .resize-sw {
                    bottom: -5px;
                    left: -5px;
                    cursor: sw-resize;
                }
                
                .ProseMirror .resize-se {
                    bottom: -5px;
                    right: -5px;
                    cursor: se-resize;
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

                .gradient-border {
                    border-image: linear-gradient(45deg, #F51DA5, #5530FA) 1;
                    background: linear-gradient(white, white) padding-box, 
                                linear-gradient(45deg, #F51DA5, #5530FA) border-box;
                }

                .ProseMirror .image-container.dragging {
                    opacity: 0.5;
                }
                
                .ProseMirror:focus {
                    outline: none;
                }
                
                .ProseMirror ::selection {
                    background: rgba(85, 48, 250, 0.2);
                }
            `}</style>
            {showDiscardDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowDiscardDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Discard Blog Post</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to discard this blog post? All unsaved changes will be lost.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDiscardDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    window.location.href = '/admin-dashboard/blog';
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPublishDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowPublishDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Publish</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to publish this blog post?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPublishDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPublish}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDraftDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowDraftDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Save as Draft</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to save this blog post as a draft?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDraftDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSaveAsDraft}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Save as Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessDialog && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Success</h3>
                        <p className="text-gray-600 mb-6">{successMessage}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowSuccessDialog(false);
                                    router.push('/admin-dashboard/blog');
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout >
    );
};

export default CreateBlogPost;