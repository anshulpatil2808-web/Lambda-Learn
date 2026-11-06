import React from 'react';
import { UserProfile, UserLevel, Checkpoint } from '../types';
import { CelestialMap } from './CelestialMap';
import { CHECKPOINTS } from '../data/checkpointsData';
import { LESSONS } from '../data/lessonsData';
import { REWARD_GIFTS } from '../data/rewardsData';
import { getRankTitle } from '../utils/gameLogic';
import {
  Flame,
  Coins,
  Gift,
  Award,
  Compass,
  ArrowRight,
  BookOpen,
  Camera,
  Rocket,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  onNavigateTab: (tab: 'home' | 'learn' | 'community' | 'gallery') => void;
  onStartLesson: (lessonId: string) => void;
  onOpenRewards: () => void;
  onOpenAuth: () => void;
  onChangeLevel: (level: UserLevel) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onNavigateTab,
  onStartLesson,
  onOpenRewards,
  onOpenAuth,
  onChangeLevel,
}) => {
  const currentCheckpoint =
    CHECKPOINTS.find((c) => c.id === user.currentCheckpointId) || CHECKPOINTS[0];
  const rankTitle = getRankTitle(user.xp, user.level);

  // Recommended next lesson for user's level
  const availableLessons = LESSONS.filter((l) => l.level === user.level);
  const nextLesson =
    availableLessons.find((l) => !user.completedLessons.includes(l.id)) ||
    availableLessons[0];

  // Daily missions
  const dailyMissions = [
    {
      id: 'm1',
      title: 'Orbital Cadet Routine',
      desc: 'Complete any 1 mini-lesson today',
      progress: user.completedLessons.length > 0 ? 1 : 0,
      target: 1,
      reward: 30,
      completed: user.completedLessons.length > 0,
    },
    {
      id: 'm2',
      title: 'Cosmic Knowledge Collector',
      desc: 'Maintain your learning streak',
      progress: user.streaks > 0 ? 1 : 0,
      target: 1,
      reward: 20,
      completed: user.streaks > 0,
    },
    {
      id: 'm3',
      title: 'Astro-Observation Scout',
      desc: 'Inspect an astrophotography photograph in Gallery',
      progress: 1,
      target: 1,
      reward: 25,
      completed: true,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Prominent Authentication Gateway Banner (Google, Apple, LinkedIn, Email OTP) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#200d3d]/90 via-[#180a2e]/90 to-[#0e061c]/90 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Cadet Authentication Gateway</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Verified: {user.provider.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-purple-200/70">
              Sign in with Google, Apple, LinkedIn, or Email with secure 6-digit OTP confirmation.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        >
          <UserCheck className="w-3.5 h-3.5 text-purple-300" />
          <span>Switch or Create Account</span>
        </button>
      </div>

      {/* Hero Welcome & Destination Banner (Purplish Cosmic Hue) */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#1c0c3b] via-[#14082c] to-[#090416] p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Cosmic Journey In Progress</span>
              </span>
              <span className="text-xs text-purple-300/60 font-mono">
                Cadet ID: #{user.id.slice(-4)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Welcome aboard,{' '}
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                {user.name}
              </span>
            </h1>

            <p className="text-sm text-purple-200/80 leading-relaxed">
              Current Rank: <strong className="text-purple-300 font-semibold">{rankTitle}</strong>. 
              {user.level === 'beginner' && ' Mastering 9th-grade astronomy, rocketry fundamentals, and night sky camera setups.'}
              {user.level === 'intermediate' && ' Applying orbital flight math, Tsiolkovsky delta-V budgeting, and star tracking.'}
              {user.level === 'advanced' && ' Analyzing peer-reviewed astrophysics papers, LIGO gravitational wave strains, and CMOS sensor photometry.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {nextLesson && (
                <button
                  onClick={() => onStartLesson(nextLesson.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Resume Next Lesson: {nextLesson.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onNavigateTab('learn')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 font-medium text-xs sm:text-sm border border-purple-800/60 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Browse All Chapters</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 min-w-[280px]">
            {/* Streak */}
            <div className="p-3.5 rounded-2xl bg-[#140a2a]/90 border border-purple-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5 fill-orange-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-purple-300/70 block font-mono">
                  Streak
                </span>
                <span className="text-lg font-bold text-white">
                  {user.streaks} <span className="text-xs text-orange-300 font-normal">days</span>
                </span>
              </div>
            </div>

            {/* Coins */}
            <div className="p-3.5 rounded-2xl bg-[#140a2a]/90 border border-purple-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5 fill-amber-400/40" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-purple-300/70 block font-mono">
                  Lambda Coins
                </span>
                <span className="text-lg font-bold text-amber-300 font-mono">
                  {user.coins}
                </span>
              </div>
            </div>

            {/* Total XP */}
            <div className="p-3.5 rounded-2xl bg-[#140a2a]/90 border border-purple-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-purple-300/70 block font-mono">
                  Cosmic XP
                </span>
                <span className="text-lg font-bold text-purple-200 font-mono">
                  {user.xp}
                </span>
              </div>
            </div>

            {/* Completed */}
            <div className="p-3.5 rounded-2xl bg-[#140a2a]/90 border border-purple-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-purple-300/70 block font-mono">
                  Lessons Done
                </span>
                <span className="text-lg font-bold text-white">
                  {user.completedLessons.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Rocket Journey Map with ion trails */}
      <section>
        <CelestialMap
          user={user}
          onSelectCheckpoint={() => {}}
          onStartLesson={onStartLesson}
        />
      </section>

      {/* Two-Column Section: 3 Chapters Hub & Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3 Learning Chapters Quick Jump */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-white">
              Core Study Tracks
            </h2>
            <button
              onClick={() => onNavigateTab('learn')}
              className="text-xs text-purple-300 hover:text-white font-medium flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Track 1: Astrophotography */}
            <div
              onClick={() => onNavigateTab('learn')}
              className="group p-5 rounded-2xl bg-[#140a2a]/80 hover:bg-[#1c0c3b] border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base font-display group-hover:text-purple-300 transition-colors">
                  Astrophotography
                </h3>
                <p className="text-xs text-purple-200/70 mt-1">
                  Master exposure triangle, pinpoint stars, equatorial trackers & Hubble palettes.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-purple-300 font-medium">
                <span>3 Core Levels</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 2: Astronomy / Astrophysics */}
            <div
              onClick={() => onNavigateTab('learn')}
              className="group p-5 rounded-2xl bg-[#140a2a]/80 hover:bg-[#1c0c3b] border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base font-display group-hover:text-indigo-300 transition-colors">
                  Astrophysics & Astronomy
                </h3>
                <p className="text-xs text-purple-200/70 mt-1">
                  From starlight and Kepler’s laws to LIGO gravitational wave derivations.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-indigo-300 font-medium">
                <span>3 Core Levels</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 3: Aerospace */}
            <div
              onClick={() => onNavigateTab('learn')}
              className="group p-5 rounded-2xl bg-[#140a2a]/80 hover:bg-[#1c0c3b] border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base font-display group-hover:text-pink-300 transition-colors">
                  Aerospace Engineering
                </h3>
                <p className="text-xs text-purple-200/70 mt-1">
                  Chemical rocket propulsion, Hohmann transfers, and planetary gravity assists.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-pink-300 font-medium">
                <span>3 Core Levels</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Daily Missions & Reward Vault Teaser */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">
              Daily Missions
            </h2>
            <span className="text-[11px] text-purple-300/70 font-mono">Resets daily</span>
          </div>

          <div className="space-y-2.5">
            {dailyMissions.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#140a2a]/80 border border-purple-900/50 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{m.title}</h4>
                  <p className="text-[11px] text-purple-300/70">{m.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-mono text-amber-300 font-semibold">
                    +{m.reward} 🪙
                  </span>
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-purple-800" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reward Gifts Vault banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-[#120726] border border-purple-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xl">
                🎁
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Gifts & Bonuses Vault</h4>
                <p className="text-[11px] text-purple-300/70">
                  {user.unlockedGifts.length} items collected
                </p>
              </div>
            </div>
            <button
              onClick={onOpenRewards}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Open Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
