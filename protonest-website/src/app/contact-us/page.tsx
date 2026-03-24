"use client";
import { Icon } from '@iconify/react';
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import FAQSection from "../components/faq";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import PageHero from "../components/page-hero";

export default function Contact() {
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const formScriptId = 'hubspot-form-script';
    const meetingScriptId = 'hubspot-meeting-script';

    // We generate a strict runtime ID to defend against React Strict Mode race conditions
    const currentUniqueId = 'hubspot-form-' + Math.random().toString(36).substring(2, 9);

    if (formContainerRef.current) {
      formContainerRef.current.id = currentUniqueId;
      formContainerRef.current.innerHTML = ''; // clear any ghost elements
    }

    const renderForm = () => {
      let retryCount = 0;
      const initForm = () => {
        if (!isMounted) return; // Prevent creating if unmounted before script executed

        if (typeof window !== 'undefined' && (window as any).hbspt && (window as any).hbspt.forms) {
          (window as any).hbspt.forms.create({
            region: "na2",
            portalId: "245081948",
            formId: "629656dd-95fd-43c1-99b1-32fd914a3323",
            target: `#${currentUniqueId}`
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
      const formScript = document.createElement('script');
      formScript.src = 'https://js-na2.hsforms.net/forms/v2.js'; // MUST use v2 API to support hbspt.forms.create
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

    const meetingScript = document.createElement('script');
    meetingScript.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
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
        <meta name="keywords" content="IoT prototyping contact, Protonest email, IoT development consultation, hardware prototyping consultation" />


        <link rel="canonical" href="https://protonest.co/contact-us" />


        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/contact-us" />
        <meta property="og:title" content="Contact Us - Protonest" />
        <meta property="og:description" content="Get in touch with our IoT engineering team for prototyping services and project consultations." />


        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Protonest",
            "description": "IoT prototyping consultation and inquiry form",
            "url": "https://protonest.co/contact-us",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+94 771 482 755",
              "email": "info@protonest.co",
              "contactType": "customer service",
              "areaServed": "Global",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kaduwela",
              "addressLocality": "Colombo",
              "addressCountry": "Sri Lanka"
            }
          })}
        </script>
      </Head>
      <Navbar />
      <div>

        <PageHero
          backgroundImage="/contact-1.webp"
          heading={{
            beforeGradient: "Let's Build the Future of IoT",
            gradientText: "Together!"
          }}
          height="h-[350px] sm:h-[420px] md:h-[400px]"
        />


        <div id="get-in-touch" className="relative w-full scroll-mt-[100px]">
          <div className="relative z-20 px-4 sm:px-8 md:px-12 lg:px-[90px] xl:px-[157px] 2xl:px-[180px]">

            <div className="w-full text-center px-4 mb-16">
              <span className="text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                Get in Touch
              </span>
            </div>


            <div className="flex flex-col gap-16 lg:gap-20 items-center max-w-[800px] mx-auto w-full">
              {/* Contact Form Container (Top) */}
              <div className="w-full min-h-[550px] flex items-start justify-center">
                <div ref={formContainerRef} className="w-full"></div>
              </div>

              {/* Meeting Scheduler Container (Bottom) */}
              <div id="book-a-call" className="w-full min-h-[550px] flex items-start justify-center scroll-mt-[65px] lg:scroll-mt-[80px]">
                <div className="w-full meetings-iframe-container" data-src="https://meetings-na2.hubspot.com/udara-kumarasena?embed=true"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto h-auto mt-4 md:mt-8 pt-8">

          <div className="absolute inset-0 top-[40px] sm:top-[45px] md:top-[51px] lg:top-[57px] h-[400px] sm:h-[450px] md:h-[520px] lg:h-[585px] overflow-hidden">
            <div className="hidden md:block max-w-[1440px] mr-auto h-full">
              <Image
                src="/contact-3.svg"
                alt="Contact cards background"
                fill
                priority={false}
                quality={65}
                sizes="(min-width: 768px) 100vw, 0px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="w-full h-full"
              />
            </div>
          </div>


          <div className="relative z-10 w-full text-center px-4 mb-[60px] sm:mb-[70px] md:mb-[80px] lg:mb-[90px]">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[38px] md:leading-[48px] lg:leading-[55px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Reach Us </span>
              <span className="text-[#6c6c6c]">Directly</span>
            </h2>
          </div>


          <div className="relative z-10 flex flex-col sm:flex-col md:flex-row justify-center items-center gap-6 sm:gap-6 md:gap-8 lg:gap-[67px] px-4 sm:px-8 md:px-12 lg:px-[160px]">

            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
                  <Icon
                    icon="solar:map-point-wave-bold"
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
                  />
                </div>
              </div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm lg:text-base font-normal font-poppins">
                Location
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[190px] sm:top-[200px] md:top-[240px] lg:top-[280px] text-center text-[#6c6c6c] text-[14px] xl:text-[20px] font-medium font-poppins px-2">
                Kaduwela, Colombo,<br />Sri Lanka
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>


            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
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


            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
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