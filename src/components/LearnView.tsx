import React from 'react';
import { UserProfile, UserLevel, TrackId, Lesson } from '../types';
import { LESSONS } from '../data/lessonsData';
import {
  Camera,
  Compass,
  Rocket,
  Search,
  CheckCircle2,
  Lock,
  Clock,
  Coins,
  Award,
  Sparkles,
  FileText,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';

interface LearnViewProps {
  user: UserProfile;
  onStartLesson: (lessonId: string) => void;
  userLevel: UserLevel;
  onChangeLevel: (level: UserLevel) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  user,
  onStartLesson,
  userLevel,
  onChangeLevel,
}) => {
  const [selectedTrack, setSelectedTrack] = React.useState<TrackId | 'all'>(
    user.preferredTrack || 'all'
  );
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    if (user.preferredTrack) {
      setSelectedTrack(user.preferredTrack);
    }
  }, [user.preferredTrack]);

  // Filter lessons
  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesTrack = selectedTrack === 'all' || lesson.trackId === selectedTrack;
    const matchesLevel = lesson.level === userLevel;
    const matchesSearch =
      searchQuery.trim() === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.trackName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrack && matchesLevel && matchesSearch;
  });

  const trackIcons: Record<TrackId, React.ReactNode> = {
    astrophotography: <Camera className="w-4 h-4 text-cyan-400" />,
    astronomy: <Compass className="w-4 h-4 text-indigo-400" />,
    aerospace: <Rocket className="w-4 h-4 text-orange-400" />,
  };

  const levelDescriptions: Record<UserLevel, { name: string; desc: string; badge: string }> = {
    beginner: {
      name: 'Beginner Level (5th–9th Grade Accessible)',
      desc: 'Clear, everyday physical explanations of rockets, gravity, stars, cosmology, and night-sky photography that any 5th grader or curious learner can master.',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    intermediate: {
      name: 'Intermediate Level',
      desc: 'Applied math and observational mechanics. Tsiolkovsky delta-V budgets, Hohmann transfers, spectral OBAFGKM classification, and equatorial star tracking.',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    advanced: {
      name: 'Advanced Level',
      desc: 'Peer-reviewed research papers with full academic attribution (LIGO GW150914, JWST NIRCam, NASA JPL trajectory optimization, CMOS read noise photometry).',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Level Explanation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum Navigator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Cosmic Learning Academy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Explore three foundational disciplines from scratch. Toggle between Beginner, Intermediate, and Advanced research-grade content anytime with zero restrictions.
          </p>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          {(['beginner', 'intermediate', 'advanced'] as UserLevel[]).map((lvl) => {
            const isSelected = userLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onChangeLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Info Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${levelDescriptions[userLevel].badge}`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm capitalize">{levelDescriptions[userLevel].name}</span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/30">
              Active Curriculum
            </span>
          </div>
          <p className="text-xs opacity-90 max-w-3xl">
            {levelDescriptions[userLevel].desc}
          </p>
        </div>
      </div>

      {/* Chapters Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Track Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTrack === 'all'
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Tracks ({LESSONS.filter(l => l.level === userLevel).length})
          </button>

          <button
            onClick={() => setSelectedTrack('astrophotography')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTrack === 'astrophotography'
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Astrophotography</span>
          </button>

          <button
            onClick={() => setSelectedTrack('astronomy')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTrack === 'astronomy'
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Astrophysics / Astronomy</span>
          </button>

          <button
            onClick={() => setSelectedTrack('aerospace')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTrack === 'aerospace'
                ? 'bg-orange-950/40 text-orange-300 border-orange-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-orange-400" />
            <span>Aerospace Engineering</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lessons & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Mini-Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const isCompleted = user.completedLessons.includes(lesson.id);
          const hasPapers = Boolean(lesson.researchPapers && lesson.researchPapers.length > 0);
          const hasSimulator = lesson.slides.some((s) => s.diagramType && s.diagramType !== 'none');

          return (
            <div
              key={lesson.id}
              className="flex flex-col justify-between p-5 rounded-3xl bg-gradient-to-b from-[#160b2e] via-[#100722] to-[#090416] border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 shadow-xl group space-y-4"
            >
              <div className="space-y-3">
                {/* Track Badge & Completed Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    {trackIcons[lesson.trackId]}
                    <span className="truncate max-w-[150px]">{lesson.trackName}</span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Ready
                    </span>
                  )}
                </div>

                {/* Lesson Title & Subtitle */}
                <div>
                  <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {lesson.subtitle}
                  </p>
                </div>

                {/* Special Tags (Simulators / Research Papers) */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hasSimulator && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      <Sliders className="w-3 h-3" /> Interactive Lab
                    </span>
                  )}
                  {hasPapers && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      <FileText className="w-3 h-3" /> Cited Papers ({lesson.researchPapers?.length})
                    </span>
                  )}
                </div>
              </div>

              {/* Footer info & Action button */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lesson.estimatedMinutes} mins</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 font-semibold font-mono">
                      +{lesson.coinsReward} 🪙
                    </span>
                    <span className="text-purple-300 font-semibold font-mono">
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onStartLesson(lesson.id)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Review Mini-Lesson</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Mini-Lesson</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-sm text-slate-400">
            No mini-lessons match your current filters. Try selecting "All Tracks" or clearing the search query.
          </p>
        </div>
      )}
    </div>
  );
};
