import React from 'react';

/**
 * Purplish Hue Cosmic Theme with Starry Ceiling.
 * - Starry ceiling canopy at the top of the viewport with celestial constellations
 * - Smooth, non-pixelated purplish nebula gradients (#090416, #160a2c, #2e1065)
 * - Ultra-low RAM & CPU footprint (pure SVG & CSS, zero heavy canvas memory leaks)
 */
export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#090416]">
      {/* Deep cosmic purple nebula glows */}
      <div
        className="absolute top-0 left-[15%] w-[70vw] h-[45vh] rounded-full blur-[140px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(126, 34, 206, 0.25) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[35%] right-[5%] w-[55vw] h-[50vh] rounded-full blur-[150px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[5%] w-[60vw] h-[55vh] rounded-full blur-[160px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(88, 28, 135, 0.5) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 80%)',
        }}
      />

      {/* STARRY CEILING CANOPY (Upper Viewport Celestial Layer) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Violet Star Glow */}
          <radialGradient id="purpleStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#f0abfc" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </radialGradient>

          {/* Cyan/Blue Star Accent */}
          <radialGradient id="cyanStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#a5f3fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Shooting Star Gradient */}
          <linearGradient id="shootingStarTrail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e879f9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Faint Constellation Guide Lines on the Starry Ceiling */}
        <g stroke="#a855f7" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.25">
          {/* Cassiopeia-like zig-zag on ceiling */}
          <path d="M 60 40 L 140 25 L 210 65 L 300 35 L 370 70" fill="none" />
          {/* Orion belt segment */}
          <path d="M 720 30 L 780 45 L 840 60" fill="none" />
          <path d="M 780 45 L 750 95" fill="none" />
          <path d="M 780 45 L 810 5" fill="none" />
        </g>

        {/* Starry Ceiling Canopy Nodes (Twinkling softly) */}
        {/* Top left cluster */}
        <circle cx="60" cy="40" r="2.2" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />
        <circle cx="140" cy="25" r="1.8" fill="url(#purpleStarGlow)" className="animate-twinkle-fast" />
        <circle cx="210" cy="65" r="2.4" fill="url(#cyanStarGlow)" className="animate-twinkle-slow" />
        <circle cx="300" cy="35" r="1.6" fill="url(#purpleStarGlow)" className="animate-twinkle-fast" />
        <circle cx="370" cy="70" r="2.0" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />

        {/* Top center ceiling stars */}
        <circle cx="50%" cy="28" r="2.2" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />
        <circle cx="46%" cy="60" r="1.4" fill="#e9d5ff" opacity="0.6" />
        <circle cx="54%" cy="75" r="1.5" fill="url(#cyanStarGlow)" className="animate-twinkle-fast" />

        {/* Top right ceiling stars */}
        <circle cx="720" cy="30" r="2.0" fill="url(#purpleStarGlow)" className="animate-twinkle-fast" />
        <circle cx="780" cy="45" r="2.6" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />
        <circle cx="840" cy="60" r="2.0" fill="url(#cyanStarGlow)" className="animate-twinkle-fast" />
        <circle cx="910" cy="22" r="1.5" fill="#f5d0fe" opacity="0.7" />
        <circle cx="96%" cy="45" r="2.2" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />

        {/* Mid-sky & lower field stars (~8 distributed points) */}
        <circle cx="12%" cy="38%" r="1.6" fill="url(#purpleStarGlow)" className="animate-twinkle-fast" />
        <circle cx="24%" cy="72%" r="2.0" fill="url(#cyanStarGlow)" className="animate-twinkle-slow" />
        <circle cx="38%" cy="52%" r="1.2" fill="#e9d5ff" opacity="0.5" />
        <circle cx="65%" cy="82%" r="1.8" fill="url(#purpleStarGlow)" className="animate-twinkle-slow" />
        <circle cx="82%" cy="48%" r="2.2" fill="url(#purpleStarGlow)" className="animate-twinkle-fast" />
        <circle cx="88%" cy="78%" r="1.4" fill="#f5d0fe" opacity="0.6" />
        <circle cx="42%" cy="92%" r="1.8" fill="url(#cyanStarGlow)" className="animate-twinkle-slow" />

        {/* Shooting star streak across the starry ceiling */}
        <line
          x1="65%"
          y1="12"
          x2="55%"
          y2="38"
          stroke="url(#shootingStarTrail)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
