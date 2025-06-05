'use client';
import Image from 'next/image';

const WhyChooseProtonest = () => {
    const features = [
        {
            topRow: [
                { title: "Tailored IoT Solutions", position: "left-[270px] top-[371px]" },
                { title: "Expertise in hardware and software design", position: "left-[582px] top-[371px]" },
                { title: "Transparency and Collaboration", position: "left-[894px] top-[371px]" }
            ],
            bottomRow: [
                { title: "Innovation and Quality", position: "left-[115px] top-[636px]" },
                { title: "Post Development Support", position: "left-[416px] top-[636px]" },
                { title: "Dedicated to Client Satisfaction", position: "left-[717px] top-[636px]" },
                { title: "Proven Track Record", position: "left-[1025px] top-[636px]" }
            ]
        }
    ];

    const iconPositions = [
        { position: "left-[344px] top-[209px]", img: "/choose1.svg" },
        { position: "left-[656px] top-[209px]", img: "/choose2.svg" },
        { position: "left-[968px] top-[209px]", img: "/choose3.svg" },
        { position: "left-[189px] top-[474px]", img: "/choose4.svg" },
        { position: "left-[490px] top-[474px]", img: "/choose5.svg" },
        { position: "left-[791px] top-[474px]", img: "/choose6.svg" },
        { position: "left-[1092px] top-[474px]", img: "/choose7.svg" }
    ];

    return (
        <div className="my-40 relative w-[1440px] h-[806px]">
            {/* Background Image */}
            <Image
                src="/home-6.svg"
                alt="Background"
                width={1440}
                height={664}
                className="absolute left-0 top-[142px]"
            />

            {/* Header */}
            <div className="flex flex-col items-start justify-start h-full px-[133px]">
                <div className="flex justify-center">
                    <div className="text-center text-[30px] font-medium font-montserrat">
                        <span className="text-[rgba(108,108,108,1)]">
                            Why Choose{' '}
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                            Protonest?
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center w-full my-12">
                    <div className="text-[18px] font-normal font-poppins">
                        <span className="text-[rgba(108,108,108,1)]">
                            Where bold ideas become connected products.
                        </span>
                    </div>
                    <div className="text-[18px] font-normal font-poppins">
                        <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">Get a Quote &gt;</span>
                    </div>
                </div>


            </div>

            {/* Feature Icons */}
            {iconPositions.map((icon, index) => (
                <FeatureIcon key={index} position={icon.position} img={icon.img} />
            ))}

            {/* Feature Titles */}
            {features[0].topRow.map((feature, index) => (
                <FeatureTitle
                    key={index}
                    title={feature.title}
                    position={feature.position}
                />
            ))}

            {features[0].bottomRow.map((feature, index) => (
                <FeatureTitle
                    key={index}
                    title={feature.title}
                    position={feature.position}
                />
            ))}
        </div>
    );
};

// Reusable Feature Icon Component
const FeatureIcon = ({ position, img }: { position: string, img: string }) => {
    return (
        <div className={`w-32 h-32 absolute ${position}`}>
            <Image
                src={img}
                alt="Feature icon"
                width={128}
                height={128}
                className="w-full h-full"
            />
        </div>
    );
};

// Reusable Feature Title Component
const FeatureTitle = ({ title, position }: { title: string, position: string }) => (
    <div className={`w-[276px] absolute text-center text-[#4d4d4d] text-lg font-normal font-poppins ${position}`}>
        {title}
    </div>
);

export default WhyChooseProtonest;