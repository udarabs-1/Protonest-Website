import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
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

    if (!blogData) {
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
                        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
                            Protonest
                        </div>
                        <div style={{ fontSize: 32 }}>
                            Blog
                        </div>
                    </div>
                </div>
            ),
            {
                ...size,
            }
        );
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const publishDate = blogData.published_at || blogData.created_at;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background: 'white',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(85, 48, 250, 0.05) 0%, rgba(245, 29, 165, 0.05) 50%, rgba(108, 154, 225, 0.05) 100%)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        padding: '60px 80px',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <div style={{ display: 'flex', marginBottom: 30 }}>
                            <img
                                src="https://protonest.co/logo.webp"
                                alt="Protonest"
                                width={200}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                background: 'linear-gradient(90deg, #5530FA 0%, #F51DA5 50%, #6C9AE1 100%)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                marginBottom: 30,
                                lineHeight: 1.3,
                            }}
                        >
                            {blogData.title}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: 40,
                                marginTop: 20,
                            }}
                        >
                            {publishDate && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 20, color: '#949494', marginBottom: 8, fontFamily: 'Poppins' }}>
                                        Published
                                    </div>
                                    <div style={{ fontSize: 28, color: '#6c6c6c', fontWeight: '600', fontFamily: 'Poppins' }}>
                                        {formatDate(publishDate)}
                                    </div>
                                </div>
                            )}

                            {blogData.categories && blogData.categories.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 20, color: '#949494', marginBottom: 8, fontFamily: 'Poppins' }}>
                                        Category
                                    </div>
                                    <div style={{ fontSize: 28, color: '#6c6c6c', fontWeight: '600', fontFamily: 'Poppins' }}>
                                        {blogData.categories[0]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 40,
                        }}
                    >
                        <div style={{ fontSize: 32, color: '#6c6c6c', fontWeight: '500', fontFamily: 'Poppins' }}>
                            Read more at protonest.co/blog
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
