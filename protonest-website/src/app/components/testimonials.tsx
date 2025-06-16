'use client';
import Image from 'next/image';

const TestimonialSection = () => {
    return (
        <div className="relative w-full xl:w-[1440px] h-auto lg:h-[700px] xl:h-[674px] xl:mx-auto overflow-hidden">
            {/* Background Elements - XL screen keeps original absolute positioning */}
            <div className="xl:absolute xl:inset-0 hidden xl:block z-0">
                <div className="absolute left-[344px] top-[211px] w-[753px] h-[447px] rounded-[37px] overflow-hidden">
                    <Image
                        src="/home-5.svg"
                        alt="Background"
                        width={753}
                        height={447}
                        className="rounded-[37px]"
                    />
                    <div className="absolute left-[22px] top-[241px] w-[235px] h-[235px] bg-[#5530fa]/75 rounded-full blur-[100px]" />
                    <div className="absolute left-[491px] top-[-27px] w-[235px] h-[235px] bg-[#f51da5]/75 rounded-full blur-[100px]" />
                    <button className="absolute left-[287px] top-[373px] w-[179px] h-[51px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat hover:font-poppins rounded-[57px] flex justify-center items-center gap-1 z-20">
                        <span className="text-white text-base font-semibold">Contact Us</span>
                    </button>
                </div>
            </div>

            {/* Background Elements for lg screens - Fixed sizing and positioning */}
            <div className="hidden lg:block xl:hidden absolute inset-0 z-0 w-full h-[600px]">
                <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[800px] h-auto rounded-[35px] overflow-hidden">
                    <Image
                        src="/home-5.svg"
                        alt="Background"
                        width={900}
                        height={480}
                        className="object-cover rounded-[35px]"
                    />
                    {/* Blur Effects - Adjusted for larger container */}
                    <div className="absolute left-[8%] bottom-[20%] w-[220px] h-[220px] bg-[#5530fa]/75 rounded-full blur-[90px]" />
                    <div className="absolute right-[8%] top-[15%] w-[220px] h-[220px] bg-[#f51da5]/75 rounded-full blur-[90px]" />

                    {/* Contact Button with higher z-index */}
                    <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 z-30">
                        <button className="w-[180px] h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat hover:font-poppins rounded-[40px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <span className="text-white text-base font-semibold">Contact Us</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Elements for md and smaller screens */}
            <div className="lg:hidden absolute inset-0 flex items-center justify-center z-0 pt-60 md:pt-80">
                <div className="hidden md:block relative md:w-[600px] md:h-[350px] rounded-[30px] overflow-hidden">
                    <Image
                        src="/home-5.svg"
                        alt="Background"
                        width={600}
                        height={350}
                        className="object-cover rounded-[30px]"
                    />
                    {/* Blur Effects */}
                    <div className="absolute left-[5%] bottom-[15%] w-[180px] h-[180px] bg-[#5530fa]/75 rounded-full blur-[70px]" />
                    <div className="absolute right-[5%] top-[15%] w-[180px] h-[180px] bg-[#f51da5]/75 rounded-full blur-[70px]" />

                    {/* Contact Button with higher z-index */}
                    <div className="absolute bottom-[8%] left-1/2 transform -translate-x-1/2 z-30">
                        <button className="w-[160px] h-[46px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat hover:font-poppins rounded-[35px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <span className="text-white text-base font-semibold">Contact Us</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* XL Screen Header - Original absolute positioning */}
            <div className="hidden xl:block absolute left-[161px] top-[18px] w-[1120px] text-center z-10">
                <h2 className="text-[#6c6c6c] text-[30px] font-medium font-montserrat leading-[55px]">
                    Innovation Backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Experience</span>
                </h2>
            </div>

            {/* XL Screen Subheader - Original absolute positioning */}
            <div className="hidden xl:block absolute left-[295px] top-[100px] w-[850px] text-center text-[#6c6c6c] text-[18px] font-normal font-poppins leading-[30px] z-10">
                Words from those who&apos;ve experienced our process, people, and product delivery first-hand.
            </div>

            {/* XL Screen Gradient Overlays - Original positioning */}
            <div className="hidden xl:block absolute left-0 top-[100px] w-[159px] h-[542px] bg-gradient-to-l from-white/0 to-white z-5" />
            <div className="hidden xl:block absolute left-[1281px] top-0 w-[159px] h-[674px] bg-gradient-to-l from-white to-white/0 z-5" />

            {/* XL Screen Testimonial Cards - Original absolute positioning with z-index */}
            <div className="hidden xl:absolute xl:left-[161px] xl:top-[248px] xl:flex xl:gap-[46px] z-15">
                {[1, 2, 3].map((item) => (
                    <TestimonialCardXL key={item} />
                ))}
            </div>

            {/* Responsive Content for smaller screens */}
            <div className="xl:hidden relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">

                {/* Header Section for smaller screens */}
                <div className="text-center mb-6 md:mb-8 lg:mb-12">
                    <h2 className="text-[#6c6c6c] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium font-montserrat leading-tight sm:leading-relaxed md:leading-[1.3] lg:leading-[1.2] mb-4 md:mb-6 lg:mb-8">
                        Innovation Backed by{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            Experience
                        </span>
                    </h2>

                    <p className="text-[#6c6c6c] text-sm sm:text-base md:text-lg lg:text-xl font-normal font-poppins leading-relaxed max-w-4xl mx-auto">
                        Words from those who&apos;ve experienced our process, people, and product delivery first-hand.
                    </p>
                </div>

                {/* Testimonial Cards Grid for smaller screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-8 lg:gap-6 justify-items-center mb-8 sm:mb-10 lg:mb-16 z-25 relative">
                    {/* Show 1 card on sm, 2 cards on md, 3 cards on lg+ */}
                    <TestimonialCardResponsive />
                    <div className="hidden md:block">
                        <TestimonialCardResponsive />
                    </div>
                    <div className="hidden lg:block">
                        <TestimonialCardResponsive />
                    </div>
                </div>

                {/* Mobile/Tablet Contact Button - Hide on lg since it's in background */}
                <div className="lg:hidden flex justify-center z-30 relative">
                    <button className="w-[160px] h-[45px] md:w-[170px] md:h-[48px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat hover:font-poppins rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <span className="text-white text-base font-semibold">Contact Us</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Original XL Testimonial Card Component (unchanged)
const TestimonialCardXL = () => {
    return (
        <div className="w-[343px] h-[312px] px-8 py-[50px] bg-white/60 rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col items-center gap-2.5">
            <div className="w-[259px] flex flex-col items-start gap-[27px]">
                <ClientAvatarXL />
                <ClientInfoXL />
                <TestimonialTextXL />
            </div>
        </div>
    );
};

// Responsive Testimonial Card Component for smaller screens
const TestimonialCardResponsive = () => {
    return (
        <div className="w-full max-w-[320px] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[280px] h-auto min-h-[280px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[300px] px-6 sm:px-7 md:px-8 lg:px-6 py-8 sm:py-9 md:py-10 lg:py-8 bg-white/60 backdrop-blur-[10px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:bg-white/70 flex flex-col justify-between">

            {/* Card Content */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-4">
                <ClientAvatarResponsive />
                <ClientInfoResponsive />
            </div>

            <TestimonialTextResponsive />
        </div>
    );
};

// XL Screen Sub-components (original)
const ClientAvatarXL = () => (
    <div className="w-[45px] h-[45px] p-0.5 bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-[22.50px] flex items-center justify-center">
        <div className="w-[41px] h-[41px] bg-white rounded-full flex items-center justify-center">
            <Image
                src="/clientAvatar.svg"
                alt="Client"
                width={39}
                height={39}
                className="rounded-full"
            />
        </div>
    </div>
);

const ClientInfoXL = () => (
    <div className="flex flex-col items-start gap-[13px]">
        <div className="text-black text-base font-normal font-poppins">Client Name</div>
        <div className="text-[#989898] text-xs font-normal font-poppins">Company Name</div>
    </div>
);

const TestimonialTextXL = () => (
    <div className="text-[#6c6c6c] text-xs font-normal font-poppins">
        Client review client review client review client review client review client review
        client review client review client review client review client review client review
    </div>
);

// Responsive Sub-components for smaller screens
const ClientAvatarResponsive = () => (
    <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[42px] lg:h-[42px] p-0.5 bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
        <div className="w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] md:w-[46px] md:h-[46px] lg:w-[38px] lg:h-[38px] bg-white rounded-full flex items-center justify-center">
            <Image
                src="/clientAvatar.svg"
                alt="Client"
                width={39}
                height={39}
                className="w-[32px] h-[32px] sm:w-[37px] sm:h-[37px] md:w-[42px] md:h-[42px] lg:w-[34px] lg:h-[34px] rounded-full"
            />
        </div>
    </div>
);

const ClientInfoResponsive = () => (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-2">
        <h3 className="text-black text-sm sm:text-base md:text-base lg:text-sm font-normal font-poppins">
            Client Name
        </h3>
        <p className="text-[#989898] text-xs sm:text-sm md:text-sm lg:text-xs font-normal font-poppins">
            Company Name
        </p>
    </div>
);

const TestimonialTextResponsive = () => (
    <div className="text-[#6c6c6c] text-xs sm:text-sm md:text-sm lg:text-xs font-normal font-poppins leading-relaxed sm:leading-relaxed md:leading-[1.6] lg:leading-relaxed mt-auto">
        Client review client review client review client review client review client review
        client review client review client review client review client review client review
    </div>
);

export default TestimonialSection;