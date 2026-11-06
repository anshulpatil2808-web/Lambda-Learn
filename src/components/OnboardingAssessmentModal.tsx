import React from 'react';
import {
  X,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
} from 'lucide-react';
import { UserLevel, TrackId } from '../types';
import { LambdaLogo, LambdaMascot } from './BrandAssets';

interface OnboardingAssessmentModalProps {
  onClose: () => void;
  onCompleteOnboarding: (
    userData: {
      name: string;
      level: UserLevel;
      roleBackground: string;
      discoverySource: string;
      dailyMinutesGoal: number;
      dailyLessonsGoal: number;
      preferredTrack: TrackId | 'all';
    },
    autoLaunchFirstLesson: boolean
  ) => void;
}

interface EasySpaceQuestion {
  id: string;
  topic: string;
  lambdaQuestion: string;
  options: { text: string; emoji: string }[];
  correctIndex: number;
  lambdaReaction: string;
}

const EASY_SPACE_QUESTIONS: EasySpaceQuestion[] = [
  {
    id: 'q1-mars',
    topic: 'Planets & Solar System • Question 1 of 4',
    lambdaQuestion:
      'Warm-up time! NASA’s Curiosity and Perseverance rovers are driving on this dusty world right now. Which planet is famous as the "Red Planet" because its surface is covered in rusty iron dust?',
    options: [
      { text: 'Mars', emoji: '🔴' },
      { text: 'Venus', emoji: '🟡' },
      { text: 'Neptune', emoji: '🔵' },
      { text: 'Mercury', emoji: '⚪' }
    ],
    correctIndex: 0,
    lambdaReaction:
      'Boom! Spot on! Mars is covered in iron oxide—the exact same stuff as rust on an old bike! Click Next for question 2!'
  },
  {
    id: 'q2-rockets',
    topic: 'Rocket Science & Aerospace • Question 2 of 4',
    lambdaQuestion:
      'Here’s a classic rocket science secret: jet airplanes scoop air from the sky to burn fuel. Why do space rockets carry their own oxygen tanks?',
    options: [
      { text: 'Because outer space has no air or oxygen, so rockets must bring their own!', emoji: '🚀' },
      { text: 'To make the rocket heavier so the wind does not blow it away', emoji: '💨' },
      { text: 'Just to cool down the paint on the outside of the nosecone', emoji: '🎨' },
      { text: 'Rockets actually run on solar power only, not fuel', emoji: '☀️' }
    ],
    correctIndex: 0,
    lambdaReaction:
      'You nailed rocket physics! In the vacuum of space there’s zero air—so rockets pack liquid oxygen right next to their fuel tank!'
  },
  {
    id: 'q3-cosmology',
    topic: 'Astrophysics & Cosmology • Question 3 of 4',
    lambdaQuestion:
      'Now let’s zoom way out into cosmology! What is the name of our home galaxy—the giant glowing spiral that holds our Sun, Earth, and over 100 billion stars?',
    options: [
      { text: 'The Milky Way Galaxy', emoji: '🌌' },
      { text: 'The Halley Comet Cloud', emoji: '☄️' },
      { text: 'The Apollo Nebula', emoji: '✨' },
      { text: 'The Northern Lights', emoji: '🌈' }
    ],
    correctIndex: 0,
    lambdaReaction:
      'Awesome! On a dark night far from city streetlights, you can see the glowing band of our Milky Way stretching right across the sky!'
  },
  {
    id: 'q4-astrophoto',
    topic: 'Astrophotography • Question 4 of 4',
    lambdaQuestion:
      'Last one! Because stars are faint, a camera shutter stays open for several seconds at night. What tool keeps the camera steady so the stars don’t blur?',
    options: [
      { text: 'A sturdy three-legged tripod', emoji: '🔭' },
      { text: 'Turning on the bright camera flash', emoji: '📸' },
      { text: 'Jumping up and down to get closer to the stars', emoji: '🦘' },
      { text: 'Wearing dark sunglasses while taking the photo', emoji: '🕶️' }
    ],
    correctIndex: 0,
    lambdaReaction:
      'Bingo! A solid tripod is every astrophotographer’s #1 best friend for razor-sharp night sky photos!'
  }
];

