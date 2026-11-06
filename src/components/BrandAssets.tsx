import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Faithful recreation of the uploaded Lambda Learn Logo:
 * Golden-copper lowercase lambda (λ) inside concentric orbital rings
 * with a tilted planetary ring and orbital nodes.
 */
export const LambdaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 42,
  showText = false,
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="lambdaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="lambdaInnerGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Deep obsidian circular backing */}
        <circle cx="60" cy="60" r="46" fill="#0D0A14" />

        {/* Outer copper orbital circle */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="url(#lambdaGoldGrad)"
          strokeWidth="2.4"
        />

        {/* Inner golden orbital circle */}
        <circle
          cx="60"
          cy="60"
          r="39"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />

        {/* Orbital nodes on the outer circle */}
        <circle cx="29" cy="26" r="3" fill="#0D0A14" stroke="#EA580C" strokeWidth="2" />
        <circle cx="91" cy="94" r="3" fill="#0D0A14" stroke="#EA580C" strokeWidth="2" />

        {/* Central Golden Lambda (λ) */}
        <g>
          {/* Back leg of lambda */}
          <path
            d="M59 48 L41 85 L50 85 L63 57 Z"
            fill="url(#lambdaGoldGrad)"
          />
          {/* Main sweeping stem of lambda */}
          <path
            d="M46 42 C47 34, 55 33, 59 41 L71 79 C73 85, 81 85, 82 77 L79 76 C78 80, 75 80, 73 75 L61 37 C57 27, 45 29, 43 41 Z"
            fill="url(#lambdaInnerGrad)"
          />
        </g>

        {/* Tilted Planetary Elliptical Ring */}
        <g transform="rotate(-28 60 60)">
          <ellipse
            cx="60"
            cy="60"
            rx="56"
            ry="15"
            stroke="url(#lambdaGoldGrad)"
            strokeWidth="2.5"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="50"
            ry="11.5"
            stroke="#FDE68A"
            strokeWidth="1.4"
            strokeOpacity="0.9"
          />
          {/* Ring nodes */}
          <circle cx="9" cy="54" r="2.6" fill="#0D0A14" stroke="#F59E0B" strokeWidth="1.8" />
          <circle cx="109" cy="66" r="2.6" fill="#0D0A14" stroke="#F59E0B" strokeWidth="1.8" />
        </g>
      </svg>

      {showText && (
        <span className="mt-1.5 font-serif tracking-[0.18em] text-amber-200 font-bold text-xs uppercase">
          LAMBDA LEARN
        </span>
      )}
    </div>
  );
};

interface MascotProps {
  className?: string;
  size?: number;
  isSpeaking?: boolean;
}

/**
 * Faithful recreation of the uploaded Robot Mascot floating in space:
 * Cute white rounded space robot with glowing cyan happy eyes (^ ◡ ^),
 * top glowing antenna + mounted radar dish, blue solar panel wings,
 * golden λ badge on its chest, and blue thruster jets below.
 */
