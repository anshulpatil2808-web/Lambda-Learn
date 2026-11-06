import React from 'react';
import {
  Radio,
  Flame,
  ChevronRight,
  RotateCw,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { UserProfile, Checkpoint } from '../types';
import { LambdaMascot } from './BrandAssets';
import capsuleDriftingImg from '../assets/images/capsule_drifting_1793966322628.jpg';

interface CapsuleJourneyViewProps {
  user: UserProfile;
  checkpoints: Checkpoint[];
  onStartNextLesson: () => void;
  onReturnToDashboard: () => void;
}

export const CapsuleJourneyView: React.FC<CapsuleJourneyViewProps> = ({
  user,
  checkpoints,
  onStartNextLesson,
  onReturnToDashboard,
}) => {
  const [rcsFired, setRcsFired] = React.useState<boolean>(false);
  const [antennaDeployed, setAntennaDeployed] = React.useState<boolean>(false);
  const [rcsAngle, setRcsAngle] = React.useState<number>(0);

  const currentCheckpoint =
    checkpoints.find((c) => c.id === user.currentCheckpointId) || checkpoints[0];
  const nextCheckpoint =
    checkpoints[Math.min(checkpoints.length - 1, currentCheckpoint.order || 1)];

  const handleFireRCS = () => {
    setRcsFired(true);
    setRcsAngle((prev) => (prev + 12) % 360);
    setTimeout(() => {
      setRcsFired(false);
    }, 1200);
  };

  const completedCount = (user.completedLessons || []).length;
  const dailyTarget = user.dailyLessonsGoal || 5;
  const dailyMinutes = user.dailyMinutesGoal || 20;
  const dailyCompleted = user.dailyLessonsCompleted || Math.min(completedCount, 1);
  const dailyPercentage = Math.min(100, Math.round((dailyCompleted / dailyTarget) * 100));

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#090416] shadow-2xl mb-12">
      {/* 50/50 Space Cab & Drifting Cosmos Stage */}
      <div className="relative w-full min-h-[520px] lg:min-h-[580px] overflow-hidden flex items-center">
        <img
          src={capsuleDriftingImg}
          alt="Space Cab Drifting in Cosmos"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />

        {/* Ambient Cosmic Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090416] via-[#090416]/65 to-[#090416]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090416]/95 via-[#090416]/75 to-[#090416]/60" />

        {/* Active Thruster Fire Visual FX when RCS is triggered */}
        {rcsFired && (
          <div className="absolute top-[28%] left-[46%] pointer-events-none z-20 flex items-center gap-2 animate-ping">
            <div className="w-8 h-8 rounded-full bg-cyan-400/80 blur-md" />
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-transparent transform -rotate-45" />
          </div>
        )}

        {/* Content Grid: Left 6 Cols = Lambda in the Space Cab (50% space) | Right 6 Cols = Mission Status & Daily Target */}
        <div className="relative z-20 w-full p-6 sm:p-10 space-y-6">
          {/* Top Header Overlay: Return button & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onReturnToDashboard}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Mission Control</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/85 border border-amber-500/40 text-amber-200 text-xs font-mono backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Space Cab Status: Guided by Lambda</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* LEFT HALF (6 cols = 50%): LAMBDA IN THE SPACE CAB WITH COMIC SPEECH BUBBLE */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#100826]/90 border border-amber-500/35 backdrop-blur-xl flex flex-col items-center space-y-4 shadow-2xl">
              <div className="w-full flex items-center justify-between text-xs font-mono text-amber-300 border-b border-violet-900/50 pb-2">
                <span>SPACE CAB</span>
                <span className="text-cyan-300">ORBITAL CRUISE</span>
              </div>

              <div className="relative w-full bg-white text-slate-950 rounded-2xl p-4 shadow-xl border-2 border-cyan-400">
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-900">
                  {rcsFired
                    ? `"Whoosh! Did you feel that thruster kick, ${user.name}? Small bursts of gas steer our space cab without needing wings or air!"`
                    : `"Welcome to the Space Cab, ${user.name}! Right now we're coasting past ${currentCheckpoint.name} toward ${nextCheckpoint.name}. Ready for our next space lesson?"`}
                </p>
                <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-cyan-400 transform rotate-45 mx-auto -mb-6 mt-2" />
              </div>

              <div className="pt-2 flex flex-col items-center">
                <LambdaMascot size={185} />
                <span className="mt-1 px-4 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold text-xs">
                  Lambda
                </span>
              </div>
            </div>

            {/* RIGHT HALF (6 cols = 50%): TRAJECTORY & DAILY TARGET */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/40 backdrop-blur-md">
                  Space Cab Lambda-I
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Attitude: {rcsAngle}° Yaw
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-display text-white drop-shadow-md">
                Cruising Through the Cosmos with Lambda
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow">
                Your exploration cab is cruising from <strong>{currentCheckpoint.name}</strong> toward <strong>{nextCheckpoint.name}</strong>. Complete mini-lessons in Astrophysics, Rocket Science, or Astrophotography to power your next burn!
              </p>

              {/* Daily Lesson & Time Target Progress Card */}
              <div className="p-4 rounded-2xl bg-slate-950/85 border border-amber-500/35 backdrop-blur-md space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Daily Learning Target ({dailyMinutes} mins/day)</span>
                  </span>
                  <span className="font-mono text-amber-300">
                    {dailyCompleted} of {dailyTarget} lessons ({dailyPercentage}%)
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.max(8, dailyPercentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Topic Focus: {(user.preferredTrack || 'all').toUpperCase()}</span>
                  <span>Streak: {user.streaks} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Telemetry & Space Cab Command Deck */}
      <div className="p-6 bg-[#0c061d] border-t border-violet-900/40 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-violet-950">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFireRCS}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                rcsFired
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${rcsFired ? 'animate-spin' : ''}`} />
              <span>Fire Orientation RCS Puffs</span>
            </button>

            <button
              onClick={() => setAntennaDeployed((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                antennaDeployed
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/20'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-violet-500/50 hover:bg-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-violet-400" />
              <span>{antennaDeployed ? 'DSN Antenna Deployed (Active Link)' : 'Deploy DSN Antenna'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartNextLesson}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Start Next Lesson in Space Cab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Data Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-violet-900/30">
            <div className="text-[11px] text-slate-400">Orbital Velocity</div>
            <div className="text-base font-bold text-white mt-1">7,780 m/s</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">Mach 22.8 (LEO)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-violet-900/30">
            <div className="text-[11px] text-slate-400">Altitude / Apogee</div>
            <div className="text-base font-bold text-white mt-1">412 km / 420 km</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Perigee: 408 km</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-violet-900/30">
            <div className="text-[11px] text-slate-400">Solar Array Power</div>
            <div className="text-base font-bold text-white mt-1">4.2 kW</div>
            <div className="text-[10px] text-violet-300 mt-0.5">100% Sunward</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-violet-900/30">
            <div className="text-[11px] text-slate-400">Cabin Atmosphere</div>
            <div className="text-base font-bold text-white mt-1">101.3 kPa</div>
            <div className="text-[10px] text-slate-400 mt-0.5">21% O2 • Nominal</div>
          </div>
        </div>
      </div>
    </div>
  );
};
