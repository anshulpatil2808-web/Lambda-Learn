import React from 'react';
import { UserProfile, UserLevel } from '../types';
import { Flame, Coins, Gift, Orbit, LogIn, ChevronDown, Rocket, Code2 } from 'lucide-react';
import { LambdaLogo } from './BrandAssets';

interface NavbarProps {
  activeTab: 'welcome' | 'home' | 'learn' | 'community' | 'gallery' | 'capsule';
  setActiveTab: (tab: 'welcome' | 'home' | 'learn' | 'community' | 'gallery' | 'capsule') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenRewards: () => void;
  onOpenProfile: () => void;
  onOpenGitHub: () => void;
  onChangeLevel: (level: UserLevel) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenRewards,
  onOpenProfile,
  onOpenGitHub,
  onChangeLevel,
}) => {
  const [levelDropdownOpen, setLevelDropdownOpen] = React.useState(false);

  const levelLabels: Record<UserLevel, { label: string; tag: string; color: string }> = {
    beginner: { label: 'Beginner', tag: '5th–9th Grade Accessible Basics', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    intermediate: { label: 'Intermediate', tag: 'High School & 1st-Year Flight Math', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    advanced: { label: 'Advanced', tag: 'Research Papers & Derivations', color: 'text-amber-300 bg-amber-500/15 border-amber-500/40' },
  };

  const currentLevelConfig =
    (user && levelLabels[user.level]) ? levelLabels[user.level] : levelLabels['beginner'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#0a0614]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <button
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg py-1 cursor-pointer shrink-0"
            aria-label="Lambda Learn Welcome"
          >
            <LambdaLogo size={38} />
            <div className="leading-tight">
              <span className="font-serif font-bold text-sm sm:text-base tracking-wider text-amber-200 group-hover:text-amber-100 transition-colors uppercase whitespace-nowrap block">
                LAMBDA LEARN
              </span>
              <p className="text-[10px] text-amber-200/65 hidden 2xl:block whitespace-nowrap">
                Astrophysics · Cosmology · Rocket Science · Astrophotography
              </p>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('welcome')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'welcome'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              Welcome
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setActiveTab('capsule')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'capsule'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              <span>Space Cab</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'community'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              Learn Community
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              Gallery
            </button>
          </nav>
        </div>

        {/* Right side controls: GitHub, Level selector, Stats, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub link button */}
          <button
            onClick={onOpenGitHub}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-200 text-xs font-mono hover:bg-amber-950/40 transition-colors cursor-pointer"
            title="View open-source repository on GitHub"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>GitHub</span>
          </button>

          {/* Level Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${currentLevelConfig.color}`}
              aria-label="Select Learning Level"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{currentLevelConfig.label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {levelDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-amber-500/30 bg-[#140a2a] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setLevelDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 border-b border-purple-900/40 mb-1">
                  <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider font-mono">
                    Select Target Level
                  </span>
                </div>
                {(['beginner', 'intermediate', 'advanced'] as UserLevel[]).map((lvl) => {
                  const cfg = levelLabels[lvl];
                  const isSelected = (user?.level || 'beginner') === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => {
                        onChangeLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 text-white font-semibold border border-amber-500/40'
                          : 'text-slate-300 hover:bg-purple-900/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-sm font-medium">{cfg.label}</span>
                        {isSelected && <span className="text-[10px] text-amber-300">Active</span>}
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">{cfg.tag}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Progress Stats Counters */}
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold cursor-pointer hover:bg-orange-500/20 transition-colors"
                title={`${user.streaks} Day Learning Streak! Click to inspect profile.`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{user.streaks}</span>
                <span className="hidden sm:inline text-[10px] text-orange-300/80 font-normal">days</span>
              </button>

              <button
                onClick={onOpenRewards}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="Lambda Coins. Click to spend on rewards & gifts!"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                <span>{user.coins}</span>
              </button>

              <button
                onClick={onOpenRewards}
                className="p-1.5 rounded-xl text-amber-300/80 hover:text-amber-200 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30 transition-all cursor-pointer"
                title="Gifts & Bonuses Vault"
                aria-label="Rewards Store"
              >
                <Gift className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}

          {/* User Profile or Login Options */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#170c30] border border-amber-500/30 hover:border-amber-400/60 transition-colors cursor-pointer"
              aria-label="User Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50"
              />
              <span className="text-xs font-medium text-amber-100 hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              aria-label="Log In or Create Account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex border-t border-amber-500/20 px-2 py-1 bg-[#090416] justify-around">
        <button
          onClick={() => setActiveTab('welcome')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'welcome' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Welcome
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'home' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('learn')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'learn' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Learn
        </button>
        <button
          onClick={() => setActiveTab('capsule')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'capsule' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Cab
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'community' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'gallery' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}
        >
          Gallery
        </button>
      </div>
    </header>
  );
};
