"use client";

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PrivacyPolicyPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white py-8">
        {/* Container with responsive max-width */}
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">

          {/* Back Button */}
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

          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium font-['Montserrat'] text-[#6c6c6c] leading-tight">
              Privacy Policy
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6">

            {/* Introduction */}
            <section>
              <h2 className="text-xl sm:text-2xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                Introduction
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>
                  This Privacy Policy (&quot;Policy&quot;) explains how Protonest Pvt Ltd (&quot;Protonest&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, discloses, and safeguards your information when you visit our website{' '}
                  <a href="https://protonest.co" className="underline hover:text-gray-800 transition-colors">
                    https://protonest.co
                  </a>{' '}
                  (the &quot;Site&quot;).
                </p>
                <p>
                  By accessing or using the Site, you agree to the practices described in this Policy. If you do not agree, please refrain from using the site.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                1. Information We Collect
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>
                  You may use most of the site without submitting personal information. However, we may collect the following categories of data:
                </p>
                <div className="pl-4 space-y-2">
                  <p><strong>Account Information:</strong> Name, email address, password, and other registration details when you create an account.</p>
                  <p><strong>Order and Payment Information:</strong> Name, billing and shipping addresses, and payment method details (handled securely via third-party payment processors).</p>
                  <p><strong>Technical and Usage Data:</strong> IP address, browser type, operating system, device information, and Site usage data, collected through cookies and other tracking technologies.</p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                2. How We Use Your Information
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>We use your information to:</p>
                <div className="pl-4 space-y-1">
                  <p>• Process transactions and fulfill orders</p>
                  <p>• Deliver customer support and respond to inquiries</p>
                  <p>• Improve, personalize, and optimize your user experience</p>
                  <p>• Send transactional and promotional communications (you can opt out of marketing emails)</p>
                  <p>• Detect and prevent fraudulent activities or security issues</p>
                  <p>• Comply with legal obligations</p>
                </div>
                <p>
                  We process your personal data based on your consent, to fulfill a contract, or where we have a legitimate interest in doing so.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                3. Cookies and Tracking Technologies
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>
                  We use cookies and similar tracking technologies to enhance functionality, analyze performance, and personalize content. You can control the use of cookies through your browser settings.
                </p>
                <p>
                  A more detailed cookie policy will be provided soon. By continuing to use the Site, you consent to our use of cookies.
                </p>
              </div>
            </section>

            {/* Sharing Your Information */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                4. Sharing Your Information
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>
                  We do not sell or rent your personal data. We only share it when necessary with trusted third parties such as:
                </p>
                <div className="pl-4 space-y-1">
                  <p>• Payment processors (e.g., for secure transactions)</p>
                  <p>• Shipping and logistics partners</p>
                  <p>• Customer service tools and analytics providers</p>
                  <p>• Government agencies (only if required by law)</p>
                </div>
                <p>
                  All such partners are obligated to use your information only for the intended service and in compliance with applicable laws.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                5. Data Security
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We use industry-standard security measures, including encryption, to protect your personal data. However, no system is entirely secure. We encourage you to use strong passwords and to keep your credentials confidential.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                6. Data Retention
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy or as required by law. Once data is no longer needed, it will be securely deleted.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                7. Your Rights
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-4">
                <p>You have the right to:</p>
                <div className="pl-4 space-y-1">
                  <p>• Access the personal information we hold about you</p>
                  <p>• Request correction of inaccurate or incomplete data</p>
                  <p>• Request deletion of your personal data (subject to limitations)</p>
                  <p>• Withdraw consent at any time where processing is based on consent</p>
                  <p>• Object to certain types of data processing</p>
                </div>
                <p>
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:info@protonest.co" className="underline hover:text-gray-800 transition-colors">
                    info@protonest.co
                  </a>.
                </p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                8. Changes to This Policy
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed">
                <p>
                  We may update this Policy periodically. We will notify you by updating the &quot;Last Updated&quot; date at the top of this page. Continued use of the Site after any changes signifies your acceptance of the revised Policy.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-lg sm:text-xl font-medium font-['Poppins'] text-[#6c6c6c] mb-4">
                Contact Us
              </h2>
              <div className="text-sm sm:text-base font-normal font-['Poppins'] text-[#6c6c6c] leading-relaxed space-y-2">
                <p>
                  If you have any questions about this Privacy Policy or how your data is handled, please contact us at:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-4">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <span>Email: </span>
                    <a href="mailto:info@protonest.co" className="underline hover:text-gray-800 transition-colors ml-1">
                      info@protonest.co
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🏢</span>
                    <span>Company: Protonest Pvt Ltd</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>Website: </span>
                    <a href="https://protonest.co" className="underline hover:text-gray-800 transition-colors ml-1">
                      https://protonest.co
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default PrivacyPolicyPage;