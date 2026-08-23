"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MEETING_URL =
  "https://meetings-na2.hubspot.com/udara-kumarasena?embed=true";

export default function BookACallPage() {
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = meetingContainerRef.current;
    if (!container) return;

    const meetingScriptId = "hubspot-meeting-script";
    const existingScript = document.getElementById(meetingScriptId);
    existingScript?.remove();

    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe")) {
        setIsLoading(false);
        setHasError(false);
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    const meetingScript = document.createElement("script");
    meetingScript.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    meetingScript.id = meetingScriptId;
    meetingScript.async = true;
    meetingScript.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    document.body.appendChild(meetingScript);

    return () => {
      observer.disconnect();
      meetingScript.remove();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#5530FA]/5 via-white to-[#F51DA5]/5 px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-28 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#5530FA]/15 to-[#F51DA5]/10 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 h-[350px] w-[350px] rounded-full bg-gradient-to-tl from-[#F51DA5]/15 to-[#6C9AE1]/10 blur-[80px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <section className="overflow-hidden rounded-[28px] bg-white px-4 py-6 shadow-2xl shadow-gray-200/60 sm:rounded-[32px] sm:px-8 sm:py-8 lg:px-10">
          <header className="border-b border-gray-200 pb-5 text-center lg:flex lg:items-center lg:pb-7 lg:text-left">
            <div className="lg:flex lg:w-52 lg:flex-none lg:justify-center lg:pr-10">
              <Link
                href="/"
                className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5530FA]"
                aria-label="Go to the Protonest home page"
              >
                <Image
                  src="/logo.webp"
                  alt="Protonest"
                  width={112}
                  height={80}
                  priority
                  className="h-auto w-24 object-contain lg:w-28"
                />
              </Link>
            </div>

            <div className="mt-4 lg:mt-0 lg:min-h-24 lg:flex-1 lg:border-l lg:border-gray-200 lg:pl-10 lg:flex lg:flex-col lg:justify-center">
              <h1 className="font-montserrat text-2xl font-medium leading-tight sm:text-3xl">
                <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                  Book your call
                </span>
              </h1>
              <p className="mx-auto mt-2 max-w-xl font-poppins text-sm leading-relaxed text-gray-500 lg:mx-0">
                Choose a convenient time to discuss your idea with our team.
              </p>
            </div>
          </header>

          <div className="relative mt-6 min-h-[650px] sm:mt-8">
            {isLoading && (
              <div
                className="absolute inset-x-0 top-0 z-10 space-y-4 bg-white"
                aria-live="polite"
                aria-busy="true"
              >
                <p className="text-center font-poppins text-sm text-gray-400">
                  Loading available times…
                </p>
                <div className="h-14 animate-pulse rounded-xl bg-gray-100" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                  <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            )}

            {hasError && (
              <div role="alert" className="py-20 text-center">
                <h2 className="font-montserrat text-lg font-semibold text-gray-700">
                  The booking calendar could not be loaded.
                </h2>
                <p className="mt-2 font-poppins text-sm text-gray-500">
                  You can still open the calendar directly to choose a time.
                </p>
                <a
                  href={MEETING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#5530FA] to-[#F51DA5] px-7 font-poppins text-sm font-semibold text-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5530FA]"
                >
                  Open booking calendar
                </a>
              </div>
            )}

            <div
              ref={meetingContainerRef}
              className={`meetings-iframe-container w-full transition-opacity duration-300 ${
                isLoading || hasError ? "opacity-0" : "opacity-100"
              }`}
              data-src={MEETING_URL}
              aria-label="Protonest call booking calendar"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
