"use client";

import dynamic from "next/dynamic";

// Dynamically import WorldMap so it only renders on client
const WorldMap = dynamic(() => import("./world-map"), {
    ssr: false,
});

export default function ClientsMap() {
    const dots = [
        {
            start: { lat: 6.9271, lng: 79.8612, label: "🇱🇰", labelPosition: "bottom" as const },
            end: { lat: 51.5072, lng: -0.1276, label: "🇬🇧", labelPosition: "top" as const },
        },
        {
            start: { lat: 6.9271, lng: 79.8612 },
            end: { lat: 52.5200, lng: 13.4050, label: "🇩🇪", labelPosition: "right" as const },
        },
        {
            start: { lat: 6.9271, lng: 79.8612 },
            end: { lat: 48.8566, lng: 2.3522, label: "🇫🇷", labelPosition: "bottom" as const },
        },
        {
            start: { lat: 6.9271, lng: 79.8612 },
            end: { lat: 41.9028, lng: 12.4964, label: "🇮🇹", labelPosition: "right" as const },
        },
        {
            start: { lat: 6.9271, lng: 79.8612 },
            end: { lat: 40.7128, lng: -74.0060, label: "🇺🇸", labelPosition: "top" as const },
        },
        {
            start: { lat: 6.9271, lng: 79.8612 },
            end: { lat: 25.2048, lng: 55.2708, label: "🇦🇪", labelPosition: "top" as const },
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20 bg-white">
            <div className="bg-white flex justify-center w-full">
                <WorldMap dots={dots} lineColor="#5530FA" />
            </div>
        </div>
    );
}
