import Image from "next/image";
import Link from "next/link";

export default function BlogSection() {
  const categories = ["UI/UX", "Photoshop", "Designing", "UI/UX", "Photoshop"];
  const blogs = Array(6).fill({
    title: "Selecting A Suitable Sensor For An IoT Project",
    excerpt: "The world of the Internet of Things is a world in constant flux where sensors are silent heroes that will help bring your project to reality. Whether it is to..",
    readTime: "3 min read",
    imageUrl: "/blogsPage1.svg"
  });

  return (
    <div className="mb-30">
      <div
        className="mt-[50px] h-[400px] sm:h-[480px] lg:h-[553px] bg-no-repeat bg-cover bg-center relative"
        style={{ backgroundImage: "url('/blogs-1.svg')" }}
      >
        {/* Top Edge Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        {/* Bottom Edge Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-[133px] xl:px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[28px] sm:text-[35px] md:text-[40px] lg:text-[45px] font-medium font-montserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Blogs
              </span>
            </div>
          </div>
          <div className="text-center text-[14px] sm:text-[16px] lg:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20 lg:px-auto">
            <span className="text-[rgba(108,108,108,1)]">
              Insights, Innovation & IoT: Explore the Protonest Blog
            </span>
          </div>
        </div>
      </div>

      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-[130px]">
        {/* Search Bar */}
        <div className="relative h-[38px] max-w-2xl mx-auto opacity-50 bg-white rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] border border-[#6c6c6c] overflow-hidden">
          <input
            type="text"
            className="w-full h-full pl-9 pr-12 bg-transparent text-[#6c6c6c] text-sm font-normal font-poppins leading-normal focus:outline-none"
            placeholder="Search for the blog categories you are looking for"
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

        {/* Category Filters */}
        <div className="flex flex-wrap justify-start gap-3 mt-6 sm:mt-8">
          {categories.map((category, index) => (
            <button
              key={index}
              className="h-11 px-4 sm:px-6 py-4 rounded-[57px] inline-flex items-center gap-1 gradient-button"
            >
              <span className="text-[#6c6c6c] text-sm font-medium font-montserrat hover:text-white">
                {category}
              </span>
              <Image
                src="/close.svg"
                width={28}
                height={28}
                alt=""
                className="rotate-180"
              />
            </button>
          ))}
        </div>

        {/* Blog Grid - FIXED VERSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12">
          {blogs.map((blog, index) => (
            <Link key={index} href="/whats-new/blog-details" passHref>
              <article
                className="group bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden hover:shadow-[10px_10px_30px_0px_rgba(85,48,250,0.20)] transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="p-4 sm:p-6 lg:p-8 pb-0">
                  <div className="w-full aspect-[472/164] rounded-[11px] overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      width={472}
                      height={164}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 sm:p-6 lg:p-8 pt-4 space-y-3 sm:space-y-4">
                  <h3 className="text-[#6c6c6c] text-sm sm:text-base lg:text-lg font-medium font-poppins leading-[1.4] group-hover:text-[#5530fa] transition-colors duration-300">
                    {blog.title}
                  </h3>
                  <div className="text-[#6c6c6c] text-xs sm:text-sm font-normal font-poppins">
                    {blog.readTime}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-[29px] px-3 py-2 rounded-[30px] outline-1 outline-offset-[-1px] outline-[#d5d5d5] inline-flex justify-center items-center">
                      <div className="text-[#83848b] text-[8px] sm:text-[10px] font-normal font-poppins leading-normal">
                        Category Tag
                      </div>
                    </div>
                    <div className="h-[29px] px-3 py-2 rounded-[30px] outline-1 outline-offset-[-1px] outline-[#d5d5d5] inline-flex justify-center items-center">
                      <div className="text-[#83848b] text-[8px] sm:text-[10px] font-normal font-poppins leading-normal">
                        Category Tag
                      </div>
                    </div>
                  </div>
                  <p className="text-[#6c6c6c] text-xs sm:text-sm font-medium font-poppins leading-[1.5] line-clamp-3">
                    {blog.excerpt}
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
  );
}