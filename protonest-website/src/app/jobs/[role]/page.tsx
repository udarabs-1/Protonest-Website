"use client";

import Footer from "@/app/components/footer";
import JobRoleNavigation from "@/app/components/job-role-navigation";
import Navbar from "@/app/components/navbar";
import PageHero from "@/app/components/page-hero";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  location: string;
  posted: string;
  type: string;
  deadline: string;
  experience: string;
  category: string;
  created_at: string;
  is_active?: boolean;
};

interface ApiJobData {
  id?: string;
  title?: string;
  location?: string;
  type?: string;
  deadline?: string;
  experience?: string;
  category?: string;
  created_at?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  overview?: string;
  is_active?: boolean;
}

interface ApiResponse {
  status?: string;
  data?: ApiJobData[];
  jobs?: ApiJobData[];
}

type FilterType = "experience" | "location" | "datePosted" | "jobType";
type Filters = {
  experience: string[];
  location: string[];
  datePosted: string[];
  jobType: string[];
};

const roleToCategoryMap: { [key: string]: string } = {
  "front-end": "Front-End",
  "back-end": "Back-End",
  "full-stack": "Full-Stack",
  electronics: "Electronics",
  "ui-ux-designing": "UI/UX Designing",
  mechanical: "Mechanical",
  "embedded-firmware": "Embedded Firmware",
  "quality-assurance": "Quality Assurance",
  "other-roles": "Other Roles",
};

const roleTitles: { [key: string]: string } = {
  "front-end": "Front-End",
  "back-end": "Back-End",
  "full-stack": "Full-Stack",
  electronics: "Electronics",
  "ui-ux-designing": "UI/UX",
  mechanical: "Mechanical",
  "embedded-firmware": "Embedded Firmware",
  "quality-assurance": "Quality Assurance",
  "other-roles": "Other Roles",
};

