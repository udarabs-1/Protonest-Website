'use client';
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
                        src="/blogs2.svg"
                        alt="Blog Cover"
                        width={1125}
                        height={390}
                        className="w-full h-auto rounded-[11px]"
                    />
                </div>

                {/* Title and Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h1 className="text-[#6c6c6c] text-3xl font-medium font-montserrat leading-10">
                        Selecting The Right Battery For Your IoT Project
                    </h1>
                    {/* <p className="text-[#6c6c6c] text-sm font-normal font-poppins mt-2 sm:mt-0">
                        June 20, 2025 | 12 min read
                    </p> */}
                </div>

                {/* Author */}
                {/* <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-4">
                    By Aadhil, IoT Hardware Engineer
                </div> */}

                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {["IoT", "Batteries", "Hardware"].map((cat, idx) => (
                        <div
                            key={idx}
                            className="h-11 px-4 py-2 w-[160px] text-center rounded-[57px] gradient-button inline-flex items-center justify-center text-[#6c6c6c] text-sm font-medium font-montserrat"
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Introduction */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mb-4">
                    Introduction to Choosing a Battery for an IoT Project
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        The rapid growth of the Internet of Things has enabled a wide range of innovations in smart home devices and industrial sensors. The key behind all these systems is one important component &quot;The battery&quot;. The selection of the proper battery for an IoT project is much more than a technical decision but a strategic one, considering the reliability, lifespan, and performance of your IoT Project.
                    </p>
                    <p>
                        Different from classical devices, IoT systems often work in special working conditions. They are very often deployed at remote locations, they require a very long lifetime, and their working environmental conditions can vary widely. Choosing the right battery calls for several consideration parameters.
                    </p>
                    <p>
                        Herein is a small discussion on selecting battery for an IoT project:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Power requirements understanding of IoT devices</li>
                        <li>Choice of batteries depending on the size</li>
                        <li>Weight of the battery</li>
                        <li>Capacity of battery according to device requirement</li>
                        <li>Environmental considerations at the place your IoT device will be used or operate.</li>
                    </ul>
                    <p>
                        By the end of this section, you will be well-equipped to evaluate and choose the best battery technology that suits your IoT application.
                    </p>
                </div>

                {/* Battery Types Overview */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Common Battery Types for IoT Projects
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-4">
                    <p>Here are the most common battery types used in IoT projects:</p>
                    <ul className="list-disc pl-6 columns-1 sm:columns-2">
                        <li>Lithium-Ion (Li-ion) Batteries</li>
                        <li>Lithium Polymer (Li-Po) Batteries</li>
                        <li>Coin Cell (Button Cell) Batteries</li>
                        <li>Nickel-Cadmium (NiCd) Batteries</li>
                        <li>Alkaline Batteries (Rechargeable/ Non-Rechargeable)</li>
                        <li>Nickel-Metal Hydride (NiMH) Batteries</li>
                        <li>Solid-State Batteries</li>
                        <li>Lead-Acid Batteries</li>
                        <li>Zinc-Air Batteries</li>
                        <li>Magnesium-Air Batteries</li>
                        <li>Carbon-Zinc Batteries</li>
                        <li>Hybrid Batteries</li>
                    </ul>
                </div>

                {/* Lithium-Ion Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Lithium-Ion (Li-ion) Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Lithium-ion batteries are among the most widely used rechargeable battery technologies in modern electronics. They offer high energy density, a lightweight design, and a long cycle life, making them ideal for a range of applications, from IoT devices to various other uses.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure1.webp"
                            alt="Lithium-ion battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 1: Lithium-ion battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li>Provides huge amount of energy relative to size and weight.</li>
                        <li>Compact devices with very little space will find this suitable.</li>
                        <li>Normal nominal voltage: 3.6V to 3.7V per cell.</li>
                        <li>Can be recharged hundreds to thousands of times depending on usage and good performance over many cycles.</li>
                        <li>Retains charge when not in use, making it ideal for intermittent IoT operations.</li>
                        <li>Lightweight Construction: Uses lithium, the lightest metal, making the overall weight low.</li>
                    </ul>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure2.webp"
                            alt="Components of Li-Ion battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 2: Components of Li-Ion battery</p>
                    </div>

                    <p>
                        Li-ion batteries consist of three main components:
                    </p>
                    <ol className="list-decimal pl-6">
                        <li>Cathode (typically a lithium metal oxide).</li>
                        <li>Anode (commonly graphite).</li>
                        <li>Electrolyte (a lithium salt in an organic solvent).</li>
                    </ol>
                    <p>
                        During charging period, lithium ion moves from the cathode to the anode. During discharge, the ions flow back, generating an electric current.
                    </p>

                    <div className="my-4">
                        <iframe
                            width="100%"
                            height="400"
                            src="https://www.youtube.com/embed/VxMM4g2Sk8U"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        ></iframe>
                        <p className="text-sm text-gray-500 mt-2">Video explanation on suitable battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>High Energy Efficiency:</strong> Efficient in energy storage and retrieval.</li>
                        <li><strong>Low Maintenance:</strong> Requires no periodic discharge to maintain performance.</li>
                        <li><strong>Wide Application Range:</strong> Used in small devices (e.g., smartphones, IoT sensors) and large systems (e.g., electric vehicles).</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Temperature Sensitivity:</strong> Extreme cold or heat can degrade performance. Risk of overheating if handled or charged incorrectly.</li>
                        <li><strong>Aging Effect:</strong> Its capacity reduces with time, even without usage.</li>
                        <li><strong>Relatively high cost</strong> compared to the old traditional types of batteries, such as alkaline or NiCd.</li>
                    </ul>
                </div>

                {/* Lithium Polymer Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Lithium Polymer Batteries (Li-Po)
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        These have been designed to be light and flexible in form. Applications involving Li-Po batteries involve devices where space and weight become critical: drones, wearables, compact IoT systems, and many more. Their polymer-based electrolyte allows thinner and more versatile designs for batteries.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure3.webp"
                            alt="Polymer Lithium ion battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 3: Polymer Lithium ion battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Flexible Form Factor:</strong> Li-Po batteries can be molded to conform to fit into irregular spaces and thus be ideal for compact devices.</li>
                        <li><strong>Nominal voltage:</strong> 3.7V/cell.</li>
                        <li><strong>Energy density:</strong> Comparable to standard Li‑ion but can be slightly lower due to the polymer-based electrolyte; however, Li‑Po batteries can still deliver a high energy density suitable for many compact IoT devices.</li>
                        <li><strong>Less chance of leakage</strong> due to solid or gel-like polymer electrolyte but more robust to mechanical damage than Li-ion.</li>
                    </ul>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure4.webp"
                            alt="Li-Po battery structure"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 4: Li-Po battery structure</p>
                    </div>

                    <p>
                        Li-Po battery consists of similar components in Li-ion batteries:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Cathode:</strong> Lithium metal oxide</li>
                        <li><strong>Anode:</strong> Graphite</li>
                        <li><strong>Electrolyte:</strong> A polymer material in solid or jelly-like.</li>
                    </ul>
                    <p>
                        During the charging period, lithium-ion moves to the anode side, and during discharging, they flow back to the cathode, producing current.
                    </p>

                    <div className="my-4">
                        <iframe
                            width="100%"
                            height="400"
                            src="https://www.youtube.com/embed/7Gh1f-hBLOU"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        ></iframe>
                        <p className="text-sm text-gray-500 mt-2">Video explanation on Li-Po batteries</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Thin and Light</strong></li>
                        <li><strong>Flexible Design:</strong> Can be made in specific shapes according to device needs.</li>
                        <li><strong>Low Risk of Leakage</strong></li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Higher Cost:</strong> More expensive than standard Li-ion batteries due to manufacturing complexity.</li>
                        <li><strong>Short Lifespan:</strong> They can have a decent lifespan (similar to Li‑ion), but they tend to be more sensitive to overcharging/over-discharging and require robust BMS.</li>
                        <li><strong>Sensitive to Overcharging:</strong> A strong BMS is needed for safe operation.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Comparison to Li-Ion Batteries</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Form Factor:</strong> Li-Po batteries are more versatile in shape.</li>
                        <li><strong>Energy Density:</strong> Li-ion generally has higher energy density.</li>
                        <li><strong>Safety:</strong> Li-Po batteries have fewer leakage issues.</li>
                    </ul>
                </div>

                {/* Coin Cell Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Coin Cell Batteries (Button Cell)
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Coin-cell batteries, popularly referred to as button cell batteries, are small, round, single-use, or rechargeable batteries that find extensive applications in ultra-low-power devices. With their compact size and long shelf life, they are ideal for IoT devices that require minimal power, including sensors, trackers, and remote controls.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure5.webp"
                            alt="Button cell Battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 5: Button cell Battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Small Size:</strong> Normally range in diameter from 5 mm to 25 mm and in height from 1 mm to 6 mm.</li>
                        <li><strong>Nominal voltage:</strong> 1.5V (alkaline) or 3V (lithium-based)</li>
                        <li><strong>Capacity:</strong> Ranges from 20 mAh up to 600 mAh, depending on the size and chemistry.</li>
                        <li><strong>Long Shelf Life:</strong> Can maintain charge for 5 – 10 years in a no power condition depending on chemistry.</li>
                        <li><strong>Applications:</strong> Applicable in devices needing intermittent or continuous low power over a long period.</li>
                    </ul>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure6.webp"
                            alt="Coin cell inside"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 6: Coin cell inside</p>
                    </div>

                    <p>
                        Coin cells come in many diverse chemistries, following are some examples of those types:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Alkaline:</strong> Cheap with lower energy density.</li>
                        <li><strong>Lithium:</strong> High energy density, highly stable voltage, and lengthy shelf life.</li>
                        <li><strong>Silver Oxide:</strong> Used in precision applications, its voltage remains constant.</li>
                    </ul>
                    <p>
                        Electrolytes allow ions to flow while the reaction happens between cathode and anode.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Compact and perfect</strong> for small portable IoT devices.</li>
                        <li><strong>Dependable power</strong> for long-term implementation in low-power systems.</li>
                        <li><strong>Very cheap</strong> for one-time use, low-energy devices.</li>
                        <li><strong>Available Almost Everywhere</strong></li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Limited Capacity:</strong> Not suitable for high-power or long-duration applications.</li>
                        <li><strong>Non-Rechargeable (for most types):</strong> So it requires periodic replacement, increasing maintenance in some cases.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Popular Models and Sizes</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>CR2032:</strong> 3V, 220 mAh – Common in wearables and small sensors.</li>
                        <li><strong>CR2025:</strong> 3V, 170 mAh – Slimmer alternative to CR2032.</li>
                        <li><strong>SR44:</strong> 1.55V, 150 mAh – Silver oxide for precision devices.</li>
                    </ul>
                </div>

                {/* Nickel-Cadmium Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Nickel-Cadmium Batteries (NiCd)
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Nickel-Cadmium batteries are rechargeable batteries that have been used for decades in various applications. They are known for their durability and ability to deliver high current, making them suitable for certain IoT applications, especially in harsh environments.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure7.webp"
                            alt="Ni-Cd battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 7: Ni-Cd battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Nominal voltage:</strong> 1.2V per cell.</li>
                        <li><strong>Capacity:</strong> Depends on size, but is normally in the range from 100 mAh to 2,000 mAh.</li>
                        <li><strong>Performance:</strong> Good performance under high load conditions and at very high and low temperatures.</li>
                        <li><strong>Memory Effect:</strong> Has the tendency to lose its capacity when charged repeatedly before a full discharge.</li>
                        <li><strong>Cycle Life:</strong> Large cycle life, normally more than 500 charge-discharge cycles.</li>
                    </ul>

                    <p>
                        NiCd batteries produce electricity during a chemical reaction between:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Cathode:</strong> Nickel hydroxide (NiOOH).</li>
                        <li><strong>Anode:</strong> Cadmium (Cd).</li>
                        <li><strong>Electrolyte:</strong> Potassium hydroxide (KOH) solution.</li>
                    </ul>
                    <p>
                        At discharge, cadmium and nickel hydroxide undergo reactions that release electrons to power the device.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Durability:</strong> Can withstand overcharging and deep discharges without severe degradation.</li>
                        <li><strong>Temperature Tolerance:</strong> Operates reliably in extreme temperatures from -20°C to 60°C.</li>
                        <li><strong>High Discharge Rates:</strong> Suitable for devices requiring bursts of high power.</li>
                        <li><strong>Long Shelf Life:</strong> Can be stored for long periods without significant loss of capacity.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Environmental Concerns:</strong> Contains toxic cadmium, which requires careful disposal and recycling.</li>
                        <li><strong>Memory Effect:</strong> Reduces usable capacity over time if not discharged fully before recharging.</li>
                        <li><strong>Size and Weight:</strong> Bulkier and heavier compared to modern chemistries like Li-ion and Li-Po.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Use Cases in IoT</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Remote Sensors in Harsh Environments:</strong> Where extreme temperatures or rough conditions may degrade other battery types.</li>
                        <li><strong>Industrial IoT:</strong> Applications needing high reliability and long life.</li>
                        <li><strong>Emergency Backup Systems:</strong> Like Power for real-time clocks (RTC) or memory retention in IoT systems.</li>
                    </ul>
                </div>

                {/* Alkaline Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Alkaline Batteries (Rechargeable and Non-Rechargeable)
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Alkaline batteries have a huge application and can be achieved at a reasonably cheaper cost; both non-rechargeable (primary) and rechargeable batteries are in wide use. While their primary form predominates, on account of economy and handiness, the secondary (rechargeable) batteries offer reusability with similar characteristics.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure8.webp"
                            alt="Alkaline Battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 8: Alkaline Battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>

                    <div className="">
                        <Image
                            src="/blog2/characteristics.webp"
                            alt="Characteristics"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 8: Alkaline Battery for an IoT project</p>
                    </div>
                    <h4 className="text-lg font-medium font-montserrat mt-4">Chemistry</h4>
                    <ul className="list-disc pl-6">
                        <li><strong>Anode:</strong> Zinc (Zn).</li>
                        <li><strong>Cathode:</strong> Manganese dioxide (MnO₂).</li>
                        <li><strong>Electrolyte:</strong> Potassium hydroxide (KOH).</li>
                    </ul>

                    <p>
                        Low-ripple direct current is not suitable for charging disposable alkaline batteries; more suitable is a current pulsed at a rate of 40 to 200 pulses per second, with an 80% duty cycle. Pulsed charging appears to reduce the risk of electrolyte—usually potassium hydroxide (KOH)—leakage. The charging current must be low to prevent rapid production of gases that can rupture the cell. Cells that have leaked electrolyte are unsafe and unsuitable for reuse.
                    </p>
                    <p className="text-sm text-gray-500">
                        (Source: Wikipedia: – https://en.wikipedia.org/wiki/Rechargeable_alkaline_battery)
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Cons</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Limited charging:</strong> Non-rechargeable batteries must be replaced, adding to waste.</li>
                        <li><strong>Rechargeable types have fewer cycles:</strong> Usually 50-100-compared to NiMH or Li-ion batteries.</li>
                        <li><strong>Voltage drops linearly</strong> during use, which may affect some IoT devices.</li>
                    </ul>
                </div>

                {/* Nickel-Metal Hydride Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Nickel-Metal Hydride Batteries (NiMH)
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Nickel-Metal Hydride batteries are rechargeable batteries that utilize a hydrogen-absorbing alloy for the negative electrode (anode) and nickel oxyhydroxide (NiOOH) for the positive electrode (cathode). They are increasingly used as alternatives to older Nickel-Cadmium batteries, offering better energy density and a more environmentally friendly composition.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure9.webp"
                            alt="NiMH battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 9: NiMH battery for an IoT project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Nominal Voltage:</strong> 1.2V per cell.</li>
                        <li><strong>Capacity:</strong> Generally ranges from 600 mAh to 3,000 mAh, depending on size and application, such as AA, AAA, C, and D.</li>
                        <li><strong>Cycle Life:</strong> Can support 300–500 charge/discharge cycles under proper conditions.</li>
                        <li><strong>Self-Discharge:</strong> The older versions of NiMH batteries self-discharge 20–30% per month when stored. Modern Low Self-Discharge (LSD) NiMH variants self-discharge only 1–2% per month, thus making them suitable for IoT applications.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Environmentally Friendly:</strong> No cadmium, easier to recycle.</li>
                        <li><strong>Higher Energy Density:</strong> Can store a lot more energy in relation to its size when compared to NiCd.</li>
                        <li><strong>Standardized sizes (AA, AAA)</strong> suitable for many devices.</li>
                        <li><strong>No memory effect</strong> (unlike NiCd), meaning partial charges without degradation are allowed.</li>
                        <li><strong>Less expensive upfront</strong> compared to Lithium-ion batteries.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Lower Energy Density:</strong> Has lower energy storage capacity by comparison with Li-ion batteries.</li>
                        <li><strong>Standard NiMH batteries</strong> lose their charge fairly quickly when not in use.</li>
                        <li><strong>Shorter Life Span</strong></li>
                    </ul>

                    <p>
                        NiMH batteries are another highly versatile ecologically friendly variant for IoT projects, especially in implementations where safety and cost are of concern with moderate capacity. They will not have the same energy density as Lithium-ion batteries but are an impressive improvement from NiCd batteries and still very popular in low to medium-power devices in IoT.
                    </p>
                </div>

                {/* Solid-State Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Solid-State Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        A solid-state battery is an advanced type of rechargeable battery for an IoT project that uses a solid electrolyte instead of the liquid or gel electrolyte found in traditional batteries, like lithium-ion. This design offers significant improvements in energy storage, safety, and durability, making it a key area of focus in the development of next-generation energy solutions.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure10.webp"
                            alt="Solid-State battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 10: Solid-State battery for an IoT Project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">How Solid-State Batteries Work</h3>
                    <div className="my-4">
                        <Image
                            src="/blog2/figure11.webp"
                            alt="Solid-State battery working"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 11: Solid-State battery for an IoT Project</p>
                    </div>

                    <p>
                        In any battery for an IoT project, charged and discharged, ions would flow across an anode and a cathode by way of an electrolyte. Now, in solid state batteries:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Solid Electrolyte:</strong> The electrolyte used is a solid, ranging from ceramic to a polymer.</li>
                        <li><strong>Electrode Materials:</strong> Compatible materials, such as lithium metal for the anode, allow efficient energy transfer.</li>
                    </ul>
                    <p>
                        The solid electrolyte can provide thinner and more flexible batteries with no compromise in performance.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Smaller and Lighter:</strong> The high energy density allows for lightweight and ultra-thin designs possible.</li>
                        <li><strong>Longer Life:</strong> Lower component wear and tear translate to far higher charge-discharge cycles.</li>
                        <li><strong>Eco-Friendliness:</strong> Their use of solid electrolytes reduces the environmental hazards associated with liquid or gel electrolytes, such as leakage.</li>
                        <li><strong>Flexibility:</strong> Its flexible form factors will be tailored to newer applications related to electronics, medical devices, and IoT.</li>
                    </ul>

                    <p>
                        Solid state batteries are more expensive than their conventional counterparts, like Li-ion or NiMH batteries, this is due to a number of material, processing, and developmental factors. This is reflected in the increased upfront cost. Factors that could compensate for a higher upfront cost with solid state batteries include higher cycle life reduces replacement costs over time, reduced risk of thermal runaway reduces the costs associated with implementing safety systems and lighter batteries can reduce device design and transportation costs.
                    </p>

                    <p>
                        Currently, solid-state batteries find their applications primarily in some Premium Applications like High-end consumer electronics, medical devices and IoT devices where performance considerations outweigh cost factors.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Leading Manufacturers of Solid State Batteries</h3>
                    <h4 className="text-lg font-medium font-montserrat mt-4">Established Players of Battery for an IoT project</h4>
                    <ul className="list-disc pl-6">
                        <li><strong>Toyota:</strong> Moves to commercialize the solid-state battery for EVs in the near future.</li>
                        <li><strong>Samsung SDI:</strong> Aggressively developing solid-state batteries for consumer electronics and EVs.</li>
                        <li><strong>Panasonic:</strong> Collaborating with automakers such as Tesla to study solid-state technology for next-generation EV batteries.</li>
                        <li><strong>LG Energy Solution:</strong> Developing solid-state batteries for automotive and electronics applications.</li>
                        <li><strong>Hitachi Zosen:</strong> Working on compact solid-state batteries for small devices and IoT.</li>
                    </ul>
                </div>

                {/* Lead-Acid Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Lead-Acid Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Lead-acid batteries are among the oldest and most widely used rechargeable batteries. They are well-known for their reliability, cost-effectiveness, and durability. Typically, they are employed in applications that require a high-power output. However, their size and weight make them unsuitable for portable IoT devices.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure12.webp"
                            alt="Lead-Acid battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 12: Lead-Acid battery for an IoT Project</p>
                    </div>

                    <p>
                        It has combined of a lead-dioxide (PbO2) cathode, a sponge lead (Pb) anode, and a sulfuric acid (H2SO4) electrolyte.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure13.webp"
                            alt="Working Principle of Lead-acid battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 13: Working Principle of Lead-acid battery for an IoT Project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Features of Lead-Acid Batteries</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Voltage:</strong> Nominal voltage per cell 2.0V and it typical configurations 6V (3 cells) or 12V (6 cells).</li>
                        <li><strong>Energy Density:</strong> Low when we compare to lithium batteries, typically around 30–50 Wh/kg.</li>
                        <li><strong>Durability:</strong> Can handle overcharging and deep discharging to some extent.</li>
                        <li><strong>Types:</strong> Unlike others this have two main types:
                            <ul className="list-disc pl-6">
                                <li><strong>Flooded (Wet Cell):</strong> Maintains – water has to be added periodically. Most usage in automotive and stationary power applications.</li>
                                <li><strong>Sealed Lead-Acid or Valve-Regulated Lead-Acid:</strong> Maintenance-free. Includes Absorbent Glass Mat and Gel Cell variants for better performance and safety.</li>
                            </ul>
                        </li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Economical:</strong> Low upfront cost compared to lithium-based batteries.</li>
                        <li><strong>Reliable and Proven Technology</strong></li>
                        <li><strong>High Power Output</strong></li>
                        <li><strong>Recyclable:</strong> One of the most recycled battery types globally.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Low Energy Density:</strong> Heavy and bulky, limiting portability.</li>
                        <li><strong>Short Cycle Life:</strong> Limited longevity compared to modern chemistries like lithium-ion.</li>
                        <li><strong>Environmental Concerns:</strong> Lead is toxic, and sulfuric acid can cause environmental harm if not disposed of properly.</li>
                        <li><strong>Slow Charging</strong></li>
                    </ul>

                    <p>
                        Due to their size and weight, lead-acid batteries are seldom found in IoT applications. However, they may be suitable for:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Stationary IoT Systems:</strong> Like remote weather monitoring stations or IoT gateways with fixed installations.</li>
                        <li><strong>Backup Power Supplies:</strong> For power outages and Off-Grid IoT Solutions where it coupled with solar panels for remote and low-maintenance applications.</li>
                    </ul>
                    <p>
                        In most IoT use cases, advantages of lithium-ion and solid-state batteries are replacing lead-acid to a great extent.
                    </p>
                </div>

                {/* Zinc-Air Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Zinc-Air Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Zinc-air batteries are different from other batteries as they use atmospheric oxygen as a reactant, thus giving energy-dense power source for low-power applications. Most commercial versions are non-rechargeable, although some rechargeable versions are under development.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure14.webp"
                            alt="Zinc-Air battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 14: Zinc-Air battery for an IoT Project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Chemistry</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Anode:</strong> Zinc (Zn)</li>
                        <li><strong>Cathode:</strong> Air (oxygen from the ambient)</li>
                        <li><strong>Electrolyte:</strong> Aqueous alkaline solution</li>
                    </ul>
                    <p>
                        The battery produce electricity when zinc reacts with oxygen through a catalytic process.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure15.webp"
                            alt="Zinc-Air battery working"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 15: Zinc-Air combination in battery and its working</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Features of Zinc-Air Batteries</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Nominal voltage:</strong> 1.2–1.4 V per cell</li>
                        <li><strong>Energy Density:</strong> Very high: approximately 300–400 Wh/kg</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>High Energy Density</strong></li>
                        <li><strong>Environmentally Friendly:</strong> Uses zinc, which is abundant and non-toxic.</li>
                        <li><strong>Low Cost:</strong> Cheaper to produce, especially for disposable applications.</li>
                        <li><strong>Long Shelf Life:</strong> Remains inactive until exposed to air, thus assuring minimal self-discharge when sealed.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Non-Rechargeable (Mostly):</strong> Rechargeable versions are in development but not commercially available.</li>
                        <li><strong>Limited Power Output:</strong> Suitable only for low-power devices</li>
                        <li><strong>Short Active Life:</strong> Once exposed to air, they degrade over time even if not in use.</li>
                        <li><strong>Moisture Sensitivity</strong></li>
                    </ul>

                    <p>
                        Zinc-air batteries are good for scenarios where lightweight, energy-dense, and low-cost solutions for low-power IoT devices are required. While they are limited by rechargeability and power output, further technological development may extend their application within IoT ecosystems.
                    </p>
                </div>

                {/* Magnesium-Air Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Magnesium-Air Battery Energy
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Magnesium-air batteries are a type of metal-air battery which is specially known for high theoretical energy density. The batteries make use of magnesium (Mg) for the anode and oxygen from the air as the cathode.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure16.webp"
                            alt="Magnesium-Air Battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 16: Magnesium-Air Battery for an IoT Project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Key Energy Characteristics</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Theoretical Energy Density:</strong> About 6,800 Wh/kg of magnesium—one of the highest energy densities among battery</li>
                        <li><strong>Practical Energy Density:</strong> Typically lower due to inefficiencies like side reactions, electrolyte limitations, and electrode design. Estimated at around 700–1,200 Wh/kg for real-world applications.</li>
                        <li><strong>Voltage:</strong> The nominal voltage of a magnesium-air cell is about 1.2–1.4V depending on the design and electrolyte used.</li>
                        <li><strong>Capacity:</strong> Capacity depends on the magnesium weight and its reaction rate with oxygen. In the case of a small magnesium-air battery, capacities may vary over a wide range but are usually optimized to give long-lasting energy output rather than high instantaneous power.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Why Magnesium Air Batteries?</h3>
                    <ul className="list-disc pl-6">
                        <li>Abundant, lightweight with a high electrochemical equivalent.</li>
                        <li>More environmentally friendly and non-toxic as compared to lithium.</li>
                        <li>Cheaper than lithium or other rare metals used in alternative batteries.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Applications</h3>
                    <p>
                        While still in an experimental stage or early-stage deployment, magnesium-air batteries appear very promising in applications such as:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Remote IoT systems and sensors</li>
                        <li>Military and emergency equipment</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Challenges</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Limited Rechargeability:</strong> Magnesium-air batteries inherently are not rechargeable, however, research is underway.</li>
                        <li>More suited for low-power applications.</li>
                        <li><strong>Corrosion:</strong> Magnesium being highly reactive results in self-discharge.</li>
                    </ul>
                </div>

                {/* Carbon-Zinc Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Carbon-Zinc Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Being rather inexpensive, they show up in wide usage on low-drain applications. These batteries are also identified as zinc-carbon batteries. They are suitable for simple devices that don&apos;t have an immense power requirement.
                    </p>

                    <div className="my-4">
                        <Image
                            src="/blog2/figure17.webp"
                            alt="Carbon-Zinc Battery"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">Figure 17: Carbon-Zinc Battery for an IoT Project</p>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat">Chemistry</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Anode:</strong> Zinc.</li>
                        <li><strong>Cathode:</strong> Manganese dioxide (MnO₂).</li>
                        <li><strong>Electrolyte:</strong> Ammonium chloride or zinc chloride in a paste form.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Key Characteristics of Carbon Zinc Batteries</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Nominal voltage:</strong> 1.5V per cell.</li>
                        <li><strong>Energy Density:</strong> Moderate, around 40–60 Wh/kg.</li>
                        <li><strong>Shelf Life:</strong> Shorter shelf life compared to alkaline batteries due to higher self-discharge rates.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Advantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Low Cost</strong></li>
                        <li><strong>Widely Available</strong></li>
                        <li><strong>Safe to Use:</strong> Non-toxic and fairly safe to dispose of compared to some other chemistries.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Disadvantages</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Low Energy Density</strong></li>
                        <li><strong>High Self-Discharge:</strong> Loses charge quickly even when not in use.</li>
                        <li><strong>Limited Operating Temperature</strong></li>
                        <li><strong>Prone to leakage</strong> due to its construction, it can leak and damage equipment.</li>
                    </ul>

                    <p>
                        Carbon zinc batteries find very little application in IoT gadgets because of their low energy density and inability to stand long-term or high-drain operation. However, several applications could be:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Simple, Disposable IoT Devices</li>
                        <li>Single-use trackers/tags for logistics</li>
                        <li>Applications in some Devices with very little power requirements, such as a simple remote control device or toy sensors.</li>
                    </ul>
                </div>

                {/* Hybrid Batteries */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Hybrid Batteries
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Hybrid batteries combine features of at least two different battery chemistries to achieve optimum performance, capacity, safety, and life. They aim to leverage the strengths of various technologies beyond their respective individual weaknesses. Such batteries are suitable for very specific applications, which may also include IoT devices.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Examples of Hybrid Battery Technologies</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Lithium Ion Capacitor (LIC):</strong> Combination of lithium-ion batteries with supercapacitors to achieve fast charging and long cycle life.</li>
                        <li><strong>Zinc Alkaline Hybrid:</strong> Bridges zinc and alkaline technologies to offer superior energy density compared to classical alkaline batteries.</li>
                        <li><strong>Solid-State Hybrid:</strong> Utilizes solid electrolytes and lithium or sodium chemistry; thus, allowing enhanced safety and more compactness.</li>
                    </ul>

                    <p>
                        Hybrid batteries are likely to remain crucial in future IoT systems and portable electronics due to their tailored solutions and appeal in meeting specific performance requirements. Continuous research remains in conduct to find their cost-effectiveness and enhance scalability.
                    </p>
                </div>

                {/* Comparative Analysis */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Comparative Analysis of Battery for an IoT Project
                </h2>

                <div className="my-4">
                    <Image
                        src="/blog2/analysis.webp"
                        alt="Analysis of Battery for an IoT Project"
                        width={800}
                        height={400}
                        className="rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">Figure 17: Carbon-Zinc Battery for an IoT Project</p>
                </div>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <h3 className="text-xl font-medium font-montserrat">Key Takeaways</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Best for High-Performance IoT:</strong> Lithium-ion and Li-Po batteries are suited for IoT applications requiring high energy density and rechargeability, such as wearables and smart sensors.</li>
                        <li><strong>Best for Low-Power, Long-Term Use:</strong> Coin cells and Zinc-air batteries are suited to ultra-low-power applications where size and weight are critical.</li>
                        <li><strong>Environmentally Friendly Choices:</strong> Nickel-metal hydride (NiMH) and emerging Magnesium-Air batteries are considered more &apos;green&apos; than traditional chemistries.</li>
                        <li><strong>Cost-Effective Solutions:</strong> Alkaline and Carbon-zinc batteries are good in very low-budget IoT applications, which have small energy consumption.</li>
                        <li><strong>Emerging Technologies:</strong> Solid-state and Hybrid: The Future of IoT Power: Safety, compactness, and efficiency for next-generation applications are ensured by Solid-state and Hybrid batteries.</li>
                    </ul>
                </div>

                {/* Conclusion */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Conclusion of Battery for an IoT Project
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-4">
                    <p>
                        Choosing the proper battery for an IoT project can be very critical with respect to achieving an optimal operation in terms of performance, cost, longevity, and environmental concerns. Selection methodology of a battery would thus depend on the type of IoT device-power consumption, size, weight, cost, and expected operational environment.
                    </p>
                    <p>
                        In the end, it should be selected in order to match the energy demand, size constraint, and expected lifetime of the application, besides the environmental conditions. Although well-established technologies like Li-ion and NiMH dominate applications, new technologies like Solid-State and Magnesium-Ion batteries hold great promise for future IoT advancements, with superior safety, energy efficiency, and longer operational life.
                    </p>
                </div>

                {/* References */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    References for Selecting a Battery for an IoT Project
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-2">
                    <p><a href="https://energizer.com" className="hover:underline">Alkaline, Lithium, and Zinc-Air batteries.</a></p>
                    <p><a href="https://www.batterystuff.com/batteries/" className=" hover:underline">Li-ion Battery FAQ</a></p>
                    <p><a href="https://www.energystorage.org" className=" hover:underline">Research and resources on battery technologies, including Solid-State and Lithium-based solutions.</a></p>
                    <p><a href="https://www.analog.com/en/resources/technical-articles/lithium-coincell-batteries-predicting-an-application-lifetime.html" className=" hover:underline">Coincell battery</a></p>
                    <p><a href="https://data.energizer.com/pdfs/lithiumcoin_appman.pdf" className=" hover:underline">Coincell battery</a></p>
                    <p><a href="https://www.duracell.com/en-us/" className=" hover:underline">Alkaline, Nickel-Metal Hydride (NiMH), and other battery types.</a></p>
                    <p><a href="https://www.lithiumbatterysale.com/complete-guide-for-lithium-polymer-battery/" className=" hover:underline">About lipo battery</a></p>
                    <p><a href="https://www.qurator.com/blog/what-are-nickel-cadmium-batteries" className=" hover:underline">Nicd</a></p>
                    <p><a href="https://en.wikipedia.org/wiki/Alkaline_battery" className=" hover:underline">Alkaline batteries</a></p>
                    <p><a href="https://intorobotics.com/lead-acid-batteries/" className=" hover:underline">Lead acid</a></p>
                    <p><a href="https://www.sciencedirect.com/topics/earth-and-planetary-sciences/electric-hybrid-vehicles#:~:text=Batteries%20for%20HEV%20applications%20are,material%20utilization%20at%20high%20rates." className=" hover:underline">Hybrid batteries research</a></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}