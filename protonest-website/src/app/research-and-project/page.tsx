"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import NewsletterSubscription from "../components/newsletter-subscription";
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


            <NewsletterSubscription />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}