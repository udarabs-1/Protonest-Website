"use client";

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

// Define types for Research and Projects
interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Subscription form interface
interface SubscriptionForm {
  name: string;
  email: string;
  career_updates: boolean;
  newsletter: boolean;
}

// Function to extract excerpt from HTML content
const extractExcerpt = (htmlContent: string, maxLength: number = 100): string => {
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  const trimmed = textContent.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const truncated = trimmed.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > -1
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
};

// Card Component
const ContentCard = ({ item, type }: { item: ResearchProject; type: 'research' | 'projects' }) => {
  const excerpt = item.excerpt || extractExcerpt(item.content);

  return (
    <Link href={`research-and-project/${type === 'research' ? 'research' : 'project'}/${item.slug}`} passHref>
      <article
        className="group bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden hover:shadow-[10px_10px_30px_0px_rgba(85,48,250,0.20)] transition-all duration-300 cursor-pointer"
      >
        <div className="p-6 pb-0">
          <div className="w-full aspect-[374/164] rounded-[11px] overflow-hidden">
            <Image
              src={item.cover_image || '/blogsPage1.svg'}
              alt={item.title}
              width={374}
              height={164}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/blogsPage1.svg';
              }}
            />
          </div>
        </div>

        <div className="p-6 pt-4 space-y-3">
          <h3 className="text-[#6c6c6c] text-base font-medium font-poppins leading-[1.4] group-hover:text-[#5530fa] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-[#6c6c6c] text-[9px] font-medium font-poppins leading-[1.5] line-clamp-3">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default function ResearchProjects() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'research' | 'projects'>('research');

  // State for content data
  const [researchData, setResearchData] = useState<ResearchProject[]>([]);
  const [projectsData, setProjectsData] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and load more
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // State for subscription form
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
    name: '',
    email: '',
    career_updates: false,
    newsletter: true
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  // Fetch research data
  const fetchResearch = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/research?published=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch research');
      }

      const result = await response.json();

      if (result.status === 'success') {
        setResearchData(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch research');
      }
    } catch (err) {
      console.error('Error fetching research:', err);
      setResearchData([]);
    }
  }, []);

  // Fetch projects data
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/projects?published=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const result = await response.json();

      if (result.status === 'success') {
        setProjectsData(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjectsData([]);
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchResearch(), fetchProjects()]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [fetchResearch, fetchProjects]);

  // Get current data based on active tab
  const currentData = activeTab === 'research' ? researchData : projectsData;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return currentData;

    return currentData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentData, searchTerm]);

  // Calculate visible items
  const { visibleItems, shouldShowLoadMoreButton } = useMemo(() => {
    const limit = 6;
    const visibleCount = showAll ? filteredData.length : limit;
    const visibleItems = filteredData.slice(0, visibleCount);
    const shouldShowLoadMoreButton = filteredData.length > limit;

    return { visibleItems, shouldShowLoadMoreButton };
  }, [filteredData, showAll]);

  // Event handlers
  const handleLoadMore = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowAll(false);
  }, []);

  // Handle subscription
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
        setSubscriptionMessage(data.message || 'Subscription successful!');
        setSubscriptionForm({
          name: '',
          email: '',
          career_updates: false,
          newsletter: true
        });
      } else {
        setSubscriptionStatus('error');
        setSubscriptionMessage(data.message || 'Failed to subscribe.');
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

  return (
    <div>
      <Navbar />
      <div className="mb-30">
        {/* Hero Section */}
        <div
          className="mt-[50px] h-[400px] sm:h-[480px] lg:h-[553px] bg-no-repeat bg-cover bg-center relative"
          style={{ backgroundImage: "url('/research-1.svg')" }}
        >
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

          <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-[133px]">
            <div className="flex justify-center">
              <div className="text-center text-[28px] sm:text-[35px] md:text-[40px] lg:text-[45px] font-medium font-montserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  Research & Projects
                </span>
              </div>
            </div>
            <div className="text-center text-[14px] sm:text-[16px] lg:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20">
              <span className="text-[rgba(108,108,108,1)]">
                From proof-of-concepts to real-world IoT deployments! Dive into our most impactful work.
              </span>
            </div>
          </div>
        </div>

        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-[130px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <div className="text-[#6c6c6c] text-xl font-medium font-poppins mb-6">
                Filter
              </div>

              <button className="text-[#6c6c6c] text-sm font-normal font-poppins mb-8">
                Clear All
              </button>

              <div className="mb-8">
                <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                  Sort By →
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sort"
                      id="sort-0"
                      className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                      defaultChecked
                    />
                    <label htmlFor="sort-0" className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                      Most Recent
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sort"
                      id="sort-1"
                      className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                    />
                    <label htmlFor="sort-1" className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                      Most Viewed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Mobile Filter Header */}
              <div className="lg:hidden mb-6">
                <div className="text-[#6c6c6c] text-xl font-medium font-poppins leading-[38px] mb-4">
                  Filter Your Fit
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative h-12 w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden">
                    <input
                      type="text"
                      className="w-full h-full pl-4 pr-10 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins focus:outline-none"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Image
                        src="/down-arrow.svg"
                        width={24}
                        height={24}
                        alt="Filter"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className={`cursor-pointer transform ${showMobileFilters ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Popup */}
                {showMobileFilters && (
                  <div className="w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] p-6 mb-6 relative">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[#6c6c6c] text-xl font-medium font-poppins">
                        Filter
                      </div>
                      <button
                        className="text-[#6c6c6c] text-sm font-normal font-poppins"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        <Image
                          src="/close.svg"
                          width={24}
                          height={24}
                          alt="Close"
                        />
                      </button>
                    </div>

                    <div>
                      <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                        Sort By →
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="mobile-sort"
                            id="mobile-sort-0"
                            className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                            defaultChecked
                          />
                          <label htmlFor="mobile-sort-0" className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                            Most Recent
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="mobile-sort"
                            id="mobile-sort-1"
                            className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                          />
                          <label htmlFor="mobile-sort-1" className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                            Most Viewed
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button className="text-[#6c6c6c] text-sm font-normal font-poppins">
                        Clear All
                      </button>
                      <button
                        className="h-[40px] px-6 font-semibold text-sm font-montserrat text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px]"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex justify-start gap-3 mb-4">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setShowAll(false);
                    setSearchTerm('');
                  }}
                  className={`h-[51px] px-6 py-4 rounded-[57px] inline-flex justify-center items-center gap-1 ${activeTab === 'projects'
                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] border border-transparent'
                    : 'gradient-button'
                    }`}
                >
                  <span className={`text-base font-poppins ${activeTab === 'projects'
                    ? 'text-white font-semibold font-montserrat'
                    : 'text-[#4d4d4d] font-medium'
                    }`}>
                    Project
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('research');
                    setShowAll(false);
                    setSearchTerm('');
                  }}
                  className={`h-[51px] px-6 py-4 rounded-[57px] inline-flex justify-center items-center gap-1 ${activeTab === 'research'
                    ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] border border-transparent'
                    : 'gradient-button'
                    }`}
                >
                  <span className={`text-base font-poppins ${activeTab === 'research'
                    ? 'text-white font-semibold font-montserrat'
                    : 'text-[#4d4d4d] font-medium'
                    }`}>
                    Research
                  </span>
                </button>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="relative h-[50px] w-full opacity-70 bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-8">
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

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin"></div>
                  <span className="ml-3 text-[#6c6c6c] font-poppins">Loading...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <p className="text-red-600 font-poppins mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* No Content State */}
              {!loading && !error && currentData.length === 0 && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <p className="text-[#6c6c6c] font-poppins text-lg">
                      No {activeTab} available at the moment.
                    </p>
                    <p className="text-[#6c6c6c] font-poppins text-sm mt-2">Check back later for new content!</p>
                  </div>
                </div>
              )}

              {/* No Filtered Results */}
              {!loading && !error && currentData.length > 0 && filteredData.length === 0 && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <p className="text-[#6c6c6c] font-poppins text-lg">No results found for your search.</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

              {/* Content Grid */}
              {!loading && !error && visibleItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                  {visibleItems.map((item) => (
                    <ContentCard key={item.id} item={item} type={activeTab} />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!loading && !error && shouldShowLoadMoreButton && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="h-[50px] w-[160px] sm:w-[180px] font-semibold text-[14px] sm:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300"
                  >
                    {showAll ? 'Show Less' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-20 sm:mt-40 lg:mt-60 relative">
            <div className="flex flex-col items-start gap-12 sm:gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2">
                <h2 className="text-[#6c6c6c] text-xl sm:text-2xl lg:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[45px] lg:leading-[55px]">
                  Stay Ahead in the IoT Space
                </h2>
                <p className="mt-4 text-[#6c6c6c] text-sm sm:text-base font-normal font-poppins leading-[24px] sm:leading-[30px]">
                  Get the latest articles, insights, and stories delivered to your inbox.
                </p>

                <form onSubmit={handleSubscriptionSubmit} className="mt-6 sm:mt-8 space-y-8 sm:space-y-12 lg:space-y-16">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[#6c6c6c] text-base sm:text-lg font-semibold font-poppins leading-[30px]">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={subscriptionForm.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      required
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm sm:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[#6c6c6c] text-base sm:text-lg font-semibold font-poppins leading-[30px]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={subscriptionForm.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      required
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm sm:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
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
                    <label htmlFor="career-updates" className="text-[#6c6c6c]/80 text-sm sm:text-base font-normal font-poppins leading-[24px] sm:leading-[30px] cursor-pointer">
                      I&apos;m interested in career updates too.
                    </label>
                  </div>

                  {subscriptionMessage && (
                    <div className={`text-sm font-poppins ${subscriptionStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {subscriptionMessage}
                    </div>
                  )}

                  <div className="flex justify-start mt-8 sm:mt-12">
                    <button
                      type="submit"
                      disabled={subscriptionStatus === 'loading'}
                      className="h-[50px] w-[160px] sm:w-[180px] font-semibold text-[14px] sm:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 right-0 -mr-32">
              <Image
                src="/blogs-2.svg"
                width={600}
                height={600}
                alt="IoT Newsletter"
                className="opacity-80"
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}