import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Image from "next/image";

export default function BlogDetailsPage() {
    return (
        <div>
            <Navbar />
            <div className="px-4 sm:px-8 lg:px-[130px] py-10 sm:py-16">
                {/* Featured Image */}
                <div className="mb-8">
                    <Image
                        src="/blogsPage1.svg"
                        alt="Blog Cover"
                        width={1125}
                        height={390}
                        className="w-full h-auto rounded-[11px]"
                    />
                </div>

                {/* Title and Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h1 className="text-[#6c6c6c] text-3xl font-medium font-montserrat leading-10">
                        Selecting A Suitable Battery For An IoT Project
                    </h1>
                    <p className="text-[#6c6c6c] text-sm font-normal font-poppins mt-2 sm:mt-0">
                        April 27, 2025 | 4 min read
                    </p>
                </div>

                {/* Author */}
                <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-4">
                    By Aadhil, Hardware Engineer
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {["Category", "Category", "Category"].map((cat, idx) => (
                        <div
                            key={idx}
                            className="h-11 px-4 py-2 w-[160px] text-center rounded-[57px] gradient-button inline-flex items-center justify-center text-[#6c6c6c] text-sm font-medium font-montserrat"
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Subheading */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mb-4">
                    Introduction To Choosing A Battery For An IoT Project
                </h2>

                {/* Content */}
                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        The rapid growth of the Internet of Things has enabled a wide range of
                        innovations in smart home devices and industrial sensors. The key
                        behind all these systems is one important component: “The battery”.
                        The selection of the proper battery for an IoT project is much more
                        than a technical decision but a strategic one, considering the
                        reliability, lifespan, and performance of your IoT Project.
                    </p>
                    <p>
                        Different from classical devices, IoT systems often work in special
                        working conditions. They are very often deployed at remote locations,
                        require a very long lifetime, and their working environmental
                        conditions can vary widely. Choosing the right battery calls for
                        several consideration parameters.
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Power requirements understanding of IoT devices</li>
                        <li>Choice of batteries depending on the size</li>
                        <li>Weight of the battery</li>
                        <li>Capacity of battery according to device requirement</li>
                        <li>Environmental considerations at the deployment location</li>
                    </ul>
                    <p>
                        By the end of this section, you will be well-equipped to evaluate and
                        choose the best battery technology that suits your IoT application.
                    </p>

                    {/* Battery Types */}
                    <ul className="list-disc pl-6">
                        <li>Lithium-Ion (Li-ion) Batteries</li>
                        <li>Lithium Polymer (Li-Po) Batteries</li>
                        <li>Coin Cell (Button Cell) Batteries</li>
                        <li>Nickel-Cadmium (NiCd) Batteries</li>
                        <li>Alkaline Batteries (Rechargeable / Non-Rechargeable)</li>
                        <li>Nickel-Metal Hydride (NiMH) Batteries</li>
                        <li>Solid-State Batteries</li>
                        <li>Lead-Acid Batteries</li>
                        <li>Zinc-Air Batteries</li>
                        <li>Magnesium-Air Batteries</li>
                        <li>Carbon-Zinc Batteries</li>
                        <li>Hybrid Batteries</li>
                    </ul>
                </div>

                {/* Section on Li-Ion */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Lithium-Ion (Li-Ion) Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-4">
                    <p>
                        Lithium-ion batteries are among the most widely used rechargeable
                        battery technologies in modern electronics. They offer high energy
                        density, a lightweight design, and a long cycle life, making them
                        ideal for a range of applications, from IoT devices to various other
                        uses.
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Provides huge amount of energy relative to size and weight.</li>
                        <li>Suitable for compact devices with limited space.</li>
                        <li>Typical voltage: 3.6V to 3.7V per cell.</li>
                        <li>Rechargeable hundreds to thousands of times.</li>
                        <li>Excellent performance over many cycles.</li>
                        <li>Retains charge during inactivity, perfect for IoT usage.</li>
                        <li>Lightweight due to lithium, the lightest metal.</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>

    );
}