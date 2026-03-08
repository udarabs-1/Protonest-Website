"use client";

import DottedMap from "dotted-map";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRef } from "react";

interface MapProps {
    dots?: Array<{
        start: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
        end: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
    }>;
    lineColor?: string;
}

export default function WorldMap({
    dots = [],
    lineColor = "#0ea5e9",
}: MapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const { theme } = useTheme();

    const svgMap = map.getSVG({
        radius: 0.22,
        color: theme === "dark" ? "#FFFFFF40" : "#00000040",
        shape: "circle",
        backgroundColor: theme === "dark" ? "black" : "white",
    });

    const projectPoint = (lat: number, lng: number) => {
        // Use the dotted-map internal projection mapped to the 800x400 SVG viewbox bounds
        // DottedMap with height 100 outputs a viewBox of 0 0 198 100
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

        let x = point.x;
        let y = point.y;
        let textAnchor = "middle";

        switch (position) {
            case "top":
                y -= 15; // Adjusted higher for 24px text
                break;
            case "bottom":
                y += 28; // Adjusted lower for 24px text
                break;
            case "left":
                x -= 15; // Adjusted further left
                y += 8;
                textAnchor = "end";
                break;
            case "right":
                x += 15; // Adjusted further right
                y += 8;
                textAnchor = "start";
                break;
        }

        // Dropped full SVG fill gradient because this applies to the emoji flags and forces them un-renderable or monotone colored in Safari iOS.
        return (
            <text
                x={x}
                y={y}
                fontSize="24"
                fontWeight="bold"
                textAnchor={textAnchor}
            >
                {dot.label}
            </text>
        );
    };

    return (
        <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden">
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
                    <linearGradient id="theme-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5530FA" />
                        <stop offset="100%" stopColor="#F51DA5" />
                    </linearGradient>
                </defs>

                {dots.map((dot, i) => {
                    const startPoint = projectPoint(dot.start.lat, dot.start.lng);
                    const endPoint = projectPoint(dot.end.lat, dot.end.lng);
                    return (
                        <g key={`path-group-${i}`}>
                            <motion.path
                                d={createCurvedPath(startPoint, endPoint)}
                                fill="none"
                                stroke={lineColor}
                                strokeOpacity="0.8"
                                strokeWidth="1.5"
                                initial={{
                                    pathLength: 0,
                                }}
                                animate={{
                                    pathLength: 1,
                                }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5 * i,
                                    ease: "easeOut",
                                }}
                                key={`start-upper-${i}`}
                            ></motion.path>
                        </g>
                    );
                })}

                {dots.map((dot, i) => (
                    <g key={`points-group-${i}`}>
                        <g key={`start-${i}`}>
                            <circle
                                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                                r="2.5"
                                fill={lineColor}
                            />
                            {renderLabel(dot.start)}
                            <circle
                                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                                r="2.5"
                                fill={lineColor}
                                opacity="0.5"
                            >
                                <animate
                                    attributeName="r"
                                    from="2.5"
                                    to="10"
                                    dur="1.5s"
                                    begin="0s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    from="0.5"
                                    to="0"
                                    dur="1.5s"
                                    begin="0s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </g>
                        <g key={`end-${i}`}>
                            <circle
                                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                                r="2.5"
                                fill={lineColor}
                            />
                            {renderLabel(dot.end)}
                            <circle
                                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                                r="2.5"
                                fill={lineColor}
                                opacity="0.5"
                            >
                                <animate
                                    attributeName="r"
                                    from="2.5"
                                    to="10"
                                    dur="1.5s"
                                    begin="0s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    from="0.5"
                                    to="0"
                                    dur="1.5s"
                                    begin="0s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
}
