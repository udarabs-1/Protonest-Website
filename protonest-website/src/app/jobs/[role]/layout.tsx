import { Metadata } from 'next';

type Props = {
    params: { role: string };
};

const roleTitles: { [key: string]: string } = {
    'front-end': 'Front-End',
    'back-end': 'Back-End',
    'full-stack': 'Full-Stack',
    electronics: 'Electronics',
    'ui-ux-designing': 'UI/UX',
    mechanical: 'Mechanical',
    'embedded-firmware': 'Embedded Firmware',
    'quality-assurance': 'Quality Assurance',
    'other-roles': 'Other Roles',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { role } = await params;
    const canonical = `https://protonest.co/jobs/${role}`;
    const roleTitle = roleTitles[role] || role.replace(/-/g, ' ');
    const title = `${roleTitle} Jobs - Protonest`;
    const description = `Browse ${roleTitle} job openings at Protonest and apply for the role that fits you.`;

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
export default function JobRoleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}