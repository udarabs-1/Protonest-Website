'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import { useOnScreen } from "@/app/components/use-on-screen";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

interface SubscriptionForm {
  name: string;
  email: string;
  career_updates: boolean;
  newsletter: boolean;
}

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

        <div className="relative w-full aspect-[472/164] rounded-[11px] overflow-hidden mb-6">
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

          <div className="flex flex-wrap gap-2">
            {blog.categories.map((tag: string, index: number) => (
              <div key={`${tag}-${index}`} className="h-[29px] px-3 py-2 rounded-[30px] outline-1 outline-offset-[-1px] outline-[#d5d5d5] inline-flex justify-center items-center">
                <div className="text-[#83848b] text-[10px] font-normal font-poppins leading-normal">
                  {tag}
                </div>
              </div>
            ))}
          </div>

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
    name: '',
    email: '',
    career_updates: false,
    newsletter: true
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs?published=true`, {
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
        setBlogs(result.data || []);
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
    fetchBlogs();
  }, [fetchBlogs]);

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

  const allCategories = useMemo(() =>
    Array.from(new Set(blogs.flatMap(blog => blog.categories)))
      .filter(category => category && category.trim() !== '')
      .sort((a: string, b: string) => a.localeCompare(b)),
    [blogs]
  );

  const filteredBlogs = useMemo(() =>
    blogs.filter(blog =>
      selectedCategories.every(cat => blog.categories.includes(cat))
    ),
    [blogs, selectedCategories]
  );

  const { visibleBlogs, shouldShowLoadMoreButton } = useMemo(() => {
    const blogsToDisplay = selectedCategories.length > 0 ? filteredBlogs : blogs;
    const limit = isMobile ? 3 : 6;
    const visibleCount = showAllBlogs ? blogsToDisplay.length : limit;
    const visibleBlogs = blogsToDisplay.slice(0, visibleCount);
    const shouldShowLoadMoreButton = blogsToDisplay.length > limit;

    return { visibleBlogs, shouldShowLoadMoreButton };
  }, [blogs, filteredBlogs, selectedCategories, isMobile, showAllBlogs]);

  const handleLoadMore = useCallback(() => {
    setShowAllBlogs(prev => !prev);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    const matchedCategories = allCategories.filter((cat: string) =>
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedCategories.length > 0) {
      const newCategories = matchedCategories.filter(
        (cat: string) => !selectedCategories.includes(cat)
      );

      if (newCategories.length > 0) {
        setSelectedCategories(prev => [...prev, ...newCategories]);
      }
    }

    setSearchTerm("");
    setShowAllBlogs(false);
  }, [searchTerm, allCategories, selectedCategories]);

  const removeCategory = useCallback((category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
    setShowAllBlogs(false);
  }, []);

  const handleSubscriptionSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionStatus('loading');
    setSubscriptionMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subscriptionForm.name,
          email: subscriptionForm.email,
          career_updates: subscriptionForm.career_updates,
          newsletter: subscriptionForm.newsletter
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('success');
        setSubscriptionMessage(data.message || 'Subscription successful! Thank you for subscribing.');
        setSubscriptionForm({
          name: '',
          email: '',
          career_updates: false,
          newsletter: true
        });
      } else {
        setSubscriptionStatus('error');
        setSubscriptionMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
      setSubscriptionMessage('An error occurred. Please try again later.');
    }
  }, [subscriptionForm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSubscriptionForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div>
      <Head>

        <title>Blog - Protonest</title>
        <meta
          name="description"
          content="Explore Protonest's IoT blog for expert insights on prototyping, hardware development, and cutting-edge IoT technology trends."
        />
        <meta name="keywords" content="IoT blog, prototyping insights, hardware development, IoT technology, sensor selection, IoT communication" />


        <link rel="canonical" href="https://protonest.co/blog" />


        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/blog" />
        <meta property="og:title" content="Blog - Protonest" />
        <meta property="og:description" content="Expert articles on IoT prototyping, hardware selection, and system design from Protonest engineers." />


        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Protonest IoT Blog",
            "description": "Expert insights on IoT prototyping and hardware development",
            "url": "https://protonest.co/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Protonest",
            },
          })}
        </script>
      </Head>
      <Navbar />
      <main className="md:mt-[50px] mb-30">

        <section className="h-[400px] sm:h-[480px] lg:h-[553px] relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/blogs-1.svg"
              alt="Blogs background"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={true}
              quality={90}
            />
          </div>


          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>


          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>

          <div className="pt-20 relative z-20 flex flex-col items-center justify-start h-full px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
            <div className="flex flex-col items-center">
              <h1 className="text-center text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  Blog
                </span>
              </h1>
              <p className="text-center text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20 lg:px-auto text-[rgba(108,108,108,1)]">
                IoT Related Insights, and Innovations
              </p>
            </div>


            <div className="py-20 w-full">
              <form onSubmit={handleSearch} className="relative h-[45px] opacity-100 bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="flex-grow h-full pl-4 pr-10 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins leading-normal focus:outline-none"
                  placeholder="Search for blog categories"
                  aria-label="Search blog categories"
                />
                <button type="submit" className="w-5 h-5 mr-3" aria-label="Search">
                  <Image
                    src="/search.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="w-full h-full text-[#6c6c6c]"
                  />
                </button>
              </form>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap justify-start gap-3 mt-6 sm:mt-8 mb-8">
                  {selectedCategories.map((category) => (
                    <div
                      key={category}
                      className="h-11 px-4 py-2 rounded-[57px] inline-flex items-center gap-2 gradient-border"
                    >
                      <span className="text-[#6c6c6c] text-sm font-medium font-montserrat">
                        {category}
                      </span>
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1"
                        aria-label={`Remove ${category} filter`}
                      >
                        <Image
                          src="/close.svg"
                          width={30}
                          height={30}
                          alt=""
                          className="hover:scale-110 transition-transform duration-200"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-[60px] xl:px-[130px] 2xl:px-[180px]">

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
                  onClick={fetchBlogs}
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
                <p className="text-[#6c6c6c] font-poppins text-lg">No blogs available at the moment.</p>
                <p className="text-[#6c6c6c] font-poppins text-sm mt-2">Check back later for new content!</p>
              </div>
            </div>
          )}


          {!loading && !error && blogs.length > 0 && filteredBlogs.length === 0 && selectedCategories.length > 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-[#6c6c6c] font-poppins text-lg">No blogs found for the selected categories.</p>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="mt-4 px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors"
                >
                  Clear Filters
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


          <section className="mt-20 sm:mt-40 lg:mt-60 relative">
            <div className="flex flex-col items-start gap-12 sm:gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 relative">
                <h2 className="text-[#6c6c6c] text-xl md:text-[22px] lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[45px] lg:leading-[55px] max-w-[200px] md:max-w-none">
                  Stay Ahead in the IoT Space
                </h2>


                <div className="block lg:hidden absolute -top-40 right-0 -mr-4 sm:-mr-8">
                  <Image
                    src="/blogs-2-mobile.svg"
                    width={150}
                    height={150}
                    alt=""
                    className="opacity-80"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-[#6c6c6c] text-sm lg:text-[15px] xl:text-base font-normal font-poppins leading-[24px] sm:leading-[30px]">
                  Get the latest articles, insights, and stories delivered to your inbox.
                </p>


                <form onSubmit={handleSubscriptionSubmit} className="mt-6 sm:mt-8 space-y-8 sm:space-y-12 lg:space-y-16">
                  <div className="space-y-1">
                    <label htmlFor="newsletter-name" className="text-[#6c6c6c] text-base xl:text-lg xl:font-medium font-poppins leading-[30px]">
                      Name
                    </label>
                    <input
                      type="text"
                      id="newsletter-name"
                      name="name"
                      value={subscriptionForm.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      required
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="newsletter-email" className="text-[#6c6c6c] text-base xl:text-lg xl:font-medium font-poppins leading-[30px]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="newsletter-email"
                      name="email"
                      value={subscriptionForm.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      required
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="career-updates"
                      name="career_updates"
                      checked={subscriptionForm.career_updates}
                      onChange={handleInputChange}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#5530fa] bg-gray-100 border-gray-300 rounded focus:ring-[#5530fa] focus:ring-2"
                    />
                    <label htmlFor="career-updates" className="text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[24px] sm:leading-[30px]">
                      I&apos;m interested in career updates too.
                    </label>
                  </div>


                  {subscriptionMessage && (
                    <div className={`text-sm font-poppins ${subscriptionStatus === 'success' ? 'text-green-600' : 'text-red-600'
                      }`} role="alert">
                      {subscriptionMessage}
                    </div>
                  )}

                  <div className="flex justify-start mt-8 sm:mt-12">
                    <button
                      type="submit"
                      disabled={subscriptionStatus === 'loading'}
                      className="h-[50px] w-[160px] lg:w-[180px] lg:font-semibold text-[15px] xl:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                    >
                      {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                </form>
              </div>
            </div>


            <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 right-0 -mr-15 xl:-mr-32 2xl:-mr-45">
              <Image
                src="/blogs-2.svg"
                width={600}
                height={600}
                alt=""
                className="opacity-80"
                priority={false}
                quality={85}
                aria-hidden="true"
              />
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}