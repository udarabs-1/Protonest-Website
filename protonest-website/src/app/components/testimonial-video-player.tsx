"use client";

import { useRef, useState } from "react";

type TestimonialVideoPlayerProps = {
  src: string;
  ariaLabel: string;
  name: string;
  company: string;
};

export default function TestimonialVideoPlayer({
  src,
  ariaLabel,
  name,
  company,
}: TestimonialVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaybackToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="featured-testimonial-video relative overflow-hidden rounded-[20px] bg-[#111] shadow-[0_16px_36px_rgba(20,17,35,0.16)] lg:rounded-[24px]">
      <video
        ref={videoRef}
        src={`${src}#t=0.001`}
        aria-label={ariaLabel}
        preload="metadata"
        playsInline
        controls={false}
        className="w-full"
        style={{ aspectRatio: "9/16", display: "block" }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={handlePlaybackToggle}
        aria-label={`${isPlaying ? "Pause" : "Play"} testimonial video from ${name}`}
        className="absolute right-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/30 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none sm:right-5 sm:top-5 sm:h-16 sm:w-16"
      >
        {isPlaying ? (
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-5 w-1.5 rounded-sm bg-white" />
            <span className="h-5 w-1.5 rounded-sm bg-white" />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white"
          />
        )}
      </button>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-16 pt-24 text-white transition-opacity duration-200 motion-reduce:transition-none sm:px-6 ${isPlaying ? "opacity-0" : "opacity-100"}`}
      >
        <p className="font-montserrat text-xl font-semibold leading-tight sm:text-2xl">
          {name}
        </p>
        <p className="mt-1.5 font-poppins text-sm font-normal text-white/75 sm:text-base">
          {company}
        </p>
      </div>
    </div>
  );
}
