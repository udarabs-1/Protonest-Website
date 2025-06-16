'use client';
import Image from 'next/image';

const OurTeamSection = () => {
    const teamMembers = [
        {
            id: 1,
            title: "Creative Thinkers",
        },
        {
            id: 2,
            title: "Expert Engineers",
        },
        {
            id: 3,
            title: "Designers",
        }
    ];

    return (
        <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] xl:min-h-[706px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full -z-10">
                <Image
                    src="/about-5.svg"
                    alt="Team background"
                    fill
                    className="object-cover object-center"
                    quality={100}
                    priority
                />
            </div>

            {/* Gradient Overlays for edge fade effect */}
            <div className="absolute left-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-r from-white to-white/0 pointer-events-none" />
            <div className="absolute right-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-l from-white to-white/0 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium font-montserrat leading-tight mb-4 sm:mb-6 lg:mb-8">
                        <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                            Our Team
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-[#6c6c6c] text-sm sm:text-base lg:text-lg font-normal font-poppins leading-relaxed max-w-4xl mx-auto px-4">
                        Our strength lies in our people. Each member of our 8+ person team brings unique skills and a shared drive to build impactful technology. Together, we fuse creativity with engineering precision to deliver world-class IoT solutions.
                    </p>
                </div>

                {/* Subheader */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h3 className="text-base sm:text-lg lg:text-xl font-normal font-poppins leading-relaxed">
                        <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                            Our Team Includes
                        </span>
                    </h3>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 max-w-6xl mx-auto">
                    {teamMembers.map(member => (
                        <div key={member.id} className="flex flex-col items-center text-center group">
                            {/* Team Member Image */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src={`/team${member.id}.svg`}
                                    alt={member.title}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover rounded-lg"
                                    quality={100}
                                />
                            </div>

                            {/* Team Member Title */}
                            <h4 className="text-[#4d4d4d] text-sm sm:text-base lg:text-lg font-normal font-poppins max-w-[200px] sm:max-w-[240px] lg:max-w-[276px]">
                                {member.title}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurTeamSection;