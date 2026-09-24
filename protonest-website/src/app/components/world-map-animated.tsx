"use client";

import { motion } from "framer-motion";

const EMOJI_FALLBACKS: Record<string, string> = {
    "🇱🇰": "LK", "🇬🇧": "GB", "🇩🇪": "DE", "🇫🇷": "FR",
    "🇮🇹": "IT", "🇺🇸": "US", "🇦🇪": "AE",
};

interface AnimatedPath {
    d: string;
    delay: number;
}

interface AnimatedDot {
    cx: number;
    cy: number;
    label?: string;
    labelPosition?: "top" | "bottom" | "left" | "right";
    color: string;
}

interface WorldMapAnimatedProps {
    paths: AnimatedPath[];
    dots: AnimatedDot[];
    lineGradientId: string;
    dotGradientId: string;
}

function Label({
    cx,
    cy,
    label,
    labelPosition,
}: {
    cx: number;
    cy: number;
    label?: string;
    labelPosition?: "top" | "bottom" | "left" | "right";
}) {
    if (!label) return null;

    const position = labelPosition || "top";
    const circleR = 14;

    let lx = cx;
    let ly = cy;

    switch (position) {
        case "top":
            ly -= circleR + 10;
            break;
        case "bottom":
            ly += circleR + 10;
            break;
        case "left":
            lx -= circleR + 14;
            break;
        case "right":
            lx += circleR + 14;
            break;
    }

    const fallback = EMOJI_FALLBACKS[label] ?? "un";
    const flagW = 16;
    const flagH = 12;

    return (
        <g>
            <circle cx={lx} cy={ly} r={circleR} fill="#ffffff" />
            <image
                href={`https://flagcdn.com/${fallback.toLowerCase()}.svg`}
                x={lx - flagW / 2}
                y={ly - flagH / 2}
                width={flagW}
                height={flagH}
                preserveAspectRatio="xMidYMid meet"
            />
            <circle cx={lx} cy={ly} r={circleR} fill="none" stroke="#a084f7" strokeWidth="1.5" />
        </g>
    );
}

export default function WorldMapAnimated({
    paths,
    dots,
    lineGradientId,
    dotGradientId,
}: WorldMapAnimatedProps) {
    return (
        <svg
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

            {paths.map((path, i) => (
                <motion.path
                    key={`path-${i}`}
                    d={path.d}
                    fill="none"
                    stroke={`url(#${lineGradientId})`}
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 1.2,
                        delay: path.delay,
                        ease: "easeOut",
                    }}
                />
            ))}

            {dots.map((dot, i) => (
                <g key={`dot-${i}`}>
                    <circle
                        cx={dot.cx}
                        cy={dot.cy}
                        r="4"
                        fill={`url(#${dotGradientId})`}
                    />
                    <Label
                        cx={dot.cx}
                        cy={dot.cy}
                        label={dot.label}
                        labelPosition={dot.labelPosition}
                    />
                    <circle
                        cx={dot.cx}
                        cy={dot.cy}
                        r="4"
                        fill={dot.color}
                        opacity="0.4"
                    >
                        <animate attributeName="r" from="4" to="14" dur="1.5s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                    </circle>
                </g>
            ))}
        </svg>
    );
}
