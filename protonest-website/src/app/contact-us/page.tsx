"use client";
import { Icon } from '@iconify/react';
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import FAQSection from "../components/faq";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import StatusModal from "../components/status-model";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowModal(true);
    setSubmitStatus('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        console.error('Error:', result.message || result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitStatus('');
  };

  return (
    <div>
      <Head>

        <title>Contact Us - Protonest</title>
        <meta
          name="description"
          content="Contact Protonest's IoT prototyping team for project inquiries, consultations, or partnership opportunities. Get a free quote within 48 hours."
        />
        <meta name="keywords" content="IoT prototyping contact, Protonest email, IoT development quote, hardware prototyping consultation" />


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

        <div className="relative">
          <div className="mt-10 sm:mt-0 h-[350px] sm:h-[420px] md:h-[480px] lg:h-[553px] relative">
            <Image
              src="/contact-1.webp"
              alt="Contact page hero background"
              fill
              priority={true}
              quality={100}
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="absolute inset-0"
            />


            <div className="block sm:hidden">

              <div className="absolute top-4 left-3 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center">
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 md:px-12 lg:px-[133px] 2xl:px-[180px] relative z-10">
              <div className="flex justify-center">
                <div className="px-14 md:px-0 text-center text-[24px] sm:text-[30px] md:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
                  <span className="text-[rgba(108,108,108,1)]">
                    Let&apos;s Build the Future of IoT
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                    Together!
                  </span>
                </div>
              </div>
              <div className="text-center text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal font-poppins mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-4 max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px]">
                <span className="text-[rgba(108,108,108,1)]">
                  Got an idea in mind? Let us know your idea, and we&apos;ll review it within 48 hours and get back to you with a detailed proposal
                </span>
              </div>
            </div>
          </div>


          <div className="absolute -bottom-4 sm:bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        </div>


        <div className="relative w-full min-h-screen sm:min-h-[1100px] 2xl:min-h-[1300px]">

          <div className="absolute inset-0 w-full h-full z-10 overflow-visible -mt-[500px] sm:-mt-[500px] md:-mt-[100px] lg:-mt-[110px] xl:-mt-[150px]">

            <div className="block md:hidden">
              <Image
                src="/contact-2-mobile.svg"
                alt="Contact form background mobile"
                fill
                priority={false}
                quality={65}
                sizes="(max-width: 768px) 100vw, 0px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            <div className="hidden md:block max-w-[1440px] ml-auto h-full">
              <Image
                src="/contact-2.webp"
                alt="Contact form background desktop"
                fill
                priority={false}
                quality={70}
                sizes="(min-width: 768px) 100vw, 0px"
                style={{ objectFit: 'cover', objectPosition: 'right' }}
              />
            </div>
          </div>


          <div className="relative z-20 pt-[120px] sm:pt-[140px] md:pt-[170px] lg:pt-[200px] px-4 sm:px-8 md:px-12 lg:px-[90px] xl:px-[157px] 2xl:px-[180px] pb-[60px] sm:pb-[70px] md:pb-[85px] lg:pb-[100px]">

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[40px] sm:top-[50px] md:top-[65px] lg:top-[80px] w-full max-w-[1127px] text-center px-4">
              <span className="text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                Get in Touch
              </span>
            </div>


            <form onSubmit={handleSubmit} className="max-w-[500px] sm:max-w-[600px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[770px] space-y-[30px] sm:space-y-[35px] md:space-y-[42px] lg:space-y-[50px]">

              <div>
                <label htmlFor="name" className="block text-[#6c6c6c] text-base xl:text-lg font-medium font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Name
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    className="w-full text-[#6c6c6c]/80 text-sm sm:text-sm xl:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none"
                    required
                  />
                </div>
              </div>


              <div>
                <label htmlFor="email" className="block text-[#6c6c6c] text-base xl:text-lg font-medium font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Email
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@company.com"
                    className="w-full text-[#6c6c6c]/80 text-sm sm:text-sm xl:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none"
                    required
                  />
                </div>
              </div>


              <div>
                <label htmlFor="message" className="block text-[#6c6c6c] text-base xl:text-lg font-medium font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Message
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about your project or question"
                    className="w-full text-[#6c6c6c]/80 text-sm xl:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none resize-none min-h-[80px] sm:min-h-[90px] md:min-h-[95px] lg:min-h-[100px]"
                    required
                  />
                </div>
              </div>


              <div className="inline-flex justify-start items-center mt-4 text-center w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[150px] lg:w-[180px] h-[45px] sm:h-[47px] md:h-[48px] lg:h-[50px] gradient-button font-medium font-poppins text-sm md:text-[15px] xl:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>


        <div className="relative w-full max-w-[1440px] mx-auto h-auto -mt-25 sm:-mt-80 md:-mt-60 lg:-mt-50 2xl:-mt-[250px] pb-[60px] lg:pb-0">

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


      <StatusModal
        showModal={showModal}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        onClose={closeModal}
      />
    </div>
  );
}