import { Metadata } from 'next';

type Props = {
    params: { role: string; id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { role, id } = await params;
    const canonical = `https://protonest.co/jobs/${role}/${id}`;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${id}`, {
            next: { revalidate: 3600 },
        });

        if (response.ok) {
            const data = await response.json();
            const job = data.data;

            const title = `${job.title} - Protonest`;
            const description = job.description
                ? job.description.substring(0, 160) + (job.description.length > 160 ? '...' : '')
                : `Apply for ${job.title} at Protonest. ${job.location ? `Location: ${job.location}` : ''} ${job.type ? `Type: ${job.type.replace('-', ' ')}` : ''}`;

            return {
                title,
                description,
                alternates: { canonical },
                openGraph: {
                    title,
                    description,
                    type: 'website',
                    siteName: 'Protonest',
                    locale: 'en_US',
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                },
            };
        }
    } catch (error) {
        console.error('Error fetching job data for metadata:', error);
    }

    return {
        title: 'Job Details - Protonest',
        description: 'Explore exciting career opportunities at Protonest',
        alternates: { canonical },
        openGraph: {
            title: 'Job Opportunities - Protonest',
            description: 'Explore exciting career opportunities at Protonest',
            type: 'website',
            siteName: 'Protonest',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Job Opportunities - Protonest',
            description: 'Explore exciting career opportunities at Protonest',
        },
    };
}

export { default } from './page';
