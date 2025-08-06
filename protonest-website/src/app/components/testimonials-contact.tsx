"use client";

import Image from "next/image";

const clients = Array(6).fill({
    name: "Client Name",
    company: "Company Name",
    review:
        "Client review client review client review client review client review client review client review client review client review client review client review client review.",
    imgSrc: "/profile.svg", // Replace with actual path in public/
});

function ClientCard({ name, company, review, imgSrc }: typeof clients[0]) {
    return (
        <div className="w-full max-w-[343px] mx-auto h-auto min-h-[312px] px-4 sm:px-6 py-8 sm:py-[50px] bg-white/80 rounded-[20px] sm:rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col justify-start items-center gap-2.5">
            <div className="w-full max-w-[259px] flex flex-col justify-start items-start gap-4 sm:gap-[27px]">
                <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] relative bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex justify-center items-center">
                    <div className="w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] bg-white rounded-full flex justify-center items-center overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt="Client"
                            width={39}
                            height={39}
                            className="rounded-full w-[34px] h-[34px] sm:w-[39px] sm:h-[39px]"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-[13px]">
                    <div className="text-black text-sm sm:text-base font-normal font-poppins">{name}</div>
                    <div className="text-[#989898] text-xs font-normal font-poppins">{company}</div>
                </div>
                <p className="text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed">{review}</p>
            </div>
        </div>
    );
}

export default function Testimonials() {
    return (
        <div className="mt-10 sm:mt-16 lg:mt-20 w-full flex-col px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] relative py-6 sm:py-8 lg:py-10">
            {/* Title */}
            <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-medium font-montserrat leading-tight sm:leading-[45px] lg:leading-[55px] text-[#6c6c6c] px-4">
                What Our{" "}
                <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent font-montserrat">Clients</span>{" "}
                Say
            </h2>

            {/* Testimonial Cards */}
            <div className="mt-8 sm:mt-12 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-[46px] place-items-center">
                {clients.map((client, idx) => (
                    <ClientCard key={idx} {...client} />
                ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 sm:mt-12 lg:mt-15 text-center">
                <button className="w-[160px] h-[45px] gradient-button font-medium font-poppins text-sm">
                    Load More
                </button>
            </div>

            {/* Background Image - Hidden on mobile for better performance */}
            <div className="hidden lg:block">
                <Image
                    src="/contact-4.svg" // move your bg image to public folder
                    alt="Background"
                    width={800}
                    height={800}
                    className="absolute -mt-40 -z-10 top-0 left-0 opacity-50 xl:opacity-100"
                />
            </div>
        </div>
    );
}