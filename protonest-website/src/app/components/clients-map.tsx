"use client";

import dynamic from "next/dynamic";

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
        <div className="w-full bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-medium font-montserrat leading-tight">
                        <span className="text-[#6c6c6c]">Serving Across </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            Borders
                        </span>
                    </h2>
                </div>
                <WorldMap dots={dots} lineColor="#5530FA" />
            </div>
        </div>
    );
}
