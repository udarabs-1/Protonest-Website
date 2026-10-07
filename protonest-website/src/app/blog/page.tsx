'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import PageHero from "@/app/components/page-hero";
import { useOnScreen } from "@/app/components/use-on-screen";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NewsletterSubscription from "../components/newsletter-subscription";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  categories: string[];
  author: string;
  published: boolean;
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

const calculateReadTime = (content: string): string => {
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const readingSpeed = 200;
  const minutes = Math.ceil(wordCount / readingSpeed);
  return `${minutes} min read`;
};

const CategoryCard = ({
  category,
  isSelected,
  onClick
}: {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-14 xl:h-[65.89px] min-w-[140px] px-3 sm:px-6 py-2 sm:py-4 rounded-full xl:rounded-[57px] border flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer group ${isSelected
        ? 'bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)] border-transparent'
        : 'gradient-button-static-3 hover:bg-gradient-to-r hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)]'
        }`}
    >
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0">
        <div className={`text-xs sm:text-base font-medium font-['Montserrat'] whitespace-pre-line leading-tight overflow-hidden text-center ${isSelected
          ? 'text-white'
          : 'text-[#6c6c6c] group-hover:text-white'
          }`}>
          {category}
        </div>
      </div>
    </button>
  );
};

const BlogCard = ({ blog }: { blog: Blog }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const shouldShowEffects = isMobile ? isVisible : false;

  const excerpt = blog.excerpt || extractExcerpt(blog.content);
  const readTime = calculateReadTime(blog.content);

  return (
    <Link href={`/blog/${blog.slug}`} passHref>
      <article
        ref={ref}
        className={`group w-full h-full relative bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-6 lg:p-8 transition-all duration-300 md:hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] ${shouldShowEffects ? 'shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)]' : ''
          }`}
      >

        <div className="relative w-full aspect-video rounded-[11px] overflow-hidden mb-6">
          <Image
            src={blog.cover_image || '/default-blog-image.jpg'}
            alt={blog.title}
            width={472}
            height={164}
            className={`w-full h-full object-cover transition-all duration-300 md:group-hover:scale-105 md:group-hover:grayscale ${shouldShowEffects ? 'scale-105 grayscale' : ''
              }`}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 472px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-blog-image.jpg';
            }}
          />

          <button className={`absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-10 bg-[#A3A3A3] font-poppins text-sm transition-all duration-300 rounded-md md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 ${shouldShowEffects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
              Read More
            </span>
          </button>
        </div>


        <div className="space-y-4">
          <h3 className={`text-[16px] xl:text-[18px] font-medium font-poppins leading-[1.4] transition-all duration-300 md:text-[#6c6c6c] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[#5530FA] md:to-[#F51DA5] ${shouldShowEffects ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]' : 'text-[#6c6c6c]'
            }`}>
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

export default function BlogSection() {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          setCategories(result.data.map((cat: { name: string }) => cat.name));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchBlogs = useCallback(async (category?: string | null) => {
    try {
      setLoading(true);
      setError(null);

      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs?published=true&limit=100`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const result = await response.json();

      if (result.status === 'success') {
        const blogsList = Array.isArray(result.data?.blogs)
          ? result.data.blogs
          : (Array.isArray(result.data) ? result.data : []);
        setBlogs(blogsList);
      } else {
        throw new Error(result.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, [fetchCategories, fetchBlogs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [loading]);

  useEffect(() => {
    fetchBlogs(selectedCategory);
    setShowAllBlogs(false);
    setSearchTerm('');
  }, [selectedCategory, fetchBlogs]);

  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkScreenSize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [checkScreenSize]);

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    if (!searchTerm.trim()) return blogs;

    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const { visibleBlogs, shouldShowLoadMoreButton } = useMemo(() => {
    const list = Array.isArray(filteredBlogs) ? filteredBlogs : [];
    const limit = isMobile ? 3 : 6;
    const visibleCount = showAllBlogs ? list.length : limit;
    const visibleBlogs = list.slice(0, visibleCount);
    const shouldShowLoadMoreButton = list.length > limit;

    return { visibleBlogs, shouldShowLoadMoreButton };
  }, [filteredBlogs, isMobile, showAllBlogs]);

  const handleLoadMore = useCallback(() => {
    setShowAllBlogs(prev => !prev);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  }, [selectedCategory]);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowAllBlogs(false);
  }, []);

  if (loading) {
    return (
      <div>
        <BlogJsonLd />
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#6c6c6c] font-poppins">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style jsx global>{`
        .gradient-icon-default svg {
            width: 100%;
            height: 100%;
        }
        
        .gradient-icon-default svg path {
            fill: url(#icon-gradient-default) !important;
        }
        
        .gradient-icon-default svg circle {
            fill: url(#icon-gradient-default) !important;
        }
        
        .gradient-icon-default svg rect {
            fill: url(#icon-gradient-default) !important;
        }
        
        .gradient-icon-default svg polygon {
            fill: url(#icon-gradient-default) !important;
        }

        .group:hover .gradient-icon-default svg path {
            fill: white !important;
        }
        
        .group:hover .gradient-icon-default svg circle {
            fill: white !important;
        }
        
        .group:hover .gradient-icon-default svg rect {
            fill: white !important;
        }
        
        .group:hover .gradient-icon-default svg polygon {
            fill: white !important;
        }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="icon-gradient-default" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5530FA" />
            <stop offset="100%" stopColor="#F51DA5" />
          </linearGradient>
        </defs>
      </svg>

      <BlogJsonLd />
      <Navbar />
      <main className="mb-30">

        <PageHero
          backgroundImage="/blogs-1.webp"
          heading={{
            gradientText: "Blog"
          }}
          description="IoT Related Insights, and Innovations"
        />

        <section className="relative z-30 -mt-[100px] px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="py-4 w-full">
            {selectedCategory ? (
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 text-[#6c6c6c] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#5530FA] hover:to-[#F51DA5] group cursor-pointer"
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
                    className="group-hover:stroke-[#5530FA]"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span className="font-poppins text-sm font-medium">All Categories</span>
                </button>
                <span className="text-[#6c6c6c] font-poppins text-sm">/</span>
                <span className="text-[#6c6c6c] font-poppins text-sm font-semibold">
                  {selectedCategory}
                </span>
              </div>
            ) : categories.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-[#6c6c6c] text-xl font-medium font-montserrat mb-6">Browse by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-6 w-full">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category}
                      category={category}
                      isSelected={selectedCategory === category}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="relative z-30 px-4 sm:px-8 lg:px-[60px] xl:px-[130px] 2xl:px-[180px]">

          <form onSubmit={handleSearch} className="relative h-[50px] sm:h-[55px] w-full opacity-70 bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-8 sm:mb-12">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full h-full pl-9 pr-12 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins leading-normal focus:outline-none"
              placeholder="Search for what you are looking for"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
              <Image
                src="/search.svg"
                alt="Search"
                width={24}
                height={24}
                className="w-full h-full text-[#6c6c6c]"
              />
            </div>
          </form>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin"></div>
              <span className="ml-3 text-[#6c6c6c] font-poppins">Loading blogs...</span>
            </div>
          )}


          {error && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-red-600 font-poppins mb-4">{error}</p>
                <button
                  onClick={() => fetchBlogs(selectedCategory)}
                  className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}


          {!loading && !error && blogs.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-[#6c6c6c] font-poppins text-lg">
                  {selectedCategory
                    ? `No blogs available in "${selectedCategory}" category.`
                    : 'No blogs available at the moment.'
                  }
                </p>
                <p className="text-[#6c6c6c] font-poppins text-sm mt-2">Check back later for new content!</p>
                {selectedCategory && (
                  <button
                    onClick={handleBackToCategories}
                    className="mt-4 px-6 py-2 gradient-button font-poppins transition-all"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && filteredBlogs.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-[#6c6c6c] font-poppins text-lg">No results found for your search.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-poppins transition-all hover:shadow-[0_10px_20px_-10px_rgba(85,48,250,0.5)]"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}


          {!loading && !error && visibleBlogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12">
              {visibleBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}


          {!loading && !error && shouldShowLoadMoreButton && (
            <div className="flex justify-center mt-8 sm:mt-12">
              <button
                onClick={handleLoadMore}
                className="h-[50px] w-[160px] sm:w-[180px] font-medium xl:font-semibold text-[14px] sm:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                aria-expanded={showAllBlogs}
                aria-label={showAllBlogs ? "Show fewer blog posts" : "Show more blog posts"}
              >
                {showAllBlogs ? 'Show Less' : 'Load More'}
              </button>
            </div>
          )}



          <NewsletterSubscription />
        </section>
      </main>

      <Footer />
    </div>
  );
}
