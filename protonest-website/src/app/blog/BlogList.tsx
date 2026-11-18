'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import NewsletterSubscription from "../components/newsletter-subscription";
import { skipImageOptimization } from "@/lib/cms-blogs";
import { BLOG_EDGE_PADDING, BLOG_EDGE_WIDTH } from "@/lib/blog-layout";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  cover_card?: string;
  cover_blur?: string;
  categories: string[];
  author: string;
  author_role?: string;
  author_photo?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const blogJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://protonest.co/#organization",
      name: "Protonest",
      url: "https://protonest.co/",
      logo: {
        "@type": "ImageObject",
        url: "https://protonest.co/logo.webp",
      },
      description:
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
      sameAs: [
        "https://lk.linkedin.com/company/protonestiot",
        "https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about",
        "https://x.com/ProtonestIoT",
        "https://www.facebook.com/profile.php?id=61562590660146",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://protonest.co/#website",
      url: "https://protonest.co/",
      name: "Protonest",
      publisher: {
        "@id": "https://protonest.co/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "CollectionPage",
      "@id": "https://protonest.co/blog#webpage",
      url: "https://protonest.co/blog",
      name: "Blog | Protonest",
      description:
        "Read the Protonest IoT blog for practical articles, guides, reliability tests, and product development insights.",
      isPartOf: {
        "@id": "https://protonest.co/#website",
      },
      about: {
        "@id": "https://protonest.co/#organization",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://protonest.co/og-image-home.png",
        width: 1200,
        height: 630,
        caption: "Protonest IoT blog articles and product development insights",
      },
      breadcrumb: {
        "@id": "https://protonest.co/blog#breadcrumb",
      },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://protonest.co/blog#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://protonest.co/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://protonest.co/blog",
        },
      ],
    },
  ],
};

const BlogJsonLd = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c"),
    }}
  />
);

const toText = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

const extractExcerpt = (htmlContent: string, maxLength: number = 160): string => {
  const text = toText(htmlContent);
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  return (lastSpaceIndex > -1 ? truncated.substring(0, lastSpaceIndex) : truncated) + '…';
};

const calculateReadTime = (content: string): string => {
  const minutes = Math.max(1, Math.ceil(toText(content).split(' ').length / 200));
  return `${minutes} min read`;
};

// Same time zone on the server and in the browser, so the date never changes after loading
const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Colombo' })
    : '';

// Grid cards start from the CMS's smaller "card" copy (768 px), so the first load is quick;
// the featured post uses the original. A blurred preview shows until the picture arrives.
const Cover = ({ blog, sizes, priority = false, eager = false }: { blog: Blog; sizes: string; priority?: boolean; eager?: boolean }) => {
  const src = priority ? blog.cover_image : blog.cover_card || blog.cover_image;
  return (
  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#ececeb] bg-[#f7f7f5]">
    {src ? (
      <Image
        src={src}
        unoptimized={skipImageOptimization(src)}
        alt={blog.title}
        fill
        sizes={sizes}
        priority={priority}
        // The first row starts loading with the page instead of waiting until it is scrolled to
        loading={priority ? undefined : eager ? 'eager' : 'lazy'}
        placeholder={blog.cover_blur ? 'blur' : 'empty'}
        blurDataURL={blog.cover_blur}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    ) : (
      <Image src="/logo-mark.png" alt="" fill sizes="120px" className="object-contain p-12 opacity-40" />
    )}
  </div>
  );
};

