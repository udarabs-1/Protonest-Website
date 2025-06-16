"use client";

const faqs = [
    {
        question: "What services does Protonest offer?",
        answer: "We specialize in end-to-end IoT prototyping—including PCB design, firmware, app development, QA, and project management."
    },
    {
        question: "Do you work with international clients?",
        answer: "Yes! We collaborate with clients worldwide through a fully remote model."
    },
    {
        question: "Is your work project-based or ongoing?",
        answer: "Most of our work is freelance and project-based, but we also take on long-term partnerships."
    }
];

export default function FAQSection() {
    const GradientIcon = ({ letter }: { letter: string }) => (
        <div className="w-[30px] h-[30px] px-[13px] py-[7px] bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(85,_48,_250,_0.93)_0deg,_rgba(245,_29,_165,_0.93)_360deg)] rounded-[20px] outline outline-offset-[-1px] outline-[#dedede] inline-flex flex-col justify-center items-center gap-2.5 flex-shrink-0">
            <div className="text-white text-base font-normal font-poppins">{letter}</div>
        </div>
    );

    return (
        <section className="mt-20 md:mt-32 xl:mt-40 mb-20 md:mb-32 xl:mb-40 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] py-6 md:py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-8 md:mb-12">
                <h2 className="inline-block w-fit text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-2xl md:text-3xl font-normal font-poppins">
                    FAQs
                </h2>
                <div className="text-base md:text-[18px] font-normal font-poppins">
                    <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer transition-all duration-200">
                        Still Have Questions? &gt;
                    </span>
                </div>
            </div>

            {/* FAQ Items */}
            <div className="mt-12 md:mt-16 lg:mt-20 w-full max-w-[870px] space-y-6 md:space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="space-y-3 md:space-y-4">
                        {/* Question */}
                        <div className="flex items-start gap-3 md:gap-4">
                            <GradientIcon letter="Q" />
                            <h4 className="text-[#3C3C3C] text-sm md:text-base font-normal font-poppins mt-1 flex-1">
                                {faq.question}
                            </h4>
                        </div>

                        {/* Answer */}
                        <div className="flex items-start gap-3 md:gap-4">
                            <GradientIcon letter="A" />
                            <p className="text-[#6c6c6c]/93 text-sm md:text-base font-normal font-poppins italic flex-1">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}