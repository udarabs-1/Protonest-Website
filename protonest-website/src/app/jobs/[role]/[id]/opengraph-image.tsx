import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Job Details';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { role: string; id: string } }) {
    const { id } = await params;

    let jobData = null;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/jobs/${id}`);

        if (response.ok) {
            const data = await response.json();
            jobData = data.data;
        }
    } catch (error) {
        console.error('Error fetching job data for OG image:', error);
    }

    if (!jobData) {
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
                            Job Opportunities
                        </div>
                    </div>
                </div>
            ),
            {
                ...size,
            }
        );
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    };

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
                                maxWidth: '100%',
                            }}
                        >
                            {jobData.title}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: 40,
                                marginTop: 20,
                            }}
                        >
                            {jobData.type && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 24, color: '#949494', marginBottom: 8, fontFamily: 'Poppins' }}>
                                        Job Type
                                    </div>
                                    <div style={{ fontSize: 32, color: '#6c6c6c', fontWeight: '600', textTransform: 'capitalize', fontFamily: 'Poppins' }}>
                                        {jobData.type.replace('-', ' ')}
                                    </div>
                                </div>
                            )}

                            {jobData.location && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 24, color: '#949494', marginBottom: 8, fontFamily: 'Poppins' }}>
                                        Location
                                    </div>
                                    <div style={{ fontSize: 32, color: '#6c6c6c', fontWeight: '600', fontFamily: 'Poppins' }}>
                                        {truncateText(jobData.location, 25)}
                                    </div>
                                </div>
                            )}

                            {jobData.experience && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 24, color: '#949494', marginBottom: 8, fontFamily: 'Poppins' }}>
                                        Experience
                                    </div>
                                    <div style={{ fontSize: 32, color: '#6c6c6c', fontWeight: '600', textTransform: 'capitalize', fontFamily: 'Poppins' }}>
                                        {jobData.experience}
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
                            Apply now at protonest.co/careers
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