export const OnboardingAssessmentModal: React.FC<OnboardingAssessmentModalProps> = ({
  onClose,
  onCompleteOnboarding
}) => {
  const [step, setStep] = React.useState<number>(0);

  const [cadetName, setCadetName] = React.useState<string>('Alex');
  const [selectedRole, setSelectedRole] = React.useState<string>(
    '5th–8th Grade Space Explorer (Fun, clear basics from scratch)'
  );
  const [preferredTrack, setPreferredTrack] = React.useState<TrackId | 'all'>('all');
  const [dailyMinutesGoal, setDailyMinutesGoal] = React.useState<number>(20);
  const [dailyLessonsGoal, setDailyLessonsGoal] = React.useState<number>(5);
  const [selectedDiscovery, setSelectedDiscovery] = React.useState<string>(
    'YouTube Space & Science Videos'
  );

  const [userAnswers, setUserAnswers] = React.useState<Record<string, number>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = React.useState<boolean>(false);

  const totalSteps = 10;

  const roleOptions = [
    {
      label: '5th–8th Grade Space Explorer (Fun, clear basics from scratch)',
      tag: 'Grades 5–8',
      desc: 'Learn physics, rockets, and stars with everyday examples and zero confusing jargon.'
    },
    {
      label: 'High School Stargazer (9th–12th Grade)',
      tag: 'Grades 9–12',
      desc: 'Build strong foundations in astronomy, aerospace flight, and night-sky photography.'
    },
    {
      label: 'First-Year College & Engineering Student',
      tag: 'Undergrad',
      desc: 'Explore orbital mechanics, rocket propulsion equations, and optical sensors.'
    },
    {
      label: 'Graduate, Postgraduate or Researcher',
      tag: 'Advanced',
      desc: 'Includes peer-reviewed LIGO & JWST citations, derivations, and cosmology models.'
    },
    {
      label: 'Self-Paced Curious Learner (Any Age)',
      tag: 'Self-Paced',
      desc: 'Explore rockets, galaxies, and astrophotography at your own comfortable speed.'
    }
  ];

  const trackChoices: { id: TrackId | 'all'; title: string; subtitle: string; badge: string }[] = [
    {
      id: 'all',
      title: 'All Three Space Tracks (Self-Paced Mix)',
      subtitle: 'Switch freely between Rocket Science, Astrophysics & Cosmology, and Astrophotography anytime.',
      badge: 'Recommended'
    },
    {
      id: 'aerospace',
      title: 'Rocket Science & Aerospace Engineering',
      subtitle: 'Start from the basics of how rockets push off Earth, engines, staging, and orbital flight.',
      badge: 'Rockets & Flight'
    },
    {
      id: 'astronomy',
      title: 'Astrophysics, Cosmology & Astronomy',
      subtitle: 'Understand gravity, stars, galaxies, black holes, and the story of the universe.',
      badge: 'Cosmos & Physics'
    },
    {
      id: 'astrophotography',
      title: 'Night-Sky Astrophotography',
      subtitle: 'Learn how to capture pinpoint stars, the Moon, and glowing nebulae with any camera.',
      badge: 'Cameras & Optics'
    }
  ];

  const timeCommitments = [
    { mins: 10, label: '10 mins / day', desc: 'Casual Stargazer' },
    { mins: 20, label: '20 mins / day', desc: 'Steady Explorer' },
    { mins: 45, label: '45 mins / day', desc: 'Dedicated Rocketeer' },
    { mins: 60, label: '60+ mins / day', desc: 'Mission Specialist' }
  ];

  const workTargets = [
    { count: 3, label: '3 lessons / day', desc: 'Light & steady pace' },
    { count: 5, label: '5 lessons / day', desc: 'Balanced daily goal' },
    { count: 10, label: '10 lessons / day', desc: 'Fast-track explorer' },
    { count: 20, label: '20 lessons / day', desc: 'Max daily streak' }
  ];

  const discoverySources = [
    'YouTube Space & Science Videos',
    'GitHub Open-Source Repository',
    'School Teacher or Science Class',
    'Friends or Family',
    'Astronomy Club / Planetarium',
    'Social Media or Reddit'
  ];

  const handleSelectQuizOption = (questionId: string, optIdx: number) => {
    if (isAnswerRevealed) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optIdx }));
    setIsAnswerRevealed(true);
  };

  const handleNext = () => {
    setIsAnswerRevealed(false);
    setStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handleBack = () => {
    setIsAnswerRevealed(false);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const computeRecommendedLevel = (): UserLevel => {
    if (selectedRole.includes('Graduate')) return 'advanced';
    if (selectedRole.includes('First-Year College')) return 'intermediate';
    return 'beginner';
  };

  const quizScore = EASY_SPACE_QUESTIONS.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e081c] border border-amber-500/30 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-900/50 bg-[#090514]">
          <div className="flex items-center gap-3">
            <LambdaLogo size={34} />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-display">
                Your Space Journey Setup
              </h2>
              <p className="text-[11px] text-amber-300/80 font-mono">
                Step {step + 1} of {totalSteps}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Setup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* 50/50 Space Cab Split: Left Half = Assistant Companion View (Lambda asks in comic speech bubble) | Right Half = Answer Input/Options Only */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT HALF (6 cols = 50%): ASSISTANT COMPANION VIEW IN THE SPACE CAB */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#130b2e] via-[#0c0620] to-[#080414] p-6 border-b lg:border-b-0 lg:border-r border-violet-900/40 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-300/80 pb-2 border-b border-violet-900/40">
              <span>SPACE CAB</span>
              <span>STEP {step + 1} / {totalSteps}</span>
            </div>

            {/* Comic-Book Speech Bubble (Single Question Source — No Duplicate Right-Side Heading) */}
            <div className="relative w-full my-3 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-cyan-400">
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-900">
                {step === 0 &&
                  `"Hey there! Welcome into our space cab! Before we launch into the stars, what is your name and what should I call you?"`}
                {step === 1 &&
                  `"Awesome to meet you, ${cadetName || 'Explorer'}! Who are you? Pick your grade or background on the right so I can tailor our physics and rocket lessons for you!"`}
                {step === 2 &&
                  `"What would you like to learn first, ${cadetName}? You can study Astrophysics & Cosmology, Rocket Science, or Astrophotography separately at your own pace—or all three together!"`}
                {step === 3 &&
                  `"Let's set your Daily Target! How much time and how many mini-lessons would you like to complete each day?"`}
                {step === 4 &&
                  `"Quick check from Mission Control—where did you first hear about Lambda Learn?"`}
                {step >= 5 &&
                  step <= 8 &&
                  (isAnswerRevealed
                    ? `"${EASY_SPACE_QUESTIONS[step - 5].lambdaReaction}"`
                    : `"${EASY_SPACE_QUESTIONS[step - 5].lambdaQuestion}"`)}
                {step === 9 &&
                  `"Woohoo! You scored ${quizScore}/4 on the warm-up, ${cadetName}! Your space cab is fueled up and your custom flight plan is ready. Let's launch!"`}
              </p>
              <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-cyan-400 transform rotate-45 mx-auto -mb-6 mt-2" />
            </div>

            {/* Single Mascot Lambda + Single Name Badge */}
            <div className="py-2 flex flex-col items-center">
              <LambdaMascot size={180} />
              <span className="mt-1 px-4 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs">
                Lambda
              </span>
            </div>
          </div>

          {/* RIGHT HALF (6 cols = 50%): CLEAN INTERACTIVE CONTROLS ONLY (No Duplicate Question Titles) */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            {/* STEP 0: Name Input Only */}
            {step === 0 && (
              <div className="space-y-4 my-auto">
                <label
                  htmlFor="cadet-name-input"
                  className="text-xs font-mono uppercase tracking-wider text-amber-300 block"
                >
                  Enter Your Name or Call-Sign
                </label>
                <input
                  id="cadet-name-input"
                  type="text"
                  value={cadetName}
                  onChange={(e) => setCadetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && cadetName.trim()) handleNext();
                  }}
                  placeholder="e.g. Alex, Maya, Sam..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border-2 border-amber-400 text-white text-base font-semibold focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* STEP 1: Role Options Only */}
            {step === 1 && (
              <div className="space-y-2.5 my-auto">
                {roleOptions.map((item) => {
                  const active = selectedRole === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedRole(item.label)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-violet-600/25 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-violet-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{item.label}</span>
                        <span className="text-[10px] font-mono text-amber-300 shrink-0">{item.tag}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2: Track Choices Only */}
            {step === 2 && (
              <div className="space-y-2.5 my-auto">
                {trackChoices.map((track) => {
                  const active = preferredTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setPreferredTrack(track.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-violet-600/25 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-violet-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{track.title}</span>
                        <span className="text-[10px] font-mono text-cyan-300">{track.badge}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{track.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 3: Daily Target Controls Only */}
            {step === 3 && (
              <div className="space-y-5 my-auto">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Daily Time Target:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {timeCommitments.map((t) => (
                      <button
                        key={t.mins}
                        type="button"
                        onClick={() => setDailyMinutesGoal(t.mins)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          dailyMinutesGoal === t.mins
                            ? 'bg-amber-500/20 border-amber-400 text-white font-semibold'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-white">{t.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Daily Work Target (Lessons / Day):</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {workTargets.map((w) => (
                      <button
                        key={w.count}
                        type="button"
                        onClick={() => setDailyLessonsGoal(w.count)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          dailyLessonsGoal === w.count
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-white">{w.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{w.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Discovery Options Only */}
            {step === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-auto">
                {discoverySources.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedDiscovery(src)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                      selectedDiscovery === src
                        ? 'bg-violet-600/25 border-amber-400 text-white font-semibold'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-violet-500/40'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            )}

            {/* STEPS 5 to 8: Answer Choices Only (Lambda asks the question in the comic bubble on the left) */}
            {step >= 5 && step <= 8 && (
              <div className="space-y-3 my-auto">
                {(() => {
                  const qIdx = step - 5;
                  const q = EASY_SPACE_QUESTIONS[qIdx];
                  const chosen = userAnswers[q.id];

                  return (
                    <>
                      <div className="text-xs font-mono text-amber-300">
                        {q.topic}
                      </div>

                      <div className="space-y-2.5">
                        {q.options.map((opt, oIdx) => {
                          const isChosen = chosen === oIdx;
                          const isCorrect = oIdx === q.correctIndex;

                          let btnStyle =
                            'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-violet-500/50';
                          if (isAnswerRevealed) {
                            if (isCorrect) {
                              btnStyle =
                                'bg-emerald-950/50 border-emerald-400 text-emerald-200 font-semibold';
                            } else if (isChosen) {
                              btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-violet-600/30 border-amber-400 text-white font-semibold';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectQuizOption(q.id, oIdx)}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className="text-lg">{opt.emoji}</span>
                                <span>{opt.text}</span>
                              </span>
                              {isAnswerRevealed && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {isAnswerRevealed && isChosen && !isCorrect && (
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* STEP 9: Final Summary & Launch Buttons */}
            {step === 9 && (
              <div className="space-y-5 my-auto">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30 text-xs">
                  <div>
                    <span className="text-slate-400 block">Starting Level</span>
                    <strong className="text-amber-300 uppercase font-mono text-sm">
                      {computeRecommendedLevel()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Daily Target</span>
                    <strong className="text-cyan-300 font-mono text-sm">
                      {dailyMinutesGoal} mins • {dailyLessonsGoal} lessons/day
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Selected Focus</span>
                    <strong className="text-white capitalize">
                      {preferredTrack === 'all' ? 'All 3 Space Tracks' : preferredTrack}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Space Cab Guide</span>
                    <strong className="text-purple-300">Lambda</strong>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      onCompleteOnboarding(
                        {
                          name: cadetName || 'Alex',
                          level: computeRecommendedLevel(),
                          roleBackground: selectedRole,
                          discoverySource: selectedDiscovery,
                          dailyMinutesGoal,
                          dailyLessonsGoal,
                          preferredTrack
                        },
                        true
                      )
                    }
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Begin First Lesson Now (With Lambda)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onCompleteOnboarding(
                        {
                          name: cadetName || 'Alex',
                          level: computeRecommendedLevel(),
                          roleBackground: selectedRole,
                          discoverySource: selectedDiscovery,
                          dailyMinutesGoal,
                          dailyLessonsGoal,
                          preferredTrack
                        },
                        false
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Go Directly to Full Website Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Buttons (Back & Next) */}
            {step < 9 && (
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 0 && !cadetName.trim()) ||
                    (step >= 5 && step <= 8 && !isAnswerRevealed)
                  }
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