export const LambdaMascot: React.FC<MascotProps> = ({
  className = '',
  size = 220,
  isSpeaking = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mascotAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#090416" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Ambient cosmic glow & orbital swirl */}
        <circle cx="130" cy="130" r="115" fill="url(#mascotAura)" />

        {/* Orbital stardust swirl rings behind Lambda */}
        <ellipse
          cx="130"
          cy="138"
          rx="102"
          ry="42"
          transform="rotate(-22 130 138)"
          stroke="#60A5FA"
          strokeWidth="1.2"
          strokeDasharray="6 6"
          strokeOpacity="0.45"
        />
        <ellipse
          cx="130"
          cy="138"
          rx="88"
          ry="34"
          transform="rotate(-22 130 138)"
          stroke="#C084FC"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />

        {/* Twinkling background stars around mascot */}
        <circle cx="38" cy="68" r="2.5" fill="#FDE68A" />
        <circle cx="225" cy="60" r="2" fill="#38BDF8" />
        <circle cx="42" cy="195" r="2" fill="#C084FC" />
        <circle cx="218" cy="188" r="2.5" fill="#F472B6" />

        {/* Blue Thruster Plumes underneath */}
        <g>
          <ellipse cx="118" cy="218" rx="5" ry="11" fill="#38BDF8" fillOpacity="0.85" />
          <ellipse cx="142" cy="218" rx="5" ry="11" fill="#38BDF8" fillOpacity="0.85" />
          <circle cx="130" cy="228" r="3.5" fill="#7DD3FC" />
          <circle cx="122" cy="236" r="2" fill="#38BDF8" />
          <circle cx="138" cy="235" r="2.5" fill="#38BDF8" />
        </g>

        {/* LEFT SOLAR PANEL WING */}
        <g transform="rotate(20 75 135)">
          <rect
            x="18"
            y="112"
            width="54"
            height="34"
            rx="6"
            fill="url(#solarPanelGrad)"
            stroke="#E2E8F0"
            strokeWidth="3.5"
          />
          <line x1="36" y1="112" x2="36" y2="146" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="54" y1="112" x2="54" y2="146" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="18" y1="123" x2="72" y2="123" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="18" y1="135" x2="72" y2="135" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
        </g>

        {/* RIGHT SOLAR PANEL WING */}
        <g transform="rotate(-20 185 135)">
          <rect
            x="188"
            y="112"
            width="54"
            height="34"
            rx="6"
            fill="url(#solarPanelGrad)"
            stroke="#E2E8F0"
            strokeWidth="3.5"
          />
          <line x1="206" y1="112" x2="206" y2="146" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="224" y1="112" x2="224" y2="146" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="188" y1="123" x2="242" y2="123" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="188" y1="135" x2="242" y2="135" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.7" />
        </g>

        {/* ROBOT TORSO / LOWER POD */}
        <path
          d="M92 142 C92 188, 108 206, 130 206 C152 206, 168 188, 168 142 Z"
          fill="url(#robotBodyGrad)"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* LEFT & RIGHT CUTE ARMS */}
        <ellipse
          cx="84"
          cy="162"
          rx="10"
          ry="22"
          transform="rotate(22 84 162)"
          fill="url(#robotBodyGrad)"
          stroke="#334155"
          strokeWidth="3"
        />
        <ellipse
          cx="176"
          cy="162"
          rx="10"
          ry="22"
          transform="rotate(-22 176 162)"
          fill="url(#robotBodyGrad)"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* CHEST GOLDEN LAMBDA (λ) EMBLEM */}
        <circle
          cx="130"
          cy="170"
          r="17"
          fill="#1E1B4B"
          stroke="#F59E0B"
          strokeWidth="2.8"
        />
        <text
          x="130"
          y="178"
          textAnchor="middle"
          fill="#FBBF24"
          fontSize="24"
          fontWeight="bold"
          fontFamily="serif"
        >
          λ
        </text>

        {/* TOP CENTER GLOWING ANTENNA (Static SVG glow halo — no CSS scale offset) */}
        <line x1="130" y1="42" x2="130" y2="62" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        <circle cx="130" cy="38" r="11" fill="#22D3EE" fillOpacity="0.25" />
        <circle cx="130" cy="38" r="6.5" fill="#67E8F9" />

        {/* TOP RIGHT SATELLITE RADAR DISH (Mounted flush to helmet) */}
        <g transform="translate(152, 46) rotate(28)">
          <path
            d="M0 16 C6 28, 26 28, 32 16 Z"
            fill="#E2E8F0"
            stroke="#334155"
            strokeWidth="2.5"
          />
          <line x1="16" y1="18" x2="16" y2="6" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="16" cy="5" r="3" fill="#38BDF8" />
        </g>

        {/* ROBOT HEAD / HELMET */}
        <rect
          x="78"
          y="60"
          width="104"
          height="84"
          rx="38"
          fill="url(#robotBodyGrad)"
          stroke="#334155"
          strokeWidth="3.2"
        />

        {/* DIGITAL VISOR SCREEN */}
        <rect
          x="90"
          y="74"
          width="80"
          height="56"
          rx="22"
          fill="url(#visorGrad)"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* CYAN GLOWING EYES (^ ^) & HAPPY SMILE */}
        <path
          d="M105 100 C108 91, 118 91, 121 100"
          stroke="#22D3EE"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M139 100 C142 91, 152 91, 155 100"
          stroke="#22D3EE"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M122 110 C125 117, 135 117, 138 110"
          stroke="#22D3EE"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
