'use client';
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Head from "next/head";
import Image from "next/image";

export default function BlogDetailsPage() {
    return (
        <div className="overflow-x-hidden">
            <Head>
                {/* Primary Meta Tags */}
                <title>Selecting the Right Display for an IoT Device</title>
                <meta
                    name="description"
                    content="This article aims at helping IoT developers to select the perfect display for their projects. It focuses on the key points in the decision process."
                />
                <meta name="keywords" content="IoT display selection, LCD vs OLED, E-Paper displays, LED displays for IoT, touchscreen displays, IoT hardware components" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://protonest.co/right-display-for-an-iot-device" />

                {/* Open Graph (Basic) */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://protonest.co/right-display-for-an-iot-device" />
                <meta property="og:title" content="Selecting the Right Display for an IoT Device" />
                <meta property="og:description" content="This article aims at helping IoT developers to select the perfect display for their projects. It focuses on the key points in the decision process." />
                <meta property="og:image" content="https://protonest.co/blogs4.webp" />
                <meta property="og:image:alt" content="IoT display selection guide" />

                {/* Structured Data (Article) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": "Selecting the Right Display for an IoT Device",
                        "description": "This article aims at helping IoT developers to select the perfect display for their projects. It focuses on the key points in the decision process.",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Protonest",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://protonest.co/logo.png"
                            }
                        },
                        "image": {
                            "@type": "ImageObject",
                            "url": "https://protonest.co/blogs4.webp",
                            "width": "1125",
                            "height": "390"
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "https://protonest.co/right-display-for-an-iot-device"
                        }
                    })}
                </script>
            </Head>
            <Navbar />
            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-10">
                {/* Featured Image */}
                <div className="mb-8 lg:mb-12">
                    <Image
                        src="/blogs4.webp"
                        alt="Blog Cover"
                        width={1125}
                        height={390}
                        className="w-full h-[200px] md:h-[390px] xl:h-[430px] rounded-[11px]"
                    />
                </div>

                {/* Title and Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h1 className="text-[#6c6c6c] text-2xl md:text-3xl font-medium font-montserrat leading-10">
                        Selecting the Right Display for an IoT Device
                    </h1>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
                    {["IoT", "Hardware", "Displays"].map((cat, idx) => (
                        <div
                            key={idx}
                            className="h-9 md:h-11 px-4 py-2 w-auto md:w-[160px] text-center rounded-[57px] gradient-button-static-2 inline-flex items-center justify-center text-[#6c6c6c] text-sm font-medium font-montserrat"
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Introduction */}
                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        Selecting the right display for an IoT device is crucial, as the display is one of the main parts connecting users with embedded systems, interaction, and user experience. Selecting the right interface matters in a project, and it is affected by many factors. Apart from mobile and web dashboards connected with IoT systems, touch/non-touch displays play a critical role in having a built-in user interface for the users.
                    </p>

                    <p>
                        The display is a highly critical component used in IoT systems, and it functions as the primary interface between the device and the user. It affects usability, the capability to perform tasks, and the final product&apos;s effectiveness. Choosing the wrong display may, however, result in difficulties, inflation of costs, and the inability to achieve objectives.
                    </p>

                    <p>
                        This article aims at helping IoT developers to select the perfect display for their projects. It focuses on the key points in the decision process, the analysis of the several display technologies, and the aspect of futureproofing, and the concept of proper display integration.
                    </p>
                </div>

                {/* Types of Displays */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Types of Displays
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        In common displays used in IoT field can be categorized into two types. Those are Touch display and Non-touch display.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat mb-4">Advantages and Disadvantages of Touch Displays</h3>
                            <p>Touch displays are delightful for users as they allow direct control via human-machine interfaces (e.g., smartphones, etc.)</p>

                            <h4 className="text-lg font-medium mt-4">Advantages</h4>
                            <ul className="list-disc pl-6">
                                <li>The user interface minimizes the number of additional buttons and controllers needed.</li>
                                <li>Space-saving design through the integration of input and output capabilities.</li>
                                <li>The improved visual aspect and the modern look.</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4">Disadvantages</h4>
                            <ul className="list-disc pl-6">
                                <li>More expensive than non-touch screens.</li>
                                <li>It may involve sophisticated software integration to support multi-touch.</li>
                                <li>It is also open to wear and tear in harsh environments.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat mb-4">Advantages and Disadvantages of Non-Touch Displays</h3>
                            <p>Non-touch displays are mostly used for information presentation and strength and therefore are cheaper and more durable for many projects.</p>

                            <h4 className="text-lg font-medium mt-4">Advantages</h4>
                            <ul className="list-disc pl-6">
                                <li>More reliable and suitable in extreme conditions.</li>
                                <li>Lower power dissipation, devices are more applicable for battery-powered solutions.</li>
                                <li>More economical and easier to integrate.</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4">Disadvantages</h4>
                            <ul className="list-disc pl-6">
                                <li>The exclusive use of non-tactile technology increases interactivity so, the users will need additional controllers (e.g., the buttons and the joules, or the mobile apps).</li>
                                <li>Some of the devices might not meet the expectation for modern interfaces in some projects.</li>
                            </ul>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat mt-8">Choosing Between Touch and Non-Touch Displays</h3>
                    <p>
                        Touch displays are best for devices that frequently need user input, like smart controllers or wearables, where an intuitive interface is key. Non-touch displays, on the other hand, suit monitoring devices more, such as temperature sensors, digital clocks, or meters, in cases where interaction is limited. When deciding, consider how accurate interaction needs to be, your project budget, the screen fitting your device&apos;s design, and environmental conditions. Make sure that your device has the right display for the function it serves and for the users&apos; needs.
                    </p>
                </div>

                {/* Common Displays and Features */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Common Displays and Features
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-8">
                    {/* LCD Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium font-montserrat">Liquid Crystal Display (LCD)</h3>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">PM LCD Display</h4>
                            <div className="my-4">
                                <Image
                                    src="/blog4/figure1.webp"
                                    alt="LCD1602 Display Module"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <p>Passive Matrix LCD displays are available in numerous sizes and configurations.</p>
                            <p className="mt-2"><strong>Example:</strong> LCD1602 display module - A popular and low-cost display module that can be interfaced with an Arduino or Raspberry Pi. It has two or four rows of 16 characters each and comes in colors like blue, yellow, and green.</p>



                            <h5 className="font-medium mt-4">Working Principle:</h5>
                            <p>PM LCDs operate using a grid of conductive lines, where pixel activation occurs at intersections of rows and columns. Liquid crystals twist to control light passage when a current is applied.</p>

                            <h5 className="font-medium mt-4">How It Operates:</h5>
                            <ul className="list-disc pl-6">
                                <li>A backlight provides illumination.</li>
                                <li>The liquid crystal layer modulates light based on applied voltage.</li>
                                <li>Passive control energizes one pixel at a time, resulting in slower refresh rates and limited control.</li>
                            </ul>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h5 className="font-medium">Pros:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Cheaper</li>
                                        <li>Utilizes very little energy</li>
                                        <li>Best option under direct sunlight</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium">Cons:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Monochrome display</li>
                                        <li>Reading from some angles could be a problem</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">AM LCD Display</h4>
                            <p>Out of the LCDs, the active-matrix system allows incorporation of &quot;active element&quot; in each pixel location (at the crossing points vertically arranged columns and horizontally arranged rows). These active elements could either be composed of diodes or transistors.</p>
                            <p>A transistor acts as a switch which is used to charge a capacitor, which is subsequently used as the pixel voltage supply. As a certain row is switched on, it happens in an orderly manner and all transistor switches in that specific row are switched off, whereby the correct voltage is provided for all pixel capacitors.</p>

                            <h5 className="font-medium mt-4">Working Principle:</h5>
                            <p>AM LCDs incorporate thin-film transistors (TFTs) at each pixel, enabling precise voltage control and maintaining pixel state until refreshed.</p>

                            <h5 className="font-medium mt-4">How It Operates:</h5>
                            <ul className="list-disc pl-6">
                                <li>Each pixel is paired with a transistor and capacitor.</li>
                                <li>The capacitor holds the charge, keeping the pixel active until the next refresh.</li>
                                <li>Active switching allows simultaneous pixel updates.</li>
                            </ul>

                            <h5 className="font-medium mt-4">Characteristics:</h5>
                            <p>Offers faster refresh rates, higher resolution, and better color reproduction. Widely used in devices like smartphones and IoT control panels.</p>

                            <p className="mt-2"><strong>Example:</strong> TFT LCD displays</p>

                            {/* Added TFT LCD specific information */}
                            <div className="mt-4">
                                <h5 className="font-medium">Thin Film Transistor (TFT)</h5>
                                <p>If a device has a permanent battery or a power outlet, these screens are best. They use more energy than other types of screens such as EPD, LED or LCD. But they show colors which look excellent. You cannot see the individual dots.</p>
                                <p>The screen has a light behind it. So, you can see it even in a dark room.</p>
                            </div>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure2.webp"
                                    alt="TFT LCD Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h5 className="font-medium">Pros:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>High-quality display</li>
                                        <li>Clear visibility</li>
                                        <li>No burn-in</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium">Cons:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>More electricity is used compared to EPD</li>
                                        <li>Utilizes backlight for better brightness</li>
                                        <li>Lesser ability of read under direct sunlight</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OLED Section */}
                    <div className="space-y-4 mt-8">
                        <h3 className="text-xl font-medium font-montserrat">Organic Light Emitting Diode (OLED) display</h3>
                        <p>These displays have high contrast ratios as they can modulate the brightness of each pixel independently. Compared to LCDs OLEDs use the very efficient organic LEDs, which means they consume less power. One of their big advantages is the mobile devices, as their fast reaction time makes them highly plant-friendly.</p>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="my-4">
                                <Image
                                    src="/blog4/figure3.webp"
                                    alt="OLED Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <h5 className="font-medium">Working Principle:</h5>
                            <p>OLEDs are self-emissive, using organic compounds to emit light directly when current flows through them, eliminating the need for a backlight.</p>

                            <h5 className="font-medium mt-4">How It Operates</h5>
                            <ul className="list-disc pl-6">
                                <li>Organic layers are sandwiched between electrodes.</li>
                                <li>Voltage causes recombination of electrons and holes, emitting light.</li>
                                <li>Each pixel is independently controlled and self-illuminating.</li>
                            </ul>

                            <h5 className="font-medium mt-4">Characteristics:</h5>
                            <p>Provides excellent contrast, vibrant colors, and ultra-thin form factors but is limited by organic material degradation over time.</p>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h5 className="font-medium">Pros:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Better viewing angles</li>
                                        <li>Power-efficient</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium">Cons:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Short lifespan</li>
                                        <li>Expensive</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg mt-6">
                            <h4 className="text-lg font-medium">Active-Matrix OLED (AM-OLED)</h4>
                            <p>It stands out as a type of OLED that has further been developed to have high refresh rates and low energy usage. They have a TFT layer that can change the brightness and color of each pixel independently enabling it to be used in real time scenarios.</p>
                            <div className="my-4">
                                <Image
                                    src="/blog4/figure4.webp"
                                    alt="AM-OLED Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <h5 className="font-medium mt-4">Working Principle:</h5>
                            <p>AM OLEDs integrate a TFT layer to regulate individual OLED pixels, merging active matrix control with OLED technology.</p>

                            <h5 className="font-medium mt-4">How It Operates:</h5>
                            <ul className="list-disc pl-6">
                                <li>The TFT layer manages brightness and color at the pixel level.</li>
                                <li>Capacitors maintain pixel state for faster refresh rates and precision.</li>
                            </ul>

                            <h5 className="font-medium mt-4">Characteristics:</h5>
                            <p>Superior for dynamic content, ideal for IoT applications like wearables and smart displays.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h5 className="font-medium">Pros:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Improved overall display with very bright colors & darker blacks achieving stunning contrast and vibrancy.</li>
                                        <li>Higher refresh rates available that improve efficiency on interfaces involving animation or rapid switching for IoT devices.</li>
                                        <li>Uses less energy for devices operating with dark mode.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium">Cons:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Crippling prices lower many copies and design based markets which are always good for the market, business and user especially in IoT devices, adoption.</li>
                                        <li>Shows more susceptibility to burn in with static images.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* E-Paper Section */}
                    <div className="space-y-4 mt-8">
                        <h3 className="text-xl font-medium font-montserrat">E-Paper/E-ink displays</h3>
                        <p>This growing display technology stands out as a top choice for IoT screens. E-paper displays have many advantages. It uses electrochromic tech to change color or opacity by applying voltage making it semi-bistable. It needs very little power and can grow due to its low cost. Companies are starting to use this tech in food cold chain, and green industries. It works great in consumer gadgets medical tools smart cards, and point-of-service systems.</p>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="my-4">
                                <Image
                                    src="/blog4/figure5.webp"
                                    alt="E-Paper Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <h5 className="font-medium">Working Principle:</h5>
                            <p>E-paper displays rely on microcapsules containing charged white and black particles suspended in fluid. Voltage shifts move these particles to create images.</p>

                            <h5 className="font-medium mt-4">How It Operates:</h5>
                            <ul className="list-disc pl-6">
                                <li>Voltage modulates particle positions.</li>
                                <li>Images are stable without power due to bistability.</li>
                                <li>Refreshing the display rearranges particles with a voltage change.</li>
                            </ul>

                            <h5 className="font-medium mt-4">Characteristics:</h5>
                            <p>Extremely power-efficient and sunlight-readable, but slower refresh rates make them unsuitable for dynamic content.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h5 className="font-medium">Pros:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Uses very little power</li>
                                        <li>Works well in many apps because it&apos;s easy to add drivers</li>
                                        <li>Easy to make bigger, lots of design choices, very thin and can bend</li>
                                        <li>Costs very little</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium">Cons:</h5>
                                    <ul className="list-disc pl-6">
                                        <li>Not sharp, can&apos;t show all colors</li>
                                        <li>Updates take time</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LED Section */}
                    <div className="space-y-4 mt-8">
                        <h3 className="text-xl font-medium font-montserrat">Light-emitting diode (LED)</h3>
                        <p>LED displays, which use a matrix of light-emitting diodes, or use LEDs as their backlight source, are the most common display types in IoT. They are widely used due to the combination of brightness, scalability, and functionality in harsh environments.</p>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h5 className="font-medium">Working Principle:</h5>
                            <p>LED displays use an array of light-emitting diodes to generate light directly, with each LED acting as a pixel.</p>

                            <h5 className="font-medium mt-4">How It Operates:</h5>
                            <ul className="list-disc pl-6">
                                <li>LEDs are arranged in grids or clusters (e.g., RGB for color).</li>
                                <li>Current flow controls brightness and color.</li>
                            </ul>

                            <h5 className="font-medium mt-4">Characteristics:</h5>
                            <p>Known for high brightness and scalability, but power consumption is significant for larger displays.</p>

                            <h4 className="text-lg font-medium mt-6">Types of LED Displays</h4>

                            <div className="space-y-6 mt-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-medium">Seven Segment LED Displays</h5>
                                    <p>These are simple displays used to display alphanumeric characters using predefined segments, such as 7-, 14-, or 16-segment displays.</p>

                                    <div className="my-4">
                                        <Image
                                            src="/blog4/figure6.webp"
                                            alt="Seven Segment LED Display"
                                            width={400}
                                            height={300}
                                            className="rounded-lg"
                                        />
                                    </div>

                                    <p className="font-medium">Applications:</p>
                                    <p>Digital clocks, IoT-enabled meters, home appliances, etc.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-medium">Pros:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Extremely energy-efficient.</li>
                                                <li>Durable and long-lasting.</li>
                                                <li>Ideal for straightforward numeric or alphanumeric data representation.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium">Cons:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Limited to basic characters and symbols.</li>
                                                <li>Not meant for dynamic content or high-detailed graphics.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-medium">Dot Matrix LED Displays</h5>
                                    <p>Comprise grids of LEDs that can display complex patterns, graphics, or scrolling text.</p>

                                    <div className="my-4">
                                        <Image
                                            src="/blog4/figure7.webp"
                                            alt="Dot Matrix LED Display"
                                            width={400}
                                            height={300}
                                            className="rounded-lg"
                                        />
                                    </div>

                                    <p className="font-medium">Applications:</p>
                                    <p>Digital signage, public information systems, and IoT-enabled displays in transportation at bus stops.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-medium">Pros:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Can be scalable for larger displays.</li>
                                                <li>Dynamic content such as animations or scrolling text is possible to display.</li>
                                                <li>High brightness makes them visible outdoors.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium">Cons:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Higher power consumption as compared to segment displays.</li>
                                                <li>Lower resolution when compared to modern LCDs or OLEDs</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-medium">RGB LED Displays</h5>
                                    <p>These displays use clusters of red, green, and blue LEDs to create full-color visuals.</p>

                                    <div className="my-4">
                                        <Image
                                            src="/blog4/figure8.webp"
                                            alt="RGB LED Display"
                                            width={400}
                                            height={300}
                                            className="rounded-lg"
                                        />
                                    </div>

                                    <p className="font-medium">Applications:</p>
                                    <p>Smart advertising boards, outdoor IoT displays, and event information systems.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-medium">Pros:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Bright and colorful, excellent for outdoor and indoor use.</li>
                                                <li>High scalability for large-format displays.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium">Cons:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>High brightness and color capability, heavy power use.</li>
                                                <li>Expensive for large-scale deployments.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-medium">MicroLED Displays</h5>
                                    <p>A state-of-the-art LED technology whereby every pixel is a single LED. MicroLEDs marry the best of LEDs and OLEDs, offering high brightness, efficiency, and endurance.</p>

                                    <div className="my-4">
                                        <Image
                                            src="/blog4/figure9.webp"
                                            alt="MicroLED Display"
                                            width={400}
                                            height={300}
                                            className="rounded-lg"
                                        />
                                    </div>

                                    <h5 className="font-medium mt-4">Working Principle:</h5>
                                    <p>MicroLEDs employ microscopic LEDs as pixels, combining OLED&apos;s self-emissive properties with LED&apos;s durability and brightness.</p>

                                    <h5 className="font-medium mt-4">How It Operates:</h5>
                                    <p>Each microLED is a self-contained light source. Pixels are controlled individually using inorganic materials for superior efficiency and longevity.</p>

                                    <p className="font-medium mt-4">Applications:</p>
                                    <p>Next-generation wearables, AR/VR systems, and other emerging IoT devices requiring premium visuals.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-medium">Pros:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>More energy-efficient than traditional LEDs.</li>
                                                <li>Higher contrast and resolution compared to conventional LED displays.</li>
                                                <li>Very durable and withstands long use.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium">Cons:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Currently expensive and not widely available.</li>
                                                <li>Manufacturing is complex, especially for smaller IoT devices.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-medium">Touch-Enabled LED Displays</h5>
                                    <p>Touch-enabled LED displays represent one of the brightest and highly scalable families of LED technology, combined with the interactive capability of touch, that are becoming ideal for IoT designs requiring user interaction. A display of this nature is enabled by integrating touch-sensitive overlays onto standard LED panels or sensors that allow for the detection of touch capability.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-medium">Pros:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>High Interactivity</li>
                                                <li>Can be used in both small IoT devices, such as home automation systems, and large public displays.</li>
                                                <li>Durability: IR touch sensors can make LED displays rugged, suitable for harsh environments.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium">Cons:</h5>
                                            <ul className="list-disc pl-6">
                                                <li>Higher Power Consumption</li>
                                                <li>Increased Cost</li>
                                                <li>Outdoor touch-enabled displays may need additional protection against weather or vandalism.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Types of Touchscreens */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Types of Displays with Touchscreens
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Resistive Touch Displays</h3>
                            <p>Pressure from finger or stylus will be detected by connection of two layers of screen.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure10.webp"
                                    alt="Resistive Touch Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Works with finger, Stylus, With gloves</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Limited multi touches</li>
                                        <li>Poor optical clarity</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Used in:</strong> Industrial IoT systems, ATMs, basic home automation panels.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Capacitive Touch Displays</h3>
                            <p>Detect finger touch using conductive sensors.</p>
                            <p>It mesure change in electrosatatic change when touch by conductive object.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure11.webp"
                                    alt="Capacitive Touch Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Good optical clarity</li>
                                        <li>It supports to multi-touch</li>
                                        <li>High precise than other touch screens</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantage:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Not work for non-conductive objects (e.g., gloves)</li>
                                        <li>More expensive than resistive touch</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Commonly found in:</strong> IoT devices like Smart home hubs, smartwatches, wearable IoT devices, healthcare monitors.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Infrared (IR) Touch Displays</h3>
                            <p>Use IR beams to detect touchpoints.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure12.webp"
                                    alt="Infrared Touch Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <p>As above, It uses a grid of infrared light beams to detect touch interruptions.</p>
                            <p>Perfect for large-sized displays used in public IoT interfaces or industrial dashboards.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Durable</li>
                                        <li>Work for any object touch in it</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantage:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Sensitive to dust</li>
                                        <li>High cost for implement</li>
                                        <li>Low accuracy for small display</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Can be found in:</strong> display uses outdoor IoT systems.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Projected Capacitive (P-Cap) Touch Displays</h3>
                            <p>Advanced capacitive technology using electro static, supporting multi-touch and high precision.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure13.webp"
                                    alt="P-Cap Touch Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Best optical performance</li>
                                        <li>Supports multi-touch gestures</li>
                                        <li>Durable and flexible design</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Expensive to implement</li>
                                        <li>Requires special manufacturing process</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Used in:</strong> high-end IoT systems such as kiosks, high-end smart home hubs, and arced IoT display.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Surface Acoustic Wave (SAW) Display</h3>
                            <p>Typically, ultrasonic waves are spread over the screen surface, where absorption takes place by the user upon touch for exact detection.</p>
                            <p>SAW touchscreens utilize special transducers mounted on the panel edges. These transducers generate an invisible grid of ultrasonic waves that are detected by receivers.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure14.webp"
                                    alt="Surface Acoustic Wave Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>High image clarity</li>
                                        <li>Works with fingers, gloves, or stylus</li>
                                        <li>Scratch-resistant</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Not durable in harsh environments</li>
                                        <li>Affected by contaminants like water or dust</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Used in:</strong> Medical IoT devices, touchscreens in controlled environments like labs or hospitals.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">Optical Touch Display</h3>
                            <p>Using cameras and light sensors, track touch on screen.</p>

                            <div className="my-4">
                                <Image
                                    src="/blog4/figure15.webp"
                                    alt="Optical Touch Display"
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>

                            <p>Optical imaging touch technologies use infrared cameras and light to detect touch. On optical imaging touch displays, the accuracy of touch can depend considerably on the quality and type of components used.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-medium">Advantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Works with fingers, stylus, or gloves</li>
                                        <li>Excellent for large displays</li>
                                        <li>Easy to maintain</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium">Disadvantages:</h4>
                                    <ul className="list-disc pl-6">
                                        <li>Lower accuracy compared to capacitive touch</li>
                                        <li>Limited to specific screen designs</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4"><strong>Applications:</strong> Large IoT-enabled boards, interactive public displays, conference room devices.</p>
                        </div>
                    </div>
                </div>

                {/* Regulatory Framework */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Regulatory Framework, Compliance, and Certifications when selecting the right Display for an IoT Device
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        In any IoT project, the selection of a display device has to be done according to legal regulations and certification requirements. Certification ensures the safety, reliability, and market acceptance of products. However, specific standards and requirements can vary significantly based on the country and the intended use or orientation of the device.
                    </p>

                    <h3 className="text-xl font-medium font-montserrat">Why is Compliance Critical for IoT Displays?</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Safety and Performance:</strong> Compliance includes regulations that make sure a display is safe in commercially designated spaces and does not cause unnecessary disruption to other electronic devices.</li>
                        <li><strong>Legal Factors:</strong> Certification is a requirement that must be achieved for marketing IoT devices in some areas of the world. Without it, one could face legal problems or find the market difficult to penetrate.</li>
                        <li><strong>Comparison with Technical Regulations of Environmental Protection:</strong> Mandatory certifications are very bogus in nationality as they encourage the adoption of good ideals like limiting the use of hazardous materials.</li>
                    </ul>

                    <h3 className="text-xl font-medium font-montserrat">Some of the Major Standards and Certifications</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">FCC (Federal Communications Commission) – USA</h4>
                            <ul className="list-disc pl-6">
                                <li>Prevent devices (display and others) from causing interference due to excessive EMI radiation.</li>
                                <li>Compulsory for all IoT devices that are sold in the USA.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">CE Marking (Conformité Européenne) – EU:</h4>
                            <ul className="list-disc pl-6">
                                <li>To show that the item meets European health, safety, and environmental requirements.</li>
                                <li>Also, obligatory for IoT devices in Europe including displays.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">RoHS – Restriction of Hazardous Substances:</h4>
                            <ul className="list-disc pl-6">
                                <li>It guarantees that the device (display included) will not have harmful substances such as lead, mercury or cadmium.</li>
                                <li>Obligatory in the European Union and gaining acceptance in other countries.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">UL – Underwriters Laboratories:</h4>
                            <ul className="list-disc pl-6">
                                <li>Emphasizes on how durable electronic parts, especially displays, are against fire and other types of hazards.</li>
                                <li>Regularly used for IoT devices in the industrial or commercial sectors.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">ISO Standards:</h4>
                            <ul className="list-disc pl-6">
                                <li>ISO 9001: Primarily emphasizes on quality management while manufacturing different products.</li>
                                <li>ISO 14001: Concerned about management of the environment.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">IP Rating – Ingress Protection:</h4>
                            <ul className="list-disc pl-6">
                                <li>Applicable for IoT displays which are installed outside or in extreme conditions. For example:</li>
                                <li>IP67: Which makes IoT devices dust tight and waterproof.</li>
                                <li>IP68: Which makes it waterproof against complete immersion in water for long duration.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">Energy Star:</h4>
                            <ul className="list-disc pl-6">
                                <li>A certificate that is awarded to energy efficient items and electric displays in order to use less power.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium">WEEE – Waste Electrical and Electronic Equipment Directive:</h4>
                            <ul className="list-disc pl-6">
                                <li>It promotes waste management for guidance of the proper disposal of waste.</li>
                            </ul>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat mt-6">Industry Concepts and Other Certifications</h3>
                    <ul className="list-disc pl-6">
                        <li>Medical IoT devices should also be following the FDA (for the USA) or the MDR (for the EU) to be considered as suitable for Medical Displays.</li>
                        <li>Automotive IoT Displays should have AEC-Q components so that any automotive item can be compatible.</li>
                        <li>Industrial IoT Displays have requirements such as the ATEX certificate which enables them to be used in explosive zones or UL 61010 which ensures industrial safety.</li>
                    </ul>
                </div>

                {/* Connectivity and Interface Options */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Connectivity and Interface Options
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        IoT displays rely on specific connectivity options and protocols to interact seamlessly with microcontrollers or single-board computers (SBCs). The following summary describes the most common methods and their supported display types, the advantages and disadvantages, and the devices which each is best applied for.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">1. SPI – Serial Peripheral Interface</h3>
                            <p><strong>Supported Displays:</strong> TFT LCDs, OLEDs, E-paper, dot matrix LEDs</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <ul className="list-disc pl-6">
                                <li>Microcontrollers: Arduino, STM32, ESP32, ATmega328P.</li>
                                <li>SBCs: Raspberry Pi, BeagleBone, Jetson Nano.</li>
                            </ul>
                            <p className="mt-2">Fast graphics rendering over short distances but with limited distance</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">2. I2C (Inter-Integrated Circuit)</h3>
                            <p><strong>Supported Displays:</strong> Segment LEDs, small OLEDs, character-based LCDs (e.g., LCD1602).</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <ul className="list-disc pl-6">
                                <li>Microcontrollers: Arduino, ESP8266, MSP430.</li>
                                <li>SBCs: Raspberry Pi, BeagleBone Black.</li>
                            </ul>
                            <p className="mt-2">It is ideal for low-power systems, but slower than SPI.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">3. UART (Universal Asynchronous Receiver-Transmitter)</h3>
                            <p><strong>Supported Displays:</strong> Dot matrix LEDs, large LCD panels, LED matrix modules.</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <ul className="list-disc pl-6">
                                <li>Microcontrollers: AVR, PIC, STM32.</li>
                                <li>SBCs: Raspberry Pi, ESP32, Banana Pi.</li>
                            </ul>
                            <p className="mt-2">This one, universally supported by most microcontrollers. However, Slower than SPI and I2C and limited to single-display connections per line.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">4. Parallel Interface (GPIO Pins)</h3>
                            <p>Data is transmitted in parallel across multiple GPIO pins for faster communication.</p>
                            <p><strong>Supported Displays:</strong> High-resolution TFT LCDs (e.g., 3.5-inch panels).</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <ul className="list-disc pl-6">
                                <li>Microcontrollers: STM32, ESP32, ARM Cortex-M.</li>
                                <li>SBCs: Raspberry Pi.</li>
                            </ul>
                            <p className="mt-2">These displays are extremely fast for high-res, high-refresh-rate displays.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">5. HDMI (High-Definition Multimedia Interface)</h3>
                            <p>Transfers high-quality video and audio data to displays.</p>
                            <p><strong>Supported Displays:</strong> LED panels, high-resolution touchscreens, digital signage.</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <p>SBCs Only: Raspberry Pi, Jetson Nano, BeagleBone AI.</p>
                            <p className="mt-2">The Advantages when we use this display are plug-and-play compatibility and excellent resolution and color support. But it consume more power.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">6. DSI (Display Serial Interface)</h3>
                            <p>This is a High-speed serial interface optimized for mobile and IoT displays.</p>
                            <p><strong>Supported Displays:</strong> AMOLEDs, high-resolution TFT LCDs, flexible displays.</p>
                            <p><strong>Compatible Devices:</strong> SBCs Only</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium font-montserrat">7. USB</h3>
                            <p>Plug-and-play connection via USB ports.</p>
                            <p><strong>Supported Displays:</strong> Touch-enabled LED panels, portable monitors, RGB LED displays.</p>
                            <p><strong>Compatible Devices:</strong></p>
                            <ul className="list-disc pl-6">
                                <li>SBCs: Raspberry Pi, Intel NUC, Jetson Nano.</li>
                            </ul>
                            <p className="mt-2">High-speed data transfer.</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium font-montserrat mt-6">Recommendations for Display Integration</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Simple Projects:</strong> Use I2C for character-based LCDs or small OLEDs to save GPIO pins and power.</li>
                        <li><strong>High-Speed Applications:</strong> SPI is ideal for graphical displays needing fast refresh rates.</li>
                        <li><strong>Complex Systems:</strong> HDMI or DSI work best for high-resolution, multi-touch IoT displays.</li>
                        <li><strong>Limited Availability of GPIO:</strong> Choose between UART or USB for easy connectivity with least wiring.</li>
                    </ul>
                </div>

                {/* Conclusion */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    Conclusion
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-6">
                    <p>
                        The selection of the correct display for an IoT project directly influences the usability, durability, and success of the device. Each display type is very different, whether it&apos;s LCD, OLED, E-paper, or LED. Their strengths and trade-offs render them suitable for only some applications. Key considerations should go to power efficiency, environmental conditions, ways of connectivity, and user interaction that would best fit the project objectives.
                    </p>

                    <p>
                        Developers who are aware of all features and limitations of the different display options can of course make informed design decisions that balance cost, performance, and durability. Ensuring that the products meet regulatory standards and include measures to future-proof them will further improve market acceptance and longevity.
                    </p>

                    <p>
                        In this dynamic ecosystem that is IoT, there is a need to prototype and test different display solutions for optimum usability and functionality. With strategic planning coupled with the right display choice, IoT devices can have great user experiences while consistently performing in a variety of environments.
                    </p>
                </div>

                {/* References */}
                <h2 className="text-[#6c6c6c] text-2xl sm:text-[25px] font-medium font-montserrat leading-10 mt-10 mb-4">
                    References
                </h2>

                <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px] space-y-2">
                    <p><a href="https://dronebotworkshop.com/lcd-displays-arduino/" className="hover:underline">[1] LCD display history and LCD1602 display features: https://dronebotworkshop.com/lcd-displays-arduino/</a></p>
                    <p><a href="https://www.newvisiondisplay.com/types-of-lcd-technology/" className="hover:underline">[2] All types of LCD: https://www.newvisiondisplay.com/types-of-lcd-technology/</a></p>
                    <p><a href="https://www.arkco-sales.com/articles/hmi-tft-lcd-oled#:~:text=TFT%2C%20LCD%2C%20and%20OLED%20Displays:%20Differences%20and%20Design%20Considerations&text=What's%20the%20difference%20between%20TFT,emits%20its%20own%20light%20independently." className="hover:underline">[3] TFT, LCD, and OLED Displays: Differences and Design Considerations: https://www.arkco-sales.com/articles/hmi-tft-lcd-oled#:~:text=TFT%2C%20LCD%2C%20and%20OLED%20Displays:%20Differences%20and%20Design%20Considerations&text=What&apos;s%20the%20difference%20between%20TFT,emits%20its%20own%20light%20independently.</a></p>
                    <p><a href="https://search.arduino.cc/search?tab=&q=display" className="hover:underline">[4] Ideas about Display: https://search.arduino.cc/search?tab=&q=display</a></p>
                    <p><a href="https://learn.adafruit.com/adafruit-arduino-lesson-11-lcd-displays-1" className="hover:underline">[5] Choose connection methods: https://learn.adafruit.com/adafruit-arduino-lesson-11-lcd-displays-1</a></p>
                    <p><a href="https://www.electronicsweekly.com" className="hover:underline">[6] Understanding LCD and OLED Displays in IoT Devices: https://www.electronicsweekly.com</a></p>
                    <p><a href="https://www.tealhq.com/certifications/compliance-officer#:~:text=In%20the%20intricate%20world%20of,the%20complex%20compliance%20landscape%20effectively." className="hover:underline">[7] Regulatory compliance and certifications: https://www.tealhq.com/certifications/compliance-officer#:~:text=In%20the%20intricate%20world%20of,the%20complex%20compliance%20landscape%20effectively.</a></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}