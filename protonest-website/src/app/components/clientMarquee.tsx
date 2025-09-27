import Image from "next/image";
import Marquee from "react-fast-marquee";

const ClientMarquee = () => {
    const clients = [
        { name: "Client 1", logo: "/client1.svg" },
        { name: "Client 2", logo: "/client2.svg" },
        { name: "Client 3", logo: "/client3.svg" },
    ];

    return (
        <div className="w-full overflow-hidden">
            <div className="relative">
                {/* Gradient fade effects */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                <Marquee
                    speed={100}
                    gradient={false}
                    className="py-8" // Increased vertical padding
                    autoFill // Ensures continuous looping
                    direction="right" // Direction of the marquee
                >
                    {[...clients, ...clients].map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className="mx-[30px]" // Horizontal spacing between boxes
                        >
                            {/* Shadowed box container */}
                            <div className="relative h-[186px] w-[304px] flex items-center justify-center bg-[rgba(255,255,255,0.05)] rounded-[35px] backdrop-blur-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                {/* Logo container with padding */}
                                <div className="relative h-[60%] w-[60%]">
                                    <Image
                                        src={client.logo}
                                        alt={`${client.name} logo`}
                                        fill
                                        priority={index < 2}
                                        quality={85}
                                        sizes="(max-width: 768px) 180px, 182px"
                                        className="object-contain"
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo="
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default ClientMarquee;