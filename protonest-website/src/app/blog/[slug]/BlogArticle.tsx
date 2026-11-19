'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { skipImageOptimization } from "@/lib/cms-blogs";
import type { TocItem } from "@/lib/article-html";
import { articleFont } from "./fonts";
import "./article.css";
import SocialIcon, { type SocialIconName } from "@/app/components/social-icon";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { CONTACT_DETAILS } from "@/lib/contact-details";
import { BLOG_EDGE_PADDING, BLOG_EDGE_WIDTH } from "@/lib/blog-layout";


export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    cover_card?: string;
    cover_blur?: string;
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
    const u = encodeURIComponent(url);
    // Same set as Notion's blog: X, LinkedIn, Facebook, Email
    const links: { name: SocialIconName; label: string; href: string }[] = [
        { name: 'x', label: 'Share on X', href: `https://x.com/intent/post?url=${u}&text=${encodeURIComponent(title)}` },
        { name: 'linkedin', label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { name: 'facebook', label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
        { name: 'email', label: 'Share by email', href: `mailto:?subject=${encodeURIComponent(title)}&body=${u}` },
    ];

    return (
        <div className="mt-2 -ml-2 flex items-center gap-1 text-[#37352f]">
            {links.map(({ name, label, href }) => (
                <a
                    key={name}
                    href={href}
                    target={name === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-black/5 hover:text-[#5530fa]"
                >
                    <SocialIcon name={name} size={17} />
                </a>
            ))}
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
                        src={blog.cover_card || blog.cover_image || '/logo-mark.png'}
                        unoptimized={skipImageOptimization(blog.cover_card || blog.cover_image)}
                        placeholder={blog.cover_blur ? 'blur' : 'empty'}
                        blurDataURL={blog.cover_blur}
                        alt={blog.title}
                        width={472}
                        height={164}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:grayscale"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 472px"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/logo-mark.png';
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

            <div className={`${articleFont.variable} article-page w-full ${BLOG_EDGE_PADDING} py-12 lg:py-16`}>
                {/* Same side space and width as the navbar on every screen: below 1024px the phone/tablet navbar
                    (16px, then 32px from 768px); from 1024px the desktop navbar's padding and container width */}
                <div className={BLOG_EDGE_WIDTH}>
                {/* Three columns on laptops and desktops (1024px+), as in the sketch:
                    "All posts" (in line with the logo) | title, share and article | "In this article" (in line with
                    "Book a Call"). The side columns grow with the screen; from 1440px they are the same width,
                    so the article sits in the centre. Phones and tablets: one column, contents above the article.
                    The side padding is the navbar's, so the edges match on every screen. */}
                <div className="lg:grid lg:grid-cols-[140px_minmax(0,1fr)_180px] lg:gap-x-8 xl:grid-cols-[170px_minmax(0,1fr)_210px] xl:gap-x-10 min-[90rem]:grid-cols-[220px_minmax(0,920px)_220px] min-[90rem]:justify-between min-[90rem]:gap-x-12">
                    <div className="lg:col-start-1 lg:row-start-1">
                        <Link
                            href="/blog"
                            className="inline-flex h-[22px] items-center gap-1 text-[0.95rem] leading-[22px] text-black/60 transition-colors hover:text-[#0a0a0a]"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            All posts
                        </Link>
                    </div>

                    <header className="mt-8 min-w-0 lg:col-start-2 lg:row-start-1 lg:mt-0">
                        <p className="text-[0.95rem] leading-[22px] text-black/60">
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

                        <h1 className="mt-[36px] text-[2.25rem] sm:text-[3rem] lg:text-[2.75rem] xl:text-[3rem] font-bold leading-[1.04] tracking-[-0.035em] text-black/90 text-balance">
                            {blog.title}
                        </h1>

                        <div className="mt-[46px] flex items-center gap-2.5">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#e5e5e5] bg-white">
                                {blog.author_photo ? (
                                    <Image
                                        src={blog.author_photo}
                                        unoptimized={skipImageOptimization(blog.author_photo)}
                                        alt={blog.author}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <Image src="/logo-mark.png" alt="Protonest IoT" fill sizes="48px" className="object-contain p-2.5" />
                                )}
                            </div>
                            <div>
                                <p className="text-[0.95rem] leading-5 text-black/90">By {blog.author}</p>
                                {blog.author_role && <p className="text-[0.95rem] leading-5 tracking-[0.01em] text-[#a39e98]">{blog.author_role}</p>}
                            </div>
                        </div>

                        <div className="mt-12 sm:mt-[50px] xl:mt-[52px]">
                            <p className="text-[0.95rem] font-medium uppercase tracking-[0.06em] text-black/55">Share this post</p>
                            <ShareButtons url={shareUrl} title={blog.title} />
                        </div>

                        <hr className="mt-8 w-[90px] border-0 border-t border-[#e9e9e7]" />
                    </header>

                    {blog.cover_image && (
                        <>
                            <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] lg:col-start-2">
                                <Image
                                    src={blog.cover_image}
                                    unoptimized={skipImageOptimization(blog.cover_image)}
                                    alt={blog.title}
                                    fill
                                    sizes="(max-width: 780px) 100vw, 780px"
                                    placeholder={blog.cover_blur ? 'blur' : 'empty'}
                                    blurDataURL={blog.cover_blur}
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

                    {/* Right column, starting level with the first paragraph (under the cover image); placed after
                        the article in the markup so the grid puts it in the same row. It follows the reader down. */}
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
            </div>

            <Footer />

        </div>
    );
}