import React from 'react';
import {
  UserProfile,
  UserLevel,
  TrackId,
  Lesson,
  CommunityPost,
  AstrophotographyPhoto,
  RewardGift,
} from './types';
import { CHECKPOINTS } from './data/checkpointsData';
import { LESSONS } from './data/lessonsData';
import { INITIAL_POSTS } from './data/communityData';
import { INITIAL_PHOTOS } from './data/galleryData';
import {
  completeLessonProgress,
  purchaseReward,
  calculateNewStreak,
} from './utils/gameLogic';

import { SpaceBackground } from './components/SpaceBackground';
import { Navbar } from './components/Navbar';
import { WelcomeView } from './components/WelcomeView';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { CommunityView } from './components/CommunityView';
import { GalleryView } from './components/GalleryView';
import { CapsuleJourneyView } from './components/CapsuleJourneyView';
import { LessonModal } from './components/LessonModal';
import { AuthModal } from './components/AuthModal';
import { RewardStoreModal } from './components/RewardStoreModal';
import { ProfileModal } from './components/ProfileModal';
import { GitHubRepoModal } from './components/GitHubRepoModal';
import { OnboardingAssessmentModal } from './components/OnboardingAssessmentModal';
import { Sparkles, Code2 } from 'lucide-react';

const DEFAULT_USER: UserProfile = {
  id: 'user-default-101',
  name: 'Alex Chen',
  email: 'alex.chen@lambdalearn.space',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'google',
  level: 'beginner',
  streaks: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  coins: 220,
  xp: 480,
  completedLessons: [],
  currentCheckpointId: 'checkpoint-earth',
  unlockedGifts: ['gift-badge-pioneer'],
  savedPosts: [],
  savedPhotos: [],
  dailyLessonsCompleted: 0,
  dailyLessonsGoal: 5,
  dailyMinutesGoal: 20,
  preferredTrack: 'all',
  discoverySource: 'YouTube Space & Science Videos',
  roleBackground: '5th–8th Grade Space Explorer (Fun, clear basics from scratch)',
};

const VALID_LEVELS: UserLevel[] = ['beginner', 'intermediate', 'advanced'];

function sanitizeUser(raw: unknown): UserProfile {
  if (!raw || typeof raw !== 'object') return DEFAULT_USER;
  const obj = raw as Partial<UserProfile>;
  const validLevel: UserLevel =
    obj.level && VALID_LEVELS.includes(obj.level) ? obj.level : 'beginner';

  return {
    ...DEFAULT_USER,
    ...obj,
    id: typeof obj.id === 'string' && obj.id.length >= 4 ? obj.id : DEFAULT_USER.id,
    name: typeof obj.name === 'string' && obj.name.trim() ? obj.name : DEFAULT_USER.name,
    email: typeof obj.email === 'string' ? obj.email : DEFAULT_USER.email,
    avatar: typeof obj.avatar === 'string' && obj.avatar ? obj.avatar : DEFAULT_USER.avatar,
    provider:
      obj.provider === 'google' ||
      obj.provider === 'apple' ||
      obj.provider === 'linkedin' ||
      obj.provider === 'email'
        ? obj.provider
        : 'google',
    level: validLevel,
    streaks: typeof obj.streaks === 'number' && !Number.isNaN(obj.streaks) ? obj.streaks : 4,
    coins: typeof obj.coins === 'number' && !Number.isNaN(obj.coins) ? obj.coins : 220,
    xp: typeof obj.xp === 'number' && !Number.isNaN(obj.xp) ? obj.xp : 480,
    completedLessons: Array.isArray(obj.completedLessons) ? obj.completedLessons : [],
    unlockedGifts: Array.isArray(obj.unlockedGifts)
      ? obj.unlockedGifts
      : DEFAULT_USER.unlockedGifts,
    savedPosts: Array.isArray(obj.savedPosts) ? obj.savedPosts : [],
    savedPhotos: Array.isArray(obj.savedPhotos) ? obj.savedPhotos : [],
    dailyLessonsCompleted:
      typeof obj.dailyLessonsCompleted === 'number' ? obj.dailyLessonsCompleted : 0,
    dailyLessonsGoal:
      typeof obj.dailyLessonsGoal === 'number' && obj.dailyLessonsGoal > 0
        ? obj.dailyLessonsGoal
        : 5,
    dailyMinutesGoal:
      typeof obj.dailyMinutesGoal === 'number' && obj.dailyMinutesGoal > 0
        ? obj.dailyMinutesGoal
        : 20,
    preferredTrack:
      obj.preferredTrack === 'astronomy' ||
      obj.preferredTrack === 'aerospace' ||
      obj.preferredTrack === 'astrophotography' ||
      obj.preferredTrack === 'all'
        ? obj.preferredTrack
        : 'all',
  };
}

