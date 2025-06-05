'use client';
import Image from 'next/image';

const NewsAndBlogs = () => {
    const blogs = [
        {
            id: 1,
            title: "Selecting a Suitable Sensor for an IoT Project",
            image: "/blogs1.svg", // Replace with your actual image path
            description: "The world of the Internet of Things is a world in constant flux where sensors are silent heroes that will help bring your project to reality. Whether it is to keep your house comfortable with a smart thermostat, monitor your pulse with a fitness tracker, or agricultural systems that guarantee optimal crop growth are in the middle of any application involving IoT."
        },
        {
            id: 2,
            title: "Selecting a Suitable Battery for an IoT Project",
            image: "/blogs2.svg", // Replace with your actual image path
            description: "The selection of the proper battery for an IoT project is much more than a technical decision but a strategic one, considering the reliability, lifespan, and performance of your IoT Project."
        },
        {
            id: 3,
            title: "Selecting the Right Cloud Backend for an IoT Project",
            image: "/blogs3.svg", // Replace with your actual image path
            description: "One of the most critical decisions for any IoT project is selecting the right cloud backend for an IoT project. The cloud backend platform serves as a central hub for managing communication, data storage, and processing, with the scalability and security of the whole system in mind."
        }
    ];

    return (
        <div className="mt-40 relative w-[1440px] h-[642px]">
            {/* Background Image */}
            <Image
                src="/home-7.svg" // Replace with your actual background image
                alt="Background"
                width={1440}
                height={585}
                className="absolute left-0 top-[57px]"
            />

            {/* Header */}
            <div className="absolute left-[161px] top-[18px] w-[1120px] text-center">
                <h2 className="text-[#6c6c6c] text-[30px] font-medium font-montserrat leading-[55px]">
                    The Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">News & Blogs</span>
                </h2>
            </div>

            {/* Blog Cards */}
            <div className="left-[159px] top-[140px] absolute flex gap-11">
                {blogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

        </div>
    );
};

// Blog Card Component
const BlogCard = ({ blog }: { blog: { id: number, title: string, image: string, description: string } }) => {
    return (
        <div className="w-[345px] h-[502px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden">
            {/* Blog Image */}
            <div className="w-[279px] h-[164px] mx-auto mt-[33px] relative rounded-[11px] overflow-hidden">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    width={279}
                    height={164}
                    className="object-cover"
                />
            </div>

            {/* Divider */}
            <div className="w-px h-px mx-auto my-4 bg-[#767676] rounded-full" />

            {/* Blog Title */}
            <h3 className="w-[240px] mx-auto mt-6 text-center text-[#4d4d4d] text-base font-normal font-poppins">
                {blog.title}
            </h3>

            {/* Blog Description */}
            <p className="w-[279px] mx-auto mt-4 text-center text-[#6c6c6c] text-xs font-normal font-poppins">
                {blog.description}
            </p>


        </div>
    );
};

export default NewsAndBlogs;