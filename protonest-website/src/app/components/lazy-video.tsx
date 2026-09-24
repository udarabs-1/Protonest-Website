"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface LazyVideoSource {
  src: string;
  type: string;
}

interface LazyVideoProps {
  sources: LazyVideoSource[];
  poster: string;
  className?: string;
  style?: CSSProperties;
}

export default function LazyVideo({
  sources,
  poster,
  className,
  style,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasEnteredView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (!hasEnteredView) return;
    const video = videoRef.current;
    if (!video) return;

    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [hasEnteredView]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={className}
      style={style}
    >
      {hasEnteredView &&
        sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
    </video>
  );
}
