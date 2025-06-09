"use client";

import Image from "next/image";

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
    return (
        <section className="mt-40 mb-40 w-full px-[133px] py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-3xl font-normal font-poppins">FAQs</h2>
                <div className="text-[18px] font-normal font-poppins">
                    <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">Still Have Questions? &gt;</span>
                </div>

            </div>

            {/* FAQ Items */}
            <div className="mt-20 w-[870px] space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="space-y-4">
                        {/* Question */}
                        <div className="flex items-start gap-4">

                            <Image
                                src="/q.svg"
                                alt="Question"
                                width={30}
                                height={30}
                            />
                            <h4 className="text-[#3C3C3C] text-base font-normal font-poppins mt-1">
                                {faq.question}
                            </h4>
                        </div>

                        {/* Answer */}
                        <div className="flex items-start gap-4">

                            <Image
                                src="/a.svg"
                                alt="Answer"
                                width={30}
                                height={30}
                            />

                            <p className="text-[#6c6c6c]/93 text-base font-normal font-poppins italic">
                                {faq.answer}
                            </p>
                        </div>


                    </div>
                ))}
            </div>
        </section>
    );
}