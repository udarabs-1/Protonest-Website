'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

function PageViewTrackerComponent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

        if (!GA_MEASUREMENT_ID) {
            console.warn('GA_MEASUREMENT_ID not found')
            return
        }

        if (typeof window.gtag === 'undefined') {
            console.warn('gtag not loaded')
            return
        }

        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        })
    }, [pathname, searchParams])

    return null
}

// Wrap the component with Suspense
import { Suspense } from 'react'

export default function PageViewTracker() {
    return (
        <Suspense fallback={null}>
            <PageViewTrackerComponent />
        </Suspense>
    )
}