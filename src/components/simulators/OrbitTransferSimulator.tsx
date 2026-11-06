import React from 'react';
import { Rocket, Orbit, Play, RotateCcw } from 'lucide-react';

export const OrbitTransferSimulator: React.FC = () => {
  const [targetOrbit, setTargetOrbit] = React.useState<'GEO' | 'Mars'>('Mars');
  const [animating, setAnimating] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (animating) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setAnimating(false);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [animating]);

  const handleStart = () => {
    setProgress(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setProgress(0);
  };

  // Calculations:
  // LEO radius ~ 6,678 km
  // Target: GEO ~ 42,164 km, Mars ~ 227,900,000 km (scaled for visualization)
  const deltaV1 = targetOrbit === 'Mars' ? '3.6 km/s (Trans-Mars Injection)' : '2.4 km/s (LEO to GTO)';
  const deltaV2 = targetOrbit === 'Mars' ? '2.1 km/s (Mars Capture)' : '1.5 km/s (Circularization)';

  return (
    <div className="w-full bg-[#0a0f24] rounded-xl border border-slate-800 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
          <Orbit className="w-4 h-4" />
          <span>Interactive Mini-Lab: Hohmann Transfer Trajectory</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setTargetOrbit('GEO'); setProgress(0); setAnimating(false); }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              targetOrbit === 'GEO'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'text-slate-400 border-slate-700'
            }`}
          >
            LEO to GEO
          </button>
          <button
            onClick={() => { setTargetOrbit('Mars'); setProgress(0); setAnimating(false); }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              targetOrbit === 'Mars'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'text-slate-400 border-slate-700'
            }`}
          >
            Earth to Mars
          </button>
        </div>
      </div>

      {/* Orbit Visualization Canvas */}
      <div className="relative w-full h-44 rounded-lg overflow-hidden bg-[#050714] border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Central Body (Earth) */}
          <circle cx="120" cy="100" r="14" fill="#38bdf8" className="drop-shadow-[0_0_8px_#0284c7]" />
          <text x="120" y="104" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold">🌍</text>

          {/* Initial Circular Orbit (Inner) */}
          <circle cx="120" cy="100" r="32" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Target Outer Orbit */}
          <circle cx="120" cy="100" r="88" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Target Body (Mars or GEO satellite) */}
          <circle cx="208" cy="100" r="8" fill="#ef4444" />
          <text x="208" y="103" textAnchor="middle" fontSize="8" fill="#ffffff">🔴</text>

          {/* Hohmann Elliptical Transfer Path (Semi-major a = (r1 + r2)/2) */}
          {/* Ellipse center is at cx = 120 + (88 - 32)/2 = 148, rx = (32+88)/2 = 60, ry = sqrt(32*88) ~ 53 */}
          <path
            d="M 88 100 A 60 48 0 0 1 208 100"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Burn 1 Impulse Point */}
          <circle cx="88" cy="100" r="4" fill="#3b82f6" />
          <text x="88" y="88" textAnchor="middle" fontSize="8" fill="#93c5fd" fontWeight="bold">Burn 1 Δv₁</text>

          {/* Burn 2 Impulse Point */}
          <circle cx="208" cy="100" r="4" fill="#ec4899" />
          <text x="208" y="88" textAnchor="middle" fontSize="8" fill="#f472b6" fontWeight="bold">Burn 2 Δv₂</text>

          {/* Animated Spacecraft travelling along the Hohmann arc */}
          {progress > 0 && (
            <g
              transform={`translate(${
                88 + (120 * (progress / 100))
              }, ${
                100 - Math.sin((progress / 100) * Math.PI) * 48
              })`}
            >
              <circle cx="0" cy="0" r="4" fill="#ffffff" className="animate-ping" />
              <circle cx="0" cy="0" r="3.5" fill="#facc15" />
            </g>
          )}
        </svg>

        {/* Phase Info Overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-mono">
          <span>Transfer Stage:</span>
          {progress === 0 && <span className="text-cyan-400">Launch Pad Ready</span>}
          {progress > 0 && progress < 100 && (
            <span className="text-purple-400">
              Coasting Trajectory ({Math.round(progress)}%)
            </span>
          )}
          {progress === 100 && <span className="text-emerald-400">Orbit Insertion Complete!</span>}
        </div>
      </div>

      {/* Delta-V Breakdown & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
        <div className="space-y-0.5">
          <div className="text-slate-300">
            <span className="text-slate-400 font-mono">Burn 1 (Periapsis):</span> <strong>{deltaV1}</strong>
          </div>
          <div className="text-slate-300">
            <span className="text-slate-400 font-mono">Burn 2 (Apoapsis):</span> <strong>{deltaV2}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={animating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate Burn Sequence</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
