import { useEffect, useRef } from "react";

/** Animated twinkling starfield with slow parallax drift. */
export function Starfield({ density = 0.00018 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stars: { x: number; y: number; r: number; p: number; s: number; hue: number }[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor(c.offsetWidth * c.offsetHeight * density);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * c.offsetWidth,
        y: Math.random() * c.offsetHeight,
        r: Math.random() ** 3 * 1.8 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.6,
        hue: [210, 45, 0, 200][Math.floor(Math.random() * 4)],
      }));
    };
    const draw = (t: number) => {
      const w = c.offsetWidth, h = c.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const a = 0.45 + 0.55 * Math.sin(st.p + t * 0.001 * st.s);
        const x = (st.x + t * 0.003 * st.r) % w;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${st.hue}, 80%, ${st.hue === 0 ? 100 : 88}%, ${a})`;
        ctx.arc(x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    draw(0);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);
  return <canvas ref={ref} className="stars" aria-hidden="true" />;
}

/** Decorative hero art: nebula glow, ringed planet and a launching rocket. */
export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 1440 860" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="neb1" cx="0.62" cy="0.2" r="0.5">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#c2410c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="neb2" cx="0.2" cy="0.35" r="0.45">
          <stop offset="0" stopColor="#2bb3c0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="planet" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f4c27a" />
          <stop offset="0.5" stopColor="#7a4a2a" />
          <stop offset="1" stopColor="#120a06" />
        </radialGradient>
        <linearGradient id="flame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.4" stopColor="#f5d34a" />
          <stop offset="1" stopColor="#ff7a00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0.45" stopColor="#0b0b0c" stopOpacity="0" />
          <stop offset="1" stopColor="#0b0b0c" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="1440" height="860" fill="url(#neb1)" />
      <rect width="1440" height="860" fill="url(#neb2)" />
      <g transform="translate(1180 250)">
        <ellipse rx="260" ry="46" fill="none" stroke="#e7c48a" strokeOpacity="0.35" strokeWidth="10" transform="rotate(-18)" />
        <circle r="170" fill="url(#planet)" />
        <path d="M -260 0 A 260 46 0 0 0 260 0" fill="none" stroke="#f3d6a4" strokeOpacity="0.7" strokeWidth="10" transform="rotate(-18)" />
      </g>
      <g transform="translate(1290 640) rotate(22) scale(0.8)">
        <path d="M0 -120 C 22 -90 26 -40 24 40 L -24 40 C -26 -40 -22 -90 0 -120 Z" fill="#e8edf3" />
        <circle cy="-50" r="10" fill="#2bb3c0" stroke="#0e3b40" strokeWidth="3" />
        <path d="M-24 10 L -46 56 L -24 46 Z M24 10 L 46 56 L 24 46 Z" fill="#ff7a59" />
        <path d="M -16 44 Q 0 220 16 44 Z" fill="url(#flame)">
          <animate attributeName="d" dur="0.25s" repeatCount="indefinite" values="M -16 44 Q 0 220 16 44 Z;M -16 44 Q 0 190 16 44 Z;M -16 44 Q 0 220 16 44 Z" />
        </path>
      </g>
      <rect width="1440" height="860" fill="url(#fade)" />
    </svg>
  );
}
