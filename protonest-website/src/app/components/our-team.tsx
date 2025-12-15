'use client';
import Image from 'next/image';

const OurTeamSection = () => {
    const teamMembers = [
        {
            id: 1,
            title: "Creative Thinkers",
            isLeft: true
        },
        {
            id: 2,
            title: "Expert Engineers",
            isLeft: false
        },
        {
            id: 3,
            title: "Designers",
            isLeft: true
        }
    ];

    return (
        <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] xl:min-h-[706px] overflow-hidden">
            
            <div className="absolute inset-0 w-full h-full -z-10">
                
                <Image
                    src="/about-5-mobile.svg"
                    alt="Our team background mobile"
                    fill
                    priority={false}
                    quality={65}
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-cover object-center lg:hidden"
                />
                
                <Image
                    src="/about-5.svg"
                    alt="Our team background desktop"
                    fill
                    priority={false}
                    quality={70}
                    sizes="(min-width: 1024px) 100vw, 0px"
                    className="object-cover object-center hidden lg:block"
                />
            </div>

            
            <div className="absolute left-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-r from-white to-white/0 pointer-events-none" />
            <div className="absolute right-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-l from-white to-white/0 pointer-events-none" />

            
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">

                
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                    <h2 className="text-2xl lg:text-[26px] xl:text-[30px] font-medium font-montserrat leading-tight mb-4 sm:mb-6 lg:mb-8">
                        <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                            Our Team
                        </span>
                    </h2>

                    
                    <p className="text-[#6c6c6c] text-sm lg:text-[16px] xl:text-lg font-normal font-poppins leading-relaxed max-w-4xl mx-auto px-4">
                        Our strength lies in our collective expertise. Each member brings a unique skill set and a shared vision to create meaningful IoT solutions. We combine creativity, strategy, and technology to deliver world-class results.
                    </p>
                </div>

                
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h3 className="text-base sm:text-lg lg:text-xl font-normal font-poppins leading-relaxed">
                        <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                            Our Team Includes
                        </span>
                    </h3>
                </div>

                
                <div className="hidden lg:grid grid-cols-3 gap-16 xl:gap-20 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={member.id} className="flex flex-col items-center text-center group">
                            <div className="w-28 h-28 xl:w-32 xl:h-32 mb-6 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src={`/team${member.id}.svg`}
                                    alt={`${member.title} icon`}
                                    width={128}
                                    height={128}
                                    priority={index === 0}
                                    quality={80}
                                    sizes="(min-width: 1280px) 128px, 112px"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <h4 className="text-[#4d4d4d] text-[16px] xl:text-lg font-normal font-poppins max-w-[276px]">
                                {member.title}
                            </h4>
                        </div>
                    ))}
                </div>

                
                <div className="lg:hidden space-y-8 sm:space-y-12">
                    {teamMembers.map((member, index) => (
                        <div key={member.id} className={`flex ${member.isLeft ? 'justify-start' : 'justify-end'}`}>
                            <div className={`inline-flex items-center gap-6 sm:gap-8 ${member.isLeft ? '' : 'flex-row-reverse'}`}>
                                
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-0 transition-transform duration-300 hover:scale-105">
                                    <Image
                                        src={`/team${member.id}.svg`}
                                        alt={`${member.title} icon`}
                                        width={96}
                                        height={96}
                                        priority={index === 0}
                                        quality={80}
                                        sizes="(max-width: 640px) 80px, 96px"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                
                                <h4 className={`text-[#4d4d4d] text-sm sm:text-[15px] font-normal font-poppins max-w-[150px] sm:max-w-[180px] ${member.isLeft ? 'text-left' : 'text-right'}`}>
                                    {member.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurTeamSection;