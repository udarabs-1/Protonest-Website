import Link from "next/link";

type FinalCTAProps = {
  highlightedText?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export default function FinalCTA({
  highlightedText = "IoT Project",
  description =
    "Book a free call to discuss your product idea or technical challenge. We can help you review the scope, architecture, and next steps.",
  buttonLabel = "Book a Free Call",
  buttonHref = "/contact-us",
}: FinalCTAProps) {
  return (
    <section className="w-full px-4 py-16 sm:px-8 md:py-20 lg:px-[60px] lg:py-24 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-5xl rounded-[26px] bg-gradient-to-br from-[#5530FA]/12 via-[#F51DA5]/8 to-[#6C9AE1]/12 p-2 sm:p-3 lg:rounded-[34px] lg:p-4">
        <div className="relative overflow-hidden rounded-[22px] bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(85,48,250,0.07)] sm:px-10 sm:py-14 lg:rounded-[28px] lg:px-16 lg:py-16">
          <h2 className="mx-auto mb-4 max-w-3xl font-montserrat text-[24px] font-medium leading-tight lg:text-[30px] xl:text-[36px]">
            <span className="text-[#6C6C6C]">Let&#39;s Talk About Your </span>
            <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
              {highlightedText}
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl font-poppins text-[15px] font-normal leading-relaxed text-[#6C6C6C] lg:text-[18px]">
            {description}
          </p>

          <Link
            href={buttonHref}
            className="inline-flex h-[55px] w-[220px] items-center justify-center rounded-[57px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] font-poppins text-[15px] font-medium text-white transition-all duration-300 hover:from-[#F51DA5] hover:to-[#5530FA] hover:shadow-[0_10px_25px_rgba(85,48,250,0.18)] lg:h-[60px] lg:text-[16px]"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
