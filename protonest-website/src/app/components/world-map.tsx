"use client";

import DottedMap from "dotted-map";
import { motion } from "motion/react";
import { useId, useRef } from "react";

interface MapProps {
    dots?: Array<{
        start: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
        end: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
    }>;
    lineColor?: string;
}

const EMOJI_FALLBACKS: Record<string, string> = {
    "🇱🇰": "LK", "🇬🇧": "GB", "🇩🇪": "DE", "🇫🇷": "FR",
    "🇮🇹": "IT", "🇺🇸": "US", "🇦🇪": "AE",
};

export default function WorldMap({
    dots = [],
    lineColor = "#5530FA",
}: MapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const uid = useId().replace(/:/g, "-");
    const lineGradientId = `line-gradient-${uid}`;
    const dotGradientId = `dot-gradient-${uid}`;
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const svgMap = map.getSVG({
        radius: 0.22,
        color: "#C4B5FD",
        shape: "circle",
        backgroundColor: "white",
    });

    const projectPoint = (lat: number, lng: number) => {
        const point = map.getPin({ lat, lng });
        if (!point) return { x: 0, y: 0 };
        return {
            x: (point.x / 198) * 800,
            y: (point.y / 100) * 400
        };
    };

    const createCurvedPath = (
        start: { x: number; y: number },
        end: { x: number; y: number }
    ) => {
        const midX = (start.x + end.x) / 2;
        const midY = Math.min(start.y, end.y) - 50;
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    const renderLabel = (
        dot: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" }
    ) => {
        if (!dot.label) return null;
        const point = projectPoint(dot.lat, dot.lng);
        const position = dot.labelPosition || "top";

        let cx = point.x;
        let cy = point.y;
        const circleR = 14;

        switch (position) {
            case "top":
                cy -= circleR + 10;
                break;
            case "bottom":
                cy += circleR + 10;
                break;
            case "left":
                cx -= circleR + 14;
                break;
            case "right":
                cx += circleR + 14;
                break;
        }

        const fallback = EMOJI_FALLBACKS[dot.label] ?? "un"; // 'un' is a safe fallback (UN flag) or you can default to 'us'
        const flagW = 16;
        const flagH = 12;

        return (
            <g key={`label-${dot.lat}-${dot.lng}`}>
                {/* Background circle */}
                <circle cx={cx} cy={cy} r={circleR} fill="#ffffff" />
                
                {/* Render the fully visible, uncropped flag image */}
                <image
                    href={`https://flagcdn.com/${fallback.toLowerCase()}.svg`}
                    x={cx - flagW / 2}
                    y={cy - flagH / 2}
                    width={flagW}
                    height={flagH}
                    preserveAspectRatio="xMidYMid meet"
                />
                
                {/* Border outline so it looks clean */}
                <circle cx={cx} cy={cy} r={circleR} fill="none" stroke="#C4B5FD" strokeWidth="1.5" />
            </g>
        );
    };

    return (
        <div className="w-full aspect-[2/1] bg-white rounded-lg relative font-sans overflow-hidden">
            <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
                className="h-full w-full pointer-events-none select-none relative z-0"
                alt="world map"
                height="495"
                width="1056"
                draggable={false}
            />
            <svg
                ref={svgRef}
                viewBox="0 0 800 400"
                className="w-full h-full absolute inset-0 z-10 pointer-events-none select-none"
            >
                <defs>
                    <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5530FA" />
                        <stop offset="100%" stopColor="#F51DA5" />
                    </linearGradient>
                    <radialGradient id={dotGradientId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#F51DA5" />
                        <stop offset="100%" stopColor="#5530FA" />
                    </radialGradient>
                </defs>

                {dots.map((dot, i) => {
                    const startPoint = projectPoint(dot.start.lat, dot.start.lng);
                    const endPoint = projectPoint(dot.end.lat, dot.end.lng);
                    return (
                        <g key={`path-group-${i}`}>
                            <motion.path
                                d={createCurvedPath(startPoint, endPoint)}
                                fill="none"
                                stroke={`url(#${lineGradientId})`}
                                strokeOpacity="0.7"
                                strokeWidth="1.5"
                                strokeDasharray="4 2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.5 * i,
                                    ease: "easeOut",
                                }}
                                key={`path-${i}`}
                            />
                        </g>
                    );
                })}

                {dots.map((dot, i) => (
                    <g key={`points-group-${i}`}>
                        <g key={`start-${i}`}>
                            <circle
                                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                                r="4"
                                fill={`url(#${dotGradientId})`}
                            />
                            {renderLabel(dot.start)}
                            <circle
                                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                                r="4"
                                fill="#5530FA"
                                opacity="0.4"
                            >
                                <animate attributeName="r" from="4" to="14" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                            </circle>
                        </g>
                        <g key={`end-${i}`}>
                            <circle
                                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                                r="4"
                                fill={`url(#${dotGradientId})`}
                            />
                            {renderLabel(dot.end)}
                            <circle
                                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                                r="4"
                                fill="#F51DA5"
                                opacity="0.4"
                            >
                                <animate attributeName="r" from="4" to="14" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
}
