import { RefObject, useEffect, useState } from 'react';

export const useOnScreen = (ref: RefObject<HTMLDivElement | null>) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '-50px' // Trigger 50px before the element comes into view
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