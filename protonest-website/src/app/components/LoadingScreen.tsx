// components/LoadingScreen.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '../providers/LoadingProvider';
import BlinkingLogo from './BlinkingLogo';

interface LoadingScreenProps {
    logoSrc: string;
    alt?: string;
}

const LoadingScreen = ({ logoSrc, alt }: LoadingScreenProps) => {
    const { isLoading, setIsLoading } = useLoading();
    const [showLogo, setShowLogo] = useState(true);

    // Handle page load completion
    useEffect(() => {
        // Check if document is fully loaded
        const checkLoading = () => {
            if (document.readyState === 'complete') {
                // Add a small delay to ensure all components are rendered
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        // Check immediately
        checkLoading();

        // Listen for load events
        window.addEventListener('load', checkLoading);
        document.addEventListener('readystatechange', checkLoading);

        return () => {
            window.removeEventListener('load', checkLoading);
            document.removeEventListener('readystatechange', checkLoading);
        };
    }, [setIsLoading]);

    const handleLoadingComplete = () => {
        setShowLogo(false);
    };

    if (!isLoading && !showLogo) return null;

    return (
        <BlinkingLogo
            logoSrc={logoSrc}
            alt={alt}
            onLoadingComplete={handleLoadingComplete}
            minDisplayTime={1500}
        />
    );
};

export default LoadingScreen;