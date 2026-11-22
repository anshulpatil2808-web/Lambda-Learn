import type { ReactNode } from "react";
/**
 * Lambda — the Lambda Learn mascot. A friendly astronaut cab-driver with a
 * λ emblem on the visor. Pure SVG so it scales crisply and animates cheaply.
 */
export type Mood = "wave" | "happy" | "think" | "cheer";

export function Mascot({ size = 200, mood = "wave", float = true }: { size?: number; mood?: Mood; float?: boolean }) {
  const armUp = mood === "wave" || mood === "cheer";
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={(size * 240) / 200}
      className={float ? "mascot-float" : undefined}
      role="img"
      aria-label="Lambda, your space cab guide"
    >
      <defs>
        <linearGradient id="suit" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe6ee" />
        </linearGradient>
        <linearGradient id="visor" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1d2a4d" />
          <stop offset="1" stopColor="#0a1124" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f5d34a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f5d34a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="120" rx="95" ry="110" fill="url(#halo)" />

      {/* backpack */}
      <rect x="52" y="104" width="96" height="84" rx="20" fill="#c7d0db" />
      {/* legs */}
      <rect x="70" y="178" width="24" height="40" rx="10" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" />
      <rect x="106" y="178" width="24" height="40" rx="10" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" />
      <rect x="66" y="210" width="32" height="16" rx="8" fill="#2bb3c0" />
      <rect x="102" y="210" width="32" height="16" rx="8" fill="#2bb3c0" />
      {/* body */}
      <rect x="62" y="112" width="76" height="80" rx="26" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" />
      {/* chest panel */}
      <rect x="80" y="134" width="40" height="30" rx="8" fill="#2bb3c0" />
      <circle cx="90" cy="144" r="4" fill="#f5d34a" />
      <circle cx="102" cy="144" r="4" fill="#ff7a59" />
      <rect x="86" y="153" width="28" height="5" rx="2.5" fill="#0e3b40" />
      {/* belt */}
      <rect x="62" y="172" width="76" height="8" fill="#f5d34a" />

      {/* left arm (down / on hip) */}
      <g>
        <rect x="40" y="120" width="26" height="54" rx="13" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" transform={mood === "think" ? "rotate(-35 53 125)" : "rotate(12 53 125)"} />
        <circle cx={mood === "think" ? 78 : 44} cy={mood === "think" ? 96 : 172} r="11" fill="#2bb3c0" />
      </g>
      {/* right arm (waving) */}
      <g className={armUp ? "mascot-wave" : undefined} style={{ transformOrigin: "140px 124px" }}>
        {armUp ? (
          <>
            <rect x="132" y="70" width="26" height="58" rx="13" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" transform="rotate(25 145 124)" />
            <circle cx="170" cy="74" r="12" fill="#2bb3c0" />
          </>
        ) : (
          <>
            <rect x="134" y="120" width="26" height="54" rx="13" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" transform="rotate(-12 147 125)" />
            <circle cx="156" cy="172" r="11" fill="#2bb3c0" />
          </>
        )}
      </g>

      {/* helmet */}
      <circle cx="100" cy="72" r="52" fill="url(#suit)" stroke="#9aa6b4" strokeWidth="2" />
      <circle cx="100" cy="72" r="52" fill="none" stroke="#2bb3c0" strokeWidth="5" strokeDasharray="6 10" opacity="0.5" />
      {/* ear lights */}
      <rect x="40" y="62" width="10" height="22" rx="5" fill="#f5d34a" />
      <rect x="150" y="62" width="10" height="22" rx="5" fill="#f5d34a" />
      {/* visor */}
      <rect x="62" y="44" width="76" height="62" rx="28" fill="url(#visor)" stroke="#2bb3c0" strokeWidth="3" />
      <path d="M72 56 Q82 48 96 50" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* lambda emblem */}
      <path d="M86 96 L98 58 h6 L118 96 h-8 L101 70 L94 96z" fill="#f5d34a" />
      {/* eyes glint */}
      {mood === "happy" || mood === "cheer" ? (
        <>
          <path d="M76 82 q4 -5 8 0" stroke="#7fe6ef" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M118 82 q4 -5 8 0" stroke="#7fe6ef" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="80" cy="80" r="3.5" fill="#7fe6ef" />
          <circle cx="122" cy="80" r="3.5" fill="#7fe6ef" />
        </>
      )}
      {/* antenna */}
      <line x1="100" y1="20" x2="100" y2="8" stroke="#9aa6b4" strokeWidth="3" />
      <circle cx="100" cy="7" r="5" fill="#ff7a59" />
      {mood === "think" && (
        <g fill="#f5d34a">
          <circle cx="160" cy="30" r="5" />
          <circle cx="172" cy="16" r="7" />
          <text x="166" y="22" fontSize="10" fontWeight="800" fill="#111">?</text>
        </g>
      )}
      {mood === "cheer" && (
        <g fill="#f5d34a">
          <path d="M28 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M176 120 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        </g>
      )}
    </svg>
  );
}

export function LambdaSays({ children, mood = "happy", size = 72 }: { children: ReactNode; mood?: Mood; size?: number }) {
  return (
    <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 18 }}>
      <div style={{ flex: "none" }}>
        <Mascot size={size} mood={mood} float={false} />
      </div>
      <div className="bubble sm" style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
