import React from 'react';
import { UserProfile, UserLevel } from '../types';
import { X, Sparkles, Orbit, Check, Lock, Mail, ArrowRight, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, initialMode = 'login' }) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'social' | 'email'>('social');
  const [emailStep, setEmailStep] = React.useState<'input' | 'otp'>('input');
  const [name, setName] = React.useState<string>('Alex Chen');
  const [email, setEmail] = React.useState<string>('cadet.alex@lambdalearn.space');
  const [level, setLevel] = React.useState<UserLevel>('beginner');
  
  // OTP state
  const [generatedOtp, setGeneratedOtp] = React.useState<string>('');
  const [otpDigits, setOtpDigits] = React.useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = React.useState<number>(60);
  const [simulatedInboxNotice, setSimulatedInboxNotice] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(null);

  const otpInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailStep === 'otp' && timerSeconds > 0 && !isSuccess) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailStep, timerSeconds, isSuccess]);

  const generateNewOtp = () => {
    // Generate authentic 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimerSeconds(60);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setSimulatedInboxNotice(`📬 [Lambda Mail Dispatch] Verification code for ${email}: ${code}`);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEmailStep('otp');
    setTimerSeconds(60);
    setSimulatedInboxNotice(`📬 [Lambda Mail Dispatch] Your OTP for ${email} is: ${code}`);
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 150);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto move to next input
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      if (entered === generatedOtp || entered === '123456') {
        setIsSuccess(true);
        setIsVerifying(false);

        setTimeout(() => {
          const verifiedUser: UserProfile = {
            id: `user-email-${Date.now().toString().slice(-4)}`,
            name: name.trim() || 'Cosmic Cadet',
            email: email.trim(),
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            provider: 'email',
            level,
            streaks: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            coins: 150,
            xp: 250,
            completedLessons: [],
            currentCheckpointId: 'checkpoint-earth',
            unlockedGifts: ['gift-badge-pioneer'],
            savedPosts: [],
            savedPhotos: [],
          };
          onLogin(verifiedUser);
          onClose();
        }, 800);
      } else {
        setIsVerifying(false);
        setOtpError(`Invalid code. Expected ${generatedOtp} (or test code 123456).`);
      }
    }, 600);
  };

  // Social Auth Handlers
  const handleSocialAuth = (provider: 'google' | 'apple' | 'linkedin') => {
    setLoadingProvider(provider);
    setTimeout(() => {
      const providerProfiles: Record<string, { name: string; email: string; avatar: string; level: UserLevel }> = {
        google: {
          name: 'Dr. Elena Rostova',
          email: 'elena.rostova@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          level: 'advanced',
        },
        apple: {
          name: 'Aarav Patel',
          email: 'aarav.astro@icloud.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          level: 'beginner',
        },
        linkedin: {
          name: 'Samantha Ray',
          email: 'samantha.ray@aerospace-systems.org',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          level: 'intermediate',
        },
      };

      const selected = providerProfiles[provider];
      const newUser: UserProfile = {
        id: `user-${provider}-${Date.now().toString().slice(-4)}`,
        name: selected.name,
        email: selected.email,
        avatar: selected.avatar,
        provider,
        level: selected.level,
        streaks: 5,
        lastActiveDate: new Date().toISOString().split('T')[0],
        coins: 260,
        xp: 620,
        completedLessons: ['astro-b1'],
        currentCheckpointId: 'checkpoint-lunar',
        unlockedGifts: ['gift-badge-pioneer', 'gift-apollo-patch'],
        savedPosts: [],
        savedPhotos: [],
      };

      onLogin(newUser);
      setLoadingProvider(null);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#160b2e] via-[#0f0722] to-[#090416] border border-purple-500/30 p-6 sm:p-7 space-y-5 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Glow ambient background pill */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0d061c] rounded-[10px] flex items-center justify-center font-display font-extrabold text-purple-300 text-lg">
                Λ
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>Lambda Learn Cosmos</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Access Portal
                </span>
              </h2>
              <p className="text-xs text-purple-200/70">
                Log in or create your space cadet credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
            aria-label="Close Authentication Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs: Social Instant vs Email with OTP */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#090416] border border-purple-900/50">
          <button
            onClick={() => {
              setSelectedMethod('social');
              setEmailStep('input');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedMethod === 'social'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Social SSO (Google, Apple, LinkedIn)
          </button>
          <button
            onClick={() => setSelectedMethod('email')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedMethod === 'email'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Email with OTP Verification
          </button>
        </div>

        {/* METHOD 1: SOCIAL LOGINS (Google, Apple, LinkedIn) */}
        {selectedMethod === 'social' && (
          <div className="space-y-3 pt-1">
            <span className="text-[11px] font-semibold uppercase font-mono tracking-wider text-purple-300/80 block">
              Choose your authentication provider:
            </span>

            {/* Google */}
            <button
              onClick={() => handleSocialAuth('google')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#110724] hover:bg-[#1a0c36] border border-purple-900/60 hover:border-purple-500/50 transition-all duration-200 text-left group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-purple-300 transition-colors">
                    Continue with Google
                  </span>
                  <span className="text-[11px] text-purple-300/60">
                    Sign in with your Google Workspace or Gmail account
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialAuth('apple')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#110724] hover:bg-[#1a0c36] border border-purple-900/60 hover:border-purple-500/50 transition-all duration-200 text-left group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center p-2 shadow-sm shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-6.19-9.5-11.03-20.12-14.51-31.87-3.48-11.75-5.22-23.01-5.22-33.78 0-14.24 3.48-26.08 10.45-35.53 6.96-9.44 15.93-14.28 26.9-14.51 5.34 0 11.06 1.41 17.16 4.23 6.1 2.82 10.02 4.34 11.75 4.56 2.07-.33 6.22-1.9 12.46-4.73 6.23-2.82 11.66-4.13 16.29-3.92 12.08.76 21.84 5.38 29.28 13.86-10.78 6.52-16.03 15.54-15.76 27.06.33 9.02 3.82 16.57 10.46 22.65 6.64 6.08 14.53 9.61 23.68 10.59-2.18 6.53-4.91 13.1-8.19 19.71zM119.22 33.04c0-7.39 2.62-14.18 7.85-20.37 5.23-6.19 11.66-10.3 19.3-12.33.22 1.3.33 2.55.33 3.75 0 7.39-2.73 14.29-8.18 20.7-5.45 6.41-11.89 10.43-19.3 12.05z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-purple-300 transition-colors">
                    Continue with Apple
                  </span>
                  <span className="text-[11px] text-purple-300/60">
                    Sign in with Apple ID and iCloud credentials
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleSocialAuth('linkedin')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#110724] hover:bg-[#1a0c36] border border-purple-900/60 hover:border-purple-500/50 transition-all duration-200 text-left group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center p-2 shadow-sm shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-purple-300 transition-colors">
                    Continue with LinkedIn
                  </span>
                  <span className="text-[11px] text-purple-300/60">
                    Connect professional profile & aerospace affiliations
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* METHOD 2: EMAIL WITH 6-DIGIT OTP VERIFICATION */}
        {selectedMethod === 'email' && (
          <div className="space-y-4 pt-1">
            {emailStep === 'input' && (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0517] border border-purple-900/80 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cadet@lambdalearn.space"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0517] border border-purple-900/80 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-[10px] text-purple-300/60 mt-1 block">
                    We will send a 6-digit one-time password (OTP) to this address to verify your account.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Initial Learning Track Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as UserLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0517] border border-purple-900/80 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="beginner">Beginner (9th Grade friendly, challenging foundations)</option>
                    <option value="intermediate">Intermediate (Orbital math, delta-V, star trackers)</option>
                    <option value="advanced">Advanced (Astrophysics research papers & citations)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {emailStep === 'otp' && (
              <div className="space-y-4">
                {/* Simulated Inbox / Dispatch Banner */}
                {simulatedInboxNotice && (
                  <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-start gap-2.5 text-xs text-purple-200 animate-in fade-in duration-200">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Verification Code Dispatched!</span>
                      <p className="font-mono text-purple-300 mt-0.5">{simulatedInboxNotice}</p>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white font-display">
                    Enter 6-Digit OTP Code
                  </h3>
                  <p className="text-xs text-purple-200/70">
                    We sent a security code to <strong className="text-white">{email}</strong>
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg sm:text-xl font-bold bg-[#090416] text-white rounded-xl border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs text-pink-400 text-center font-medium">
                    {otpError}
                  </p>
                )}

                {/* Confirm Button */}
                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={isVerifying || otpDigits.join('').length < 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Account Verified & Confirmed!</span>
                    </>
                  ) : isVerifying ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Verify Code & Complete Registration</span>
                    </>
                  )}
                </button>

                {/* Timer and Resend */}
                <div className="flex items-center justify-between text-xs text-purple-300/70 pt-1 border-t border-purple-900/40">
                  <button
                    type="button"
                    onClick={() => setEmailStep('input')}
                    className="text-purple-400 hover:text-white"
                  >
                    Change Email
                  </button>

                  {timerSeconds > 0 ? (
                    <span>Resend OTP in <strong className="text-purple-300 font-mono">{timerSeconds}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={generateNewOtp}
                      className="text-pink-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
