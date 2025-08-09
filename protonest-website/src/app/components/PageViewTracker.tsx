'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PageViewTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
        if (typeof window.gtag === 'undefined') return

        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
            page_path: url,
        })
    }, [pathname, searchParams])

    return null
}