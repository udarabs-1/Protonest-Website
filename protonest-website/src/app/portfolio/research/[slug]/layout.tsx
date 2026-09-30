import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const extractDescription = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `https://protonest.co/portfolio/research/${slug}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/research/${slug}`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const result = await response.json();
      const research = result.data;
      const title = `${research.title} | Protonest`;
      const description = extractDescription(research.content || "");

      return {
        title,
        description,
        authors: research.author ? [{ name: research.author }] : undefined,
        alternates: { canonical },
        openGraph: {
          type: "article",
          url: canonical,
          title,
          description,
          images: research.cover_image ? [research.cover_image] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching research metadata:", error);
  }

  return {
    title: "Research | Protonest",
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default function ResearchLayout({ children }: Props) {
  return children;
}