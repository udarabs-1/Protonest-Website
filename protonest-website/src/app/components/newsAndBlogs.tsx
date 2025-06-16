'use client';
import Image from 'next/image';

const NewsAndBlogs = () => {
    const blogs = [
        {
            id: 1,
            title: "Selecting a Suitable Sensor for an IoT Project",
            image: "/blogs1.svg",
            description: "The world of the Internet of Things is a world in constant flux where sensors are silent heroes that will help bring your project to reality. Whether it is to keep your house comfortable with a smart thermostat, monitor your pulse with a fitness tracker, or agricultural systems that guarantee optimal crop growth are in the middle of any application involving IoT."
        },
        {
            id: 2,
            title: "Selecting a Suitable Battery for an IoT Project",
            image: "/blogs2.svg",
            description: "The selection of the proper battery for an IoT project is much more than a technical decision but a strategic one, considering the reliability, lifespan, and performance of your IoT Project."
        },
        {
            id: 3,
            title: "Selecting the Right Cloud Backend for an IoT Project",
            image: "/blogs3.svg",
            description: "One of the most critical decisions for any IoT project is selecting the right cloud backend for an IoT project. The cloud backend platform serves as a central hub for managing communication, data storage, and processing, with the scalability and security of the whole system in mind."
        }
    ];

    return (
        <div className="mt-10 sm:mt-20 lg:mt-32 xl:mt-40 relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[642px] px-4 sm:px-6 lg:px-8">
            {/* Background Image - Hidden on mobile for better readability */}
            <div className="absolute inset-0 hidden sm:block">
                <Image
                    src="/home-7.svg"
                    alt="Background"
                    fill
                    className="object-cover opacity-50 sm:opacity-100"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-[#6c6c6c] text-xl sm:text-2xl lg:text-3xl font-medium font-montserrat leading-tight sm:leading-[55px]">
                        The Latest{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            News & Blogs
                        </span>
                    </h2>
                </div>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-11 justify-items-center">
                    {blogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </div>

            <div className="my-20 text-center px-4">
                <button className="w-[160px] sm:w-[180px] h-[45px] sm:h-[50px] gradient-button font-medium font-poppins hover:font-semibold transition text-[14px] sm:text-[16px]">
                    View All Article
                </button>
            </div>
        </div>
    );
};

// Blog Card Component
const BlogCard = ({ blog }: { blog: { id: number, title: string, image: string, description: string } }) => {
    return (
        <div className="w-full max-w-[345px] h-auto min-h-[450px] sm:min-h-[502px] relative bg-white/5 rounded-[20px] sm:rounded-[35px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] sm:shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Blog Image */}
            <div className="w-full max-w-[279px] h-[140px] sm:h-[164px] mx-auto relative rounded-[8px] sm:rounded-[11px] overflow-hidden mb-4 sm:mb-6">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Divider */}
            <div className="w-8 h-px mx-auto bg-[#767676] rounded-full mb-4 sm:mb-6" />

            {/* Blog Title */}
            <h3 className="w-full max-w-[240px] mx-auto text-center text-[#4d4d4d] text-sm sm:text-base font-normal font-poppins mb-3 sm:mb-4 px-2">
                {blog.title}
            </h3>

            {/* Blog Description */}
            <p className="w-full max-w-[279px] mx-auto text-center text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed px-2">
                {blog.description}
            </p>
        </div>
    );
};

export default NewsAndBlogs;