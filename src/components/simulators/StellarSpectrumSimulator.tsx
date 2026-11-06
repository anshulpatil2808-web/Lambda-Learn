import React from 'react';
import { Sun, Sparkles } from 'lucide-react';

interface SpectralClassInfo {
  type: string;
  tempK: number;
  colorName: string;
  starColorHex: string;
  representativeStar: string;
  features: string;
  radiusSolar: number;
}

const SPECTRAL_CLASSES: SpectralClassInfo[] = [
  { type: 'O', tempK: 38000, colorName: 'Deep Blue-Violet', starColorHex: '#818cf8', representativeStar: 'Zeta Puppis (Naos)', features: 'Ionized helium lines (He II), weak hydrogen', radiusSolar: 16 },
  { type: 'B', tempK: 21000, colorName: 'Blue-White', starColorHex: '#93c5fd', representativeStar: 'Rigel (Beta Orionis)', features: 'Neutral helium (He I), moderate Balmer lines', radiusSolar: 8 },
  { type: 'A', tempK: 9200, colorName: 'Pure White', starColorHex: '#e0f2fe', representativeStar: 'Vega & Sirius A', features: 'Strongest neutral hydrogen Balmer lines', radiusSolar: 2.1 },
  { type: 'F', tempK: 7000, colorName: 'Yellow-White', starColorHex: '#fef08a', representativeStar: 'Procyon A', features: 'Ionized Calcium (Ca II H & K lines)', radiusSolar: 1.5 },
  { type: 'G', tempK: 5800, colorName: 'Solar Yellow', starColorHex: '#fde047', representativeStar: 'The Sun (Sol)', features: 'Neutral & ionized metals, G band iron lines', radiusSolar: 1.0 },
  { type: 'K', tempK: 4400, colorName: 'Orange', starColorHex: '#fb923c', representativeStar: 'Arcturus & Aldebaran', features: 'Strong metallic lines, weak hydrogen', radiusSolar: 0.8 },
  { type: 'M', tempK: 3200, colorName: 'Red Dwarf / Supergiant', starColorHex: '#f87171', representativeStar: 'Betelgeuse & Proxima Centauri', features: 'Titanium Oxide (TiO) molecular bands', radiusSolar: 0.4 },
];

export const StellarSpectrumSimulator: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(4); // Default: G-type (Sun)
  const current = SPECTRAL_CLASSES[selectedIndex];

  return (
    <div className="w-full bg-[#0a0f24] rounded-xl border border-slate-800 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
          <Sun className="w-4 h-4" />
          <span>Interactive Mini-Lab: Spectral Class & Blackbody Temperature</span>
        </div>
        <span className="text-[11px] text-amber-300 font-mono">
          {current.tempK.toLocaleString()} Kelvin
        </span>
      </div>

      {/* Visual Star Viewport */}
      <div className="relative w-full h-36 rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
        {/* Stellar Glow */}
        <div
          className="absolute rounded-full transition-all duration-300 blur-xl opacity-60"
          style={{
            width: `${Math.min(180, 50 + current.radiusSolar * 10)}px`,
            height: `${Math.min(180, 50 + current.radiusSolar * 10)}px`,
            background: current.starColorHex,
          }}
        />

        {/* Photosphere Disk */}
        <div
          className="relative rounded-full transition-all duration-300 shadow-2xl flex items-center justify-center font-display font-extrabold text-slate-900 text-lg"
          style={{
            width: `${Math.min(90, 36 + current.radiusSolar * 4)}px`,
            height: `${Math.min(90, 36 + current.radiusSolar * 4)}px`,
            backgroundColor: current.starColorHex,
            boxShadow: `0 0 25px ${current.starColorHex}`,
          }}
        >
          {current.type}
        </div>

        {/* Blackbody Spectrum Absorption Line Simulation */}
        <div className="absolute bottom-2 inset-x-4 h-5 rounded bg-gradient-to-r from-violet-600 via-green-500 to-red-600 border border-slate-700/80 overflow-hidden flex items-center">
          {/* Simulated Fraunhofer dark absorption absorption lines */}
          <div className="w-[2px] h-full bg-black/90 absolute left-[18%]" title="H-delta 410nm" />
          <div className="w-[3px] h-full bg-black/90 absolute left-[32%]" title="H-gamma 434nm" />
          <div className="w-[2px] h-full bg-black/90 absolute left-[45%]" title="H-beta 486nm" />
          <div className="w-[4px] h-full bg-black/90 absolute left-[58%]" title="Sodium D doublet 589nm" />
          <div className="w-[3px] h-full bg-black/90 absolute left-[82%]" title="H-alpha 656nm" />
        </div>
      </div>

      {/* Type Selector Buttons */}
      <div className="flex justify-between items-center gap-1">
        {SPECTRAL_CLASSES.map((spec, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={spec.type}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20 scale-105'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span style={{ color: spec.starColorHex }}>{spec.type}</span>
            </button>
          );
        })}
      </div>

      {/* Spectral Breakdown Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
        <div>
          <span className="text-slate-400 block text-[11px]">Representative Star:</span>
          <span className="text-white font-medium">{current.representativeStar}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Surface Color & Temp:</span>
          <span className="text-cyan-300 font-medium">
            {current.colorName} ({current.tempK.toLocaleString()} K)
          </span>
        </div>
        <div className="sm:col-span-2 pt-1 border-t border-slate-800/80">
          <span className="text-slate-400 block text-[11px]">Key Absorption Features:</span>
          <span className="text-slate-300">{current.features}</span>
        </div>
      </div>
    </div>
  );
};
