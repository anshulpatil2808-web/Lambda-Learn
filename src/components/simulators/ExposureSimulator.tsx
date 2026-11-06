import React from 'react';
import { Camera, Sliders, Info, Sparkles } from 'lucide-react';

export const ExposureSimulator: React.FC = () => {
  const [aperture, setAperture] = React.useState<number>(2.8);
  const [shutterSec, setShutterSec] = React.useState<number>(15);
  const [iso, setIso] = React.useState<number>(3200);
  const [focalLength, setFocalLength] = React.useState<number>(24);

  // Rule of 500 calculation: 500 / focalLength
  const maxUntrackedSec = Math.round(500 / focalLength);
  const isStarTrailing = shutterSec > maxUntrackedSec;

  // Approximate relative exposure value (EV calculation)
  // Light = (shutterSec * ISO) / (aperture^2)
  const exposureScore = (shutterSec * (iso / 100)) / (aperture * aperture);
  const normalizedBrightness = Math.min(1, Math.max(0.08, exposureScore / 3500));
  const noiseAmount = Math.min(1, Math.max(0.05, (iso - 800) / 10000));

  return (
    <div className="w-full bg-[#0a0f24] rounded-xl border border-slate-800 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
          <Camera className="w-4 h-4" />
          <span>Interactive Mini-Lab: The Night Sky Exposure Simulator</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Rule of 500 Limit: <strong className="text-cyan-300">{maxUntrackedSec}s</strong>
        </span>
      </div>

      {/* Simulated Camera Sensor Canvas Display */}
      <div className="relative w-full h-44 rounded-lg overflow-hidden bg-black border border-slate-700/80 flex items-center justify-center">
        {/* Sky glow based on exposure */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, rgba(56, 189, 248, ${normalizedBrightness * 0.45}) 0%, rgba(15, 23, 42, ${normalizedBrightness * 0.9}) 80%, #030712 100%)`,
          }}
        />

        {/* Faint Milky Way dust lane simulation */}
        <div
          className="absolute inset-0 rotate-12 transition-opacity duration-200"
          style={{
            opacity: normalizedBrightness * 0.85,
            background: 'linear-gradient(45deg, transparent 30%, rgba(224, 231, 255, 0.25) 50%, rgba(147, 197, 253, 0.3) 53%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Star dots or streaks depending on shutter vs Rule of 500 */}
        <svg className="absolute inset-0 w-full h-full">
          {[
            { x: '15%', y: '25%', r: 2.2 },
            { x: '35%', y: '40%', r: 1.8 },
            { x: '50%', y: '20%', r: 2.6 },
            { x: '68%', y: '35%', r: 1.5 },
            { x: '82%', y: '28%', r: 2.0 },
            { x: '25%', y: '65%', r: 1.4 },
            { x: '75%', y: '70%', r: 2.4 },
            { x: '45%', y: '75%', r: 1.6 },
          ].map((st, i) => {
            if (isStarTrailing) {
              // Draw an elongated trail line
              const trailLength = (shutterSec - maxUntrackedSec) * 1.5;
              return (
                <line
                  key={i}
                  x1={st.x}
                  y1={st.y}
                  x2={`calc(${st.x} + ${trailLength}px)`}
                  y2={`calc(${st.y} + ${trailLength * 0.4}px)`}
                  stroke="#ffffff"
                  strokeWidth={st.r}
                  strokeLinecap="round"
                  opacity={normalizedBrightness > 0.15 ? 0.9 : 0.2}
                />
              );
            }
            return (
              <circle
                key={i}
                cx={st.x}
                cy={st.y}
                r={st.r}
                fill="#ffffff"
                opacity={normalizedBrightness > 0.15 ? 0.95 : 0.2}
                className="drop-shadow-[0_0_3px_#38bdf8]"
              />
            );
          })}
        </svg>

        {/* Noise overlay simulating ISO grain */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-200"
          style={{
            opacity: noiseAmount * 0.4,
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '4px 4px',
          }}
        />

        {/* Status badges in simulator viewfinder */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono border border-slate-700 text-slate-300">
          <span>f/{aperture}</span>
          <span>•</span>
          <span>{shutterSec}s</span>
          <span>•</span>
          <span>ISO {iso}</span>
          <span>•</span>
          <span>{focalLength}mm</span>
        </div>

        <div className="absolute bottom-2 right-2">
          {isStarTrailing ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
              ⚠️ Star Trailing Detected ({shutterSec}s &gt; {maxUntrackedSec}s)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pinpoint Sharp Stars!
            </span>
          )}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Aperture Slider */}
        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Aperture: <strong>f/{aperture}</strong></span>
            <span className="text-[10px] text-slate-400">Lower f-number = more light</span>
          </div>
          <input
            type="range"
            min="1.4"
            max="16"
            step="0.2"
            value={aperture}
            onChange={(e) => setAperture(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Shutter Speed Slider */}
        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Shutter Speed: <strong>{shutterSec}s</strong></span>
            <span className="text-[10px] text-slate-400">Rule of 500 limit: {maxUntrackedSec}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={shutterSec}
            onChange={(e) => setShutterSec(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* ISO Slider */}
        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div className="flex justify-between text-slate-300 mb-1">
            <span>ISO Gain: <strong>{iso}</strong></span>
            <span className="text-[10px] text-slate-400">Signal amplification</span>
          </div>
          <input
            type="range"
            min="100"
            max="12800"
            step="100"
            value={iso}
            onChange={(e) => setIso(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Lens Focal Length Slider */}
        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Lens Focal Length: <strong>{focalLength}mm</strong></span>
            <span className="text-[10px] text-slate-400">Wider lens allows longer exposure</span>
          </div>
          <input
            type="range"
            min="14"
            max="200"
            step="1"
            value={focalLength}
            onChange={(e) => setFocalLength(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
