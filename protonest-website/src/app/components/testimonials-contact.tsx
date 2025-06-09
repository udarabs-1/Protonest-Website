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
        <div className="w-[343px] h-[312px] px-6 py-[50px] bg-white/80 rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col justify-start items-center gap-2.5">
            <div className="w-[259px] flex flex-col justify-start items-start gap-[27px]">
                <div className="w-[45px] h-[45px] relative bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex justify-center items-center">
                    <div className="w-[41px] h-[41px] bg-white rounded-full flex justify-center items-center overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt="Client"
                            width={39}
                            height={39}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-[13px]">
                    <div className="text-black text-base font-normal font-poppins">{name}</div>
                    <div className="text-[#989898] text-xs font-normal font-poppins">{company}</div>
                </div>
                <p className="text-[#6c6c6c] text-xs font-normal font-poppins">{review}</p>
            </div>
        </div>
    );
}

export default function Testimonials() {
    return (
        <div className="mt-20 w-full flex-col px-[133px] relative py-10">
            {/* Title */}
            <h2 className="text-center text-3xl font-medium font-montserrat leading-[55px] text-[#6c6c6c]">
                What Our{" "}
                <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent font-montserrat">Clients</span>{" "}
                Say
            </h2>

            {/* Testimonial Cards */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[46px]">
                {clients.map((client, idx) => (
                    <ClientCard key={idx} {...client} />
                ))}
            </div>

            {/* Load More Button */}
            <div className="mt-15 text-center">
                <button className="w-[180px] h-[50px] gradient-button font-medium font-poppins hover:font-semibold">
                    Load More
                </button>
            </div>

            {/* Background Image */}
            <Image
                src="/contact-4.svg" // move your bg image to public folder
                alt="Background"
                width={800}
                height={800}
                className="absolute -mt-40 -z-10 top-0 left-0"
            />
        </div>
    );
}
