import Image from "next/image";

const ServicesSection = () => {
    return (
        <>
            {/* Desktop Version - xl and larger */}
            <div className="hidden xl:block mt-[120px] mb-[80px] h-[649px] bg-no-repeat bg-cover bg-center">
                <div
                    className="h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-3.svg')" }}
                >
                    <div className="flex flex-col items-start justify-start h-full px-[133px]">
                        <div className="flex justify-center">
                            <div className="text-left text-[30px] font-medium font-montserrat">
                                <span className="text-[rgba(108,108,108,1)]">
                                    What Do We{" "}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                                    Offer?
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full my-12">
                            <div className="text-[18px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)]">
                                    From Idea to Execution, We&apos;ve Got You Covered.
                                </span>
                            </div>
                            <div className="text-[18px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                                    Get a Quote &gt;
                                </span>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* First row */}
                            <div className="flex justify-between mb-12 gap-3">
                                <div className="w-[510px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-1.svg"
                                        hoverImage="/home/offers/xl/service-1-hover.svg"
                                        alt="Service 1"
                                    />
                                </div>
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-2.svg"
                                        hoverImage="/home/offers/xl/service-2-hover.svg"
                                        alt="Service 2"
                                    />
                                </div>
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-3.svg"
                                        hoverImage="/home/offers/xl/service-3-hover.svg"
                                        alt="Service 3"
                                    />
                                </div>
                            </div>

                            {/* Second row */}
                            <div className="flex justify-between gap-3">
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-4.svg"
                                        hoverImage="/home/offers/xl/service-4-hover.svg"
                                        alt="Service 4"
                                    />
                                </div>
                                <div className="w-[510px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-5.svg"
                                        hoverImage="/home/offers/xl/service-5-hover.svg"
                                        alt="Service 5"
                                    />
                                </div>
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/xl/service-6.svg"
                                        hoverImage="/home/offers/xl/service-6-hover.svg"
                                        alt="Service 6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* lg Version */}
            <div className="hidden lg:block xl:hidden mt-[100px] mb-[70px] min-h-[800px] bg-no-repeat bg-cover bg-center">
                <div
                    className="h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-3.svg')" }}
                >
                    <div className="flex flex-col items-start justify-start h-full px-[80px]">
                        <div className="flex justify-center w-full">
                            <div className="text-left text-[28px] font-medium font-montserrat">
                                <span className="text-[rgba(108,108,108,1)]">
                                    What Do We{" "}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                                    Offer?
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full my-10">
                            <div className="text-[16px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)]">
                                    From Idea to Execution, We&apos;ve Got You Covered.
                                </span>
                            </div>
                            <div className="text-[16px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                                    Get a Quote &gt;
                                </span>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* First row */}
                            <div className="flex justify-between mb-8 gap-3">
                                <div className="w-[510px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-1.svg"
                                        hoverImage="/home/offers/lg/service-1-hover.svg"
                                        alt="Service 1"
                                    />
                                </div>
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-2.svg"
                                        hoverImage="/home/offers/lg/service-2-hover.svg"
                                        alt="Service 2"
                                    />
                                </div>
                            </div>

                            {/* Second row */}
                            <div className="flex justify-between mb-8 gap-3">
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-3.svg"
                                        hoverImage="/home/offers/lg/service-3-hover.svg"
                                        alt="Service 3"
                                    />
                                </div>
                                <div className="w-[510px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-4.svg"
                                        hoverImage="/home/offers/lg/service-4-hover.svg"
                                        alt="Service 4"
                                    />
                                </div>
                            </div>

                            {/* Third row */}
                            <div className="flex justify-between gap-3">
                                <div className="w-[391px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-5.svg"
                                        hoverImage="/home/offers/lg/service-5-hover.svg"
                                        alt="Service 5"
                                    />
                                </div>
                                <div className="w-[391px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/lg/service-6.svg"
                                        hoverImage="/home/offers/lg/service-6-hover.svg"
                                        alt="Service 6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* md Version */}
            <div className="hidden md:block lg:hidden mt-[80px] mb-[60px] min-h-[700px] bg-no-repeat bg-cover bg-center">
                <div
                    className="h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-3.svg')" }}
                >
                    <div className="flex flex-col items-start justify-start h-full px-[60px]">
                        <div className="flex justify-center w-full">
                            <div className="text-left text-[26px] font-medium font-montserrat">
                                <span className="text-[rgba(108,108,108,1)]">
                                    What Do We{" "}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                                    Offer?
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full my-8">
                            <div className="text-[15px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)]">
                                    From Idea to Execution, We&apos;ve Got You Covered.
                                </span>
                            </div>
                            <div className="text-[15px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                                    Get a Quote &gt;
                                </span>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* First row */}
                            <div className="flex justify-between mb-6 gap-3">
                                <div className="w-[450px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-1.svg"
                                        hoverImage="/home/offers/md/service-1-hover.svg"
                                        alt="Service 1"
                                    />
                                </div>
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-2.svg"
                                        hoverImage="/home/offers/md/service-2-hover.svg"
                                        alt="Service 2"
                                    />
                                </div>
                            </div>

                            {/* Second row */}
                            <div className="flex justify-between mb-6 gap-3">
                                <div className="w-[264px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-3.svg"
                                        hoverImage="/home/offers/md/service-3-hover.svg"
                                        alt="Service 3"
                                    />
                                </div>
                                <div className="w-[450px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-4.svg"
                                        hoverImage="/home/offers/md/service-4-hover.svg"
                                        alt="Service 4"
                                    />
                                </div>
                            </div>

                            {/* Third row */}
                            <div className="flex justify-between gap-3">
                                <div className="w-[377px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-5.svg"
                                        hoverImage="/home/offers/md/service-5-hover.svg"
                                        alt="Service 5"
                                    />
                                </div>
                                <div className="w-[338px] h-[186px]">
                                    <ServiceCard
                                        normalImage="/home/offers/md/service-6.svg"
                                        hoverImage="/home/offers/md/service-6-hover.svg"
                                        alt="Service 6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* sm Version */}
            <div className="hidden sm:block md:hidden mt-[60px] mb-[50px] min-h-[1100px] bg-no-repeat bg-cover bg-center">
                <div
                    className="h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-3.svg')" }}
                >
                    <div className="flex flex-col items-center justify-start h-full px-8">
                        <div className="flex justify-center w-full mb-6">
                            <div className="text-left text-[24px] font-medium font-montserrat">
                                <span className="text-[rgba(108,108,108,1)]">
                                    What Do We{" "}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                                    Offer?
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4">
                            <div className="text-[14px] font-normal font-poppins text-center sm:text-left">
                                <span className="text-[rgba(108,108,108,1)]">
                                    From Idea to Execution, We&apos;ve Got You Covered.
                                </span>
                            </div>
                            <div className="text-[14px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                                    Get a Quote &gt;
                                </span>
                            </div>
                        </div>

                        <div className="w-full max-w-md">
                            {/* Single column layout */}
                            <div className="flex flex-col gap-4">
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-1.svg"
                                        hoverImage="/home/offers/sm/service-1-hover.svg"
                                        alt="Service 1"
                                    />
                                </div>
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-2.svg"
                                        hoverImage="/home/offers/sm/service-2-hover.svg"
                                        alt="Service 2"
                                    />
                                </div>
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-3.svg"
                                        hoverImage="/home/offers/sm/service-3-hover.svg"
                                        alt="Service 3"
                                    />
                                </div>
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-4.svg"
                                        hoverImage="/home/offers/sm/service-4-hover.svg"
                                        alt="Service 4"
                                    />
                                </div>
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-5.svg"
                                        hoverImage="/home/offers/sm/service-5-hover.svg"
                                        alt="Service 5"
                                    />
                                </div>
                                <div className="w-[470px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/sm/service-6.svg"
                                        hoverImage="/home/offers/sm/service-6-hover.svg"
                                        alt="Service 6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Version */}
            <div className="sm:hidden mt-12 mb-12 min-h-[1100px]">
                <div
                    className="h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-3.svg')" }}
                >
                    <div className="flex flex-col items-center justify-start h-full py-8">
                        <div className="flex justify-center mb-6">
                            <div className="text-left text-[22px] font-medium font-montserrat">
                                <span className="text-[rgba(108,108,108,1)]">
                                    What Do We{" "}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                                    Offer?
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-center w-full mb-8 gap-4">
                            <div className="text-[13px] font-normal font-poppins text-center">
                                <span className="text-[rgba(108,108,108,1)]">
                                    From Idea to Execution, We&apos;ve Got You Covered.
                                </span>
                            </div>
                            <div className="text-[13px] font-normal font-poppins">
                                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                                    Get a Quote &gt;
                                </span>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* Single column layout */}
                            <div className="flex flex-col gap-3 items-center">
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-1.svg"
                                        hoverImage="/home/offers/mobile/service-1-hover.svg"
                                        alt="Service 1"
                                    />
                                </div>
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-2.svg"
                                        hoverImage="/home/offers/mobile/service-2-hover.svg"
                                        alt="Service 2"
                                    />
                                </div>
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-3.svg"
                                        hoverImage="/home/offers/mobile/service-3-hover.svg"
                                        alt="Service 3"
                                    />
                                </div>
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-4.svg"
                                        hoverImage="/home/offers/mobile/service-4-hover.svg"
                                        alt="Service 4"
                                    />
                                </div>
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-5.svg"
                                        hoverImage="/home/offers/mobile/service-5-hover.svg"
                                        alt="Service 5"
                                    />
                                </div>
                                <div className="w-[362px] h-[108px]">
                                    <ServiceCard
                                        normalImage="/home/offers/mobile/service-6.svg"
                                        hoverImage="/home/offers/mobile/service-6-hover.svg"
                                        alt="Service 6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Simplified ServiceCard component that takes up full width/height of its container
const ServiceCard = ({
    normalImage,
    hoverImage,
    alt,
}: {
    normalImage: string;
    hoverImage: string;
    alt: string;
}) => {
    return (
        <div className="relative group w-full h-full">
            <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[25px] overflow-hidden">
                <Image
                    src={normalImage}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[25px] overflow-hidden">
                <Image
                    src={hoverImage}
                    alt={`${alt} Hover`}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    );
};

export default ServicesSection;