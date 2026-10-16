import { useId } from "react";
import DottedMap from "dotted-map";
import WorldMapAnimated from "./world-map-animated";

interface MapProps {
    dots?: Array<{
        start: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
        end: { lat: number; lng: number; label?: string; labelPosition?: "top" | "bottom" | "left" | "right" };
    }>;
    lineColor?: string;
}

export default function WorldMap({
    dots = [],
    lineColor = "#5530FA",
}: MapProps) {
    const uid = useId().replace(/:/g, "-");
    const lineGradientId = `line-gradient-${uid}`;
    const dotGradientId = `dot-gradient-${uid}`;

    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const svgMap = map.getSVG({
        radius: 0.22,
        color: "#a084f7",
        shape: "circle",
        backgroundColor: "white",
    });

    const projectPoint = (lat: number, lng: number) => {
        const point = map.getPin({ lat, lng });
        if (!point) return { x: 0, y: 0 };
        return {
            x: (point.x / 198) * 800,
            y: (point.y / 100) * 400,
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

    const pathData = dots.map((dot, i) => {
        const start = projectPoint(dot.start.lat, dot.start.lng);
        const end = projectPoint(dot.end.lat, dot.end.lng);
        return { d: createCurvedPath(start, end), delay: 0.5 * i };
    });

    const dotData = dots.flatMap((dot, i) => {
        const start = projectPoint(dot.start.lat, dot.start.lng);
        const end = projectPoint(dot.end.lat, dot.end.lng);
        return [
            { cx: start.x, cy: start.y, label: dot.start.label, labelPosition: dot.start.labelPosition, color: "#5530FA" },
            { cx: end.x, cy: end.y, label: dot.end.label, labelPosition: dot.end.labelPosition, color: "#F51DA5" },
        ];
    });

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
            <WorldMapAnimated
                paths={pathData}
                dots={dotData}
                lineGradientId={lineGradientId}
                dotGradientId={dotGradientId}
            />
        </div>
    );
}