const Byline = ({ blog }: { blog: Blog }) => (
  <div className="mt-5 flex items-center gap-3 text-sm text-[#787774]">
    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[#ececeb] bg-white">
      {blog.author_photo ? (
        <Image src={blog.author_photo} unoptimized={skipImageOptimization(blog.author_photo)} alt="" fill sizes="28px" className="object-cover" />
      ) : (
        <Image src="/logo-mark.png" alt="" fill sizes="28px" className="object-contain p-1" />
      )}
    </span>
    <span className="truncate">
      <span className="text-[#37352f]">{blog.author}</span>
      {' · '}
      {formatDate(blog.published_at || blog.created_at)}
      {' · '}
      {calculateReadTime(blog.content)}
    </span>
  </div>
);

// The newest post, shown large above the grid
const FeaturedCard = ({ blog }: { blog: Blog }) => (
  <Link href={`/blog/${blog.slug}`} className="group grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
    <Cover blog={blog} sizes="(max-width: 768px) 100vw, 700px" priority />
    <div>
      {blog.categories?.[0] && <p className="text-sm font-medium text-[#787774]">{blog.categories[0]}</p>}
      <h2 className="mt-3 text-[1.75rem] sm:text-[2.25rem] font-bold leading-[1.15] tracking-[-0.015em] text-[#191919] group-hover:underline decoration-2 underline-offset-4">
        {blog.title}
      </h2>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-[#55534e] line-clamp-3">{blog.excerpt || extractExcerpt(blog.content, 220)}</p>
      <Byline blog={blog} />
    </div>
  </Link>
);

const BlogCard = ({ blog, eager = false }: { blog: Blog; eager?: boolean }) => (
  <Link href={`/blog/${blog.slug}`} className="group flex h-full flex-col">
    <Cover blog={blog} eager={eager} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px" />
    {blog.categories?.[0] && <p className="mt-5 text-sm font-medium text-[#787774]">{blog.categories[0]}</p>}
    <h3 className="mt-2 text-xl font-bold leading-[1.3] tracking-[-0.01em] text-[#191919] group-hover:underline decoration-2 underline-offset-4">
      {blog.title}
    </h3>
    <p className="mt-3 text-[0.95rem] leading-relaxed text-[#55534e] line-clamp-3">{blog.excerpt || extractExcerpt(blog.content)}</p>
    <div className="mt-auto">
      <Byline blog={blog} />
    </div>
  </Link>
);

// The blog list. The server page (page.tsx) loads the posts and categories from the CMS, so the
// list is in the page HTML that search engines read; filtering and search happen here.
export default function BlogList({
  initialBlogs,
  categories,
}: {
  initialBlogs: Blog[];
  categories: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Only categories that have posts, in the CMS order
  const usedCategories = useMemo(
    () => categories.filter((category) => initialBlogs.some((blog) => blog.categories.includes(category))),
    [categories, initialBlogs],
  );

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialBlogs.filter(
      (blog) =>
        (!selectedCategory || blog.categories.includes(selectedCategory)) &&
        (!term || blog.title.toLowerCase().includes(term) || toText(blog.content).toLowerCase().includes(term)),
    );
  }, [initialBlogs, selectedCategory, searchTerm]);

  // The newest post is featured on the main view; filtering or searching shows a plain grid
  const featured = !selectedCategory && !searchTerm.trim() ? filteredBlogs[0] : undefined;
  const gridBlogs = featured ? filteredBlogs.slice(1) : filteredBlogs;
  const limit = isMobile ? 4 : 9;
  const visibleBlogs = showAllBlogs ? gridBlogs : gridBlogs.slice(0, limit);

  const selectCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setShowAllBlogs(false);
  }, []);

  const tabClass = (active: boolean) =>
    `-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[0.95rem] transition-colors ${
      active ? 'border-[#191919] font-semibold text-[#191919]' : 'border-transparent text-[#787774] hover:text-[#191919]'
    }`;

  return (
    <div className="overflow-x-hidden bg-white">
      <BlogJsonLd />
      <Navbar />
      <main className={`w-full ${BLOG_EDGE_PADDING} pt-12 pb-20 lg:pt-16 font-montserrat`}>
        {/* Same side space and width as the navbar: phone/tablet navbar below 1024px, desktop navbar above */}
        <div className={BLOG_EDGE_WIDTH}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-[760px]">
            <p className="text-base font-medium text-[#787774]">Protonest Blog</p>
            <h1 className="mt-3 text-[2.5rem] sm:text-[3.5rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#191919]">
              IoT insights and guides
            </h1>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#55534e]">
              Practical articles on choosing sensors, batteries, displays and cloud backends, and on building reliable IoT products.
            </p>
          </header>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full shrink-0 md:max-w-[420px] lg:w-[300px] lg:max-w-none">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b9a97]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAllBlogs(false);
              }}
              aria-label="Search the blog"
              placeholder="Search articles"
              className="h-11 w-full rounded-lg border border-[#e3e2e0] bg-white pl-9 pr-3 text-[0.95rem] text-[#37352f] placeholder:text-[#9b9a97] focus:border-[#191919] focus:outline-none"
            />
          </form>
        </div>

        {/* Category tabs; they scroll sideways when there are many */}
        <nav aria-label="Blog categories" className="mt-12 flex gap-7 overflow-x-auto border-b border-[#ececeb] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button type="button" onClick={() => selectCategory(null)} className={tabClass(!selectedCategory)}>
            All posts
          </button>
          {usedCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(selectedCategory === category ? null : category)}
              className={tabClass(selectedCategory === category)}
            >
              {category}
            </button>
          ))}
        </nav>

        {filteredBlogs.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-lg text-[#37352f]">
              {searchTerm.trim()
                ? `No articles found for "${searchTerm.trim()}".`
                : selectedCategory
                  ? `No articles in "${selectedCategory}" yet.`
                  : 'No articles yet. Check back soon.'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  selectCategory(null);
                }}
                className="mt-5 rounded-lg border border-[#e3e2e0] px-5 py-2 text-[0.95rem] text-[#37352f] hover:bg-[#f7f7f5]"
              >
                Show all posts
              </button>
            )}
          </div>
        )}

        {featured && (
          <section className="mt-12" aria-label="Latest post">
            <FeaturedCard blog={featured} />
          </section>
        )}

        {visibleBlogs.length > 0 && (
          <section
            aria-label={selectedCategory ? `${selectedCategory} posts` : 'All posts'}
            className={`grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-16 border-t border-[#ececeb] pt-14' : 'mt-12'}`}
          >
            {visibleBlogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} eager={i < 3} />
            ))}
          </section>
        )}

        {gridBlogs.length > limit && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllBlogs((prev) => !prev)}
              aria-expanded={showAllBlogs}
              className="rounded-lg border border-[#e3e2e0] px-6 py-2.5 text-[0.95rem] font-medium text-[#37352f] transition-colors hover:bg-[#f7f7f5]"
            >
              {showAllBlogs ? 'Show fewer posts' : `Show all ${gridBlogs.length} posts`}
            </button>
          </div>
        )}

        <div className="mt-20">
          <NewsletterSubscription />
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
