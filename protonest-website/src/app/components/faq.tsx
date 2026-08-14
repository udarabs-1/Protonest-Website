"use client";

import { useCallback, useMemo, useState } from 'react';

const faqs = [
    {
        id: "iot-projects",
        question: "What kind of IoT projects can you help with?",
        answer: "We can help with IoT product development across hardware, firmware, embedded systems, IoT software, dashboards, testing, and product support. This can include connected devices, access control systems, industrial IoT solutions, wearable technology, smart products, and custom IoT systems."
    },
    {
        id: "early-idea",
        question: "Can I contact you if my IoT idea is still early?",
        answer: "Yes. You can contact us with an early idea, rough concept, prototype, or existing product. If the scope is not fully defined yet, share the problem you want to solve, who the product is for, and what you already know about the device or system."
    },
    {
        id: "project-inquiry",
        question: "What should I include in my project inquiry?",
        answer: "Include the product goal, device type, current stage, expected timeline, target users, and the type of support you need. If you already have sketches, requirements, hardware notes, firmware details, or software requirements, mention them in the message."
    },
    {
        id: "hardware-and-software",
        question: "Can you help with both hardware and software?",
        answer: "Yes. We can support your connected product idea with hardware design, firmware development, embedded systems, IoT software, dashboards, testing, and product improvements. If your project needs multiple engineering areas, include that in your inquiry."
    },
    {
        id: "existing-product",
        question: "Can you review or improve an existing IoT product?",
        answer: "Yes. We can review existing IoT products, prototypes, hardware, firmware, software, or system architecture. We can help identify technical issues, improve reliability, support new features, or plan the next development stage."
    },
    {
        id: "nda",
        question: "Can you sign a Non-Disclosure Agreement before discussing the project?",
        answer: "Yes. We can review and sign an NDA before discussing sensitive project details. Mention the NDA requirement in your message so we can handle it before the technical discussion starts."
    },
    {
        id: "getting-started",
        question: "How do I start an IoT project with you?",
        answer: "Submit the contact form or book a call with us. Share the project goal, current stage, technical needs, and timeline. We will review the requirement and guide the next step, which may include a technical discussion, scope review, or proposal."
    },
    {
        id: "product-quality",
        question: "How do you check product quality?",
        answer: "We use testing and validation throughout the development process. Depending on the project, this can include hardware checks, firmware testing, connectivity testing, software testing, device behavior checks, and product readiness review before delivery."
    },
    {
        id: "build-test-ship",
        question: "Can you build, test, and ship a product?",
        answer: "Yes. We can build, test, and ship products based on the confirmed project scope, technical requirements, and delivery plan. Shipping details, quantity, destination, and handover requirements should be confirmed during the project discussion."
    },
    {
        id: "response-timeline",
        question: "How long does it take to receive a response or proposal?",
        answer: "We aim to respond within 48 hours after receiving clear project details. A full proposal may take longer if the requirement needs technical review, hardware analysis, timeline planning, or cost estimation."
    }
];

const GradientIcon = ({ letter }: { letter: string }) => (
    <div className="w-[30px] h-[30px] px-[13px] py-[7px] bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(85,_48,_250,_0.93)_0deg,_rgba(245,_29,_165,_0.93)_360deg)] rounded-[20px] outline outline-offset-[-1px] outline-[#dedede] inline-flex flex-col justify-center items-center gap-2.5 flex-shrink-0">
        <div className="text-white text-base font-normal font-poppins">{letter}</div>
    </div>
);

const FAQItem = ({ faq }: { faq: typeof faqs[0] }) => (
    <div className="space-y-3 lg:space-y-4">

        <div className="flex items-start gap-3 lg:gap-4">
            <GradientIcon letter="Q" />
            <h4 className="text-[#3C3C3C] text-sm lg:text-[15px] xl:text-base font-normal font-poppins mt-1 flex-1">
                {faq.question}
            </h4>
        </div>


        <div className="flex items-start gap-3 lg:gap-4">
            <GradientIcon letter="A" />
            <p className="text-[#6c6c6c]/93 text-sm lg:text-[15px] xl:text-base font-normal font-poppins mt-1 italic flex-1">
                {faq.answer}
            </p>
        </div>
    </div>
);

export default function FAQSection() {
    const [showAll, setShowAll] = useState(false);

    const getNavbarHeight = useCallback(() => {

        if (typeof window === 'undefined') return 80;

        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            return 80;
        } else if (screenWidth < 1024) {
            return 100;
        } else {
            return 120;
        }
    }, []);

    const scrollToGetInTouch = useCallback(() => {

        const getInTouchSection = document.querySelector('form') ||
            document.querySelector('[data-section="get-in-touch"]');

        if (getInTouchSection) {

            const elementRect = getInTouchSection.getBoundingClientRect();
            const elementTop = elementRect.top + window.pageYOffset;

            const navbarHeight = getNavbarHeight();

            const viewportHeight = window.innerHeight;
            const elementHeight = elementRect.height;
            const centerOffset = (viewportHeight - elementHeight) / 2;

            const scrollToPosition = elementTop - navbarHeight - centerOffset;

            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });
        }
    }, [getNavbarHeight]);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    const { displayedFaqs, hasMoreFaqs } = useMemo(() => {
        const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);
        const hasMoreFaqs = faqs.length > 5;

        return { displayedFaqs, hasMoreFaqs };
    }, [showAll]);

    return (
        <section
            className="mt-20 md:mt-32 xl:mt-30 mb-20 md:mb-32 xl:mb-40 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] 2xl:px-[180px] py-6 md:py-12"
            aria-labelledby="faq-title"
        >

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-8 md:mb-12">
                <div className="flex flex-col gap-2">
                    <h2
                        id="faq-title"
                        className="inline-block w-fit text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-2xl lg:text-[26px] xl:text-3xl font-normal font-poppins"
                    >
                        Frequently Asked Questions
                    </h2>
                    <p className="max-w-[640px] text-[13px] sm:text-sm md:text-[15px] font-normal font-poppins text-[#6c6c6c] leading-relaxed">
                        These answers help visitors understand what to send before contacting Protonest about an IoT product, prototype, embedded system, or connected device requirement.
                    </p>
                </div>
                <div className="text-base xl:text-[18px] font-normal font-poppins">
                    <button
                        onClick={scrollToGetInTouch}
                        className="cursor-pointer text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300"
                        aria-label="Navigate to contact form"
                    >
                        <span className="underline hover:underline-offset-0">Still Have Questions?</span> <span className="underline-offset-0">&gt;</span>
                    </button>
                </div>
            </div>


            <div className="mt-12 md:mt-16 lg:mt-20 w-full max-w-[870px] space-y-6 md:space-y-8">
                {displayedFaqs.map((faq) => (
                    <FAQItem
                        key={faq.id}
                        faq={faq}
                    />
                ))}
            </div>


            {hasMoreFaqs && (
                <div className="flex justify-center mt-8 sm:mt-12 lg:mt-15">
                    <button
                        onClick={toggleShowAll}
                        className="w-[160px] md:w-[180px] h-[45px] md:h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 hover:shadow-lg"
                        aria-expanded={showAll}
                        aria-label={showAll ? "Show fewer FAQs" : "Show more FAQs"}
                    >
                        <span className="text-white text-sm md:text-base font-medium">
                            {showAll ? "Show Less" : "Load More"}
                        </span>
                    </button>
                </div>
            )}
        </section>
    );
}