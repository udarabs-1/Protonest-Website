'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isCmsImage } from "@/lib/cms-blogs";
import type { TocItem } from "@/lib/article-html";
import { articleFont } from "./fonts";
import SocialIcon, { type SocialIconName } from "@/app/components/social-icon";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { CONTACT_DETAILS } from "@/lib/contact-details";


export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    categories: string[];
    keywords?: string[];
    author: string;
    author_role?: string;
    author_photo?: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

const calculateReadTime = (content: string): string => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed);
    return `${minutes} min read`;
};

// "October 20, 2026" for the article header
const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Colombo' });

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

// Row of share icons: Facebook, LinkedIn, WhatsApp, and "Other" for the device's own share sheet
const ShareButtons = ({ url, title }: { url: string; title: string }) => {
    const [copied, setCopied] = useState(false);

    const u = encodeURIComponent(url);
    const links: { name: SocialIconName; label: string; href: string }[] = [
        { name: 'facebook', label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
        { name: 'linkedin', label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { name: 'whatsapp', label: 'Share on WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    ];

    // Opens the system share sheet where supported (phones, Safari, Chrome on Windows);
    // otherwise copies the link so it can be pasted anywhere
    const shareOther = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // Closing the share sheet rejects; nothing to do
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy this link:', url);
        }
    };

    return (
        <div className="mt-5 flex items-center gap-7 text-[#37352f]">
            {links.map(({ name, label, href }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="transition-colors hover:text-[#5530fa]"
                >
                    <SocialIcon name={name} size={28} />
                </a>
            ))}
            <button
                type="button"
                onClick={shareOther}
                aria-label="Share another way"
                title="Other"
                className="relative transition-colors hover:text-[#5530fa]"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                </svg>
                {copied && (
                    <span role="status" className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0a0a0a] px-2 py-1 text-xs text-white">
                        Link copied
                    </span>
                )}
            </button>
        </div>
    );
};

const TableOfContents = ({ items, isMobile = false }: { items: TocItem[], isMobile?: boolean }) => {
    const [activeId, setActiveId] = useState<string>('');
    // The box follows the reader only when the whole list fits on screen; a long list
    // scrolls with the page instead, so no item is ever hidden or needs an inner scrollbar
    const asideRef = useRef<HTMLElement>(null);
    const [fitsOnScreen, setFitsOnScreen] = useState(true);

    useEffect(() => {
        const aside = asideRef.current;
        if (!aside) return;
        const check = () => setFitsOnScreen(aside.offsetHeight <= window.innerHeight - 120);
        check();
        const observer = new ResizeObserver(check);
        observer.observe(aside);
        window.addEventListener('resize', check);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', check);
        };
    }, [items]);

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
        <div className="article-toc rounded-lg border border-[#e5e5e5] bg-white p-6 w-full">
            <h2 className="text-lg font-semibold tracking-tight text-[#0a0a0a]">
                In this article
            </h2>
            {/* The full list is shown, with no inner scrollbar, like the Protonest Master blog */}
            <nav className="mt-5">
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={item.level === 3 ? 'ml-4' : ''}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`block text-[0.9375rem] leading-6 transition-colors ${activeId === item.id
                                    ? 'text-[#0a0a0a] font-semibold'
                                    : 'text-[#3f3f46] hover:text-[#5530fa]'
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
        <aside ref={asideRef} className={`hidden lg:block h-fit self-start ${fitsOnScreen ? 'sticky top-24' : ''}`}>
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

// The article page. The server page (page.tsx) loads the post from the CMS and prepares its
// HTML, so the full article is in the page HTML that search engines read.
export default function BlogArticle({
    blog,
    tocItems,
    suggestedBlogs,
}: {
    blog: Blog;
    tocItems: TocItem[];
    suggestedBlogs: Blog[];
}) {
    const publishDate = blog.published_at || blog.created_at;

    const shareUrl = `https://protonest.co/blog/${blog.slug}`;
    const followLinks: { name: SocialIconName; label: string; href: string }[] = [
        { name: 'x', label: 'Protonest IoT on X', href: SOCIAL_LINKS.x },
        { name: 'linkedin', label: 'Protonest IoT on LinkedIn', href: SOCIAL_LINKS.linkedin },
        { name: 'facebook', label: 'Protonest IoT on Facebook', href: SOCIAL_LINKS.facebook },
        { name: 'youtube', label: 'Protonest IoT on YouTube', href: SOCIAL_LINKS.youtube },
        { name: 'instagram', label: 'Protonest IoT on Instagram', href: SOCIAL_LINKS.instagram },
        { name: 'email', label: `Email ${CONTACT_DETAILS.email}`, href: `mailto:${CONTACT_DETAILS.email}` },
    ];

    return (
        <div className="overflow-x-hidden" id="article-top">
            <Navbar />

            <div className={`${articleFont.variable} article-page mx-auto w-full max-w-[1360px] px-4 sm:px-6 py-12 lg:py-16`}>
                {/* The article sits in a centred column; the back link uses the left margin and the table of contents the right */}
                <div className="mx-auto max-w-[780px] lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-[240px_minmax(0,780px)_240px] lg:justify-center lg:gap-x-10">
                    <div className="lg:col-start-1 lg:pt-1">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-base text-[#52525b] transition-colors hover:text-[#0a0a0a]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            All posts
                        </Link>
                    </div>

                    <header className="mt-8 min-w-0 lg:col-start-2 lg:mt-0">
                        <p className="text-lg sm:text-xl text-[#55534e]">
                            Published <time dateTime={publishDate}>{formatDate(publishDate)}</time>
                            {blog.categories?.[0] && (
                                <>
                                    {' '}in{' '}
                                    <Link href="/blog" className="underline underline-offset-4 hover:text-[#5530fa]">
                                        {blog.categories[0]}
                                    </Link>
                                </>
                            )}
                        </p>

                        <h1 className="mt-6 text-[2.5rem] sm:text-[3.25rem] lg:text-[4.25rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#191919] text-balance">
                            {blog.title}
                        </h1>

                        <div className="mt-7 flex items-center gap-4">
                            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-[#e5e5e5] bg-white">
                                {blog.author_photo ? (
                                    <Image
                                        src={blog.author_photo}
                                        unoptimized={isCmsImage(blog.author_photo)}
                                        alt={blog.author}
                                        fill
                                        sizes="72px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <Image src="/logo-mark.png" alt="Protonest IoT" fill sizes="72px" className="object-contain p-4" />
                                )}
                            </div>
                            <div>
                                <p className="text-lg sm:text-xl text-[#191919]">By {blog.author}</p>
                                {blog.author_role && <p className="mt-0.5 text-base text-[#9b9a97]">{blog.author_role}</p>}
                            </div>
                        </div>

                        <div className="mt-14">
                            <p className="text-base uppercase tracking-[0.06em] text-[#55534e]">Share this post</p>
                            <ShareButtons url={shareUrl} title={blog.title} />
                        </div>

                        <hr className="mt-14 w-[90px] border-0 border-t border-[#e9e9e7]" />
                    </header>

                    {blog.cover_image && (
                        <>
                            <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] lg:col-start-2">
                                <Image
                                    src={blog.cover_image}
                                    unoptimized={isCmsImage(blog.cover_image)}
                                    alt={blog.title}
                                    fill
                                    sizes="(max-width: 780px) 100vw, 780px"
                                    className="object-cover"
                                    priority={true}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <div className="min-w-0 mt-10 lg:col-start-2 lg:mt-14">
                        <div className="lg:hidden">
                            <TableOfContents items={tocItems} isMobile={true} />
                        </div>

                        <article
                            className="blog-article"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        <section className="mt-16 flex flex-col gap-6 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                            <div>
                                <p className="text-lg font-semibold text-[#0a0a0a]">Follow Protonest IoT</p>
                                <p className="mt-1 text-sm text-[#52525b]">IoT product development insights, project updates and new articles.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {followLinks.map(({ name, label, href }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target={name === 'email' ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e4e7] bg-white text-[#27272a] transition-colors hover:border-[#5530fa] hover:text-[#5530fa]"
                                    >
                                        <SocialIcon name={name} size={20} />
                                    </a>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* After the article in the markup so the grid puts it in the right column of the same row */}
                    <div className="hidden lg:block lg:col-start-3 lg:mt-14">
                        <TableOfContents items={tocItems} isMobile={false} />
                    </div>
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
        .article-page {
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
          /* Large images fill the column; small ones keep their real size so they stay sharp */
          width: auto;
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
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

        /* Quotes in the CMS show as a callout box with a light bulb, like Notion's blog */
        .blog-article blockquote {
          position: relative;
          margin: 2.5rem 0;
          padding: 1.5rem 1.75rem 1.5rem 5.25rem;
          border: 0;
          background: #f2f8fe;
          border-radius: 1rem;
          color: #37352f;
          font-style: italic;
        }

        .blog-article blockquote::before {
          content: '';
          position: absolute;
          left: 1.75rem;
          top: 1.4rem;
          width: 2.5rem;
          height: 2.75rem;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 44' fill='none' stroke='%232f5f8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 31c0-4-6-8-6-15a13 13 0 0 1 26 0c0 7-6 11-6 15z'/%3E%3Cpath d='M14 35h12M15 39h10M17 43h6'/%3E%3Cpath d='M17 31V20l-3-4M23 31V20l3-4M17 20h6'/%3E%3C/svg%3E") no-repeat center / contain;
        }

        .blog-article blockquote p {
          margin: 0;
        }

        @media (max-width: 640px) {
          .blog-article blockquote {
            padding: 4.25rem 1.25rem 1.25rem;
          }

          .blog-article blockquote::before {
            left: 1.25rem;
            top: 1.25rem;
          }
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