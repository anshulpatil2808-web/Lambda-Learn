import React from 'react';
import { UserProfile, UserLevel, WeeklyTest, LeaderboardEntry } from '../types';
import { getRankTitle } from '../utils/gameLogic';
import { CHECKPOINTS } from '../data/checkpointsData';
import { REWARD_GIFTS } from '../data/rewardsData';
import {
  X,
  Flame,
  Coins,
  Award,
  CheckCircle2,
  Compass,
  LogOut,
  Sparkles,
  Trophy,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  HelpCircle,
  FileText,
  UserCheck
} from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onLogout: () => void;
  onChangeLevel: (level: UserLevel) => void;
  onStartLesson?: (lessonId: string) => void;
}

const MOCK_WEEKLY_TESTS: WeeklyTest[] = [
  {
    id: 'test-w1',
    weekNumber: 1,
    title: 'Week 1: Celestial Coordinates & Sensor Quantum Efficiency',
    description: 'Assesses Right Ascension/Declination, sidereal day calculations, and CMOS dark-current mitigation.',
    questionsCount: 15,
    timeLimitMinutes: 20,
    status: 'completed',
    score: 94,
    badgeAwarded: 'Gold Optical Sensor Certificate'
  },
  {
    id: 'test-w2',
    weekNumber: 2,
    title: 'Week 2: Stellar Nucleosynthesis & Cepheid Period-Luminosity',
    description: 'Harvard OBAFGKM classification, Henrietta Leavitt period-luminosity relation, and HR diagram analysis.',
    questionsCount: 15,
    timeLimitMinutes: 20,
    status: 'available',
  },
  {
    id: 'test-w3',
    weekNumber: 3,
    title: 'Week 3: Interplanetary Hohmann Transfers & Oberth Maneuver',
    description: 'Keplerian orbital transfers, delta-v budgeting for multi-impulse planetary capture, and gravitational slingshots.',
    questionsCount: 20,
    timeLimitMinutes: 25,
    status: 'locked',
  }
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Dr. Elena Rostova', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80', level: 'advanced', xp: 2450, streak: 12, title: 'Astrophysics Fellow' },
  { rank: 2, name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', level: 'advanced', xp: 2120, streak: 9, title: 'Deep-Sky Astrophotographer' },
  { rank: 3, name: 'Alex Chen (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', level: 'beginner', xp: 1840, streak: 5, title: 'Cosmic Explorer', isCurrentUser: true },
  { rank: 4, name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', level: 'intermediate', xp: 1620, streak: 6, title: 'Orbital Propulsion Specialist' },
  { rank: 5, name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', level: 'intermediate', xp: 1410, streak: 4, title: 'Observatory Scout' },
  { rank: 6, name: 'Kenji Takahashi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', level: 'beginner', xp: 1290, streak: 3, title: 'Aero-Cadet' },
  { rank: 7, name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', level: 'intermediate', xp: 1180, streak: 7, title: 'Spectroscopy Scholar' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onLogout,
  onChangeLevel,
  onStartLesson,
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'streaks' | 'leaderboard' | 'weekly-tests'>('overview');

  const rank = getRankTitle(user.xp, user.level);
  const checkpoint = CHECKPOINTS.find((c) => c.id === user.currentCheckpointId) || CHECKPOINTS[0];
  const unlockedRewardsList = REWARD_GIFTS.filter((g) => user.unlockedGifts.includes(g.id));

  const dailyLessonsDone = user.dailyLessonsCompleted || Math.min(user.completedLessons.length, 1);
  const dailyTarget = user.dailyLessonsGoal || 20;

  const weekdays = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0c071d] border border-violet-500/30 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-950 bg-[#080516]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-bold">
              Λ
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Cadet Mission & Flight Profile
              </h2>
              <p className="text-xs text-slate-400">
                Performance analytics, streak metrics & certifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#090518] border-b border-violet-950 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Badges
          </button>
          <button
            onClick={() => setActiveTab('streaks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'streaks'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Streaks & Daily Goal ({dailyLessonsDone}/{dailyTarget})</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly-tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'weekly-tests'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Tests & Certs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Cadet Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[#0e0722] border border-violet-500/30">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-400 shadow-md shadow-violet-600/30"
                  />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white font-display">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-violet-300 font-semibold">{rank}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30">
                        {user.level} Track
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Auth: {user.provider.toUpperCase()} • ID: #{user.id.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-violet-900/40 border border-violet-500/30 text-violet-200 text-xs font-mono">
                    {user.discoverySource ? `Discovered: ${user.discoverySource}` : 'Enrolled Cadet'}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-violet-950">
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{user.streaks}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Day Streak</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-violet-950">
                  <Coins className="w-5 h-5 text-amber-400 fill-amber-400/40 mx-auto mb-1" />
                  <div className="text-xl font-bold text-amber-300 font-mono">{user.coins}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Lambda Coins</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-violet-950">
                  <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-purple-300 font-mono">{user.xp}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Cosmic XP</div>
                </div>
              </div>

              {/* Checkpoint Station */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-violet-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{checkpoint.icon}</span>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Active Exploration Checkpoint
                    </span>
                    <span className="text-xs font-bold text-white">{checkpoint.name}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400">{checkpoint.distanceKm}</span>
              </div>

              {/* Badges Vault */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">
                  Collected Space Badges & Relics ({unlockedRewardsList.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {unlockedRewardsList.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-violet-900/50 text-xs text-slate-200"
                    >
                      <span className="text-base">{g.icon}</span>
                      <div>
                        <div className="font-semibold">{g.name}</div>
                        <div className="text-[10px] text-slate-400">{g.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rigor Switch */}
              <div className="pt-2 border-t border-violet-950">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Switch Curriculum Rigor:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as UserLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => onChangeLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        user.level === lvl
                          ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STREAKS & DAILY PROGRESS */}
          {activeTab === 'streaks' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Daily Progress XP Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#120824] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Daily Lesson XP Quota</h4>
                      <p className="text-xs text-slate-300">Complete up to 20 lessons per day for bonus streaks</p>
                    </div>
                  </div>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {dailyLessonsDone} / {dailyTarget}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-violet-400 transition-all duration-500"
                    style={{ width: `${Math.max(5, (dailyLessonsDone / dailyTarget) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Progress: {Math.round((dailyLessonsDone / dailyTarget) * 100)}% toward daily milestone</span>
                  <span>Resets at 00:00 UTC</span>
                </div>
              </div>

              {/* 7-Day Calendar Streak Checkpoints */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-violet-950 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    7-Day Cadet Activity Log
                  </h4>
                  <span className="text-xs text-orange-400 font-mono flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" />
                    {user.streaks}-Day Active Streak
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2">
                  {weekdays.map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-center border space-y-1 ${
                        w.completed
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{w.day}</div>
                      <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center">
                        {w.completed ? (
                          <Check className="w-4 h-4 text-amber-400" />
                        ) : (
                          <span className="text-xs">•</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs text-violet-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
                <span>Streak Freeze Shield active: Your streak is protected if an observation night is cloudy!</span>
              </div>
            </div>
          )}

          {/* TAB 3: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-violet-950">
                <div>
                  <h4 className="text-sm font-bold text-white">Global Cohort Leaderboard</h4>
                  <p className="text-xs text-slate-400">Ranked by weekly Cosmic XP accumulated across lessons</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  Division: Orion Belt
                </span>
              </div>

              <div className="space-y-2">
                {MOCK_LEADERBOARD.map((cadet) => (
                  <div
                    key={cadet.rank}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      cadet.isCurrentUser
                        ? 'bg-violet-600/25 border-violet-400 shadow-md shadow-violet-600/20'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center font-mono ${
                          cadet.rank === 1
                            ? 'bg-amber-500 text-slate-950'
                            : cadet.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : cadet.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{cadet.rank}
                      </span>

                      <img
                        src={cadet.avatar}
                        alt={cadet.name}
                        className="w-9 h-9 rounded-full object-cover border border-violet-500/30"
                      />

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{cadet.name}</span>
                          {cadet.isCurrentUser && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-400 text-slate-950 font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{cadet.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-orange-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-orange-400" />
                        {cadet.streak}d
                      </span>
                      <span className="text-purple-300 font-bold">
                        {cadet.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WEEKLY TESTS */}
          {activeTab === 'weekly-tests' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-violet-950">
                <div>
                  <h4 className="text-sm font-bold text-white">Weekly Rigor Tests & Certifications</h4>
                  <p className="text-xs text-slate-400">Timed examinations to test retention across all 3 tracks</p>
                </div>
                <span className="text-xs font-mono text-cyan-300">Term 1: 3 Weeks</span>
              </div>

              <div className="space-y-3">
                {MOCK_WEEKLY_TESTS.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-violet-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{test.title}</span>
                        {test.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Passed • {test.score}%
                          </span>
                        )}
                        {test.status === 'available' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Active Now
                          </span>
                        )}
                        {test.status === 'locked' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                            Unlocks Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{test.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                        <span>{test.questionsCount} Questions</span>
                        <span>•</span>
                        <span>{test.timeLimitMinutes} Mins</span>
                        {test.badgeAwarded && (
                          <>
                            <span>•</span>
                            <span className="text-amber-300 font-semibold">{test.badgeAwarded}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {test.status === 'available' ? (
                        <button
                          onClick={() => {
                            onClose();
                            onStartLesson?.('lesson-2');
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Start Weekly Exam
                        </button>
                      ) : test.status === 'completed' ? (
                        <button
                          onClick={() => {
                            onClose();
                            onStartLesson?.('lesson-1');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          Review Answers
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-slate-900 text-slate-600 text-xs font-medium cursor-not-allowed border border-slate-800"
                        >
                          Locked
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-violet-950 bg-[#080516] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
