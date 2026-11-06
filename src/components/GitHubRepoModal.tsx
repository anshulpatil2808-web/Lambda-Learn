import React from 'react';
import {
  X,
  Star,
  GitFork,
  Eye,
  GitBranch,
  Folder,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Code2,
  GitCommit,
  ShieldAlert,
  BookOpen
} from 'lucide-react';

interface GitHubRepoModalProps {
  onClose: () => void;
}

export const GitHubRepoModal: React.FC<GitHubRepoModalProps> = ({ onClose }) => {
  const [hasStarred, setHasStarred] = React.useState<boolean>(false);
  const [starsCount, setStarsCount] = React.useState<number>(2480);
  const [copiedClone, setCopiedClone] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'code' | 'commits' | 'readme'>('code');

  const handleToggleStar = () => {
    if (hasStarred) {
      setHasStarred(false);
      setStarsCount((prev) => prev - 1);
    } else {
      setHasStarred(true);
      setStarsCount((prev) => prev + 1);
    }
  };

  const handleCopyClone = () => {
    navigator.clipboard?.writeText('git clone https://github.com/lambdalearn/space-curriculum.git');
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0c0d1c] border border-violet-500/30 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080914]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-100 flex items-center justify-center border border-slate-700">
              <Code2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">lambdalearn /</span>
                <span className="text-sm font-bold text-white font-mono">space-curriculum</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  Public
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official open-source curriculum, physics simulators & research datasets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                hasStarred
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${hasStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span>{hasStarred ? 'Starred' : 'Star'}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono">
                {starsCount.toLocaleString()}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Repository Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-nav Stats */}
        <div className="px-6 py-3 bg-[#0a0b18] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-mono text-slate-300">main</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>382 forks</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>145 watching</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'code' ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code Files
            </button>
            <button
              onClick={() => setActiveTab('commits')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'commits' ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recent Commits
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'readme' ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              README.md
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Clone box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300 overflow-x-auto">
              <span className="text-violet-400 font-bold">$</span>
              <span>git clone https://github.com/lambdalearn/space-curriculum.git</span>
            </div>
            <button
              onClick={handleCopyClone}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-200 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedClone ? 'Copied URL!' : 'Copy Clone URL'}</span>
            </button>
          </div>

          {/* TAB 1: Code Files */}
          {activeTab === 'code' && (
            <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 bg-slate-950/60 font-mono text-xs">
              <div className="px-4 py-2.5 bg-slate-900/70 text-slate-400 text-[11px] flex items-center justify-between">
                <span>Directory Path: /lambdalearn/space-curriculum</span>
                <span>Latest release: v2.4.0 (Mainnet)</span>
              </div>

              {[
                { name: 'curriculum/astronomy', desc: 'Keplerian orbits, Cepheid distance ladders & stellar nucleosynthesis', date: '2 hours ago', type: 'dir' },
                { name: 'curriculum/aerospace', desc: 'Hohmann burn delta-v derivations, Tsiolkovsky rocket equation', date: 'yesterday', type: 'dir' },
                { name: 'curriculum/astrophotography', desc: 'Rule of 500 calculator, CMOS SNR equations, Bortle calibration', date: '3 days ago', type: 'dir' },
                { name: 'simulators/orbit-transfer', desc: 'Interactive Hohmann transfer canvas with orbital periapsis/apoapsis', date: '4 days ago', type: 'dir' },
                { name: 'simulators/exposure-triangle', desc: 'Aperture, ISO, star trail velocity calculator engine', date: '5 days ago', type: 'dir' },
                { name: 'research-papers/citations.bib', desc: 'LIGO GW150914 PRL 2016 & JWST NIRCam SSR 2023 references', date: '1 week ago', type: 'file' },
                { name: 'package.json', desc: 'Vite 8, React 19, TypeScript 7.0 dependencies', date: '2 days ago', type: 'file' },
                { name: 'README.md', desc: 'Open-access documentation, pedagogy philosophy & contributor guidelines', date: 'yesterday', type: 'file' },
                { name: 'LICENSE', desc: 'MIT Open-Source Educational License', date: '1 month ago', type: 'file' },
              ].map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    {item.type === 'dir' ? (
                      <Folder className="w-4 h-4 text-violet-400 shrink-0" />
                    ) : (
                      <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <span className="text-white font-medium hover:underline cursor-pointer">{item.name}</span>
                  </div>
                  <div className="hidden md:block text-slate-400 text-[11px] truncate max-w-xs">{item.desc}</div>
                  <span className="text-slate-500 text-[11px] shrink-0">{item.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Commits */}
          {activeTab === 'commits' && (
            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  hash: 'f8b2c41',
                  msg: 'feat(companion): integrate Lambda celestial AI orbital scholar mentor HUD',
                  author: 'Lambda Learn Lead Researcher',
                  time: '3 hours ago',
                  verified: true,
                },
                {
                  hash: 'a19e442',
                  msg: 'feat(onboarding): add 4-discipline diagnostic space assessment quiz',
                  author: 'Lambda Learn Lead Researcher',
                  time: '6 hours ago',
                  verified: true,
                },
                {
                  hash: 'e73100c',
                  msg: 'refactor(capsule): render deep-space capsule telemetry with RCS thrust bursts',
                  author: 'Lead Aerospace Contributor',
                  time: '1 day ago',
                  verified: true,
                },
                {
                  hash: 'c28905a',
                  msg: 'math(astronomy): verify Henrietta Leavitt period-luminosity relation constants',
                  author: 'Dr. Elena Rostova',
                  time: '2 days ago',
                  verified: true,
                },
                {
                  hash: 'b66014e',
                  msg: 'fix(optics): eliminate optical shutter lag in high Bortle narrowband simulator',
                  author: 'Maya Lin',
                  time: '3 days ago',
                  verified: true,
                },
              ].map((commit, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-white font-semibold text-xs">{commit.msg}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-6 flex items-center gap-2">
                      <span>{commit.author}</span>
                      <span>•</span>
                      <span>{commit.time}</span>
                      {commit.verified && (
                        <span className="px-1.5 py-0.2 rounded border border-emerald-500/40 text-emerald-400 text-[9px]">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] shrink-0 font-mono">
                    {commit.hash}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: README */}
          {activeTab === 'readme' && (
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-300 font-sans">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-white text-sm">README.md</span>
              </div>
              <h1 className="text-xl font-bold text-white font-display">
                Lambda Learn: Open Astrophysics & Aerospace Curriculum
              </h1>
              <p>
                An interactive space science repository designed to bridge introductory 9th-grade astronomy with university-level astrophysics, orbital mechanics, and scientific astrophotography.
              </p>
              <h2 className="text-sm font-bold text-violet-300 font-display pt-2">
                Curriculum Tracks & Simulators
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Astrophotography:</strong> Rule of 500 math, equatorial mount polar alignment, CMOS sensor quantum efficiency and narrowband filtering.</li>
                <li><strong>Astrophysics:</strong> Stellar evolution, HR diagram spectroscopy, Cepheid variables, and LIGO gravitational wave strain equations.</li>
                <li><strong>Aerospace Engineering:</strong> Tsiolkovsky rocket equation, multi-stage delta-v budgeting, and Hohmann transfer orbits.</li>
              </ul>
              <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-500/30 text-violet-200">
                <strong>Project Creator & Architect:</strong> Curated and directed by the lead space science researcher. Open for community peer contributions under MIT license.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080914] flex items-center justify-between text-xs text-slate-400">
          <div>Licensed under MIT • Free & Open Access</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Repository View
          </button>
        </div>
      </div>
    </div>
  );
};
