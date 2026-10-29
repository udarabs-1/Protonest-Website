'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCmsBlog, getCmsBlogs } from "@/lib/cms-blogs";


interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    categories: string[];
    keywords?: string[];
    author: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

const calculateReadTime = (content: string): string => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed);
    return `${minutes} min read`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const extractExcerpt = (htmlContent: string, maxLength: number = 150): string => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    const trimmed = textContent.trim();
    if (trimmed.length <= maxLength) return trimmed;

    const truncated = trimmed.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    return lastSpaceIndex > -1
        ? truncated.substring(0, lastSpaceIndex) + '...'
        : truncated + '...';
};

const extractTocItems = (htmlContent: string): TocItem[] => {
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
            const yOffset = -130;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (items.length === 0) return null;

    const tocContent = (
        <div className={`bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-[#d5d5d5] backdrop-blur-[20px] p-6 w-full ${isMobile ? '' : 'flex flex-col max-h-[calc(100vh-8rem)]'}`}>
            <h2 className="text-sm font-semibold text-[#6c6c6c] uppercase mb-4 font-montserrat tracking-wide">
                Table of Contents
            </h2>
            {/* On desktop the list scrolls inside the card so the sticky TOC always fits on screen */}
            <nav className={isMobile ? '' : 'min-h-0 overflow-y-auto pr-2'}>
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

const BlogCard = ({ blog }: { blog: Blog }) => {
    const excerpt = extractExcerpt(blog.content);
    const readTime = calculateReadTime(blog.content);

    return (
        <Link href={`/blog/${blog.slug}`} passHref>
            <article className="group w-full h-full relative bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-6 lg:p-8 transition-all duration-300 hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] cursor-pointer">
                <div className="relative w-full aspect-video rounded-[11px] overflow-hidden mb-6">
                    <Image
                        src={blog.cover_image || '/default-blog-image.jpg'}
                        alt={blog.title}
                        width={472}
                        height={164}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:grayscale"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 472px"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-blog-image.jpg';
                        }}
                    />

                    <button className="absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-10 bg-[#A3A3A3] font-poppins text-sm transition-all duration-300 rounded-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
                            Read More
                        </span>
                    </button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[16px] xl:text-[18px] font-medium font-poppins leading-[1.4] transition-all duration-300 text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
                        {blog.title}
                    </h3>

                    <p className="text-[#6c6c6c] text-xs font-medium font-poppins leading-[1.5] line-clamp-3">
                        {excerpt}
                    </p>

                    <div className="text-[#83848b] text-[10px] font-normal font-poppins">
                        {readTime}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [suggestedBlogs, setSuggestedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const errorRef = useRef<string | null>(null);

    useEffect(() => {
        errorRef.current = error;
    }, [error]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchBlog = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const [blogData, allBlogs] = await Promise.all([
                    getCmsBlog(slug, { signal }),
                    getCmsBlogs(null, { signal }).catch((err) => {
                        if ((err as Error)?.name !== 'AbortError') {
                            console.error('Error fetching suggested blogs:', err);
                        }
                        return [];
                    }),
                ]);

                if (!blogData) {
                    throw new Error('Blog post not found');
                }

                const contentWithIds = addIdsToHeadings(blogData.content);
                const toc = extractTocItems(blogData.content);

                setBlog({ ...blogData, content: contentWithIds });
                setTocItems(toc);

                const otherBlogs = allBlogs.filter((b: Blog) => b.id !== blogData.id);
                const shuffled = otherBlogs.sort(() => Math.random() - 0.5);
                setSuggestedBlogs(shuffled.slice(0, 2));
            } catch (err) {
                if ((err as Error)?.name === 'AbortError') return;
                console.error('Error fetching blog:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blog post');
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        fetchBlog();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && errorRef.current) {
                fetchBlog();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            controller.abort();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [slug]);

    useEffect(() => {
        if (blog) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [blog]);

    if (loading) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#6c6c6c] font-poppins">Loading blog post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">
                            {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Error Loading Blog'}
                        </h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            {error === 'Blog post not found'
                                ? 'The blog post you are looking for does not exist or has been removed.'
                                : error || 'Something went wrong while loading the blog post.'}
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-poppins hover:bg-gray-600 transition-colors"
                            >
                                Go Back
                            </button>
                            <Link
                                href="/blog"
                                className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                            >
                                View All Blogs
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog.published) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Blog Post Not Available</h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            This blog post is not currently published.
                        </p>
                        <Link
                            href="/blog"
                            className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                        >
                            View All Blogs
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const readTime = calculateReadTime(blog.content);
    const publishDate = blog.published_at || blog.created_at;

    return (
        <div className="overflow-x-hidden" id="article-top">
            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#6c6c6c] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#5530FA] hover:to-[#F51DA5] transition-all mb-6 group cursor-pointer"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-[url(#gradient)] lg:w-6 lg:h-6"
                    >
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#5530FA" />
                                <stop offset="100%" stopColor="#F51DA5" />
                            </linearGradient>
                        </defs>
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="font-poppins text-sm lg:text-base font-medium">Back</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                    <h1 className="text-[#6c6c6c] text-2xl md:text-3xl lg:text-4xl font-medium font-montserrat leading-tight mb-4 sm:mb-0 sm:pr-8">
                        {blog.title}
                    </h1>
                    <div className="flex flex-col sm:items-end text-sm text-[#83848b] font-poppins whitespace-nowrap">
                        <span className="mb-1">{formatDate(publishDate)}</span>
                        <span>{readTime}</span>
                    </div>
                </div>

                {blog.cover_image && (
                    <div className="mb-8 flex justify-center lg:hidden">
                        <div className="w-full max-w-2xl">
                            <div className="relative w-full aspect-video max-h-[50vh] rounded-[11px] overflow-hidden">
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
                    </div>
                )}



                <TableOfContents items={tocItems} isMobile={true} />

                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 xl:gap-12">
                    <div className="min-w-0">
                        {blog.cover_image && (
                            <div className="hidden lg:block w-full mb-6">
                                <div className="relative w-full aspect-video max-h-[55vh] rounded-[11px] overflow-hidden">
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
                        <article className="prose prose-lg max-w-none">
                            <div
                                className="text-[#6c6c6c] text-base font-normal font-poppins"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </article>
                    </div>

                    <TableOfContents items={tocItems} isMobile={false} />
                </div>

                {suggestedBlogs.length > 0 && (
                    <section className="pt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#6c6c6c] text-2xl font-medium font-montserrat">Explore More Articles</h2>
                            <Link
                                href="/blog"
                                className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300"
                            >
                                <span className="underline">View more</span> &gt;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {suggestedBlogs.map(suggestedBlog => (
                                <BlogCard key={suggestedBlog.id} blog={suggestedBlog} />
                            ))}
                        </div>
                    </section>
                )}

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