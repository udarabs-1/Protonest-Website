'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

const calculateReadTime = (content: string): string => {
    if (!content) return "1 min read";
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed) || 1;
    return `${minutes} min read`;
};

const formatDate = (dateString: string): string => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const date = new Date(dateString);
    return isNaN(date.getTime())
        ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
};

const extractTocItems = (htmlContent: string): TocItem[] => {
    if (typeof window === 'undefined' || !htmlContent) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');

    const items: TocItem[] = [];

    headings.forEach((heading) => {
        const text = heading.textContent?.trim() || '';
        if (!text) return;

        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const level = parseInt(heading.tagName.substring(1));

        items.push({ id, text, level });
    });

    return items;
};

const addIdsToHeadings = (htmlContent: string): string => {
    if (typeof window === 'undefined' || !htmlContent) return htmlContent || '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');

    headings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        heading.id = id;
    });

    return doc.body.innerHTML;
};

const TableOfContents = ({ items, isMobile = false }: { items: TocItem[], isMobile?: boolean }) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        items.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (items.length === 0) return null;

    const tocContent = (
        <div className="bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-[#d5d5d5] backdrop-blur-[20px] p-6 w-full">
            <h2 className="text-sm font-semibold text-[#6c6c6c] uppercase mb-4 font-montserrat tracking-wide">
                Table of Contents
            </h2>
            <nav>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={item.level === 3 ? 'ml-4' : ''}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`block text-sm font-poppins transition-colors ${activeId === item.id
                                    ? 'text-[#5530fa] font-semibold'
                                    : 'text-[#6c6c6c] hover:text-[#5530fa]'
                                    }`}
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );

    if (isMobile) {
        return <div className="lg:hidden mb-8">{tocContent}</div>;
    }

    return (
        <div className="hidden lg:block sticky top-24 h-fit self-start">
            {tocContent}
        </div>
    );
};

export default function BlogPreviewPage() {
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);

    useEffect(() => {
        const previewData = sessionStorage.getItem('blogPreviewData');
        if (previewData) {
            try {
                const parsed = JSON.parse(previewData);

                // Content manipulation
                const contentWithIds = addIdsToHeadings(parsed.content || '');
                const toc = extractTocItems(parsed.content || '');

                setBlog({
                    title: parsed.title || 'Untitled Blog Post',
                    content: contentWithIds,
                    cover_image: parsed.cover_image || null,
                    author: parsed.author || 'Author',
                    published_at: parsed.created_at || new Date().toISOString()
                });

                setTocItems(toc);
            } catch (err) {
                console.error("Error parsing preview data", err);
                setError('Invalid preview data');
            }
        } else {
            setError('No blog data to preview. Please return to the editor and click Preview again.');
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#6c6c6c] font-poppins">Loading preview...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Preview Not Available</h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">{error}</p>
                        <button
                            onClick={() => window.close()}
                            className="px-6 py-2 bg-[#5530fa] text-white rounded-[57px] font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const readTime = calculateReadTime(blog.content);

    return (
        <div className="overflow-x-hidden">
            <style jsx global>{`
                .preview-banner {
                    background: repeating-linear-gradient(
                      45deg,
                      #ffeb3b,
                      #ffeb3b 10px,
                      #fbc02d 10px,
                      #fbc02d 20px
                    );
                    color: black;
                    text-align: center;
                    font-weight: bold;
                    padding: 8px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    z-index: 1000;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
            `}</style>

            <div className="preview-banner">
                Preview Mode - This is exactly how the blog post will appear
            </div>

            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-10">
                {blog.cover_image && (
                    <div className="mb-8 lg:mb-12">
                        <div className="relative w-full aspect-video rounded-[11px] overflow-hidden">
                            <Image
                                src={blog.cover_image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority={true}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <h1 className="text-[#6c6c6c] text-2xl md:text-3xl lg:text-4xl font-medium font-montserrat leading-tight mb-4 sm:mb-0 sm:pr-8">
                        {blog.title}
                    </h1>
                    <div className="flex flex-col sm:items-end text-sm text-[#83848b] font-poppins whitespace-nowrap">
                        <span className="mb-1">{formatDate(blog.published_at)}</span>
                        <span>{readTime}</span>
                    </div>
                </div>

                <TableOfContents items={tocItems} isMobile={true} />

                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 xl:gap-12">
                    <div className="min-w-0">
                        <article className="prose prose-lg max-w-none">
                            <div
                                className="text-[#6c6c6c] text-base font-normal font-poppins"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </article>
                    </div>

                    <TableOfContents items={tocItems} isMobile={false} />
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
                    <button
                        onClick={() => window.close()}
                        className="px-8 py-3 rounded-[57px] border-2 border-gray-300 text-[#6c6c6c] text-base font-semibold font-montserrat hover:bg-gray-50 transition-colors"
                    >
                        Close Preview
                    </button>
                </div>

            </div>

            <Footer />

            <style jsx global>{`
        .prose {
          color: #6c6c6c;
          font-family: 'Poppins', sans-serif;
        }
        
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          color: #6c6c6c;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: normal;
        }
        
        .prose h1 {
          font-size: 2rem;
          line-height: 1.2;
        }
        
        .prose h2 {
          font-size: 1.75rem;
          line-height: 1.3;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          line-height: 1.4;
        }
        
        .prose h4 {
          font-size: 1.25rem;
          line-height: 1.4;
        }
        
        .prose p {
          margin-bottom: 1.5rem !important;
          line-height: 1.8 !important;
          display: block;
        }
        
        .prose ul {
          margin: 1.5rem 0;
          padding-left: 2rem;
          list-style-type: disc;
        }

        .prose ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          list-style-type: decimal;
        }
        
        .prose li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        
        .prose strong {
          font-weight: 600;
          color: #4a5568;
        }
        
        .prose a {
          color: #5530fa;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .prose a:hover {
          color: #f51da5;
        }
        
        .prose .image-container {
          margin: 2rem 0;
          max-width: 100%;
        }
        
        .prose .image-container img {
          border-radius: 8px;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .prose img:not(.image-container img) {
          border-radius: 8px;
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .prose blockquote {
          border-left: 4px solid #5530fa;
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        
        .prose code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          color: #e53e3e;
          font-family: 'Courier New', monospace;
        }
        
        .prose pre {
          background: #1a202c;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .prose pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .prose th, .prose td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background: #f7fafc;
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}
