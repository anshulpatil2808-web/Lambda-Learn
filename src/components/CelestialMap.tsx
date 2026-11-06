import React from 'react';
import { Checkpoint, UserProfile } from '../types';
import { CHECKPOINTS } from '../data/checkpointsData';
import { isCheckpointUnlocked } from '../utils/gameLogic';
import { Check, Lock, Compass, ArrowRight, Sparkles, Orbit } from 'lucide-react';

interface CelestialMapProps {
  user: UserProfile;
  onSelectCheckpoint: (checkpoint: Checkpoint) => void;
  onStartLesson: (lessonId: string) => void;
}

export const CelestialMap: React.FC<CelestialMapProps> = ({
  user,
  onSelectCheckpoint,
  onStartLesson,
}) => {
  const [selectedCp, setSelectedCp] = React.useState<Checkpoint>(() => {
    return (
      CHECKPOINTS.find((c) => c.id === user.currentCheckpointId) || CHECKPOINTS[0]
    );
  });

  // Find active checkpoint
  const activeCheckpoint =
    CHECKPOINTS.find((c) => c.id === user.currentCheckpointId) || CHECKPOINTS[0];

  // SVG dimensions for coordinates
  const svgWidth = 1000;
  const svgHeight = 440;

  // Build the SVG path string connecting all checkpoints sequentially
  const pathD = React.useMemo(() => {
    return CHECKPOINTS.reduce((acc, cp, idx) => {
      const x = (cp.xPercent / 100) * svgWidth;
      const y = (cp.yPercent / 100) * svgHeight;
      if (idx === 0) return `M ${x} ${y}`;
      const prev = CHECKPOINTS[idx - 1];
      const prevX = (prev.xPercent / 100) * svgWidth;
      const prevY = (prev.yPercent / 100) * svgHeight;
      // Smooth cubic curve control points
      const cx1 = prevX + (x - prevX) * 0.5;
      const cy1 = prevY;
      const cx2 = prevX + (x - prevX) * 0.5;
      const cy2 = y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }, '');
  }, []);

  const activeX = (activeCheckpoint.xPercent / 100) * svgWidth;
  const activeY = (activeCheckpoint.yPercent / 100) * svgHeight;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#140a2a] via-[#0d061c] to-[#070311] border border-purple-500/30 p-5 sm:p-7 overflow-hidden shadow-2xl shadow-purple-950/50">
      {/* Purplish ambient glow effects */}
      <div className="absolute top-0 right-1/3 w-96 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with tracker stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-purple-900/40 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Orbit className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '18s' }} />
            <span>Interactive Celestial Trajectory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mt-1">
            Cosmic Checkpoint Tracker
          </h2>
          <p className="text-xs text-purple-200/70 mt-0.5">
            Complete mini-lessons to fuel your rocket and traverse planetary waypoints with active ion trails.
          </p>
        </div>

        {/* Current Station badge */}
        <div className="flex items-center gap-3.5 bg-[#170c30] border border-purple-500/30 px-4 py-2.5 rounded-2xl shadow-lg">
          <div className="text-2xl">{activeCheckpoint.icon}</div>
          <div>
            <span className="text-[10px] text-purple-300/70 uppercase font-semibold tracking-wider block font-mono">
              Active Checkpoint
            </span>
            <span className="text-sm font-bold text-white block">
              {activeCheckpoint.name}
            </span>
            <span className="text-[11px] text-fuchsia-300 font-mono">
              {activeCheckpoint.distanceKm} from Earth
            </span>
          </div>
        </div>
      </div>

      {/* SVG Space Trajectory Map */}
      <div className="relative w-full mt-4 overflow-x-auto select-none">
        <div className="min-w-[850px] relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[320px] sm:h-[390px]"
          >
            <defs>
              {/* Purplish trajectory gradient */}
              <linearGradient id="orbitTrajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#e879f9" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="1" />
              </linearGradient>

              {/* Rocket Ion Exhaust Trail Gradient */}
              <linearGradient id="rocketTrailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" stopOpacity="0" />
                <stop offset="40%" stopColor="#9333ea" stopOpacity="0.5" />
                <stop offset="75%" stopColor="#e879f9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              {/* Glow filter for active waypoint */}
              <filter id="planetPurpleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Orbit guideline trail (dashed outer cosmic path) */}
            <path
              d={pathD}
              fill="none"
              stroke="#2e1065"
              strokeWidth="4.5"
              strokeDasharray="6 8"
              opacity="0.6"
            />

            {/* Completed active trajectory stroke with violet/magenta glow */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#orbitTrajectoryGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]"
            />

            {/* Render Checkpoints */}
            {CHECKPOINTS.map((cp) => {
              const cx = (cp.xPercent / 100) * svgWidth;
              const cy = (cp.yPercent / 100) * svgHeight;
              const isUnlocked = isCheckpointUnlocked(cp, user.completedLessons);
              const isCurrent = cp.id === user.currentCheckpointId;
              const isSelected = cp.id === selectedCp.id;

              return (
                <g
                  key={cp.id}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => {
                    setSelectedCp(cp);
                    onSelectCheckpoint(cp);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Waypoint: ${cp.name}`}
                >
                  {/* Outer pulse circle for current checkpoint */}
                  {isCurrent && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="38"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      className="animate-spin"
                      style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '12s' }}
                    />
                  )}

                  {/* Selection indicator ring */}
                  {isSelected && !isCurrent && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="33"
                      fill="none"
                      stroke="#f472b6"
                      strokeWidth="2"
                      strokeDasharray="2 3"
                    />
                  )}

                  {/* Planet base disk */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isCurrent ? 26 : 22}
                    fill={isUnlocked ? '#1a0c35' : '#0d061c'}
                    stroke={
                      isCurrent
                        ? '#c084fc'
                        : isUnlocked
                        ? cp.color
                        : '#47227d'
                    }
                    strokeWidth={isCurrent ? 3 : 2}
                    filter={isCurrent ? 'url(#planetPurpleGlow)' : undefined}
                    className="transition-all duration-300 hover:scale-110"
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />

                  {/* Icon representation */}
                  <text
                    x={cx}
                    y={cy + 6}
                    textAnchor="middle"
                    fontSize={isCurrent ? 22 : 18}
                    className="select-none pointer-events-none"
                  >
                    {cp.icon}
                  </text>

                  {/* Lock badge if locked */}
                  {!isUnlocked && (
                    <g transform={`translate(${cx + 12}, ${cy - 16})`}>
                      <circle cx="6" cy="6" r="8" fill="#1e1038" stroke="#6b21a8" strokeWidth="1" />
                      <text x="6" y="9" textAnchor="middle" fontSize="9" fill="#c084fc">
                        🔒
                      </text>
                    </g>
                  )}

                  {/* Check badge if completed */}
                  {isUnlocked && !isCurrent && (
                    <g transform={`translate(${cx + 10}, ${cy - 14})`}>
                      <circle cx="6" cy="6" r="7" fill="#10b981" />
                      <text x="6" y="9" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">
                        ✓
                      </text>
                    </g>
                  )}

                  {/* Checkpoint Name label */}
                  <text
                    x={cx}
                    y={cy + 42}
                    textAnchor="middle"
                    fill={isCurrent ? '#f0abfc' : isUnlocked ? '#f3e8ff' : '#7e57a0'}
                    fontSize="11"
                    fontWeight={isCurrent ? '700' : '600'}
                    className="font-display select-none tracking-tight pointer-events-none drop-shadow"
                  >
                    {cp.name.split(' (')[0]}
                  </text>
                </g>
              );
            })}

            {/* ROCKET WITH GLOWING ION EXHAUST TRAIL */}
            <g
              style={{
                transform: `translate(${activeX}px, ${activeY}px)`,
                transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Rocket Exhaust Trail (Long animated gradient wake curving behind) */}
              <g transform="translate(0, -38)">
                {/* Outer Trail Smoke Particles */}
                <path
                  d="M -3 16 C -10 32, -18 50, -22 68 C -14 55, -4 35, -2 18 Z"
                  fill="url(#rocketTrailGradient)"
                  opacity="0.6"
                />
                <path
                  d="M 3 16 C 10 32, 18 50, 22 68 C 14 55, 4 35, 2 18 Z"
                  fill="url(#rocketTrailGradient)"
                  opacity="0.6"
                />
                <path
                  d="M 0 16 C -6 38, -4 58, 0 78 C 4 58, 6 38, 0 16 Z"
                  fill="url(#rocketTrailGradient)"
                  opacity="0.75"
                />

                {/* Glowing Ion Jet Core Flames */}
                <ellipse cx="0" cy="20" rx="5" ry="11" fill="#c084fc" opacity="0.9" className="animate-pulse" />
                <ellipse cx="0" cy="24" rx="3.5" ry="8" fill="#f472b6" opacity="0.95" />
                <ellipse cx="0" cy="27" rx="2" ry="5" fill="#ffffff" opacity="1" />

                {/* Left/Right Thruster Particle Sparks */}
                <circle cx="-5" cy="22" r="1.5" fill="#f0abfc" opacity="0.8" className="animate-ping" />
                <circle cx="5" cy="22" r="1.5" fill="#f0abfc" opacity="0.8" className="animate-ping" />

                {/* Rocket Main Hull */}
                <path
                  d="M 0 -17 C -7 -9, -7 10, -3.5 15 L 3.5 15 C 7 10, 7 -9, 0 -17 Z"
                  fill="#ffffff"
                  stroke="#9333ea"
                  strokeWidth="1.6"
                />
                {/* Rocket Nosecone (Magenta/Purple) */}
                <path d="M 0 -17 C -4 -11, -4 -6, 0 -6 C 4 -6, 4 -11, 0 -17 Z" fill="#e879f9" />
                {/* Rocket Fin Left */}
                <path d="M -6 6 L -13 14 L -6 14 Z" fill="#7e22ce" />
                {/* Rocket Fin Right */}
                <path d="M 6 6 L 13 14 L 6 14 Z" fill="#7e22ce" />
                {/* Rocket Porthole Window */}
                <circle cx="0" cy="-2" r="2.8" fill="#38bdf8" stroke="#1d4ed8" strokeWidth="0.8" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Waypoint Detail Card */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#140a2a]/90 border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1e0e3d] flex items-center justify-center text-2xl border border-purple-500/30 shadow-md">
            {selectedCp.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">
                {selectedCp.name}
              </h3>
              {isCheckpointUnlocked(selectedCp, user.completedLessons) ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Lock className="w-3 h-3" /> Requires Prerequisites
                </span>
              )}
            </div>
            <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
              {selectedCp.description}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-purple-300/70 mt-2 font-mono">
              <span>Distance: {selectedCp.distanceKm}</span>
              <span>Order #{selectedCp.order} of 7</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {selectedCp.requiredLessons.length > 0 && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-semibold text-purple-300/70 block font-mono">
                Prerequisite Progress
              </span>
              <span className="text-xs text-white font-semibold">
                {
                  selectedCp.requiredLessons.filter((l) =>
                    user.completedLessons.includes(l)
                  ).length
                }{' '}
                / {selectedCp.requiredLessons.length} Completed
              </span>
            </div>
          )}

          {selectedCp.requiredLessons.length > 0 && (
            <button
              onClick={() => onStartLesson(selectedCp.requiredLessons[0])}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Explore Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
