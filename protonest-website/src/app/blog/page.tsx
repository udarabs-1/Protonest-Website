'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import { useOnScreen } from "@/app/components/useOnScreen";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Define a Blog type for better type safety
interface Blog {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  imageUrl: string;
  categoryTags: string[];
}

// Subscription form interface
interface SubscriptionForm {
  name: string;
  email: string;
  career_updates: boolean;
  newsletter: boolean;
}

// Optimized image blur placeholders
const blogImageBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDcyIiBoZWlnaHQ9IjE2NCIgdmlld0JveD0iMCAwIDQ3MiAxNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NzIiIGhlaWdodD0iMTY0IiBmaWxsPSIjZjVmNWY1IiByeD0iMTEiLz4KPC9zdmc+Cg==";

const heroImageBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI1NTMiIHZpZXdCb3g9IjAgMCAxMjAwIDU1MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNTUzIiBmaWxsPSIjZjBmMGYwIi8+Cjwvc3ZnPgo=";

// Blog Card Component with mobile-friendly hover effects
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

  // For mobile and small screens, use intersection observer; for larger screens, use hover
  const shouldShowEffects = isMobile ? isVisible : false;

  return (
    <Link href={`/${blog.id}`} passHref>
      <article
        ref={ref}
        className={`group w-full h-full relative bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-6 lg:p-8 transition-all duration-300 md:hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] ${shouldShowEffects ? 'shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)]' : ''
          }`}
      >
        {/* Image Container with hover effects */}
        <div className="relative w-full aspect-[472/164] rounded-[11px] overflow-hidden mb-6">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            width={472}
            height={164}
            className={`w-full h-full object-cover transition-all duration-300 md:group-hover:scale-105 md:group-hover:grayscale ${shouldShowEffects ? 'scale-105 grayscale' : ''
              }`}
            placeholder="blur"
            blurDataURL={blogImageBlurDataURL}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 472px"
          />
          {/* Read More Button with solid background and gradient text */}
          <button className={`absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-10 bg-[#A3A3A3] font-poppins text-sm transition-all duration-300 rounded-md md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 ${shouldShowEffects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
              Read More
            </span>
          </button>
        </div>

        {/* Content Container */}
        <div className="space-y-4">
          <h3 className={`text-[16px] xl:text-[18px] font-medium font-poppins leading-[1.4] transition-all duration-300 md:text-[#6c6c6c] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[#5530FA] md:to-[#F51DA5] ${shouldShowEffects ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]' : 'text-[#6c6c6c]'
            }`}>
            {blog.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            {blog.categoryTags.map((tag: string, index: number) => (
              <div key={`${tag}-${index}`} className="h-[29px] px-3 py-2 rounded-[30px] outline-1 outline-offset-[-1px] outline-[#d5d5d5] inline-flex justify-center items-center">
                <div className="text-[#83848b] text-[10px] font-normal font-poppins leading-normal">
                  {tag}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[#6c6c6c] text-xs font-medium font-poppins leading-[1.5] line-clamp-3">
            {blog.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default function BlogSection() {
  const blogs = useMemo(() => [
    {
      id: "selecting-a-suitable-sensor-for-an-iot-project",
      title: "Selecting A Suitable Sensor For An IoT Project",
      excerpt: "The world of the Internet of Things is a world in constant flux where sensors are silent heroes that will help bring your project to reality. Whether it is to monitor temperature, detect motion, or measure air quality, choosing the right sensor is crucial.",
      readTime: "3 min read",
      imageUrl: "/blogs1.svg",
      categoryTags: ["IoT", "Sensors", "Hardware"]
    },
    {
      id: "selecting-a-suitable-battery-for-an-iot-project",
      title: "Selecting a Perfect Battery for an IoT Project",
      excerpt: "The rapid growth of the Internet of Things has enabled a wide range of innovations in smart home devices and industrial sensors. The key behind all these systems is one important component \"The battery\". The selection of the proper battery for an IoT project is much more than a technical decision but a strategic one, considering the reliability, lifespan, and performance of your IoT Project.",
      readTime: "5 min read",
      imageUrl: "/blogs2.svg",
      categoryTags: ["IoT", "Batteries", "Hardware"]
    },
    {
      id: "selecting-cloud-backend-for-iot-project",
      title: "Selecting the Perfect Cloud Backend for an IoT Project",
      excerpt: "One of the most critical decisions for any IoT project is selecting the right cloud backend for an IoT project. The cloud backend platform serves as a central hub for managing communication, data storage, and processing, with the scalability and security of the whole system in mind. The core of any IoT system is the backend platform, which stores, processes, and analyzes data while providing a secure and seamless communication backbone between devices.",
      readTime: "4 min read",
      imageUrl: "/blogs3.svg",
      categoryTags: ["IoT", "Cloud Computing", "Backend"]
    },
    {
      id: "right-display-for-an-iot-device",
      title: "Selecting the Right Display for an IoT Device",
      excerpt: "Selecting the right display for an IoT device is crucial, as the display is one of the main parts connecting users with embedded systems, interaction, and user experience. Selecting the right interface matters in a project, and it is affected by many factors. Apart from mobile and web dashboards connected with IoT systems, touch/non-touch displays play a critical role in having a built-in user interface for the users.",
      readTime: "4 min read",
      imageUrl: "/blogs4.webp",
      categoryTags: ["IoT", "Hardware", "Displays"]
    },
    {
      id: "communication-method-for-an-iot-project",
      title: "Communication Method For An IoT Project : Selection Guide",
      excerpt: "Selecting a suitable communication method for an IoT project is a crucial part of implementing an IoT system. In IoT, communication methods play a key role, which allows the devices to connect and exchange information. Due to the wide range of applications in IoT and the modern approach to the construction of IoT networks, it is challenging to decide which communication method is suitable for your IoT Project. So, many IoT applications exist and they range from controlling smart homes to industrial automation thus implying that there is no unique communication method that can be adopted.",
      readTime: "4 min read",
      imageUrl: "/blogs5.webp",
      categoryTags: ["IoT", "Communication", "Networking"]
    },
    {
      id: "actuator-for-an-iot-project",
      title: "Actuator for an IoT Project : Selection Guide",
      excerpt: "Selecting an actuator for an IoT Project has a direct bearing on the project&apos;s productivity, dependability, and effectiveness. This article is aimed at classifying the actuators, describing the criteria for their selection, and providing you with examples of using it.",
      readTime: "4 min read",
      imageUrl: "/blogs6.webp",
      categoryTags: ["IoT", "Actuators", "Automation"]
    }
  ], []);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // State for load more functionality
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // State for subscription form
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
    name: '',
    email: '',
    career_updates: false,
    newsletter: true // Default to true since they're subscribing to newsletter
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  // Debounced screen size check
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

  // Memoized category calculations
  const allCategories = useMemo(() =>
    Array.from(new Set(blogs.flatMap(blog => blog.categoryTags)))
      .sort((a: string, b: string) => a.localeCompare(b)),
    [blogs]
  );

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() =>
    blogs.filter(blog =>
      selectedCategories.every(cat => blog.categoryTags.includes(cat))
    ),
    [blogs, selectedCategories]
  );

  // Memoized display calculations
  const { visibleBlogs, shouldShowLoadMoreButton } = useMemo(() => {
    const blogsToDisplay = selectedCategories.length > 0 ? filteredBlogs : blogs;
    const limit = isMobile ? 3 : 6;
    const visibleCount = showAllBlogs ? blogsToDisplay.length : limit;
    const visibleBlogs = blogsToDisplay.slice(0, visibleCount);
    const shouldShowLoadMoreButton = blogsToDisplay.length > limit;

    return { visibleBlogs, shouldShowLoadMoreButton };
  }, [blogs, filteredBlogs, selectedCategories, isMobile, showAllBlogs]);

  // Optimized event handlers
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

  // Handle subscription form submission
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

  // Handle form input changes
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
        {/* Primary Meta Tags */}
        <title>Blog - Protonest</title>
        <meta
          name="description"
          content="Explore Protonest's IoT blog for expert insights on prototyping, hardware development, and cutting-edge IoT technology trends."
        />
        <meta name="keywords" content="IoT blog, prototyping insights, hardware development, IoT technology, sensor selection, IoT communication" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://protonest.co/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/blog" />
        <meta property="og:title" content="Blog - Protonest" />
        <meta property="og:description" content="Expert articles on IoT prototyping, hardware selection, and system design from Protonest engineers." />

        {/* Structured Data */}
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
        {/* Hero Section with Image */}
        <section className="h-[400px] sm:h-[480px] lg:h-[553px] relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/blogs-1.svg"
              alt="Blogs background"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              placeholder="blur"
              blurDataURL={heroImageBlurDataURL}
              priority={true}
              quality={90}
            />
          </div>

          {/* Top Edge Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>

          {/* Bottom Edge Gradient Overlay */}
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

            {/* Search bar with flex positioning */}
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

        <section className="lg:-mt-[100px] px-4 sm:px-8 lg:px-[60px] xl:px-[130px] 2xl:px-[180px]">
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12">
            {visibleBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Load More / Show Less Button */}
          {shouldShowLoadMoreButton && (
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

          {/* Newsletter Section */}
          <section className="mt-20 sm:mt-40 lg:mt-60 relative">
            <div className="flex flex-col items-start gap-12 sm:gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 relative">
                <h2 className="text-[#6c6c6c] text-xl md:text-[22px] lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[45px] lg:leading-[55px] max-w-[200px] md:max-w-none">
                  Stay Ahead in the IoT Space
                </h2>

                {/* Mobile/Tablet Image - shows only on md and smaller screens, positioned at right edge */}
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

                {/* Working Newsletter Form */}
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

                  {/* Status Message */}
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

            {/* Desktop image - position image to the rightmost side on larger screens (lg and up) */}
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