function sanitizePosts(raw: unknown): CommunityPost[] {
  if (!Array.isArray(raw) || raw.length === 0) return INITIAL_POSTS;
  const valid = raw.filter(
    (p) =>
      p &&
      typeof p === 'object' &&
      typeof p.id === 'string' &&
      typeof p.title === 'string' &&
      Array.isArray(p.tags) &&
      Array.isArray(p.commentsList)
  );
  return valid.length > 0 ? valid : INITIAL_POSTS;
}

function sanitizePhotos(raw: unknown): AstrophotographyPhoto[] {
  if (!Array.isArray(raw) || raw.length === 0) return INITIAL_PHOTOS;
  const valid = raw.filter(
    (p) =>
      p &&
      typeof p === 'object' &&
      typeof p.id === 'string' &&
      typeof p.title === 'string' &&
      p.exif &&
      typeof p.exif === 'object' &&
      Array.isArray(p.comments)
  );
  return valid.length > 0 ? valid : INITIAL_PHOTOS;
}

export default function App() {
  // Start on 'welcome' screen first as requested
  const [activeTab, setActiveTab] = React.useState<
    'welcome' | 'home' | 'learn' | 'community' | 'gallery' | 'capsule'
  >('welcome');

  const [user, setUser] = React.useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lambda_learn_user_v2');
      if (saved) return sanitizeUser(JSON.parse(saved));
    } catch {
      // fallback to default user
    }
    return DEFAULT_USER;
  });

  const [posts, setPosts] = React.useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('lambda_learn_posts_v2');
      if (saved) return sanitizePosts(JSON.parse(saved));
    } catch {
      // fallback
    }
    return INITIAL_POSTS;
  });

  const [photos, setPhotos] = React.useState<AstrophotographyPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('lambda_learn_photos_v2');
      if (saved) return sanitizePhotos(JSON.parse(saved));
    } catch {
      // fallback
    }
    return INITIAL_PHOTOS;
  });

  // Modals state
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState<boolean>(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = React.useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = React.useState<boolean>(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Sync to localStorage
  React.useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('lambda_learn_user_v2', JSON.stringify(user));
      } else {
        localStorage.removeItem('lambda_learn_user_v2');
      }
    } catch {
      // ignore storage quota errors
    }
  }, [user]);

  React.useEffect(() => {
    try {
      localStorage.setItem('lambda_learn_posts_v2', JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  React.useEffect(() => {
    try {
      localStorage.setItem('lambda_learn_photos_v2', JSON.stringify(photos));
    } catch {
      // ignore
    }
  }, [photos]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Launch a lesson
  const handleStartLesson = (lessonId: string) => {
    const target = LESSONS.find((l) => l.id === lessonId);
    if (target) {
      setActiveLesson(target);
    } else {
      setActiveLesson(LESSONS[0]);
    }
  };

  // Complete a lesson
  const handleCompleteLesson = (
    lessonId: string,
    xpEarned: number,
    coinsEarned: number
  ) => {
    const activeUser = user || DEFAULT_USER;

    const todayStr = new Date().toISOString().split('T')[0];
    const streakResult = calculateNewStreak(
      activeUser.streaks,
      activeUser.lastActiveDate,
      todayStr
    );

    const progressResult = completeLessonProgress(
      activeUser,
      lessonId,
      xpEarned,
      coinsEarned,
      CHECKPOINTS
    );

    const newDailyLessons = (activeUser.dailyLessonsCompleted || 0) + 1;

    const updatedUser: UserProfile = {
      ...progressResult.updatedUser,
      streaks: streakResult.newStreak,
      lastActiveDate: todayStr,
      dailyLessonsCompleted: newDailyLessons,
    };

    setUser(updatedUser);

    if (progressResult.unlockedNewCheckpoint) {
      showToast(
        `🚀 Trajectory Advance: Checkpoint reached -> ${progressResult.newCheckpointName}!`
      );
    } else {
      showToast(
        `✨ Lesson mastered! +${coinsEarned} Coins, +${xpEarned} XP! Streak: ${streakResult.newStreak} days`
      );
    }
  };

  // Onboarding completion
  const handleCompleteOnboarding = (
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
  ) => {
    setIsOnboardingModalOpen(false);

    const updatedUser: UserProfile = {
      ...(user || DEFAULT_USER),
      name: userData.name,
      level: userData.level,
      roleBackground: userData.roleBackground,
      discoverySource: userData.discoverySource,
      dailyMinutesGoal: userData.dailyMinutesGoal,
      dailyLessonsGoal: userData.dailyLessonsGoal,
      preferredTrack: userData.preferredTrack,
    };

    setUser(updatedUser);
    setActiveTab('home');
    showToast(
      `Welcome ${userData.name}! Daily Target: ${userData.dailyMinutesGoal}m & ${userData.dailyLessonsGoal} lessons/day.`
    );

    if (autoLaunchFirstLesson) {
      const matchingLesson =
        userData.preferredTrack !== 'all'
          ? LESSONS.find((l) => l.trackId === userData.preferredTrack)
          : LESSONS[0];
      handleStartLesson(matchingLesson ? matchingLesson.id : LESSONS[0].id);
    }
  };

  // Purchase gift from vault
  const handlePurchaseReward = (gift: RewardGift) => {
    const activeUser = user || DEFAULT_USER;
    const result = purchaseReward(activeUser, gift);
    if (result.success) {
      setUser(result.updatedUser);
      showToast(`🎁 Unlocked reward: ${gift.name}!`);
    } else {
      showToast(result.message);
    }
  };

  // Change user level (Beginner, Intermediate, Advanced)
  const handleChangeLevel = (newLevel: UserLevel) => {
    setUser((prev) => ({ ...(prev || DEFAULT_USER), level: newLevel }));
    showToast(`Switched curriculum to ${newLevel.toUpperCase()} level`);
  };

  // Community handlers
  const handleUpvotePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isUpvoted = !p.isUpvoted;
          return {
            ...p,
            isUpvoted,
            upvotes: isUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddPostComment = (postId: string, text: string) => {
    const activeUser = user || DEFAULT_USER;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [
              ...p.commentsList,
              {
                id: `c-${Date.now()}`,
                authorName: activeUser.name,
                authorAvatar: activeUser.avatar,
                authorLevel: activeUser.level,
                text,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
    showToast('Comment published to discussion!');
  };

  const handleCreatePost = (newPostData: {
    title: string;
    content: string;
    trackTag: 'astronomy' | 'aerospace' | 'astrophotography' | 'gear' | 'general';
    tags: string[];
  }) => {
    const activeUser = user || DEFAULT_USER;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      content: newPostData.content,
      trackTag: newPostData.trackTag,
      tags: newPostData.tags,
      authorName: activeUser.name,
      authorAvatar: activeUser.avatar,
      authorLevel: activeUser.level,
      authorBadge: 'Cadet Contributor',
      upvotes: 1,
      isUpvoted: true,
      createdAt: 'Just now',
      commentsCount: 0,
      commentsList: [],
    };

    setPosts((prev) => [newPost, ...prev]);

    setUser({
      ...activeUser,
      coins: activeUser.coins + 15,
      xp: activeUser.xp + 25,
    });

    showToast('Community post published! Earned +15 Lambda Coins');
  };

  // Gallery handlers
  const handleLikePhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddPhotoComment = (photoId: string, text: string) => {
    const activeUser = user || DEFAULT_USER;
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `cm-${Date.now()}`,
                author: activeUser.name,
                avatar: activeUser.avatar,
                text,
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
    showToast('Feedback submitted to photographer!');
  };

  const handleUploadPhoto = (
    photoData: Omit<AstrophotographyPhoto, 'id' | 'likes' | 'comments' | 'date'>
  ) => {
    const newPhoto: AstrophotographyPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      likes: 1,
      isLiked: true,
      comments: [],
      date: 'Just now',
    };

    setPhotos((prev) => [newPhoto, ...prev]);

    const activeUser = user || DEFAULT_USER;
    setUser({
      ...activeUser,
      coins: activeUser.coins + 25,
      xp: activeUser.xp + 50,
    });

    showToast('Astrophotography image published to Gallery! Earned +25 Coins');
  };

  const activeUser = user || DEFAULT_USER;
  const currentLevel = activeUser.level;

  return (
    <div className="min-h-screen flex flex-col bg-[#090416] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Lightweight Space Background: pure SVG with starry ceiling canopy */}
      <SpaceBackground />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRewards={() => setIsRewardsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
        onChangeLevel={handleChangeLevel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* TAB 1: WELCOME SCREEN (Shown first by default) */}
        {activeTab === 'welcome' && (
          <WelcomeView
            onStartLearning={() => setIsOnboardingModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenGitHub={() => setIsGitHubModalOpen(true)}
            onDirectEnterDashboard={() => setActiveTab('home')}
            onSelectTrackToLearn={(trackId) => {
              setUser((prev) => ({ ...(prev || DEFAULT_USER), preferredTrack: trackId }));
              setActiveTab('learn');
              showToast(`Exploring ${trackId.toUpperCase()} self-paced lessons`);
            }}
            user={user}
          />
        )}

        {/* TAB 2: HOME / CHECKPOINT TRAJECTORY MAP */}
        {activeTab === 'home' && (
          <HomeView
            user={activeUser}
            onNavigateTab={setActiveTab}
            onStartLesson={handleStartLesson}
            onOpenRewards={() => setIsRewardsModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onChangeLevel={handleChangeLevel}
          />
        )}

        {/* TAB 3: DRIFTING CAPSULE / SPACE CAB JOURNEY VIEW */}
        {activeTab === 'capsule' && (
          <CapsuleJourneyView
            user={activeUser}
            checkpoints={CHECKPOINTS}
            onStartNextLesson={() => handleStartLesson(LESSONS[0].id)}
            onReturnToDashboard={() => setActiveTab('home')}
          />
        )}

        {/* TAB 4: LEARN CHAPTERS */}
        {activeTab === 'learn' && (
          <LearnView
            user={activeUser}
            onStartLesson={handleStartLesson}
            userLevel={currentLevel}
            onChangeLevel={handleChangeLevel}
          />
        )}

        {/* TAB 5: LEARN COMMUNITY */}
        {activeTab === 'community' && (
          <CommunityView
            user={user}
            posts={posts}
            onUpvotePost={handleUpvotePost}
            onAddComment={handleAddPostComment}
            onCreatePost={handleCreatePost}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* TAB 6: ASTROPHOTOGRAPHY GALLERY */}
        {activeTab === 'gallery' && (
          <GalleryView
            user={user}
            photos={photos}
            onLikePhoto={handleLikePhoto}
            onAddPhotoComment={handleAddPhotoComment}
            onUploadPhoto={handleUploadPhoto}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 bg-[#070514]/90 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-amber-200 text-sm">LAMBDA LEARN</span>
            <span>• Self-Paced Astrophysics, Cosmology, Rocket Science & Astrophotography</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>github.com/lambdalearn/space-curriculum</span>
            </button>
            <span>•</span>
            <span>5th Grade to Astrophysics Research</span>
          </div>
        </div>
      </footer>

      {/* Interactive Lesson Modal (with Space Cab Lambda & Upper Progress Bar) */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          user={activeUser}
          onClose={() => setActiveLesson(null)}
          onComplete={handleCompleteLesson}
          onNavigateToCapsule={() => setActiveTab('capsule')}
        />
      )}

      {/* Onboarding Space Journey Setup Modal */}
      {isOnboardingModalOpen && (
        <OnboardingAssessmentModal
          onClose={() => setIsOnboardingModalOpen(false)}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      {/* GitHub Repository Modal */}
      {isGitHubModalOpen && (
        <GitHubRepoModal onClose={() => setIsGitHubModalOpen(false)} />
      )}

      {/* Auth Modal (Google, Apple, LinkedIn, Email OTP) */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={(loggedInUser) => {
            setUser(sanitizeUser(loggedInUser));
            showToast(`Welcome back, ${loggedInUser.name}!`);
          }}
        />
      )}

      {/* Rewards Store Vault Modal */}
      {isRewardsModalOpen && (
        <RewardStoreModal
          user={activeUser}
          onClose={() => setIsRewardsModalOpen(false)}
          onPurchase={handlePurchaseReward}
        />
      )}

      {/* Profile Modal (Streaks, Leaderboard, Weekly Tests) */}
      {isProfileModalOpen && (
        <ProfileModal
          user={activeUser}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={() => {
            setUser(null);
            showToast('Signed out of cadet account.');
          }}
          onChangeLevel={handleChangeLevel}
          onStartLesson={handleStartLesson}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-white text-xs font-semibold shadow-2xl shadow-amber-500/20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
