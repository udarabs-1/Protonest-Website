// components/PageViewTrackerWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

const PageViewTracker = dynamic(() => import('./PageViewTracker'), {
    ssr: false,
})

export default function PageViewTrackerWrapper() {
    return <PageViewTracker />
}
