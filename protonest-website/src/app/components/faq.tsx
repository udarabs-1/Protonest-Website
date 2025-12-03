"use client";

import { useCallback, useMemo, useState } from 'react';

const faqs = [
    {
        id: "iot-projects",
        question: "What kind of IoT projects can you help with?",
        answer: "We can assist with a wide range of IoT projects, including smart home devices, wearable technology, industrial automation, and healthcare solutions. If you have a unique idea, feel free to reach out, and we can discuss how to bring it to life."
    },
    {
        id: "preparation",
        question: "What do I need to prepare before ordering?",
        answer: "Please organize the project idea, scope, and any specific requirements or preferred technologies. We'll guide you through the rest."
    },
    {
        id: "nda",
        question: "Are you comfortable signing a Non-Disclosure Agreement (NDA)?",
        answer: "Absolutely, we're happy to sign it."
    },
    {
        id: "getting-started",
        question: "How do I get started with my IoT project?",
        answer: "You can start by filling out our detailed project questionnaire on our website or simply send a message. This helps us understand your requirements and provide you with a detailed proposal including task, cost and time breakdown. You can also ask for a scheduled consultation with one of our team members to discuss your needs."
    },
    {
        id: "quality-assurance",
        question: "How do you ensure the quality of the product?",
        answer: "We follow testing and validation procedures to ensure the highest quality and reliability of the product. Fine-tuning and continuous improvements are part of the development process to achieve best performance."
    },
    {
        id: "shipping",
        question: "Can you build the product and ship to my address?",
        answer: "Yes, I can build it from scratch, conduct thorough testing, and ship it to your address."
    },
    {
        id: "support",
        question: "Do you provide support after the project is completed?",
        answer: "Yes, I offer ongoing support and consultation to ensure your IoT project continues to function smoothly."
    },
    {
        id: "proposal-timeline",
        question: "How long will it take for me to get a proposal for my requirement?",
        answer: "48 Hours"
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
                <h2
                    id="faq-title"
                    className="inline-block w-fit text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-2xl lg:text-[26px] xl:text-3xl font-normal font-poppins"
                >
                    FAQs
                </h2>
                <div className="text-base xl:text-[18px] font-normal font-poppins">
                    <button
                        onClick={scrollToGetInTouch}
                        className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5530FA] focus:ring-opacity-50 rounded-sm"
                        aria-label="Navigate to contact form"
                    >
                        Still Have Questions? &gt;
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