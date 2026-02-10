import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Protonest Careers';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://protonest.co'}/careers.jpeg`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                }}
            >
                <img
                    src={imageUrl}
                    alt="Protonest Careers"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
