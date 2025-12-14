import Link from "next/link";

type SectionHeaderProps = {
  prefix?: string;
  highlight: string;
  suffix?: string;
  description?: string;
  align?: "left" | "center";
  linkLabel?: string;
  linkHref?: string;
  linkExternal?: boolean;
};

export default function SectionHeader({
  prefix,
  highlight,
  suffix,
  description,
  align = "left",
  linkLabel,
  linkHref,
  linkExternal = false,
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      className={`w-full ${
        align === "center" ? "mb-12 lg:mb-16" : "mb-8 md:mb-12"
      }`}
    >
      <div className={`flex flex-col ${alignment} gap-4`}>
        <h2 className="text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat leading-tight">
          {prefix && (
            <span className="text-[rgba(108,108,108,1)]">{prefix} </span>
          )}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
            {highlight}
          </span>
          {suffix && (
            <span className="text-[rgba(108,108,108,1)]"> {suffix}</span>
          )}
        </h2>

        {(description || linkLabel) && (
          <div
            className={`flex w-full gap-4 ${
              align === "center"
                ? "flex-col items-center"
                : "flex-col md:flex-row justify-between items-start"
            }`}
          >
            {description && (
              <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] max-w-3xl">
                {description}
              </p>
            )}

            {linkLabel &&
              linkHref &&
              (linkExternal ? (
                <a
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] underline lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300"
                >
                  {linkLabel} &gt;
                </a>
              ) : (
                <Link
                  href={linkHref}
                  className="text-[14px] underline lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300"
                >
                  {linkLabel} &gt;
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
