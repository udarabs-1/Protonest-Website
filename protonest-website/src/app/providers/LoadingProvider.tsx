// providers/LoadingProvider.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    registerComponent: () => void;
    markComponentLoaded: () => void;
    loadingProgress: number;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [componentsLoaded, setComponentsLoaded] = useState(0);
    const [totalComponents, setTotalComponents] = useState(0);

    const registerComponent = () => {
        setTotalComponents(prev => prev + 1);
    };

    const markComponentLoaded = () => {
        setComponentsLoaded(prev => {
            const newCount = prev + 1;
            return newCount;
        });
    };

    // Calculate loading progress
    const loadingProgress = totalComponents > 0 ? (componentsLoaded / totalComponents) * 100 : 0;

    // Auto-hide loading when all components are loaded
    useEffect(() => {
        if (totalComponents > 0 && componentsLoaded >= totalComponents) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [componentsLoaded, totalComponents]);

    // Initial loading timeout fallback
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // Max 5 seconds loading time

        return () => clearTimeout(fallbackTimer);
    }, []);

    const value = {
        isLoading,
        setIsLoading,
        registerComponent,
        markComponentLoaded,
        loadingProgress
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

// Hook for component-level loading
export const useComponentLoading = (delay: number = 0) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { markComponentLoaded, registerComponent } = useLoading();

    useEffect(() => {
        registerComponent();

        const timer = setTimeout(() => {
            setIsLoaded(true);
            markComponentLoaded();
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, markComponentLoaded, registerComponent]);

    return isLoaded;
};