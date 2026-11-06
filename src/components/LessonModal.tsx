import React from 'react';
import { Lesson, UserProfile } from '../types';
import { ExposureSimulator } from './simulators/ExposureSimulator';
import { OrbitTransferSimulator } from './simulators/OrbitTransferSimulator';
import { StellarSpectrumSimulator } from './simulators/StellarSpectrumSimulator';
import { LambdaLogo, LambdaMascot } from './BrandAssets';
import {
  X,
  BookOpen,
  HelpCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Coins,
  Sparkles,
  Flame,
  Award,
  Rocket
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  user: UserProfile;
  onClose: () => void;
  onComplete: (lessonId: string, xpEarned: number, coinsEarned: number) => void;
  onNavigateToCapsule?: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  user,
  onClose,
  onComplete,
  onNavigateToCapsule,
}) => {
  const [activeTab, setActiveTab] = React.useState<'slides' | 'quiz' | 'papers'>('slides');
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState<number>(0);

  // Lambda's real-life comic speech state (no "Mood: Curious" or "Celestial Companion" prefix)
  const [lambdaSpeech, setLambdaSpeech] = React.useState<string>(
    `Hey ${user.name}! Buckle up in the space cab! Today we're exploring "${lesson.title}". Ready to see how the universe works?`
  );
  const [simpleFifthGradeMode, setSimpleFifthGradeMode] = React.useState<boolean>(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = React.useState<boolean>(false);

  const currentSlide = lesson.slides[currentSlideIndex];
  const hasPapers = Boolean(lesson.researchPapers && lesson.researchPapers.length > 0);

  // Conversational comic-book speech updates when navigating slides
  React.useEffect(() => {
    if (activeTab === 'quiz') {
      setLambdaSpeech(
        `Quiz time, ${user.name}! Don't sweat it—just think about what we tested in the space cab. You've totally got this!`
      );
      return;
    }
    if (activeTab === 'papers') {
      setLambdaSpeech(
        `Whoa, checking out the real scientific research papers! Even if the math looks fancy, the core idea is super cool: scientists measure light and gravity waves from deep space!`
      );
      return;
    }

    if (currentSlideIndex === 0) {
      setLambdaSpeech(
        `Look out the cab window! Did you know starlight takes years just to reach our eyes? Looking up at the night sky is literally like using a time machine!`
      );
    } else if (currentSlideIndex === 1) {
      setLambdaSpeech(
        `Here's the cool trick: imagine holding a flashlight right next to your face, and then walking a block away. It looks dimmer farther away, right? Astronomers use that exact trick to measure how far stars are!`
      );
    } else {
      setLambdaSpeech(
        `Awesome job making it to slide ${currentSlideIndex + 1}! Try playing with the interactive controls on the right, or click "Checkpoint Quiz" when you're ready!`
      );
    }
  }, [currentSlideIndex, activeTab, user.name]);

  const handleAskLambda = (promptType: 'fifth-grade' | 'rocket-analogy' | 'quiz-hint') => {
    if (promptType === 'fifth-grade') {
      setSimpleFifthGradeMode((prev) => !prev);
      setLambdaSpeech(
        `Okay, 5th-Grade Simple Version! Imagine throwing a baseball: the harder you throw it, the farther it goes. Rockets and starlight work by simple push-and-pull rules just like that!`
      );
    } else if (promptType === 'rocket-analogy') {
      setLambdaSpeech(
        `Think of our space cab like a skateboard on a frictionless ice rink! Once we fire our thrusters for a second, we keep coasting through space forever without using any more fuel!`
      );
    } else {
      setLambdaSpeech(
        `Psst! Secret quiz tip: remember that space has no air to twinkle the stars—Earth's bumpy atmosphere is what makes stars look like they're blinking!`
      );
    }
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleQuizSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= Math.ceil(lesson.quiz.length / 2)) {
      setIsCompletedSuccess(true);
      setLambdaSpeech(
        `BOOM! High five, ${user.name}! You crushed that quiz! I'm firing up the space cab thrusters so we can drift to the next cosmic checkpoint!`
      );
      onComplete(lesson.id, lesson.xpReward, lesson.coinsReward);
    } else {
      setLambdaSpeech(
        `Ooh, so close! No worries at all—every astronaut practices in the simulator first. Check the green explanations and hit Retry!`
      );
    }
  };

  // Upper progress bar calculation
  const totalSteps = lesson.slides.length + 1;
  const currentStep = activeTab === 'quiz' ? totalSteps : currentSlideIndex + 1;
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  const dailyTarget = user.dailyLessonsGoal || 20;
  const dailyLessonsDone = (user.dailyLessonsCompleted || 0) + (isCompletedSuccess ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#0b0719] border border-amber-500/30 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* UPPER PROGRESS BAR (Strictly in Upper Bar, No Sidebar) */}
        <div className="border-b border-violet-900/50 bg-[#080514] px-5 py-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LambdaLogo size={32} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                    {lesson.trackName}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                    {lesson.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-300">
                Lesson Progress: {progressPercentage}%
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Lesson"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upper Progress Line */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Top Mode Tabs */}
        <div className="px-6 py-2.5 bg-[#0e0820] border-b border-violet-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'slides'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Lesson ({currentSlideIndex + 1}/{lesson.slides.length})</span>
            </button>

            {hasPapers && (
              <button
                onClick={() => setActiveTab('papers')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'papers'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Research Papers ({lesson.researchPapers?.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Checkpoint Quiz ({lesson.quiz.length} Qs)</span>
            </button>
          </div>
        </div>

        {/* 50/50 SPLIT BODY: LEFT HALF = SPACE CAB & LAMBDA (50%) | RIGHT HALF = LESSON CONTENT (50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT HALF (6 cols = 50% of space): SPACE CAB WITH LAMBDA GUIDING IT */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#130b2e] via-[#0c0620] to-[#080415] p-6 border-b lg:border-b-0 lg:border-r border-violet-900/50 flex flex-col justify-between relative overflow-hidden">
            {/* Space Cab Arch & Canopy Frame */}
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300/80 border-b border-violet-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">SPACE CAB</span>
              </div>
              <span className="text-slate-400">50% Companion Deck</span>
            </div>

            {/* COMIC-BOOK SPEECH BUBBLE */}
            <div className="relative my-4 bg-white text-slate-950 rounded-3xl p-5 shadow-2xl border-2 border-cyan-400">
              <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-900">
                "{lambdaSpeech}"
              </p>
              {/* Comic pointer tail pointing down toward Lambda */}
              <div className="w-5 h-5 bg-white border-r-2 border-b-2 border-cyan-400 transform rotate-45 mx-auto -mb-7 mt-2.5" />
            </div>

            {/* LAMBDA MASCOT IN THE CAB (Occupies central visual stage) */}
            <div className="my-auto py-3 flex flex-col items-center justify-center">
              <LambdaMascot size={210} />
              <div className="mt-2 px-4 py-1 rounded-full bg-[#1a103c] border border-amber-500/40 text-amber-300 font-extrabold text-sm tracking-wide shadow-md">
                Lambda
              </div>
            </div>

            {/* Cab Dashboard Controls to Talk with Lambda */}
            <div className="pt-3 border-t border-violet-900/40 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 text-center">
                Ask Lambda inside the Space Cab:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAskLambda('fifth-grade')}
                  className="px-3 py-2 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-xs font-semibold text-violet-200 transition-colors cursor-pointer"
                >
                  Make It Super Simple
                </button>
                <button
                  type="button"
                  onClick={() => handleAskLambda('rocket-analogy')}
                  className="px-3 py-2 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-xs font-semibold text-cyan-200 transition-colors cursor-pointer"
                >
                  Space Cab Example
                </button>
                <button
                  type="button"
                  onClick={() => handleAskLambda('quiz-hint')}
                  className="px-3 py-2 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-xs font-semibold text-amber-200 transition-colors cursor-pointer"
                >
                  Give Me a Hint
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT HALF (6 cols = 50% of space): SLIDES, SIMULATORS & QUIZ */}
          <div className="lg:col-span-6 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            {/* TAB 1: SLIDES */}
            {activeTab === 'slides' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {currentSlide.title}
                  </h3>

                  {simpleFifthGradeMode && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs sm:text-sm text-emerald-200 leading-relaxed">
                      <strong className="text-emerald-300 block mb-1">
                        🌟 5th-Grade Friendly Breakdown:
                      </strong>
                      Everything in space—from giant rockets to tiny particles of starlight—follows simple rules you can test right at home. Light travels super fast (300,000 km every second!), and rockets push forward by shooting hot gas backward, just like letting go of an untied balloon!
                    </div>
                  )}

                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentSlide.content}
                  </p>

                  {currentSlide.bulletPoints && (
                    <ul className="space-y-2 pl-4 text-xs sm:text-sm text-slate-300 list-disc">
                      {currentSlide.bulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {currentSlide.formula && (
                    <div className="p-4 rounded-2xl bg-[#070515] border border-amber-500/30 text-center space-y-1 my-3">
                      <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider block">
                        Space Science Formula
                      </span>
                      <div className="font-mono text-sm sm:text-base text-amber-200 font-bold">
                        {currentSlide.formula}
                      </div>
                      {currentSlide.formulaExplainer && (
                        <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
                          {currentSlide.formulaExplainer}
                        </p>
                      )}
                    </div>
                  )}

                  {currentSlide.tip && (
                    <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{currentSlide.tip}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Simulators */}
                {currentSlide.diagramType === 'exposure-triangle' && (
                  <div className="pt-2">
                    <ExposureSimulator />
                  </div>
                )}
                {currentSlide.diagramType === 'orbit-transfer' && (
                  <div className="pt-2">
                    <OrbitTransferSimulator />
                  </div>
                )}
                {currentSlide.diagramType === 'stellar-spectrum' && (
                  <div className="pt-2">
                    <StellarSpectrumSimulator />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RESEARCH PAPERS */}
            {activeTab === 'papers' && hasPapers && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
                  <span className="font-semibold block mb-0.5">Primary Scientific Citations</span>
                  Peer-reviewed papers backing this module, properly credited for advanced learners.
                </div>

                {lesson.researchPapers?.map((paper, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white font-display">
                        {paper.title}
                      </h4>
                      <span className="text-xs font-mono text-amber-300 shrink-0">
                        {paper.year}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400">Authors:</span> {paper.authors}
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400">Journal:</span> <em>{paper.journal}</em>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#070914] p-3 rounded-lg border border-slate-800">
                      {paper.summary}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400">DOI: {paper.doi}</div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: QUIZ */}
            {activeTab === 'quiz' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {isCompletedSuccess ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-violet-950/40 to-slate-900 border border-amber-500/40 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
                      🚀
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white font-display">
                        Lesson Complete & Streak Recorded!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Awesome job! Your space cab is ready to drift to the next cosmic checkpoint.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>+{lesson.coinsReward} Coins</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>+{lesson.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                        <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span>Streak Kept!</span>
                      </div>
                    </div>

                    {/* Daily XP & Lesson Target Progress */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-violet-500/30 space-y-2 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Daily Target Progress</span>
                        <span className="font-mono text-amber-300">
                          {dailyLessonsDone} / {dailyTarget} lessons today
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, (dailyLessonsDone / dailyTarget) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      {onNavigateToCapsule && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToCapsule();
                          }}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Next: Space Capsule Drifting View</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lesson.quiz.map((q, qIndex) => {
                      const answered = selectedAnswers[q.id];
                      const isAnswered = answered !== undefined;
                      const isCorrect = isAnswered && answered === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-slate-900/60 border border-violet-950 space-y-2.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {qIndex + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">
                              {q.question}
                            </h4>
                          </div>

                          <div className="space-y-2 pt-1 pl-8">
                            {q.options.map((option, optIdx) => {
                              const isChosen = answered === optIdx;
                              let btnStyle =
                                'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-violet-500/40';

                              if (isSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnStyle =
                                    'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                                } else if (isChosen) {
                                  btnStyle = 'border-red-500 bg-red-500/20 text-red-200';
                                }
                              } else if (isChosen) {
                                btnStyle =
                                  'border-amber-400 bg-amber-500/20 text-amber-200 font-semibold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(q.id, optIdx)}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle} cursor-pointer`}
                                >
                                  <span>{option}</span>
                                  {isSubmitted && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                  {isSubmitted && isChosen && optIdx !== q.correctIndex && (
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {isSubmitted && (
                            <div
                              className={`p-2.5 rounded-lg text-xs mt-2 ${
                                isCorrect
                                  ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                                  : 'bg-red-950/30 border border-red-500/30 text-red-300'
                              }`}
                            >
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex justify-end pt-2">
                      {!isSubmitted ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                        >
                          Submit Answers & Claim Streak
                        </button>
                      ) : !isCompletedSuccess ? (
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setSelectedAnswers({});
                          }}
                          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          Retry Quiz
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Slide Controls */}
            {activeTab === 'slides' && (
              <div className="pt-4 border-t border-violet-950 flex items-center justify-between">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {lesson.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        i === currentSlideIndex
                          ? 'bg-amber-400 w-5'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {currentSlideIndex < lesson.slides.length - 1 ? (
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm cursor-pointer"
                  >
                    <span>Checkpoint Quiz</span>
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
