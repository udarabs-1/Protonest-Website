"use client";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
    name: "Oliver Ashbee",
    company: "entryphone, UK",
    text: "I've worked with Protonest on a development project and have been really impressed by their technical ability, clear communication, and professional approach. Everything has been handled carefully and to a high standard.",
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

export default function Contact() {
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const formScriptId = "hubspot-form-script";
    const meetingScriptId = "hubspot-meeting-script";

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

    // Load Meeting Scheduler Script
    // First remove any old instances so it correctly re-scans the DOM on load
    const existingMeetingScript = document.getElementById(meetingScriptId);
    if (existingMeetingScript) existingMeetingScript.remove();

    const meetingScript = document.createElement("script");
    meetingScript.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    meetingScript.id = meetingScriptId;
    meetingScript.async = true;
    document.body.appendChild(meetingScript);

    return () => {
      isMounted = false; // Cleanup flag to stop stray background execution
      if (document.getElementById(meetingScriptId)) {
        document.getElementById(meetingScriptId)?.remove();
      }
      // Leave the form script globally loaded, but DOM cleanup happens naturally by React
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Contact Us - Protonest</title>
        <meta
          name="description"
          content="Contact Protonest's IoT prototyping team for project inquiries, consultations, or partnership opportunities. Book a Call to get started."
        />
        <meta
          name="keywords"
          content="IoT prototyping contact, Protonest email, IoT development consultation, hardware prototyping consultation"
        />

        <link rel="canonical" href="https://protonest.co/contact-us" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/contact-us" />
        <meta property="og:title" content="Contact Us - Protonest" />
        <meta
          property="og:description"
          content="Get in touch with our IoT engineering team for prototyping services and project consultations."
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Protonest",
            description: "IoT prototyping consultation and inquiry form",
            url: "https://protonest.co/contact-us",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+94 771 482 755",
              email: "info@protonest.co",
              contactType: "customer service",
              areaServed: "Global",
              availableLanguage: "English",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "392 Horana Rd, Pannipitiya 10132",
              addressLocality: "Colombo",
              addressCountry: "Sri Lanka",
            },
          })}
        </script>
      </Head>
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
                  <SectionHeader
                    prefix="What Our Clients"
                    highlight="Say"
                    align="left"
                  />

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

        <div
          id="book-a-call"
          className="relative w-full scroll-mt-[65px] lg:scroll-mt-[80px] px-4 sm:px-8 md:px-12 lg:px-[90px] xl:px-[157px] 2xl:px-[180px] pt-10 md:pt-14 lg:pt-16"
        >
          <div className="w-full min-h-[550px] flex items-start justify-center">
            <div
              className="w-full meetings-iframe-container"
              data-src="https://meetings-na2.hubspot.com/udara-kumarasena?embed=true"
            ></div>
          </div>
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto h-auto mt-4 md:mt-8 pt-8">
          <div className="absolute inset-0 top-[40px] sm:top-[45px] md:top-[51px] lg:top-[57px] h-[400px] sm:h-[450px] md:h-[780px] lg:h-[780px] xl:h-[780px] 2xl:h-[585px] overflow-hidden">
            <div className="hidden md:block max-w-[1440px] mr-auto h-full">
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
              Contact Protonest by phone or email, or write to us at our
              address. Use the contact form for project inquiries and technical
              requirements.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-items-center items-stretch gap-6 sm:gap-8 px-4 sm:px-8 md:px-12 lg:px-[60px] xl:px-[80px] 2xl:px-[40px]">
            <div className="w-full max-w-[320px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
                  <Icon
                    icon="solar:map-point-wave-bold"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
                  />
                </div>
              </div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm lg:text-base font-normal font-poppins">
                Headquarters
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[190px] sm:top-[200px] md:top-[240px] lg:top-[280px] text-center text-[#6c6c6c] text-[14px] xl:text-[20px] font-medium font-poppins px-2">
                Kaduwela, Colombo,
                <br />
                Sri Lanka
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>

            <div className="w-full max-w-[320px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
                  <Icon
                    icon="solar:buildings-2-bold"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
                  />
                </div>
              </div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm lg:text-base font-normal font-poppins">
                Office
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[190px] sm:top-[200px] md:top-[240px] lg:top-[280px] text-center text-[#6c6c6c] text-[14px] xl:text-[20px] font-medium font-poppins px-2">
                392 Horana Rd,
                <br />
                Pannipitiya 10132
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>

            <div className="w-full max-w-[320px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
                  <Icon
                    icon="solar:phone-calling-bold"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
                  />
                </div>
              </div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm lg:text-base font-normal font-poppins">
                Phone
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[200px] sm:top-[210px] md:top-[250px] lg:top-[289px] text-center text-[#6c6c6c] text-[14px] xl:text-xl font-medium font-poppins">
                +94 771 482 755
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>

            <div className="w-full max-w-[320px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
                  <Icon
                    icon="solar:letter-bold"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
                  />
                </div>
              </div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm lg:text-base font-normal font-poppins">
                Email
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[200px] sm:top-[210px] md:top-[250px] lg:top-[289px] text-center text-[#6c6c6c] text-[14px] xl:text-xl font-medium font-poppins px-2">
                info@protonest.co
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>
          </div>
        </div>

        <FAQSection />
      </div>
      <Footer />
    </div>
  );
}
