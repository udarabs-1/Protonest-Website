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
  const canonical = `https://protonest.co/portfolio/project/${slug}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/projects/${slug}`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const result = await response.json();
      const project = result.data;
      const title = `${project.title} | Protonest`;
      const description = extractDescription(project.content || "");

      return {
        title,
        description,
        authors: project.author ? [{ name: project.author }] : undefined,
        alternates: { canonical },
        openGraph: {
          type: "article",
          url: canonical,
          title,
          description,
          images: project.cover_image ? [project.cover_image] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching project metadata:", error);
  }

  return {
    title: "Project | Protonest",
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default function ProjectLayout({ children }: Props) {
  return children;
}
