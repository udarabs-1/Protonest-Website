// components/BlinkingLogo.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BlinkingLogoProps {
    logoSrc: string;
    alt?: string;
    onLoadingComplete?: () => void;
    minDisplayTime?: number;
}

const BlinkingLogo = ({
    logoSrc,
    alt = "Loading...",
    onLoadingComplete,
    minDisplayTime = 2000
}: BlinkingLogoProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Ensure minimum display time for better UX
        const timer = setTimeout(() => {
            setFadeOut(true);

            // Allow fade out animation to complete
            setTimeout(() => {
                setIsVisible(false);
                onLoadingComplete?.();
            }, 500);
        }, minDisplayTime);

        return () => clearTimeout(timer);
    }, [minDisplayTime, onLoadingComplete]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="text-center">
                {/* Blinking Logo */}
                <div className="logo-pulse-scale mb-6">
                    <Image
                        src={logoSrc}
                        alt={alt}
                        width={200}
                        height={200}
                        className="mx-auto"
                        priority
                        unoptimized // Prevents Next.js optimization delay
                    />
                </div>
            </div>
        </div>
    );
};

export default BlinkingLogo;