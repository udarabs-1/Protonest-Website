"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: "iot-projects",
    question: "What kind of IoT projects can you help with?",
    answer:
      "We can help with IoT product development across hardware, firmware, embedded systems, IoT software, dashboards, testing, and product support. This can include connected devices, access control systems, industrial IoT solutions, wearable technology, smart products, and custom IoT systems.",
  },
  {
    id: "early-idea",
    question: "Can I contact you if my IoT idea is still early?",
    answer:
      "Yes. You can contact us with an early idea, rough concept, prototype, or existing product. If the scope is not fully defined yet, share the problem you want to solve, who the product is for, and what you already know about the device or system.",
  },
  {
    id: "project-inquiry",
    question: "What should I include in my project inquiry?",
    answer:
      "Include the product goal, device type, current stage, expected timeline, target users, and the type of support you need. If you already have sketches, requirements, hardware notes, firmware details, or software requirements, mention them in the message.",
  },
  {
    id: "hardware-and-software",
    question: "Can you help with both hardware and software?",
    answer:
      "Yes. We can support your connected product idea with hardware design, firmware development, embedded systems, IoT software, dashboards, testing, and product improvements. If your project needs multiple engineering areas, include that in your inquiry.",
  },
  {
    id: "existing-product",
    question: "Can you review or improve an existing IoT product?",
    answer:
      "Yes. We can review existing IoT products, prototypes, hardware, firmware, software, or system architecture. We can help identify technical issues, improve reliability, support new features, or plan the next development stage.",
  },
  {
    id: "nda",
    question:
      "Can you sign a Non-Disclosure Agreement before discussing the project?",
    answer:
      "Yes. We can review and sign an NDA before discussing sensitive project details. Mention the NDA requirement in your message so we can handle it before the technical discussion starts.",
  },
  {
    id: "getting-started",
    question: "How do I start an IoT project with you?",
    answer:
      "Submit the contact form or book a call with us. Share the project goal, current stage, technical needs, and timeline. We will review the requirement and guide the next step, which may include a technical discussion, scope review, or proposal.",
  },
  {
    id: "product-quality",
    question: "How do you check product quality?",
    answer:
      "We use testing and validation throughout the development process. Depending on the project, this can include hardware checks, firmware testing, connectivity testing, software testing, device behavior checks, and product readiness review before delivery.",
  },
  {
    id: "build-test-ship",
    question: "Can you build, test, and ship a product?",
    answer:
      "Yes. We can build, test, and ship products based on the confirmed project scope, technical requirements, and delivery plan. Shipping details, quantity, destination, and handover requirements should be confirmed during the project discussion.",
  },
  {
    id: "response-timeline",
    question: "How long does it take to receive a response or proposal?",
    answer:
      "We aim to respond within 48 hours after receiving clear project details. A full proposal may take longer if the requirement needs technical review, hardware analysis, timeline planning, or cost estimation.",
  },
];

type FAQItemProps = {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  const buttonId = `faq-button-${faq.id}`;
  const panelId = `faq-panel-${faq.id}`;

  return (
    <div className="border-b border-[#E5E5E5]">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-5 py-5 text-left md:py-6"
        >
          <span
            className={`font-poppins text-sm font-normal leading-relaxed transition-colors duration-300 lg:text-[15px] xl:text-base ${
              isOpen
                ? "text-[#5530FA]"
                : "text-[#3C3C3C] group-hover:text-[#5530FA]"
            }`}
          >
            {faq.question}
          </span>

          <ChevronDown
            aria-hidden="true"
            strokeWidth={1.8}
            className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-[#5530FA]"
                : "text-[#6C6C6C] group-hover:text-[#5530FA]"
            }`}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[800px] pb-5 pr-10 font-poppins text-sm font-normal leading-relaxed text-[#6C6C6C] md:pb-6 lg:text-[15px] xl:text-base">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0].id);

  const getNavbarHeight = useCallback(() => {
    if (typeof window === "undefined") return 80;

    const screenWidth = window.innerWidth;

    if (screenWidth < 768) return 80;
    if (screenWidth < 1024) return 100;

    return 120;
  }, []);

  const scrollToGetInTouch = useCallback(() => {
    const getInTouchSection =
      document.querySelector("form") ||
      document.querySelector('[data-section="get-in-touch"]');

    if (!getInTouchSection) return;

    const elementRect = getInTouchSection.getBoundingClientRect();
    const elementTop = elementRect.top + window.pageYOffset;
    const navbarHeight = getNavbarHeight();
    const viewportHeight = window.innerHeight;
    const elementHeight = elementRect.height;
    const centerOffset = (viewportHeight - elementHeight) / 2;
    const scrollToPosition = elementTop - navbarHeight - centerOffset;

    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });
  }, [getNavbarHeight]);

  const toggleFaq = useCallback((faqId: string) => {
    setOpenFaqId((currentId) => (currentId === faqId ? null : faqId));
  }, []);

  return (
    <section
      className="mt-20 mb-20 w-full px-4 py-6 sm:px-8 md:mt-32 md:mb-32 md:px-16 md:py-12 lg:px-24 xl:mt-30 xl:mb-40 xl:px-[133px] 2xl:px-[180px]"
      aria-labelledby="faq-title"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-[150px]">
          <h2
            id="faq-title"
            className="inline-block w-fit bg-gradient-to-r from-[#5530FA] to-[#F51DA5] bg-clip-text font-poppins text-2xl font-normal text-transparent lg:text-[26px] xl:text-3xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-3 max-w-[480px] font-poppins text-[13px] font-normal leading-relaxed text-[#6C6C6C] sm:text-sm md:text-[15px]">
            These answers help visitors understand what to send before
            contacting Protonest about an IoT product, prototype, embedded
            system, or connected device requirement.
          </p>

          <button
            type="button"
            onClick={scrollToGetInTouch}
            className="mt-6 cursor-pointer font-poppins text-base font-normal text-[rgba(108,108,108,1)] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] hover:bg-clip-text hover:text-transparent xl:text-[18px]"
            aria-label="Navigate to contact form"
          >
            <span className="underline hover:underline-offset-0">
              Still Have Questions?
            </span>{" "}
            <span className="underline-offset-0">&gt;</span>
          </button>
        </div>

        <div className="w-full border-t border-[#E5E5E5]">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => toggleFaq(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
