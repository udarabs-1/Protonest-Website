import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    let blogData = null;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs/${slug}`, {
            next: { revalidate: 3600 },
        });

        if (response.ok) {
            const data = await response.json();
            blogData = data.data;
        }
    } catch (error) {
        console.error('Error fetching blog data for OG image:', error);
    }

    if (!blogData || !blogData.cover_image) {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #5530FA 0%, #F51DA5 50%, #6C9AE1 100%)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        <div style={{ fontSize: 72, fontWeight: 'bold' }}>
                            Protonest
                        </div>
                    </div>
                </div>
            ),
            {
                ...size,
            }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                }}
            >
                <img
                    src={blogData.cover_image}
                    alt={blogData.title}
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
