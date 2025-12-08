"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import PageHero from "../components/page-hero";

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

interface SubscriptionForm {
  name: string;
  email: string;
  career_updates: boolean;
  newsletter: boolean;
}

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

const ContentCard = ({ item, type }: { item: ResearchProject; type: 'research' | 'projects' }) => {
  return (
    <Link href={`/research-and-project/${type === 'research' ? 'research' : 'project'}/${item.slug}?tab=${type}`} passHref>
      <article
        className="group w-full h-full relative bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-6 lg:p-8 transition-all duration-300 hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] cursor-pointer"
      >
        <div className="relative w-full aspect-video rounded-[11px] overflow-hidden mb-6">
          <Image
            src={item.cover_image || ''}
            alt={item.title}
            width={374}
            height={164}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:grayscale"
          />
        </div>

        <h3 className="text-[#6c6c6c] text-base font-medium font-poppins leading-[1.4] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5530FA] group-hover:to-[#F51DA5] transition-all duration-300">
          {item.title}
        </h3>
      </article>
    </Link>
  );
};

export default function ResearchAndProjectPage() {
  return (
    <Suspense fallback={
      <div className="overflow-x-hidden">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    }>
      <ResearchAndProjectContent />
    </Suspense>
  );
}

function ResearchAndProjectContent() {
  const [activeTab, setActiveTab] = useState<'research' | 'projects'>('research');

  const [researchData, setResearchData] = useState<ResearchProject[]>([]);
  const [projectsData, setProjectsData] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
    name: '',
    email: '',
    career_updates: false,
    newsletter: true
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'projects') {
      setActiveTab('projects');
    } else if (tab === 'research') {
      setActiveTab('research');
    }
  }, [searchParams]);

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

  const currentData = activeTab === 'research' ? researchData : projectsData;

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return currentData;

    return currentData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentData, searchTerm]);

  const { visibleItems, shouldShowLoadMoreButton } = useMemo(() => {
    const limit = 6;
    const visibleCount = showAll ? filteredData.length : limit;
    const visibleItems = filteredData.slice(0, visibleCount);
    const shouldShowLoadMoreButton = filteredData.length > limit;

    return { visibleItems, shouldShowLoadMoreButton };
  }, [filteredData, showAll]);

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
      <Head>
        <title>Research & Projects - Protonest</title>
        <meta
          name="description"
          content="Explore Protonest's cutting-edge research and innovative projects in IoT, embedded systems, and electronics. From proof-of-concepts to real-world deployments."
        />
        <meta name="keywords" content="IoT research, embedded systems projects, electronics projects, Protonest projects, innovation, prototyping" />

        <link rel="canonical" href="https://protonest.co/research-and-project" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/research-and-project" />
        <meta property="og:title" content="Research & Projects - Protonest" />
        <meta property="og:description" content="Explore Protonest's most impactful work in IoT and embedded systems." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Protonest Research & Projects",
            "description": "A collection of Protonest's research and projects in IoT and embedded systems.",
            "url": "https://protonest.co/research-and-project"
          })}
        </script>
      </Head>
      <Navbar />
      <div className="mb-30">

        <PageHero
          backgroundImage="/research-1.webp"
          heading={{
            gradientText: "Research and Projects"
          }}
          description="Explore our latest research and innovative projects in IoT and embedded systems"
        />

        <section className="relative z-30 -mt-[140px] py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex justify-start items-center gap-3 mb-6">
              <button
                onClick={() => {
                  setActiveTab('research');
                  setShowAll(false);
                  setSearchTerm('');
                  window.history.pushState({}, '', '/research-and-project?tab=research');
                }}
                className={`h-[48px] sm:h-[52px] py-4 px-6 sm:px-8 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeTab === 'research'
                  ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <span className="text-center text-sm sm:text-base font-semibold font-montserrat">
                  Research
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setShowAll(false);
                  setSearchTerm('');
                  window.history.pushState({}, '', '/research-and-project?tab=projects');
                }}
                className={`h-[48px] sm:h-[52px] py-4 px-6 sm:px-8 rounded-[57px] flex justify-center items-center gap-3 transition-colors ${activeTab === 'projects'
                  ? 'bg-gradient-to-l from-[#5530fa] to-[#f51da5] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <span className="text-center text-sm sm:text-base font-semibold font-montserrat">
                  Project
                </span>
              </button>
            </div>

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
                <span className="ml-3 text-[#6c6c6c] font-poppins">Loading...</span>
              </div>
            )}


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


            {!loading && !error && currentData.length > 0 && filteredData.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <p className="text-[#6c6c6c] font-poppins text-lg">No results found for your search.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-6 py-2 gradient-button font-poppins transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}


            {!loading && !error && visibleItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {visibleItems.map((item) => (
                  <ContentCard key={item.id} item={item} type={activeTab} />
                ))}
              </div>
            )}


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
        </section>

        <section className="relative py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-30 overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <div className="relative z-10 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
            <div className="max-w-4xl">
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
          </div >

          <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 right-0 -mr-32">
            <Image
              src="/blogs-2.svg"
              width={600}
              height={600}
              alt="IoT Newsletter"
              className="opacity-80"
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}