'use client';
import Image from 'next/image';

const OurTeamSection = () => {
    const teamMembers = [
        {
            id: 1,
            position: { left: '332px', top: '371px' },
            imageSize: 128,
            title: "Creative Thinkers",
            titlePosition: { left: '258px', top: '533px' }
        },
        {
            id: 2,
            position: { left: '656px', top: '371px' },
            imageSize: 128,
            title: "Expert Engineers",
            titlePosition: { left: '582px', top: '533px' }
        },
        {
            id: 3,
            position: { left: '980px', top: '371px' },
            imageSize: 128,
            title: "Designers",
            titlePosition: { left: '906px', top: '533px' }
        }
    ];

    return (
        <div className="relative w-[1443px] h-[706px]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-[585px] overflow-hidden -z-10">
                <Image
                    src="/about-5.svg"
                    alt="Team background"
                    fill
                    className="mt-35 object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Header with Fixed Gradient */}
            <div className="absolute left-[161px] top-[18px] w-[1121px] text-center">
                <h2 className="text-3xl font-medium font-montserrat leading-[55px]">
                    <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                        Our Team
                    </span>
                </h2>
            </div>

            {/* Description */}
            <p className="absolute left-[317px] top-[100px] w-[809px] text-center text-[#6c6c6c] text-lg font-normal font-poppins leading-[30px]">
                Our strength lies in our people. Each member of our 8+ person team brings unique skills and a shared drive to build impactful technology. Together, we fuse creativity with engineering precision to deliver world-class IoT solutions.
            </p>

            {/* Subheader with Fixed Gradient */}
            <div className="absolute left-[332px] top-[250px] w-[779px] text-center">
                <h3 className="text-lg font-normal font-poppins leading-[30px]">
                    <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                        Our Team Includes
                    </span>
                </h3>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute left-[3px] top-[100px] w-[159px] h-[542px] bg-gradient-to-l from-white/0 to-white" />
            <div className="absolute left-[1284px] top-0 w-[159px] h-[542px] bg-gradient-to-l from-white to-white/0" />

            {/* Team Members */}
            {teamMembers.map(member => (
                <div key={member.id} className="absolute" style={{ left: member.position.left, top: member.position.top }}>
                    {/* Team Member Image */}
                    <div className="w-32 h-32">
                        <Image
                            src={`/team${member.id}.svg`}
                            alt={member.title}
                            width={member.imageSize}
                            height={member.imageSize}
                            className="w-full h-full object-cover"
                            quality={100}
                        />
                    </div>

                    {/* Team Member Title */}
                    <div
                        className="absolute text-center text-[#4d4d4d] text-lg font-normal font-poppins w-[276px]"
                        style={{
                            left: `calc(${member.titlePosition.left} - ${member.position.left})`,
                            top: '162px'
                        }}
                    >
                        {member.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OurTeamSection;