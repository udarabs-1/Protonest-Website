"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CONTACT_DETAILS } from "@/lib/contact-details";
import FAQSection from "../components/faq";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import SectionHeader from "../components/section-header";
import { TestimonialMarquee } from "../components/testimonials";

const contactTestimonials = [
  {
    name: "Sajjad Akhtar. MD",
    company: "SurgicalBooking.com",
    text: "Very knowledgeable and efficient team. Always available to answer questions and get the job done on time.",
    avatar: "/profile-1.svg",
  },
  {
    name: "Oliver Ashby",
    company: "Entryphone Company, UK",
    text: "The Protonest team is collaborative, flexible, and genuinely invested in our product and business goals. Communication has been excellent, the work consistently strong, and they have become a trusted partner in our development process.",
    avatar: "/profile-1.svg",
  },
  {
    name: "Charles Palmer",
    company: "Patriot Ingenuities, Inc",
    text: "Grade A company to work with. They were very responsive and I will definitely be using them again.",
    avatar: "/profile-1.svg",
  },
  {
    name: "Steven Gribben",
    company: "McCormack Energy, USA",
    text: "Terrific experience. Udara and his team worked to take our idea and make it better through thoughtful execution. Their unique blend of experience spans software, firmware, industrial design, and IoT integration.",
    avatar: "/profile-1.svg",
  },
];

const addressIcons = {
  us: "solar:global-bold",
  office: "solar:buildings-2-bold",
  hq: "solar:map-point-wave-bold",
} as const;

