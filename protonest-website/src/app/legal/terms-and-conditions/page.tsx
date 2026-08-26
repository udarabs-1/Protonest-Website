'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TermsAndConditionsPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white py-8">
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-[#6c6c6c] hover:text-gray-800 transition-colors duration-200 group"
              aria-label="Go back to previous page"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-lg font-normal font-['Poppins']">Back</span>
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium font-['Montserrat'] text-[#6c6c6c] leading-tight">
              Terms and Conditions
            </h1>
          </div>

          <div className="mb-2">
            <h2 className="inline-block text-base sm:text-lg font-normal font-['Poppins'] text-transparent bg-clip-text bg-gradient-to-r from-[#F51DA5] to-[#5530FA]">
              Agreement to Terms
            </h2>
          </div>

          <div className="space-y-6">

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  By accessing and using the Protonest website (
                  <a href="https://protonest.co" className="underline hover:text-gray-800 transition-colors">
                    https://protonest.co
                  </a>
                  ) and services, you agree to comply with these Terms and Conditions and our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                2. Services Offered
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Protonest Pvt Ltd provides IoT prototyping services, including hardware/software design, consulting, and related resources.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                3. Eligibility
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Users must be at least 18 years old or have consent from a legal guardian. Business clients are required to provide valid registration details during onboarding.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                4. Account Registration
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  To access certain services, you may need to create an account by providing accurate personal or business information. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                5. Use of Services
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>You agree to use our services lawfully and refrain from:</p>
                <div className="pl-4 space-y-1">
                  <p>• Engaging in unauthorized or harmful activities</p>
                  <p>• Violating any applicable laws or regulations</p>
                  <p>• Infringing upon the rights of others</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                6. Intellectual Property
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  All content on our site, including text, graphics, and logos, is the property of Protonest or its licensors and is protected by intellectual property laws. Unauthorized use is prohibited.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                7. User-Generated Content
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  By submitting content to our site, you grant Protonest a non-exclusive, royalty-free license to use, reproduce, and distribute such content. You affirm that you have the rights to share this content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                8. Marketing and Testimonials
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We may use your company name and logo for promotional purposes. If you prefer to opt-out, please contact us at{' '}
                  <a href="mailto:info@protonest.co" className="underline hover:text-gray-800 transition-colors">
                    info@protonest.co
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                9. Data Protection and Confidentiality
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We are committed to protecting your data. All personal and business information will be handled in accordance with our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                10. Third-Party Links
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Our website may contain links to third-party sites. We are not responsible for the content or practices of these external sites.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                11. Shipping and Returns
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Products are shipped in compliance with Sri Lankan regulations. Risk of loss transfers upon delivery. Return requests are evaluated on a case-by-case basis due to the specialized nature of our products.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                12. Disclaimer of Warranties
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Services and materials are provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy or completeness of content or services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                13. Limitation of Liability
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  Protonest is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Your sole remedy is to discontinue use.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                14. Changes to Terms
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We may update these Terms periodically. Continued use of our services after changes indicates acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                15. Governing Law
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  These terms are governed by the laws of Sri Lanka. Disputes will be resolved in Sri Lankan courts.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                16. Termination
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We reserve the right to suspend or terminate accounts that violate these terms. Users are responsible for any obligations incurred prior to termination.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                17. Contact Us
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  For questions or concerns, please reach out to us at{' '}
                  <a href="mailto:info@protonest.co" className="underline hover:text-gray-800 transition-colors">
                    info@protonest.co
                  </a>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;