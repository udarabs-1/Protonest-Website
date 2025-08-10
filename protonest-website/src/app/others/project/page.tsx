"use client";

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ResearchProjects() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const projects = Array(6).fill({
    title: "Multi Language Control Humidifier",
    excerpt: "Humidifier offers precise humidity and temperature control, ensuring desired environmental conditions are maintained. With user...",
    category: "Consumer Electronics",
    status: "NDA",
    imageUrl: "/blogsPage1.svg"
  });

  const industries = ['Healthcare', 'Agriculture', 'Automotive', 'Smart Home'];
  const sortOptions = ['Most Viewed', 'Most Recent'];

  return (
    <div>
      <Navbar />
      <div className="mb-30">
        {/* Hero Section */}
        <div
          className="mt-[50px] h-[400px] sm:h-[480px] lg:h-[553px] bg-no-repeat bg-cover bg-center relative"
          style={{ backgroundImage: "url('/research-1.svg')" }}
        >
          {/* Top Edge Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

          {/* Bottom Edge Gradient Overlay */}
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
            {/* Desktop Filters Sidebar - Hidden on mobile and md screens */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <div className="text-[#6c6c6c] text-xl font-medium font-poppins mb-6">
                Filter
              </div>

              <button className="text-[#6c6c6c] text-sm font-normal font-poppins mb-8">
                Clear All
              </button>

              <div className="mb-8">
                <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                  Industry →
                </div>
                <div className="space-y-2">
                  {industries.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`industry-${index}`}
                        className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                      />
                      <label htmlFor={`industry-${index}`} className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                  Sort By →
                </div>
                <div className="space-y-2">
                  {sortOptions.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="sort"
                        id={`sort-${index}`}
                        className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                      />
                      <label htmlFor={`sort-${index}`} className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Mobile Filter Header - Visible only on mobile and md */}
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

                    <div className="mb-8">
                      <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                        Industry →
                      </div>
                      <div className="space-y-2">
                        {industries.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`mobile-industry-${index}`}
                              className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                            />
                            <label htmlFor={`mobile-industry-${index}`} className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#6c6c6c] text-base font-medium font-poppins mb-4">
                        Sort By →
                      </div>
                      <div className="space-y-2">
                        {sortOptions.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="mobile-sort"
                              id={`mobile-sort-${index}`}
                              className="w-4 h-4 rounded-full border-2 border-[#6c6c6c]"
                            />
                            <label htmlFor={`mobile-sort-${index}`} className="text-[#6c6c6c] text-[13px] font-normal font-poppins">
                              {item}
                            </label>
                          </div>
                        ))}
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
                <Link href="/whats-new/project" passHref>
                  <button className="h-[51px] px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] border border-transparent inline-flex justify-center items-center gap-1">
                    <span className="text-white text-base font-semibold font-montserrat">
                      Projects
                    </span>
                  </button>
                </Link>
                <Link href="/whats-new/research" passHref>
                  <button className="h-[51px] px-6 py-4 rounded-[57px] gradient-button inline-flex justify-center items-center gap-1">
                    <span className="text-[#4d4d4d] text-base font-medium font-poppins">
                      Research
                    </span>
                  </button>
                </Link>
              </div>

              {/* Search */}
              <div className="relative h-[50px] w-full opacity-70 bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden mb-8">
                <input
                  type="text"
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
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {projects.map((project, index) => (
                  <Link key={index} href="/whats-new/project-details" passHref>
                    <article className="group bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden hover:shadow-[10px_10px_30px_0px_rgba(85,48,250,0.20)] transition-all duration-300 cursor-pointer">
                      {/* Image Container */}
                      <div className="p-6 pb-0">
                        <div className="w-full aspect-[374/164] rounded-[11px] overflow-hidden">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            width={374}
                            height={164}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-6 pt-4 space-y-3">
                        <h3 className="text-[#6c6c6c] text-base font-medium font-poppins leading-[1.4] group-hover:text-[#5530fa] transition-colors duration-300">
                          {project.title}
                        </h3>
                        <div className="text-[#6c6c6c] text-[9px] font-normal font-poppins">
                          {project.status}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-[29px] px-3 py-2 rounded-[30px] border border-[#d5d5d5] inline-flex justify-center items-center">
                            <div className="text-[#83848b] text-[8px] font-normal font-poppins leading-normal">
                              {project.category}
                            </div>
                          </div>
                        </div>
                        <p className="text-[#6c6c6c] text-[9px] font-medium font-poppins leading-[1.5] line-clamp-3">
                          {project.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center mt-8 sm:mt-12">
                <button className="h-[50px] w-[160px] sm:w-[180px] font-semibold text-[14px] sm:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                  Load More
                </button>
              </div>
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

                <form className="mt-6 sm:mt-8 space-y-8 sm:space-y-12 lg:space-y-16">
                  <div className="space-y-1">
                    <label className="text-[#6c6c6c] text-base sm:text-lg font-semibold font-poppins leading-[30px]">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c]/80 text-sm sm:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#6c6c6c] text-base sm:text-lg font-semibold font-poppins leading-[30px]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c]/80 text-sm sm:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="career-updates"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#5530fa] bg-gray-100 border-gray-300 rounded focus:ring-[#5530fa] focus:ring-2"
                    />
                    <label htmlFor="career-updates" className="text-[#6c6c6c]/80 text-sm sm:text-base font-normal font-poppins leading-[24px] sm:leading-[30px] cursor-pointer">
                      I&apos;m interested in career updates too.
                    </label>
                  </div>

                  <div className="flex justify-start mt-8 sm:mt-12">
                    <button className="h-[50px] w-[160px] sm:w-[180px] font-semibold text-[14px] sm:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Position image to the rightmost side on larger screens */}
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