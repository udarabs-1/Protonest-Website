'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CMS_URL, getCmsBlog, getCmsBlogs, isCmsImage } from "@/lib/cms-blogs";
import { articleFont } from "./fonts";


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

// CMS articles often start with an H1 that repeats the post title; the page already shows it
const removeTitleHeading = (htmlContent: string, title: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const firstH1 = doc.querySelector('h1');
    const normalise = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
    if (firstH1 && normalise(firstH1.textContent || '') === normalise(title)) {
        firstH1.remove();
    }
    return doc.body.innerHTML;
};

const youTubeId = (href: string): string | null => {
    try {
        const url = new URL(href);
        if (url.hostname === 'youtu.be') return url.pathname.slice(1) || null;
        if (url.hostname.endsWith('youtube.com')) return url.searchParams.get('v');
    } catch {
        return null;
    }
    return null;
};

// Makes CMS article HTML display well: CMS media URLs point at the CMS, a YouTube link on
// its own line becomes an embedded video, and "Figure N: ..." lines are styled as captions
const enhanceArticleHtml = (htmlContent: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    doc.querySelectorAll('img[src^="/"], source[srcset^="/"]').forEach((el) => {
        const attr = el.tagName === 'IMG' ? 'src' : 'srcset';
        el.setAttribute(attr, `${CMS_URL}${el.getAttribute(attr)}`);
    });

    doc.querySelectorAll('p').forEach((p) => {
        const children = Array.from(p.childNodes).filter(
            (node) => node.nodeType !== Node.TEXT_NODE || node.textContent?.trim(),
        );
        const only = children.length === 1 ? children[0] : null;
        if (!(only instanceof HTMLElement)) return;

        const videoId = only.tagName === 'A' ? youTubeId(only.getAttribute('href') || '') : null;
        if (videoId && /^[\w-]{6,}$/.test(videoId)) {
            const wrapper = doc.createElement('figure');
            wrapper.className = 'video-embed';
            const iframe = doc.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
            iframe.title = only.textContent?.trim() || 'YouTube video';
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            wrapper.appendChild(iframe);
            const caption = doc.createElement('figcaption');
            caption.textContent = only.textContent?.trim() || '';
            if (caption.textContent) wrapper.appendChild(caption);
            p.replaceWith(wrapper);
            return;
        }

        if (only.tagName === 'EM' && /^(Figure|Fig\.|Table)\s*\d+/i.test(only.textContent?.trim() || '')) {
            p.classList.add('figure-caption');
        }
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
        <div className={`rounded-lg border border-[#e5e5e5] bg-white p-8 w-full ${isMobile ? '' : 'flex flex-col max-h-[calc(100vh-8rem)]'}`}>
            <h2 className="text-lg font-semibold tracking-tight text-[#0a0a0a]">
                In this article
            </h2>
            {/* On desktop the list scrolls inside the card so the sticky TOC always fits on screen */}
            <nav className={`mt-6 ${isMobile ? '' : 'min-h-0 overflow-y-auto pr-2'}`}>
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={item.level === 3 ? 'ml-4' : ''}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`block text-sm leading-6 transition-colors ${activeId === item.id
                                    ? 'text-[#5530fa] font-semibold'
                                    : 'text-[#525252] hover:text-[#0a0a0a]'
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
        <aside className="hidden lg:block sticky top-24 h-fit self-start">
            {tocContent}
        </aside>
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
                        unoptimized={isCmsImage(blog.cover_image)}
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

                const articleHtml = enhanceArticleHtml(removeTitleHeading(blogData.content, blogData.title));
                const contentWithIds = addIdsToHeadings(articleHtml);
                const toc = extractTocItems(articleHtml);

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

            <div className={`${articleFont.variable} mx-auto w-full max-w-[1360px] px-4 sm:px-6 py-12 lg:py-16`}>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#5530fa] bg-white px-3 py-2 text-sm font-medium uppercase tracking-wider text-[#5530fa] transition-colors hover:bg-[#5530fa] hover:text-white cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <h1 className="article-title mt-10 max-w-4xl text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-tight lg:leading-[1.08] tracking-tight text-[#0a0a0a] text-balance">
                    {blog.title}
                </h1>

                <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider">
                    {blog.categories?.[0] && (
                        <span className="rounded-sm border border-[#d9ccff] bg-[#f1ecff] px-3 py-1 text-[#5530fa]">
                            {blog.categories[0]}
                        </span>
                    )}
                    <span className="rounded-sm border border-[#e5e5e5] bg-[#f7f7f8] px-3 py-1 text-[#404040]">
                        {formatDate(publishDate)}
                    </span>
                    <span className="rounded-sm border border-[#e5e5e5] bg-[#f7f7f8] px-3 py-1 text-[#404040]">
                        {readTime}
                    </span>
                </div>

                {blog.cover_image && (
                    <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]">
                        <Image
                            src={blog.cover_image}
                            unoptimized={isCmsImage(blog.cover_image)}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 1360px) 100vw, 1360px"
                            className="object-cover"
                            priority={true}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <div className="mt-12 lg:hidden">
                    <TableOfContents items={tocItems} isMobile={true} />
                </div>

                <div className="mt-4 lg:mt-16 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
                    <TableOfContents items={tocItems} isMobile={false} />

                    <article
                        className="blog-article min-w-0"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>
                {suggestedBlogs.length > 0 && (
                    <section className="mt-24 border-t border-[#e5e5e5] pt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#0a0a0a] text-2xl font-semibold tracking-tight">Explore More Articles</h2>
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
        .article-title,
        .blog-article {
          font-family: var(--font-article), 'Inter', sans-serif;
        }

        .blog-article {
          color: #3f3f46;
          font-size: 1.125rem;
          line-height: 2rem;
        }

        .blog-article > .payload-richtext > :first-child,
        .blog-article > :first-child {
          margin-top: 0;
        }

        .blog-article h1,
        .blog-article h2,
        .blog-article h3,
        .blog-article h4 {
          color: #18181b;
          font-weight: 600;
          scroll-margin-top: 7rem;
        }

        .blog-article h1 {
          font-size: 2.25rem;
          line-height: 2.75rem;
          letter-spacing: -0.025em;
          margin: 3.5rem 0 2rem;
        }

        .blog-article h2 {
          font-size: 1.875rem;
          line-height: 2.5rem;
          letter-spacing: -0.025em;
          margin: 3.5rem 0 2rem;
        }

        .blog-article h3 {
          font-size: 1.5rem;
          line-height: 2.25rem;
          letter-spacing: -0.025em;
          margin: 2.5rem 0 1rem;
        }

        .blog-article h4 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          margin: 2rem 0 0.75rem;
        }

        .blog-article p {
          margin: 0 0 1.5rem;
        }

        .blog-article ul,
        .blog-article ol {
          margin: 1.5rem 0;
          padding-left: 1.25rem;
        }

        .blog-article ul {
          list-style-type: disc;
        }

        .blog-article ol {
          list-style-type: decimal;
        }

        .blog-article li {
          margin: 0.75rem 0;
          padding-left: 0.25rem;
        }

        .blog-article li::marker {
          color: #71717a;
        }

        .blog-article strong {
          color: #18181b;
          font-weight: 600;
        }

        .blog-article a {
          color: #5530fa;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease;
        }

        .blog-article a:hover {
          color: #f51da5;
        }

        .blog-article img {
          display: block;
          width: 100%;
          height: auto;
          margin: 2rem 0;
          border: 1px solid #e5e5e5;
          border-radius: 0.75rem;
        }

        .blog-article picture {
          display: block;
        }

        .blog-article figure {
          margin: 2rem 0;
        }

        .blog-article p.figure-caption {
          margin-top: -1rem;
          font-size: 1rem;
          line-height: 1.5rem;
          color: #52525b;
        }

        .blog-article .video-embed iframe {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          border: 1px solid #e5e5e5;
          border-radius: 0.75rem;
        }

        .blog-article figcaption {
          margin-top: 0.75rem;
          font-size: 1rem;
          font-style: italic;
          color: #52525b;
        }

        .blog-article blockquote {
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          border-left: 4px solid #5530fa;
          background: #f7f5ff;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #27272a;
          font-style: italic;
        }

        .blog-article hr {
          margin: 3rem 0;
          border: 0;
          border-top: 1px solid #e5e5e5;
        }

        .blog-article code {
          background: #f4f4f5;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #18181b;
        }

        .blog-article pre {
          background: #18181b;
          color: #e4e4e7;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .blog-article pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        /* Tables from the CMS editor */
        .blog-article .lexical-table-container {
          margin: 2rem 0;
          overflow-x: auto;
        }

        .blog-article table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .blog-article .lexical-table-container table {
          margin: 0;
        }

        .blog-article th,
        .blog-article td {
          border: 1px solid #e5e5e5 !important;
          padding: 0.75rem 1rem !important;
          text-align: left;
          vertical-align: top;
        }

        .blog-article th {
          background: #f7f7f8;
          color: #18181b;
          font-weight: 600;
        }

        .blog-article th p,
        .blog-article td p {
          margin: 0;
        }

        .blog-article td ol,
        .blog-article td ul {
          margin: 0;
        }
      `}</style>
        </div>
    );
}