const FILTER_OPTIONS = {
  experience: ["beginner", "intermediate", "experienced"],
  location: ["Remote", "On-site", "Hybrid"],
  jobType: ["full-time", "project-based", "hourly", "internship"],
  datePosted: ["Newest", "Oldest"],
} as const;

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const FilterCheckbox = ({
  isSelected,
  onClick,
  label,
}: {
  isSelected: boolean;
  onClick: () => void;
  label: string;
}) => (
  <div className="flex items-center mb-2">
    <button
      className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 ${
        isSelected
          ? "outline-2 outline-offset-[-2px] outline-[#5530fa]"
          : "border-[#6c6c6c]"
      }`}
      onClick={onClick}
      aria-checked={isSelected}
      role="checkbox"
      aria-label={`Filter by ${label}`}
    >
      {isSelected && (
        <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full"></div>
      )}
    </button>
    <span className="text-[13px] font-poppins text-[#6c6c6c] capitalize">
      {label}
    </span>
  </div>
);

const JobCard = ({ job, roleKey }: { job: Job; roleKey: string }) => (
  <Link
    href={`/jobs/${roleKey}/${job.id}`}
    className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
  >
    <article>
      <div className="flex justify-between">
        <div className="w-3/4">
          <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
            {job.title}
          </h3>
          <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
            {job.location} ‐ Posted {job.posted}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
            {job.type === "project-based"
              ? "Project Based"
              : job.type === "full-time"
                ? "Full Time"
                : job.type === "hourly"
                  ? "Hourly"
                  : job.type === "internship"
                    ? "Internship"
                    : job.type}
          </p>
          <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
        </div>
        <div>
          <p className="text-xs font-medium font-poppins text-[#6c6c6c]">
            {job.deadline}
          </p>
          <p className="text-[9px] font-poppins text-[#6c6c6c]">
            Application deadline
          </p>
        </div>
        <div>
          <p className="text-xs font-medium font-poppins text-[#6c6c6c] capitalize">
            {job.experience}
          </p>
          <p className="text-[9px] font-poppins text-[#6c6c6c]">
            Experience level
          </p>
        </div>
      </div>

      <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
        <div className="w-full h-full group-hover:hidden">
          <Image
            src="/upleft.svg"
            alt="Arrow"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden w-full h-full group-hover:block">
          <Image
            src="/upleft-hover.svg"
            alt="Hover Arrow"
            width={50}
            height={50}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
        View Details
      </button>
    </article>
  </Link>
);

export default function RolePage() {
  const params = useParams();
  const { role } = params;

  const [filters, setFilters] = useState<Filters>({
    experience: [],
    location: [],
    datePosted: [],
    jobType: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleJobsCount, setVisibleJobsCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    checkIsMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [checkIsMobile]);

  const { roleKey, category, displayTitle } = useMemo(() => {
    const roleKey = Array.isArray(role) ? role[0] : role;
    const category = roleKey ? roleToCategoryMap[roleKey] : null;
    const displayTitle = roleKey ? roleTitles[roleKey] || roleKey : "Jobs";

    return { roleKey, category, displayTitle };
  }, [role]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs?category=${encodeURIComponent(category)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch jobs: ${response.status} ${response.statusText}`,
          );
        }

        const data: ApiResponse = await response.json();

        let jobsData: ApiJobData[] = [];

        if (data.status === "success") {
          if (data.data === null) {
            jobsData = [];
          } else if (Array.isArray(data.data)) {
            jobsData = data.data;
          } else {
            throw new Error(
              `Expected data to be an array or null, got: ${typeof data.data}`,
            );
          }
        } else if (Array.isArray(data)) {
          jobsData = data as ApiJobData[];
        } else if (data.jobs) {
          jobsData = data.jobs;
        } else if (data.data && Array.isArray(data.data)) {
          jobsData = data.data;
        } else {
          throw new Error(
            `Unexpected response format. Expected array or object with data property, got: ${typeof data}`,
          );
        }

        const transformedJobs: Job[] = jobsData.map(
          (job: ApiJobData, index: number) => {
            try {
              return {
                id: job.id || `job-${index}`,
                title: job.title || "Untitled Position",
                location: job.location || "Location TBD",
                posted: formatTimeAgo(
                  job.created_at || new Date().toISOString(),
                ),
                type: job.type || "full-time",
                deadline: formatDate(job.deadline || new Date().toISOString()),
                experience: job.experience || "junior",
                category: job.category || category,
                created_at: job.created_at || new Date().toISOString(),
                is_active: job.is_active,
              };
            } catch (transformError) {
              console.error("Error transforming job:", job, transformError);
              return {
                id: `error-job-${index}`,
                title: "Error Loading Job",
                location: "Unknown",
                posted: "Unknown",
                type: "full-time",
                deadline: "Unknown",
                experience: "junior",
                category: category || "Unknown",
                created_at: new Date().toISOString(),
                is_active: false,
              };
            }
          },
        );

        const activeJobs = transformedJobs.filter(
          (job) => job.is_active !== false,
        );
        setJobs(activeJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);

        let errorMessage = "Failed to load jobs";
        if (error instanceof TypeError && error.message.includes("fetch")) {
          errorMessage = "Network error: Unable to connect to the server";
        } else if (error instanceof Error) {
          if (error.message.includes("404")) {
            errorMessage = "Jobs endpoint not found (404)";
          } else if (error.message.includes("500")) {
            errorMessage = "Server error (500)";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  const handleFilterToggle = useCallback(
    (filterType: FilterType, value: string) => {
      setFilters((prev) => {
        const currentFilters = [...prev[filterType]];
        const index = currentFilters.indexOf(value);

        if (index > -1) {
          currentFilters.splice(index, 1);
        } else {
          currentFilters.push(value);
        }

        return {
          ...prev,
          [filterType]: currentFilters,
        };
      });
    },
    [],
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      experience: [],
      location: [],
      datePosted: [],
      jobType: [],
    });
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters((prev) => !prev);
  }, []);

  const loadMoreJobs = useCallback(() => {
    setVisibleJobsCount((prev) => prev + 3);
  }, []);

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      if (
        filters.experience.length > 0 &&
        !filters.experience.includes(job.experience)
      ) {
        return false;
      }
      if (
        filters.location.length > 0 &&
        !filters.location.includes(job.location)
      ) {
        return false;
      }
      if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) {
        return false;
      }
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (filters.datePosted.length > 0) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        if (filters.datePosted.includes("Newest")) {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
    }

    return filtered;
  }, [jobs, filters, searchQuery]);

  useEffect(() => {
    setVisibleJobsCount(3);
  }, [filters, searchQuery]);

  const jobsToShow = isMobile
    ? filteredJobs.slice(0, visibleJobsCount)
    : filteredJobs;
  const hasMoreJobs = isMobile && visibleJobsCount < filteredJobs.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-white overflow-x-hidden">
      <Navbar />

      <PageHero
        backgroundImage="/jobs-1.webp"
        backgroundImageMobile="/jobs-1-mobile.webp"
        heading={{
          gradientText: `${displayTitle} Jobs`,
        }}
        description="Browse jobs posted on Protonest and apply for the role that fits you."
        height="h-[350px] lg:h-[400px] xl:h-[439px]"
      />

      <main className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] pt-0 pb-8 sm:py-12 lg:py-16">
        <section
          aria-labelledby="job-category-navigation-title"
          className="mb-10 lg:mb-14"
        >
          <h2 id="job-category-navigation-title" className="sr-only">
            Browse jobs by category
          </h2>
          {/* <JobRoleNavigation
                        activeRole={roleKey}
                        className="w-full max-w-[1127px] mx-auto"
                    /> */}
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4 hidden lg:block">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-medium font-poppins text-[#6c6c6c] mb-6">
                Filter Jobs by
              </h2>

              <button
                onClick={clearAllFilters}
                className="text-sm font-poppins text-[#6c6c6c] mb-6 hover:text-[#5530fa] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
              >
                Clear All Filters
              </button>

              <div className="mb-8">
                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                  Experience Level
                </h3>
                {FILTER_OPTIONS.experience.map((level) => (
                  <FilterCheckbox
                    key={level}
                    isSelected={filters.experience.includes(level)}
                    onClick={() => handleFilterToggle("experience", level)}
                    label={level}
                  />
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                  Location
                </h3>
                {FILTER_OPTIONS.location.map((location) => (
                  <FilterCheckbox
                    key={location}
                    isSelected={filters.location.includes(location)}
                    onClick={() => handleFilterToggle("location", location)}
                    label={location}
                  />
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                  Date Posted
                </h3>
                {FILTER_OPTIONS.datePosted.map((date) => (
                  <FilterCheckbox
                    key={date}
                    isSelected={filters.datePosted.includes(date)}
                    onClick={() => handleFilterToggle("datePosted", date)}
                    label={date}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                  Job Type
                </h3>
                {FILTER_OPTIONS.jobType.map((type) => (
                  <FilterCheckbox
                    key={type}
                    isSelected={filters.jobType.includes(type)}
                    onClick={() => handleFilterToggle("jobType", type)}
                    label={
                      type === "project-based"
                        ? "Project Based"
                        : type === "full-time"
                          ? "Full Time"
                          : type === "hourly"
                            ? "Hourly"
                            : type === "internship"
                              ? "Internship"
                              : type
                    }
                  />
                ))}
              </div>
            </div>
          </aside>

          <div className="w-full lg:w-3/4">
            <h2 className="w-full text-[#6c6c6c] text-xl font-medium font-poppins leading-[38px] mb-6">
              Explore Variety of Jobs
            </h2>

            <div className="relative w-full mb-8 lg:mb-12">
              <div className="w-full h-10 lg:h-12 opacity-50 bg-white rounded-[20px] shadow-[5px_5px_20px_rgba(0,0,0,0.1)] overflow-hidden flex items-center px-4">
                <input
                  type="text"
                  placeholder="Search for the job role you are looking for"
                  className="w-full bg-transparent border-none outline-none text-sm text-[#6c6c6c] font-poppins"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search jobs"
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
              </div>
            </div>

            <div className="lg:hidden mb-6">
              <h3 className="text-[#6c6c6c] text-xl font-medium font-poppins leading-[38px] mb-4">
                Filter Your Fit
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative h-12 w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden">
                  <input
                    type="text"
                    className="w-full h-full pl-4 pr-10 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins focus:outline-none"
                    readOnly
                    placeholder="Filter options"
                  />
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={toggleMobileFilters}
                    aria-label="Toggle filters"
                  >
                    <Image
                      src="/down-arrow.svg"
                      width={24}
                      height={24}
                      alt=""
                      className={`cursor-pointer transform transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {showMobileFilters && (
                <div className="w-full bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] p-6 mb-6 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[#6c6c6c] text-xl font-medium font-poppins">
                      Filter
                    </h4>
                    <button
                      className="text-[#6c6c6c] text-sm font-normal font-poppins"
                      onClick={toggleMobileFilters}
                      aria-label="Close filters"
                    >
                      <Image src="/close.svg" width={24} height={24} alt="" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h5 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                        Experience Level
                      </h5>
                      {FILTER_OPTIONS.experience.map((level) => (
                        <FilterCheckbox
                          key={level}
                          isSelected={filters.experience.includes(level)}
                          onClick={() =>
                            handleFilterToggle("experience", level)
                          }
                          label={level}
                        />
                      ))}
                    </div>

                    <div>
                      <h5 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                        Location
                      </h5>
                      {FILTER_OPTIONS.location.map((location) => (
                        <FilterCheckbox
                          key={location}
                          isSelected={filters.location.includes(location)}
                          onClick={() =>
                            handleFilterToggle("location", location)
                          }
                          label={location}
                        />
                      ))}
                    </div>

                    <div>
                      <h5 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                        Date Posted
                      </h5>
                      {FILTER_OPTIONS.datePosted.map((date) => (
                        <FilterCheckbox
                          key={date}
                          isSelected={filters.datePosted.includes(date)}
                          onClick={() => handleFilterToggle("datePosted", date)}
                          label={date}
                        />
                      ))}
                    </div>

                    <div>
                      <h5 className="text-base font-medium font-poppins text-[#6c6c6c] mb-3">
                        Job Type
                      </h5>
                      {FILTER_OPTIONS.jobType.map((type) => (
                        <FilterCheckbox
                          key={type}
                          isSelected={filters.jobType.includes(type)}
                          onClick={() => handleFilterToggle("jobType", type)}
                          label={
                            type === "project-based"
                              ? "Project Based"
                              : type === "full-time"
                                ? "Full Time"
                                : type === "hourly"
                                  ? "Hourly"
                                  : type === "internship"
                                    ? "Internship"
                                    : type
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      className="text-[#6c6c6c] text-sm font-normal font-poppins focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </button>
                    <button
                      className="h-[40px] px-6 font-semibold text-sm font-montserrat text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                      onClick={toggleMobileFilters}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {jobsToShow.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobsToShow.map((job) => (
                    <JobCard key={job.id} job={job} roleKey={roleKey || ""} />
                  ))}
                </div>

                {hasMoreJobs && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={loadMoreJobs}
                      className="w-full md:w-auto bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 px-8 text-white text-sm font-semibold font-montserrat text-center hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                    >
                      Load More Jobs
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg font-poppins">
                  {searchQuery ||
                  Object.values(filters).some((arr) => arr.length > 0)
                    ? "No jobs match your filters. Try adjusting your search criteria."
                    : "Currently no open positions for this role. Check back later!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
