'use client';
import Image from 'next/image';

const TestimonialSection = () => {
    return (
        <div className="relative w-[1440px] h-[674px]">
            {/* Background Elements */}
            <div className="absolute inset-0">
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
                    <button className="absolute left-[287px] top-[373px] w-[179px] h-[51px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat hover:font-poppins rounded-[57px] flex justify-center items-center gap-1">
                        <span className="text-white text-base font-semibold">Contact Us</span>
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="absolute left-[161px] top-[18px] w-[1120px] text-center">
                <h2 className="text-[#6c6c6c] text-[30px] font-medium font-montserrat leading-[55px]">
                    Innovation Backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Experience</span>
                </h2>
            </div>

            {/* Subheader */}
            <div className="absolute left-[295px] top-[100px] w-[850px] text-center text-[#6c6c6c] text-[18px] font-normal font-poppins leading-[30px]">
                Words from those who&apos;ve experienced our process, people, and product delivery first-hand.
            </div>

            {/* Gradient Overlays */}
            <div className="absolute left-0 top-[100px] w-[159px] h-[542px] bg-gradient-to-l from-white/0 to-white" />
            <div className="absolute left-[1281px] top-0 w-[159px] h-[674px] bg-gradient-to-l from-white to-white/0" />

            {/* Testimonial Cards */}
            <div className="absolute left-[161px] top-[248px] flex gap-[46px]">
                {[1, 2, 3].map((item) => (
                    <TestimonialCard key={item} />
                ))}
            </div>
        </div>
    );
};

// Reusable Testimonial Card Component
const TestimonialCard = () => {
    return (
        <div className="w-[343px] h-[312px] px-8 py-[50px] bg-white/60 rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col items-center gap-2.5">
            <div className="w-[259px] flex flex-col items-start gap-[27px]">
                <ClientAvatar />
                <ClientInfo />
                <TestimonialText />
            </div>
        </div>
    );
};

// Sub-components
const ClientAvatar = () => (
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

const ClientInfo = () => (
    <div className="flex flex-col items-start gap-[13px]">
        <div className="text-black text-base font-normal font-poppins">Client Name</div>
        <div className="text-[#989898] text-xs font-normal font-poppins">Company Name</div>
    </div>
);

const TestimonialText = () => (
    <div className="text-[#6c6c6c] text-xs font-normal font-poppins">
        Client review client review client review client review client review client review
        client review client review client review client review client review client review
    </div>
);

export default TestimonialSection;