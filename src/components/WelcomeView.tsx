import React from 'react';
import {
  Rocket,
  Star,
  Code2,
  Camera,
  Orbit,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Quote
} from 'lucide-react';
import { UserProfile, TrackId } from '../types';
import { LambdaMascot } from './BrandAssets';
import welcomeAcademyImg from '../assets/images/welcome_space_academy_1793966303647.jpg';

interface WelcomeViewProps {
  onStartLearning: () => void;
  onOpenAuth: () => void;
  onOpenGitHub: () => void;
  onDirectEnterDashboard?: () => void;
  onSelectTrackToLearn?: (track: TrackId) => void;
  user: UserProfile | null;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartLearning,
  onOpenGitHub,
  onDirectEnterDashboard,
  onSelectTrackToLearn,
}) => {
  const [activeExampleTab, setActiveExampleTab] = React.useState<'rockets' | 'cosmology' | 'astrophoto'>('rockets');
  const [thrustSlider, setThrustSlider] = React.useState<number>(65);

  const examples = {
    rockets: {
      title: 'Rocket Science & Aerospace (5th-Grade Friendly Example)',
      question: 'How does a heavy rocket push itself up into space where there is no air to push against?',
      lambdaComic:
        'Blow up a party balloon and let it go without tying the knot! The air rushes out the back, and the balloon zooms forward! Rockets work the exact same way—shooting super-fast hot gas out the nozzle pushes the rocket up into orbit!',
      physicsRule: 'Newton’s 3rd Law of Motion: Every action has an equal and opposite reaction (F_thrust = m_dot · v_exhaust).'
    },
    cosmology: {
      title: 'Astrophysics & Cosmology (How We Look Back in Time)',
      question: 'Why do astronomers say looking through a telescope is like using a real time machine?',
      lambdaComic:
        'Light is super fast, but space is HUGE! Sunlight takes 8 minutes to reach Earth. Light from the Andromeda Galaxy takes 2.5 million years to reach your eyes—so when you look at it tonight, you’re seeing how it looked when mammoths walked the Earth!',
      physicsRule: 'Light-Travel Distance: 1 Light-Year = 9.46 trillion kilometers (Speed of light c = 300,000 km/s).'
    },
    astrophoto: {
      title: 'Astrophotography (Capturing Hidden Space Colors)',
      question: 'How do regular cameras capture colorful glowing nebulae that look invisible to our naked eyes?',
      lambdaComic:
        'Your eyes refresh like a fast video camera every fraction of a second, so faint starlight doesn’t build up. But if you put a camera on a sturdy tripod and leave the shutter open for 20 seconds, it collects millions of photons like a bucket catching raindrops!',
      physicsRule: 'Rule of 500 for Pinpoint Stars: Max Exposure Seconds = 500 ÷ Lens Focal Length (mm).'
    }
  };

  const reviews = [
    {
      id: 'r-1',
      name: 'Dr. Elena Rostova',
      role: 'Astrophysics Faculty, Caltech & JWST Guest Observer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote:
        'Lambda Learn makes astrophysics and cosmology genuinely clear for 5th-grade beginners while still offering rigorous Cepheid variable math and LIGO gravitational wave papers for university students.',
      highlight: '5th Grade to University Rigor'
    },
    {
      id: 'r-2',
      name: 'Maya Lin',
      role: 'President, DarkSky Youth Astrophotographers',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote:
        'I went from blurry night sky photos to sharp Orion Nebula exposures using the Rule of 500 simulator and Lambda’s comic tips inside the space cab!',
      highlight: 'Hands-On Astrophotography'
    },
    {
      id: 'r-3',
      name: 'Marcus Vance',
      role: 'Aerospace Propulsion Engineer, Orbital Dynamics Lab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote:
        'Whether a student wants to learn basic rocket science from scratch or simulate Hohmann orbital transfers, the self-paced tracks make aerospace intuitive.',
      highlight: 'Accessible Rocket Science'
    },
    {
      id: 'r-4',
      name: 'ProInnoTech (Project Creator & Lead Architect)',
      role: 'Founder of Lambda Learn • Open-Source Space Curriculum',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      quote:
        'My dream is to make astrophysics, cosmology, rocket science, and astrophotography so clear and inspiring that a 5th grader can understand physics and rockets alongside our global community.',
      highlight: 'Founder’s Vision'
    }
  ];

  const currentEx = examples[activeExampleTab];

  return (
    <div className="space-y-14 pb-16 animate-in fade-in duration-300">
      {/* HERO STAGE WITH SINGLE SPACE CAB ASSISTANT COMPANION VIEW */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-[#090416] shadow-2xl">
        <div className="relative w-full min-h-[540px] lg:min-h-[600px] flex items-center">
          {/* Background Image: Observatory Learning Environment */}
          <img
            src={welcomeAcademyImg}
            alt="Futuristic Astronomical Learning Academy & Observatory"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />

          {/* Measured Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090416] via-[#090416]/80 to-[#090416]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090416]/95 via-[#090416]/85 to-[#090416]/40" />

          {/* 50/50 Split Hero Content: Left 6 Cols = Mission & Start Learning | Right 6 Cols = Single Space Cab Companion View */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 sm:px-12 py-10 items-center">
            {/* Left 6 Cols: Headline, Mission & Start Learning CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/35 text-xs text-amber-200 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Self-Paced Astrophysics · Cosmology · Rocket Science · Astrophotography</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-[1.12]">
                Space Science & Rocketry{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
                  Anyone Can Understand.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Learn <strong>Astrophysics & Cosmology</strong>, <strong>Rocket Science & Aerospace</strong>, and <strong>Astrophotography</strong> separately at your own pace—or all together! Designed so a <strong>5th-grade student</strong> can grasp real physics and rockets from scratch, all the way up to university research papers.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onStartLearning}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {onDirectEnterDashboard && (
                  <button
                    onClick={onDirectEnterDashboard}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-amber-200 border border-amber-500/40 text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span>Explore Full Website Directly</span>
                  </button>
                )}

                <button
                  onClick={onOpenGitHub}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>GitHub Repo</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5th-Grade Accessible Physics</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Separate Self-Paced Topics</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Guided by Lambda in the Space Cab</span>
                </span>
              </div>
            </div>

            {/* Right 6 Cols (50% of Space): Single Space Cab Assistant Companion View */}
            <div className="lg:col-span-6 bg-[#0f0824]/95 border border-amber-500/35 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-4">
              <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-violet-900/50 pb-2">
                <span>SPACE CAB</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveExampleTab('rockets')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      activeExampleTab === 'rockets'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    Rockets
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveExampleTab('cosmology')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      activeExampleTab === 'cosmology'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    Cosmology
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveExampleTab('astrophoto')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      activeExampleTab === 'astrophoto'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    Astrophoto
                  </button>
                </div>
              </div>

              {/* Comic Speech Bubble */}
              <div className="relative w-full bg-white text-slate-950 rounded-2xl p-4 shadow-lg border-2 border-cyan-400">
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-900">
                  "{currentEx.lambdaComic}"
                </p>
                <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-cyan-400 transform rotate-45 mx-auto -mb-6 mt-2" />
              </div>

              <div className="pt-2 flex flex-col items-center">
                <LambdaMascot size={175} />
                <span className="mt-1 px-3.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold text-xs">
                  Lambda
                </span>
              </div>

              {/* Interactive Thruster Sandbox inside the Space Cab */}
              <div className="w-full pt-2 border-t border-violet-900/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Space Cab Thruster Test: <strong className="text-amber-300">{thrustSlider}%</strong>
                  </span>
                  <span className="font-mono text-cyan-300">
                    {(thrustSlider * 0.12).toFixed(1)} km/s {thrustSlider >= 65 ? '✓ Orbit!' : '• Sub-orbital'}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={thrustSlider}
                  onChange={(e) => setThrustSlider(Number(e.target.value))}
                  aria-label="Test Rocket Thruster Power"
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE SEPARATE SELF-PACED LEARNING PATHWAYS */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            Learn Separately or Together • Self-Paced
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Three Independent Space Topics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Pick any single subject to study at your own pace, or combine all three along your cosmic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0d071e] border border-violet-900/50 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <Sparkles className="w-7 h-7 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-display">
                1. Astrophysics & Cosmology
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Understand gravity, light, stars, black holes, galaxies, and the expansion of the universe—from 5th-grade intuition to LIGO gravitational wave papers.
              </p>
            </div>
            <button
              onClick={() => (onSelectTrackToLearn ? onSelectTrackToLearn('astronomy') : onStartLearning())}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Explore Astrophysics & Cosmology →
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d071e] border border-violet-900/50 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <Orbit className="w-7 h-7 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-display">
                2. Rocket Science & Aerospace
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Master the basics of how rockets work, multi-stage boosters, heat shields, and orbital Hohmann transfers in plain, visual steps.
              </p>
            </div>
            <button
              onClick={() => (onSelectTrackToLearn ? onSelectTrackToLearn('aerospace') : onStartLearning())}
              className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Explore Rocket Science & Aerospace →
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d071e] border border-violet-900/50 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <Camera className="w-7 h-7 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-display">
                3. Night-Sky Astrophotography
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Learn camera settings (ISO, aperture, shutter speed), the Rule of 500, star trackers, and deep-sky nebula processing.
              </p>
            </div>
            <button
              onClick={() => (onSelectTrackToLearn ? onSelectTrackToLearn('astrophotography') : onStartLearning())}
              className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Explore Astrophotography →
            </button>
          </div>
        </div>
      </div>

      {/* COMMUNITY & ACADEMIC REVIEWS */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-300">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Learner & Educator Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Loved by Students, Stargazers & Engineers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#0c071d]/90 border border-violet-900/40 flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-amber-300">
                    {rev.highlight}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-violet-950/60">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
