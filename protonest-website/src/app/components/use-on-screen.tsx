import { RefObject, useEffect, useState } from 'react';

export const useOnScreen = (ref: RefObject<HTMLDivElement | null>) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            {
                threshold: 0.1,
                rootMargin: '-50px'
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref]);

    return isIntersecting;
};