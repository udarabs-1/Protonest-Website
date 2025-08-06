'use client';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const TestimonialSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "Peter Hodgson",
            company: "Purbrook Engineering Ltd",
            text: "I collaborated with Udara from Protonest on a test equipment project for a large international company, requiring microcontroller coding. We selected Udara based on his outstanding customer feedback and project discussions. He delivered circuit diagrams, operator instructions, code, and component selection promptly and reliably. Udara's responsiveness and reliable communication were key to achieving our goals. I highly recommend Udara for coding and electronic circuit projects.",
            avatar: "/client1.webp"
        },
        {
            id: 2,
            name: "Leon Hartman",
            company: "Netherlands",
            text: "Great working with Udara, he put a lot of dedication into the project i had given. I am super happy with the communication and off course thank to the help, a working machine. Thanks for all and see you next time",
            avatar: "/client2.webp"
        },
        {
            id: 3,
            name: "Sajjad Akhtar. MD",
            company: "SurgicalBooking.com",
            text: "Udara is a very dedicated and passionate about his work. He developed an android based app for me and his work was flawless. He was readily available and addressed my concerns promptly. I highly recommend him without reservations.",
            avatar: "/client3.webp"
        }
    ];

    // Settings for the carousel
    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden relative">
            {/* Background Container - Now visible on all screens */}
            <div className="w-full px-2 sm:px-4 md:px-8 lg:px-[150px] xl:px-[250px] 2xl:px-[350px] absolute top-55 md:top-55 lg:top-47 2xl:top-52 left-0 right-0 z-10">
                <div className="relative w-full rounded-[20px] md:rounded-[30px] lg:rounded-[37px] overflow-hidden h-[500px]">
                    <Image
                        src="/home-5.svg"
                        alt="Background"
                        fill
                        className="object-cover"
                        quality={100}
                        priority
                    />
                </div>
            </div>

            {/* Content Container - Independent with standard padding */}
            <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
                {/* Header Section */}
                <div className="w-full mb-12 lg:mb-16">
                    <div className="text-center">
                        <h2 className="text-[#6c6c6c] text-2xl lg:text-[26px] font-medium font-montserrat leading-tight md:leading-[1.3]">
                            Innovation Backed by{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                                Experience
                            </span>
                        </h2>
                        <p className="text-[#6c6c6c] text-sm sm:text-base xl:text-[18px] font-normal font-poppins leading-relaxed my-6 2xl:my-10 mx-auto">
                            Words from those who&apos;ve experienced our process, people, and product delivery first-hand.
                        </p>
                    </div>
                </div>

                <div className="lg:hidden mt-20 mb-10 md:mb-12 px-2"> {/* Added padding here */}
                    <Slider {...carouselSettings}>
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="px-6 pb-6"> {/* Added padding and shadow container */}
                                <div className="shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rounded-[20px] overflow-hidden">
                                    <TestimonialCard
                                        name={testimonial.name}
                                        company={testimonial.company}
                                        text={testimonial.text}
                                        avatar={testimonial.avatar}
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Desktop Grid (hidden on screens smaller than lg) */}
                <div className="mt-10 hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-[46px] mb-10 md:mb-12 lg:mb-16">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            name={testimonial.name}
                            company={testimonial.company}
                            text={testimonial.text}
                            avatar={testimonial.avatar}
                        />
                    ))}
                </div>

                {/* Contact Us Button */}
                <div className="flex justify-center">
                    <button className="w-[160px] md:w-[180px] h-[45px] md:h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <span className="text-white text-sm md:text-base font-medium">Contact Us</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

// Testimonial Card Component remains the same
const TestimonialCard = ({ name, company, text, avatar }: {
    name: string;
    company: string;
    text: string;
    avatar: string
}) => {
    return (
        <div className="w-full max-w-[343px] mx-auto h-[312px] px-4 sm:px-6 py-8 sm:py-[50px] bg-white/80 rounded-[20px] sm:rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col justify-start items-center gap-2.5">
            {/* Scrollable Content Container */}
            <div className="w-full max-w-[259px] h-full overflow-y-auto pr-2">
                <div className="flex flex-col justify-start items-start gap-4 sm:gap-[27px]">
                    {/* Avatar with Gradient Border */}
                    <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] relative bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex justify-center items-center">
                        <div className="w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] bg-white rounded-full flex justify-center items-center overflow-hidden">
                            <Image
                                src={avatar}
                                alt={name}
                                width={39}
                                height={39}
                                className="rounded-full w-[34px] h-[34px] sm:w-[39px] sm:h-[39px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex flex-col gap-2 sm:gap-[13px]">
                        <div className="text-black text-sm sm:text-base font-normal font-poppins">{name}</div>
                        <div className="text-[#989898] text-xs font-normal font-poppins">{company}</div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection;