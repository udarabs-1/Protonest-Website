import Image from "next/image";
import Marquee from "react-fast-marquee";

const ClientMarquee = () => {
    const clients = [
        {
            name: "Purbrook Engineering",
            logo: "/protonest-client-purbrook-engineering.svg",
            alt: "Purbrook Engineering logo",
        },
        {
            name: "Stoll Photobox",
            logo: "/protonest-client-stoll-photobox.svg",
            alt: "Stoll Photobox logo",
        },
        {
            name: "Perseo",
            logo: "/protonest-client-perseo.svg",
            alt: "Perseo logo",
        },
        {
            name: "Entryphone",
            logo: "/protonest-client-entryphone.svg",
            alt: "Entryphone logo",
        },
        {
            name: "Patriot Ingenuities",
            logo: "/protonest-client-patriot-ingenuities.webp",
            alt: "Patriot Ingenuities logo",
        },
        {
            name: "NAPCO XRF",
            logo: "/protonest-client-napcoxrf.svg",
            alt: "NAPCO XRF logo",
        },
        {
            name: "Station 70",
            logo: "/protonest-client-station-70.svg",
            alt: "Station 70 logo",
        },
        {
            name: "Executive Risk Services",
            logo: "/protonest-client-executive-risk-services.svg",
            alt: "Executive Risk Services logo",
        },
    ];

    return (
        <div className="w-full overflow-hidden">
            <div className="relative">

                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                <Marquee
                    speed={100}
                    gradient={false}
                    className="py-8"
                    autoFill
                    direction="right"
                >
                    {[...clients, ...clients].map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className="mx-[30px]"
                        >

                            <div className="relative h-[186px] w-[304px] flex items-center justify-center bg-[rgba(255,255,255,0.05)] rounded-[35px] backdrop-blur-2xl shadow-lg hover:shadow-xl transition-all duration-300">

                                <div className="relative h-[60%] w-[60%]">
                                    <Image
                                        src={client.logo}
                                        alt={client.alt}
                                        fill
                                        priority={index < 2}
                                        quality={85}
                                        sizes="(max-width: 768px) 180px, 182px"
                                        className="object-contain"
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