export default function Contact() {
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const formScriptId = "hubspot-form-script";

    // We generate a strict runtime ID to defend against React Strict Mode race conditions
    const currentUniqueId =
      "hubspot-form-" + Math.random().toString(36).substring(2, 9);

    if (formContainerRef.current) {
      formContainerRef.current.id = currentUniqueId;
      formContainerRef.current.innerHTML = ""; // clear any ghost elements
    }

    const renderForm = () => {
      let retryCount = 0;
      const initForm = () => {
        if (!isMounted) return; // Prevent creating if unmounted before script executed

        if (
          typeof window !== "undefined" &&
          (window as any).hbspt &&
          (window as any).hbspt.forms
        ) {
          (window as any).hbspt.forms.create({
            region: "na2",
            portalId: "245081948",
            formId: "629656dd-95fd-43c1-99b1-32fd914a3323",
            target: `#${currentUniqueId}`,
          });
        } else if (retryCount < 25) {
          retryCount++;
          setTimeout(initForm, 100); // Retry after 100ms if script hasn't finished loading
        }
      };

      initForm();
    };

    // Load Form Script if not already loaded, else just render the form
    if (!document.getElementById(formScriptId)) {
      const formScript = document.createElement("script");
      formScript.src = "https://js-na2.hsforms.net/forms/v2.js"; // MUST use v2 API to support hbspt.forms.create
      formScript.id = formScriptId;
      formScript.async = true;
      formScript.onload = renderForm;
      document.body.appendChild(formScript);
    } else {
      // If script is already loaded from another page visit, just render the form instantly
      renderForm();
    }

    return () => {
      isMounted = false; // Cleanup flag to stop stray background execution
      // Leave the form script globally loaded, but DOM cleanup happens naturally by React
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <section className="relative w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/contact-1.webp"
              alt="Contact Protonest about an IoT product development project"
              fill
              priority
              quality={100}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

          <div className="relative z-20 pt-20 pb-12 sm:pb-14 md:pb-16 lg:pb-20 px-4 sm:px-8 md:px-12 lg:px-[90px] xl:px-[157px] 2xl:px-[180px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-start">
              <div className="flex flex-col gap-5 md:gap-6 lg:gap-7">
                <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[40px] font-medium font-montserrat leading-[38px] sm:leading-[44px] lg:leading-[52px] xl:leading-[58px]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                    Let's Talk About Your{" "}
                  </span>
                  <span className="text-[#6c6c6c]">IoT Project</span>
                </h1>

                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-normal font-poppins text-[#6c6c6c] leading-relaxed">
                  Share your product idea, technical requirement, or project
                  scope.
                </p>

                <p className="text-[14px] md:text-[15px] font-normal font-poppins text-[#6c6c6c]/80 leading-relaxed">
                  Include details like the product goal, device type, current
                  stage, and timeline so we can understand your project quickly.
                  We aim to respond within 48 hours after receiving clear
                  project details.
                </p>

                <div className="mt-3">
                  <TestimonialMarquee testimonials={contactTestimonials} />
                </div>
              </div>

              <div
                id="get-in-touch"
                data-section="get-in-touch"
                className="scroll-mt-[100px] w-full bg-white rounded-[25px] md:rounded-[32px] shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border border-black/5 p-6 sm:p-8 lg:p-10"
              >
                <div ref={formContainerRef} className="w-full"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative w-full h-auto mt-4 md:mt-8 pt-8">
          <div className="pointer-events-none absolute inset-0 top-[40px] sm:top-[45px] md:top-[51px] lg:top-[57px] h-[400px] sm:h-[450px] md:h-[1100px] lg:h-[1100px] xl:h-[1050px] 2xl:h-[1000px] overflow-hidden">
            <div className="relative hidden md:block max-w-[1440px] mr-auto h-full">
              <Image
                src="/contact-3.svg"
                alt="Contact cards background"
                fill
                priority={false}
                quality={65}
                sizes="(min-width: 768px) 100vw, 0px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="relative z-10 w-full text-center px-4 mb-[60px] sm:mb-[70px] md:mb-[80px] lg:mb-[90px]">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[38px] md:leading-[48px] lg:leading-[55px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Reach Us{" "}
              </span>
              <span className="text-[#6c6c6c]">Directly</span>
            </h2>
            <p className="max-w-[720px] mx-auto mt-4 sm:mt-5 md:mt-6 text-[13px] sm:text-[14px] md:text-[15px] font-normal font-poppins text-[#6c6c6c] leading-relaxed">
              Contact Protonest by phone or email, or write to us at one of our
              addresses. Use the contact form for project inquiries and
              technical requirements.
            </p>
          </div>

          <section className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-[90px] xl:px-[157px] 2xl:px-[180px]">
            <div className="rounded-[32px] bg-gradient-to-br from-[#EEE9FF] via-[#F6F3FF] to-[#FFF0F8] p-3 sm:rounded-[36px] sm:p-4 lg:p-5">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
                <div className="rounded-[26px] border border-white bg-white p-6 sm:rounded-[30px] sm:p-8 lg:col-span-8 lg:p-10">
                  <div className="mb-8 flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-xs font-medium uppercase tracking-[0.14em] text-[#8A8A93]">
                        Locations
                      </p>

                      <h2 className="mt-1 font-montserrat text-xl font-semibold text-[#3F3F46] sm:text-2xl">
                        Our offices
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {CONTACT_DETAILS.addresses.map((address) => (
                      <article
                        key={address.id}
                        className="border-t border-[#ECECF1] py-6 first:border-t-0 first:pt-0 last:pb-0 md:border-l md:border-t-0 md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
                      >
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#5530FA] to-[#F51DA5] text-white">
                          <Icon
                            icon={addressIcons[address.id]}
                            className="h-5 w-5"
                          />
                        </div>

                        <h3 className="font-montserrat text-sm font-semibold text-[#44444B]">
                          {address.label}
                        </h3>

                        <address className="mt-3 not-italic font-poppins text-sm font-normal leading-6 text-[#74747D]">
                          {address.lines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </address>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-4 lg:grid-cols-1">
                  <a
                    href={CONTACT_DETAILS.phone.href}
                    className="group flex min-h-[170px] flex-col justify-between rounded-[26px] border border-white bg-white p-6 transition-colors hover:border-[#DCD4FF] sm:rounded-[30px] sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#5530FA] to-[#F51DA5] text-white">
                        <Icon
                          icon="solar:phone-calling-bold"
                          className="h-6 w-6"
                        />
                      </div>

                      <Icon
                        icon="solar:arrow-right-up-linear"
                        className="h-5 w-5 text-[#9898A1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#5530FA]"
                      />
                    </div>

                    <div className="mt-8">
                      <span className="block font-poppins text-sm font-medium text-[#74747D]">
                        Phone
                      </span>

                      <span className="mt-2 block font-montserrat text-base font-semibold text-[#3F3F46] sm:text-lg">
                        {CONTACT_DETAILS.phone.display}
                      </span>
                    </div>
                  </a>

                  <a
                    href={`mailto:${CONTACT_DETAILS.email}`}
                    className="group flex min-h-[170px] flex-col justify-between rounded-[26px] border border-white bg-white p-6 transition-colors hover:border-[#F2CBE4] sm:rounded-[30px] sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#5530FA] to-[#F51DA5] text-white">
                        <Icon icon="solar:letter-bold" className="h-6 w-6" />
                      </div>

                      <Icon
                        icon="solar:arrow-right-up-linear"
                        className="h-5 w-5 text-[#9898A1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F51DA5]"
                      />
                    </div>

                    <div className="mt-8 min-w-0">
                      <span className="block font-poppins text-sm font-medium text-[#74747D]">
                        Email
                      </span>

                      <span className="mt-2 block break-words font-montserrat text-base font-semibold text-[#3F3F46] sm:text-lg">
                        {CONTACT_DETAILS.email}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <FAQSection />
      </div>

      <Footer />
    </div>
  );
}
