'use client';
import Image from 'next/image';
import Link from 'next/link';

const WhyChooseProtonest = () => {
    const features = [
        {
            icon: "/choose1.svg",
            title: "Tailored IoT Solutions",
            isLeft: true
        },
        {
            icon: "/choose2.svg",
            title: "Expertise in hardware and software design",
            isLeft: false
        },
        {
            icon: "/choose3.svg",
            title: "Transparency and Collaboration",
            isLeft: true
        },
        {
            icon: "/choose4.svg",
            title: "Innovation and Quality",
            isLeft: false
        },
        {
            icon: "/choose5.svg",
            title: "Post Development Support",
            isLeft: true
        },
        {
            icon: "/choose6.svg",
            title: "Dedicated to Client Satisfaction",
            isLeft: false
        },
        {
            icon: "/choose7.svg",
            title: "Proven Track Record",
            isLeft: true
        }
    ];

    return (
        <div className="my-20 lg:my-24 relative w-full">
            {/* Background Images */}
            {/* Mobile/SM/MD Background */}
            <div className="lg:hidden absolute inset-0 flex items-center justify-center">
                <Image
                    src="/home-6-mobile.svg"
                    alt="Why choose us mobile background"
                    width={768}
                    height={500}
                    priority={false}
                    quality={65}
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="max-w-full h-auto object-contain"
                />
            </div>

            {/* LG+ Background */}
            <div className="hidden lg:block absolute inset-0">
                <div className="flex justify-center">
                    <Image
                        src="/home-6.svg"
                        alt="Why choose us desktop background"
                        width={1440}
                        height={664}
                        priority={false}
                        quality={70}
                        sizes="(min-width: 1024px) 100vw, 1440px"
                        className="max-w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
                {/* Header */}
                <div className="text-left mb-8 md:mb-12">
                    <h2 className="text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat mb-15">
                        <span className="text-[rgba(108,108,108,1)]">
                            Why Choose{' '}
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                            Protonest?
                        </span>
                    </h2>

                    <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6">
                        <div className="text-[14px] lg:text-[18px] xl:text-[18px] font-normal font-poppins text-left">
                            <span className="text-[rgba(108,108,108,1)]">
                                Where bold ideas become connected products.
                            </span>
                        </div>
                        <div className="text-[14px] lg:text-[18px] xl:text-[18px] font-normal font-poppins">
                            <Link href="https://iot-system-design-tool.protonest.co" target="_blank" rel="noopener noreferrer">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer transition-all duration-300">
                                    Get a Quote &gt;
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features - Mobile/SM/MD Layout (Alternating Left/Right) */}
                <div className="block lg:hidden space-y-8 pt-8">
                    {features.map((feature, index) => (
                        <FeatureItemAlternating
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            isLeft={feature.isLeft}
                            index={index}
                        />
                    ))}
                </div>

                {/* Features - Large Screen Layout (LG/XL/2XL - 2 Rows Centered) */}
                <div className="hidden lg:block pt-16">
                    {/* First Row - 3 items centered */}
                    <div className="flex justify-center items-start gap-16 xl:gap-20 2xl:gap-24 mb-20">
                        {features.slice(0, 3).map((feature, index) => (
                            <FeatureItemGrid
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                index={index}
                            />
                        ))}
                    </div>
                    {/* Second Row - 4 items centered */}
                    <div className="flex justify-center items-start gap-16 xl:gap-20 2xl:gap-24">
                        {features.slice(3, 7).map((feature, index) => (
                            <FeatureItemGrid
                                key={index + 3}
                                icon={feature.icon}
                                title={feature.title}
                                index={index + 3}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Alternating Feature Item Component (Mobile/SM/MD)
const FeatureItemAlternating = ({ icon, title, isLeft, index }: { icon: string, title: string, isLeft: boolean, index: number }) => {
    return (
        <div className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
            <div className={`inline-flex items-center gap-6 sm:gap-8 ${isLeft ? '' : 'flex-row-reverse'}`}>
                <FeatureCircle icon={icon} title={title} index={index} />
                <div className={`max-w-[150px] text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm font-normal font-poppins ${isLeft ? 'text-left' : 'text-right'}`}>
                    {title}
                </div>
            </div>
        </div>
    );
};

// Grid Feature Item Component (LG+)
const FeatureItemGrid = ({ icon, title, index }: { icon: string, title: string, index: number }) => {
    return (
        <div className="flex flex-col items-center text-center w-64 group">
            <div className="mb-6">
                <FeatureCircle icon={icon} title={title} index={index} />
            </div>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[16px] xl:text-lg font-normal font-poppins leading-relaxed min-h-[3rem] flex items-start justify-center">
                {title}
            </h3>
        </div>
    );
};

// Reusable Feature Circle Component
const FeatureCircle = ({ icon, title, index }: { icon: string, title: string, index: number }) => {
    return (
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <Image
                src={icon}
                alt={`${title} icon`}
                width={128}
                height={128}
                priority={index < 3}
                quality={80}
                sizes="(max-width: 640px) 96px, 128px"
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default WhyChooseProtonest;